import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import ExerDetComp from '../components/ExerDetComp';
import FooterComp from '../components/FooterComp';
import { updateCurrentTemp, updateLoading, updateUserData } from '../components/workoutSlice';
import { REACT_APP_API_URI } from '@env';
import axios from 'axios';
import SecureSt from '../components/SecureStore';
import Loading from '../components/Loading';
import { customStyle } from '../components/Style';
import * as Notifications from 'expo-notifications';
import Noti from '../components/noti'

Notifications.setNotificationHandler({
    handleNotification: async () => {
        return {
            shouldShowAlert: true
        }
    }
})




const Workout = () => {

    const navigation = useNavigation();
    const stateSelector = useSelector(state => state.workout);
    const dispatch = useDispatch();
    const responseListener = useRef();
    const [detMode, setDetMode] = useState(false);
    const [detExer, setDetExer] = useState(null);

    // returns time elapsed since last the time exercise template is used
    function calcTime(template) {
        let arr = template.workoutTimeArr;
        if (arr.length === 0) return 'Never';
        let lastTime = new Date(arr[arr.length - 1]).getTime();
        let hourDiff = Math.floor((new Date().getTime() - lastTime) / (1000 * 3600));
        return (hourDiff < 24) ? `${hourDiff} hour(s) ago` : `${Math.floor(hourDiff / 24)} day(s) ago`;
    }

    // handles navigation to show temp page
    function handleShowTemp(temp, userTemp, index) {
        dispatch(updateCurrentTemp({
            userTemp: userTemp,
            index: index
        }));

        navigation.navigate('ShowTemp');
    }

    // returns exercise template list component
    function tempList(tList, userTemp) {
        return tList.map((temp, i) => {
            return <TouchableOpacity className='border-[1px] rounded-lg p-1 border-white m-1' key={`${userTemp ? 'user' : 'fixed'}-temp-${i}`} onPress={() => handleShowTemp(temp, userTemp, i)}>
                <View><Text className='text-white text-lg font-bold'>{temp.name}</Text></View>
                <View><Text className='text-white italic'>{`Last Performed: ${calcTime(temp)}`}</Text></View>
                <View className='flex-row'><FontAwesome5 name="bell" size={18} color={temp.reminder ? "yellow" : "white"} /><Text className='pb-2 italic' style={{ color: temp.reminder ? "yellow" : "white" }} >{` ${temp.reminder ? `${Noti.getDayTime(temp)}` : "None"}`}</Text></View>
                {exerList(temp.exerList, userTemp)}
            </TouchableOpacity>
        })
    }

    // returns exercise list component for a given exercise template
    function exerList(eList, userTemp) {
        return eList.map((exer, i) => {
            return <View className='flex-row justify-between' key={`${userTemp ? 'user' : 'fixed'}-exer-${i}`} >
                <Text className='text-white text'>{`${exer.sets} X ${exer.name}`}</Text>
            </View>
        })
    }

    // handles cancelling of exercise detail mode
    function handleBack() {
        setDetMode(false);
        setDetExer(null);
    }

    // handles navigation to new template page
    function handleNewTemp() {
        navigation.navigate('NewTemp');
    }

    // async function printAll() {
    //     let res = await Notifications.getAllScheduledNotificationsAsync();
    //     return res;
    // }

    // async function clearAll() {
    //     await Notifications.cancelAllScheduledNotificationsAsync();
    // }

    // function triggerPrint() {
    //     printAll().then(res => {
    //         console.log(res)
    //     })
    // }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        })
    }, []);



    // fetches user data from database
    useEffect(() => {
        async function loadData(uid) {
            let loadURI = REACT_APP_API_URI + 'loadData';
            let res = await axios.post(loadURI, { userID: uid, email: stateSelector.userData.email });
            return res;
        }



        dispatch(updateLoading(true));
        SecureSt.getVal('uid').then(uid => {
            if (uid) {
                loadData(uid).then(res => {
                    let data = res.data;
                    if (data.success) {
                        Noti.updateNoti(data.data.templateArr, data.data.fixTempArr)
                            .then(response => {
                                data.data.templateArr = response.templateArr;
                                data.data.fixTempArr = response.fixTempArr;
                                dispatch(updateUserData(data.data));
                            })

                        responseListener.current =
                            Notifications.addNotificationResponseReceivedListener((response) => {
                                let tempID = response.notification.request.content.data.tempID;
                                let templateArr = stateSelector.userData.templateArr;
                                let fixTempArr = stateSelector.userData.fixTempArr;
                                let user;

                                templateArr.map((temp, i) => {
                                    if (temp.tempID === tempID) {
                                        user = true;
                                        dispatch(updateCurrentTemp({
                                            userTemp: true,
                                            index: i
                                        }));
                                        navigation.navigate('ShowTemp');
                                    }
                                })

                                if (!user) {
                                    fixTempArr.map((temp, i) => {
                                        if (temp.tempID === tempID) {
                                            dispatch(updateCurrentTemp({
                                                userTemp: false,
                                                index: i
                                            }));

                                            navigation.navigate('ShowTemp');
                                        }
                                    })
                                }

                            })

                        dispatch(updateLoading(false))
                    }
                    else {
                        dispatch(updateLoading(false))
                        Alert.alert(`Error`, `${data.err}`)
                    }
                })
            }
            else console.log('invalid uid: ', uid)
        })

    }, [stateSelector.userData.email])

    return (
        <View className='bg-[#28547B] flex-1 max-h-screen min-w-screen overflow-hidden'>
            <Loading />
            <View className='h-full w-full' style={customStyle.topPad}>
                <View className='w-full h-10 shadow-2xl flex-row items-center justify-between px-3 sticky'>
                    <View className=''>
                        {detMode ? <TouchableOpacity onPress={handleBack}><FontAwesome5 name="arrow-left" size={25} color="white" /></TouchableOpacity> : <Text className='text-white text-xl font-semibold'>Workout</Text>}
                    </View>
                </View>
                <ScrollView className='px-3 pt-3' contentContainerStyle={{ paddingBottom: 70 }}>
                    {detMode ? <ExerDetComp exerObj={detExer} /> :
                        <>
                            <View>
                                <View className='flex-row justify-between pb-3'>
                                    <View>
                                        <Text className='text-white text-base'>MY TEMPLATES</Text>
                                    </View>
                                    <View>
                                        <TouchableOpacity onPress={handleNewTemp}><FontAwesome5 name="plus" size={25} color="white" /></TouchableOpacity>
                                    </View>
                                </View>
                                {tempList(stateSelector.userData.templateArr, true)}
                            </View>
                            <View>
                                <View className='flex-row justify-between py-3'>
                                    <View>
                                        <Text className='text-white text-base'>SAMPLE TEMPLATES</Text>
                                    </View>
                                </View>
                                <View>
                                    {tempList(stateSelector.userData.fixTempArr, false)}
                                </View>
                            </View>
                        </>
                    }
                    {/* <TouchableOpacity onPress={triggerNot}><Text>Notify</Text></TouchableOpacity>
                    <TouchableOpacity onPress={triggerCancel}><Text>Cancel</Text></TouchableOpacity> */}
                    {/* <TouchableOpacity onPress={triggerPrint}><Text>Print</Text></TouchableOpacity> */}
                    {/* <TouchableOpacity onPress={clearAll}><Text>Clear ALl</Text></TouchableOpacity> */}

                </ScrollView>
                <FooterComp />
            </View>
        </View>
    )
}

export default Workout