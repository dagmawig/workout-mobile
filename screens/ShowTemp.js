import { View, Text, TouchableOpacity, ScrollView, Alert, Image } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { updateCurrentTemp, updateLoading, updateStartTime, updateUserTempArr } from '../components/workoutSlice';
import exerLocal from '../assets/ExerData/exercisesLocal.json';
import ExerDetComp from '../components/ExerDetComp';
import Loading from '../components/Loading';
import { customStyle } from '../components/Style';
import { IMAGES } from '../assets';
import SecureSt from '../components/SecureStore';
import { REACT_APP_API_URI } from '@env';
import axios from 'axios';


const ShowTemp = () => {

    const stateSelector = useSelector(state => state.workout);
    const dispatch = useDispatch();

    const currentTempObj = stateSelector.currentTemp;
    let currentTemp = currentTempObj.userTemp ? stateSelector.userData.templateArr[currentTempObj.index] :
        stateSelector.userData.fixTempArr[currentTempObj.index];

    const [detMode, setDetMode] = useState(false);
    const [detExer, setDetExer] = useState(null);

    function calcTime(template) {
        let arr = template.workoutTimeArr;
        if (arr.length === 0) return 'Never';
        let lastTime = new Date(arr[arr.length - 1]).getTime();
        let hourDiff = Math.floor((new Date().getTime() - lastTime) / (1000 * 3600));
        return (hourDiff < 24) ? `${hourDiff} hour(s) ago` : `${Math.floor(hourDiff / 24)} day(s) ago`;
    }

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

    function handleExerDet(exer) {
        setDetMode(true);
        let exerIndex = exerLocal.findIndex(ex => ex.name === exer.name);
        setDetExer({ refIndex: exerIndex, item: exer });
    }

    function handleBack() {
        dispatch(updateCurrentTemp(null))
        navigation.navigate('Workout')
    }

    function handleBack2() {
        setDetMode(false);
        setDetExer(null);
    }

    function handleEditTemp() {
        navigation.navigate('EditTemp');
    }

    function handleLogWork() {
        navigation.navigate('LogWorkout');
        dispatch(updateStartTime(Math.floor(Date.now() / 1000)));
    }

    async function saveTemplate(newTempArr, uid) {
        let updateURI = REACT_APP_API_URI + 'updateTemp';
        let res = await axios.post(updateURI, { userID: uid, templateArr: newTempArr }).catch(err => console.log(err));

        return res;
    }

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
                    newUserTempArr.splice(currentTempObj.index, 1);
                    dispatch(updateLoading(true));
                    SecureSt.getVal('uid').then(uid=> {
                        if(uid) {
                            saveTemplate(newUserTempArr, uid).then(res => {
                                let data = res.data;
                                if(data.success) {
                                    
                                    Alert.alert(`Success`, `Template "${currentTemp.name}" deleted successfully!`);
                                    navigation.navigate('Workout');
                                    dispatch(updateUserTempArr(data.data.templateArr));
                                    dispatch(updateLoading(false));
                                }
                                else {
                                    dispatch(updateLoading(false));
                                    Alert.alert(`Error`, `${data.err}`)
                                }
                            }).catch(err=>console.log(err))
                        }
                        else console.log(err=>'invalid uid: ', uid)
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
                <ScrollView className='px-3 pt-3'>
                    {detMode ? <ExerDetComp exerObj={detExer} /> :
                        <>
                            <View className='border-[1px] rounded-lg p-1 border-white m-1' key='temp'>
                                <View><Text className='text-white font-bold text-lg'>{currentTemp.name}</Text></View>
                                <View><Text className='text-white pb-2 italic'>{`Last Performed: ${calcTime(currentTemp)}`}</Text></View>
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