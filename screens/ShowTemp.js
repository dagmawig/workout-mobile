import { View, Text, TouchableOpacity, ScrollView, Alert, Image } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { updateLoading, updateStartTime, updateUserTempArr } from '../components/workoutSlice';
import exerLocal from '../assets/ExerData/exercisesLocal.json';
import ExerDetComp from '../components/ExerDetComp';
import Loading from '../components/Loading';
import { customStyle } from '../components/Style';
import { IMAGES } from '../assets';
import SecureSt from '../components/SecureStore';
import { REACT_APP_API_URI } from '@env';
import axios from 'axios';
import { BackHandler } from 'react-native';
import Noti from '../components/noti';


const ShowTemp = () => {

    const stateSelector = useSelector(state => state.workout);
    const dispatch = useDispatch();

    const currentTempObj = stateSelector.currentTemp;
    let currentTemp = currentTempObj.userTemp ? stateSelector.userData.templateArr[currentTempObj.index] :
        stateSelector.userData.fixTempArr[currentTempObj.index];

    const [detMode, setDetMode] = useState(false);
    const [detExer, setDetExer] = useState(null);

    // returns how long ago an exersice template has been performed
    function calcTime(template) {
        let arr = template.workoutTimeArr;
        if (arr.length === 0) return 'Never';
        let lastTime = new Date(arr[arr.length - 1]).getTime();
        let hourDiff = Math.floor((new Date().getTime() - lastTime) / (1000 * 3600));
        return (hourDiff < 24) ? `${hourDiff} hour(s) ago` : `${Math.floor(hourDiff / 24)} day(s) ago`;
    }

    // returns exercise list component for a given exercise template
    function exerList(eList, userTemp) {
        return eList.map((exer, i) => {

            let exerIndex = exerLocal.findIndex(ex => ex.name === exer.name);

            return <View className='flex-row justify-between items-center' key={`${userTemp ? 'user' : 'fixed'}-exer-${i}`} >
                <View className='flex-row justify-start items-center w-10/12'>
                    <Image
                        source={IMAGES[exerIndex]}
                        className='w-20 h-20 m-1 object-cover bg-white'
                    />
                    <View>
                        <Text className='text-white text ml-1'>{`${exer.sets} X ${exer.name}`}</Text>
                        <Text className='text-white text-sm ml-1'>{`${exer.bodyPart}`}</Text>
                    </View>

                </View>

                <View className='w-1/12'><TouchableOpacity onPress={() => handleExerDet(exer)}><FontAwesome5 name="info-circle" size={30} color="white" /></TouchableOpacity></View>
            </View>
        })
    }

    // handles navigation to exercise detail
    function handleExerDet(exer) {
        setDetMode(true);
        let exerIndex = exerLocal.findIndex(ex => ex.name === exer.name);
        setDetExer({ refIndex: exerIndex, item: exer });
    }

    // handles navigation back from exercise template display
    function handleBack() {
        navigation.goBack();
    }

    // handles cancelling of execise detail mode
    function handleBack2() {
        setDetMode(false);
        setDetExer(null);
    }

    // handles navigation to edit template page
    function handleEditTemp() {
        navigation.replace('EditTemp');
    }

    // handles navigation to log workout page
    function handleLogWork() {
        navigation.replace('LogWorkout');
        dispatch(updateStartTime(Math.floor(Date.now() / 1000)));
    }

    // update database after exercise template is deleted
    async function saveTemplate(newTempArr, uid) {
        let updateURI = REACT_APP_API_URI + 'updateTemp';
        let res = await axios.post(updateURI, { userID: uid, templateArr: newTempArr }).catch(err => console.log(err));

        return res;
    }

    // handles deletion of exercise template
    function handleDel() {
        return Alert.alert('Delete Template?', 'Are you sure you want to delete template?', [
            {
                text: 'CANCEL',
                onPress: () => null,
                style: 'cancel'
            },
            {
                text: 'DELETE',
                onPress: () => {

                    let newUserTempArr = JSON.parse(JSON.stringify(stateSelector.userData.templateArr));
                    let delTemp = newUserTempArr[currentTempObj.index];

                    Noti.cancelNot(delTemp.reminder, delTemp[delTemp.tempID])
                        .then(response => {
                            newUserTempArr.splice(currentTempObj.index, 1);
                            dispatch(updateLoading(true));
                            SecureSt.getVal('uid').then(uid => {
                                if (uid) {
                                    saveTemplate(newUserTempArr, uid).then(res => {
                                        let data = res.data;
                                        if (data.success) {

                                            Alert.alert(`Success`, `Template "${currentTemp.name}" deleted successfully!`);
                                            navigation.goBack();
                                            dispatch(updateUserTempArr(data.data.templateArr));
                                            dispatch(updateLoading(false));
                                        }
                                        else {
                                            dispatch(updateLoading(false));
                                            Alert.alert(`Error`, `${data.err}`)
                                        }
                                    }).catch(err => console.log(err))
                                }
                                else console.log(err => 'invalid uid: ', uid)
                            }).catch(err => console.log(err))
                        }).catch(err => console.log(err))
                }
            }
        ])
    }

    const navigation = useNavigation();
    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        })
    }, []);

    // handles page navigation for device back button
    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                if (detMode) {
                    handleBack2();
                    return true;
                }
                else return false;
            };

            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => subscription.remove();
        }, [detMode])
    )

    return (
        <View className='bg-[#28547B] flex-1 max-h-screen min-w-screen overflow-hidden'>
            <Loading />
            <View className='h-full w-full' style={customStyle.topPad}>
                <View className='w-full h-10 shadow-2xl flex-row items-center justify-between px-3 sticky'>
                    <View className='w-full flex-row items-center justify-between'>
                        <View>
                            <TouchableOpacity onPress={detMode ? handleBack2 : handleBack}>
                                <FontAwesome5 name="arrow-left" size={25} color="white" />
                            </TouchableOpacity>
                        </View>
                        <View>
                            {currentTempObj.userTemp && !detMode ? <TouchableOpacity onPress={handleEditTemp}>
                                <FontAwesome5 name="edit" size={25} color="white" />
                            </TouchableOpacity> : null}
                        </View>
                        <View>
                            {currentTempObj.userTemp && !detMode ? <TouchableOpacity onPress={handleDel}>
                                <FontAwesome5 name="trash-alt" size={25} color="white" />
                            </TouchableOpacity> : null}
                        </View>
                    </View>
                </View>
                <ScrollView className='px-3 pt-3' contentContainerStyle={{ paddingBottom: 10 }}>
                    {detMode ? <ExerDetComp exerObj={detExer} /> :
                        <>
                            <View className='border-[1px] rounded-lg p-1 border-white m-1' key='temp'>
                                <View><Text className='text-white font-bold text-lg'>{currentTemp.name}</Text></View>
                                <View><Text className='text-white italic'>{`Last Performed: ${calcTime(currentTemp)}`}</Text></View>
                                {currentTempObj.userTemp ? <View className='flex-row'><FontAwesome5 name="bell" size={18} color={currentTemp.reminder ? "yellow" : "white"} /><Text className='pb-2 italic' style={{ color: currentTemp.reminder ? "yellow" : "white" }} >{` ${currentTemp.reminder ? `${Noti.getDayTime(currentTemp)}` : "None"}`}</Text></View> : null}
                                {exerList(currentTemp.exerList, currentTempObj.userTemp)}
                            </View>
                            <View className='w-full justify-center items-center py-3'>
                                <TouchableOpacity onPress={handleLogWork}><Text className='text-white font-semibold text-lg'>START WORKOUT</Text></TouchableOpacity>
                            </View>
                        </>
                    }
                </ScrollView>
            </View>
        </View>
    )
}

export default ShowTemp