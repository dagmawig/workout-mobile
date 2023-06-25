import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert, BackHandler } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import TempExerComp from '../components/TempExerComp';
import { useDispatch, useSelector } from 'react-redux';
import { updateLoading, updateUserTempArr } from '../components/workoutSlice';
import SearchComp from '../components/SearchComp';
import ExerDetComp from '../components/ExerDetComp';
import Loading from '../components/Loading';
import { REACT_APP_API_URI } from '@env';
import axios from 'axios';
import SecureSt from '../components/SecureStore';
import { customStyle } from '../components/Style';
import ReminderComp from '../components/ReminderComp';
import Noti from '../components/noti';

const EditTemp = () => {

    const navigation = useNavigation();

    const stateSelector = useSelector(state => state.workout)
    const dispatch = useDispatch();

    const currentTemp = stateSelector.userData.templateArr[stateSelector.currentTemp.index];

    const [exerMode, setExerMode] = useState(false);
    const [tempName, setTempName] = useState(currentTemp.name);
    const [tempExerArr, setTempExerArr] = useState(currentTemp.exerList);
    const [detMode, setDetMode] = useState(false);
    const [exerObj, setExerObj] = useState(null);

    const [reminder, setReminder] = useState(currentTemp.reminder ? true : false);
    const [rType, setRType] = useState(currentTemp.remObj ? currentTemp.remObj.rType : 'daily');
    const [hour, setHour] = useState(currentTemp.remObj ? currentTemp.remObj.hour : 0);
    const [minute, setMinute] = useState(currentTemp.remObj ? currentTemp.remObj.minute : 0);
    const [dispH, setDispH] = useState(currentTemp.remObj ? currentTemp.remObj.dispH : 12);
    const [meridian, setMeridian] = useState(currentTemp.remObj ? currentTemp.remObj.meridian : 'AM');
    const [day, setDay] = useState(currentTemp.remObj ? currentTemp.remObj.day : 'SUNDAY');
    const [dayIndex, setIndex] = useState(currentTemp.remObj ? currentTemp.remObj.dayIndex : 1);
    const [dayTag, setDayTag] = useState(currentTemp.reminder && currentTemp.remObj.rType==='weekly' && currentTemp.remObj.dayIndexArr ? new Array(7).fill(false).map((ele, i)=> {if(currentTemp.remObj.dayIndexArr.indexOf(i+1)!==-1) return true; else return false}) : new Array(7).fill(false));

    // handles cancelling of exercise template edit
    function handleDelChange() {
        return Alert.alert('Discard Changes?', 'Are you sure you want to discard unsaved changes?', [
            {
                text: 'CANCEL',
                onPress: () => null,
                style: 'cancel'
            },
            {
                text: 'DISCARD',
                onPress: () => {
                    setTempName('');
                    setTempExerArr([]);
                    navigation.goBack();
                }
            }
        ])
    }

    // handles cancelling exercise detail mode
    function handleDetBack() {
        setDetMode(false);
        setExerObj(null);
    }

    // handles saving edited exercise template to database
    async function saveTemplate(newTempArr, uid) {
        let updateURI = REACT_APP_API_URI + 'updateTemp';
        let res = await axios.post(updateURI, { userID: uid, templateArr: newTempArr }).catch(err => console.log(err));

        return res;
    }

    // hanldes saving edited exercise template
    function saveTemp() {
        let dayIndexArr = dayTag.reduce((filArr, tag, i) => {
            tag && filArr.push(i + 1);
            return filArr;
        }, []);

        if (!tempName.split(' ').join('')) {
            return Alert.alert('Missing Template Name!', 'Please Add Template Name.', [
                {
                    text: 'Ok',
                    onPress: () => null
                }
            ])
        }
        else if (tempExerArr.length === 0) {
            return Alert.alert('Missing Exercise!', 'Please Add Exercise(s).', [
                {
                    text: 'Ok',
                    onPress: () => null
                }
            ])
        }
        else if (rType==='weekly' && dayIndexArr.length===0) {
            return Alert.alert('Missing Reminder Day!', 'Please pick at least one day of the week or turn off reminder before saving template.', [
                {
                    text: 'Ok',
                    onPress: () => null
                }
            ])
        }
        else {
            let updatedTemp = JSON.parse(JSON.stringify(currentTemp));
            updatedTemp.name = tempName;
            updatedTemp.exerList = tempExerArr;

            let newUserTempArr = JSON.parse(JSON.stringify(stateSelector.userData.templateArr));
            newUserTempArr[stateSelector.currentTemp.index] = updatedTemp;

            dispatch(updateLoading(true));
            let remSetting = { workoutTemp:updatedTemp, rType: (rType==='weekly' && dayIndexArr.length===7)? 'daily' : rType, hour, minute };
            Noti.cancelNotArr(updatedTemp.reminder, updatedTemp[updatedTemp.tempID])
                .then(respo => {
                    Promise.all(respo)
                        .then(response => {
                            Noti.setNotArr(reminder, dayIndexArr, remSetting)
                                .then(respo => {
                                    Promise.all(respo)
                                        .then(respS => {
                                            if (respS.length !== 0) {
                                                let remObj = { reminder, rType, hour, minute, dispH, meridian, day, dayIndexArr, dispH, meridian, day };
                                                updatedTemp[updatedTemp.tempID] = respS;
                                                updatedTemp.remObj = remObj;
                                                updatedTemp.reminder = true;
                                            }
                                            else {
                                                updatedTemp[updatedTemp.tempID] = null;
                                                updatedTemp.remObj = null;
                                                updatedTemp.reminder = false;
                                            }

                                            SecureSt.getVal('uid').then(uid => {
                                                if (uid) {
                                                    saveTemplate(newUserTempArr, uid).then(res => {
                                                        let data = res.data;
                                                        if (data.success) {
                                                            dispatch(updateUserTempArr(data.data.templateArr));
                                                            Alert.alert(`Success`, `Template "${tempName}" updated successfully!`);
                                                            setTempName('');
                                                            setTempExerArr([]);
                                                            navigation.goBack();
                                                            dispatch(updateLoading(false));
                                                        }
                                                        else {
                                                            dispatch(updateLoading(false));
                                                            Alert.alert(`Error`, `${data.err}`)
                                                        }
                                                    }).catch(err => console.log(err))
                                                }
                                                else console.log('invalid uid: ', uid)
                                            }).catch(err => console.log(err))
                                        })
                                }).catch(err => console.log(err))
                        })
                })


        }
    }

    // handles template name update
    function handleTempName(text) {
        setTempName(text);
    }

    // handles exercise removal from exercise template
    function removeExer(index) {
        let newTempExerArr = JSON.parse(JSON.stringify(tempExerArr));
        newTempExerArr.splice(index, 1);
        setTempExerArr(newTempExerArr);
    }

    // handles addition of a set to a given exercise
    function addSet(index) {
        let newTempExerArr = JSON.parse(JSON.stringify(tempExerArr));
        newTempExerArr[index].sets++;
        setTempExerArr(newTempExerArr);
    }

    // handles removal of a set from a given exercise
    function removeSet(index) {
        let newTempExerArr = JSON.parse(JSON.stringify(tempExerArr));
        newTempExerArr[index].sets--;
        setTempExerArr(newTempExerArr);
    }

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
                    handleDetBack();
                    return true;
                }
                else {
                    handleDelChange();
                    return true;
                }
            };

            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => subscription.remove();
        }, [detMode])
    )

    return (
        <View className='bg-[#28547B] flex-1 max-h-screen min-w-screen overflow-hidden'>
            <Loading />
            <View className='h-full w-full' style={customStyle.topPad}>
                {exerMode ? <SearchComp tempExerArr={tempExerArr} setTempExerArr={setTempExerArr} setExerMode={setExerMode} /> : detMode ?
                    <>
                        <View className='w-full h-10 shadow-2xl flex-row items-center justify-between px-3 sticky'>
                            <>
                                <TouchableOpacity onPress={handleDetBack}>
                                    <FontAwesome5 name="arrow-left" size={25} color="white" />
                                </TouchableOpacity>
                            </>
                        </View>
                        <ScrollView className='px-3' keyboardShouldPersistTaps='handled'
                            contentContainerStyle={{ paddingBottom: 70 }}>
                            <View>
                                <ExerDetComp exerObj={exerObj} />
                            </View>
                        </ScrollView>
                    </> :
                    <>
                        <View className='w-full h-10 shadow-2xl flex-row items-center justify-between px-3 sticky'>
                            <>
                                <TouchableOpacity onPress={handleDelChange}>
                                    <FontAwesome5 name="times" size={25} color="white" />
                                </TouchableOpacity>
                                <Text className='text-white text-xl font-semibold'>Edit Template</Text>
                                <TouchableOpacity onPress={saveTemp}>
                                    <FontAwesome5 name="save" size={25} color="white" />
                                </TouchableOpacity>
                            </>
                        </View>
                        <ScrollView className='px-3' keyboardShouldPersistTaps='handled'>
                            <View className='flex-row items-center justify-around'>
                                <TextInput
                                    className='h-10 w-60  border-white border-2 rounded-md bg-[#345b7c] px-2 text-white text-base'
                                    cursorColor={'white'}
                                    placeholder='template name'
                                    placeholderTextColor={'gray'}
                                    value={tempName}
                                    onChangeText={(text) => handleTempName(text)} />
                                <TouchableOpacity onPress={() => setReminder(!reminder)} className='mt-1'>{reminder ? <FontAwesome5 name="bell" size={24} color="white" /> : <FontAwesome5 name="bell-slash" size={24} color="white" />}</TouchableOpacity>
                            </View>
                            {reminder && <View className='items-center justify-center'>
                                <ReminderComp rType={rType} setRType={setRType} dispH={dispH} minute={minute} meridian={meridian} day={day} setHour={setHour} setMinute={setMinute} setDispH={setDispH} setMeridian={setMeridian} setDay={setDay} setIndex={setIndex} dayTag={dayTag} setDayTag={setDayTag} />
                            </View>}
                            <View className='pt-3'>
                                <TempExerComp exerArr={tempExerArr} removeExer={removeExer} addSet={addSet} removeSet={removeSet} setExerObj={setExerObj} setDetMode={setDetMode} />
                            </View>
                            <View className='justify-center items-center py-3'>
                                <TouchableOpacity onPress={() => setExerMode(true)}><Text className='text-white text-lg'>ADD EXERCISE</Text></TouchableOpacity>
                            </View>
                        </ScrollView>
                    </>}
            </View>
        </View>
    )
}

export default EditTemp