import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import exerLocal from '../assets/ExerData/exercisesLocal.json';
import { useDispatch, useSelector } from 'react-redux';
import ExerDetComp from '../components/ExerDetComp';
import FooterComp from '../components/FooterComp';
import { updateCurrentTemp, updateLoading, updateUserData } from '../components/workoutSlice';
import { REACT_APP_API_URI } from '@env';
import axios from 'axios';
import SecureSt from '../components/SecureStore';
import Loading from '../components/Loading';
import { customStyle } from '../components/Style';

const Workout = () => {

    const navigation = useNavigation();
    const stateSelector = useSelector(state => state.workout);
    const dispatch = useDispatch();

    const [detMode, setDetMode] = useState(false);
    const [detExer, setDetExer] = useState(null);

    function calcTime(template) {
        let arr = template.workoutTimeArr;
        if (arr.length === 0) return 'Never';
        let lastTime = new Date(arr[arr.length - 1]).getTime();
        let hourDiff = Math.floor((new Date().getTime() - lastTime) / (1000 * 3600));
        return (hourDiff < 24) ? `${hourDiff} hour(s) ago` : `${Math.floor(hourDiff / 24)} day(s) ago`;
    }

    function handleShowTemp(temp, userTemp, index) {
        dispatch(updateCurrentTemp({
            userTemp: userTemp,
            index: index
        }));

        navigation.navigate('ShowTemp');
    }

    function tempList(tList, userTemp) {
        return tList.map((temp, i) => {
            return <TouchableOpacity className='border-[1px] rounded-lg p-1 border-white m-1' key={`${userTemp ? 'user' : 'fixed'}-temp-${i}`} onPress={() => handleShowTemp(temp, userTemp, i)}>
                <View><Text className='text-white text-lg font-bold'>{temp.name}</Text></View>
                <View><Text className='text-white pb-2 italic'>{`Last Performed: ${calcTime(temp)}`}</Text></View>
                {exerList(temp.exerList, userTemp)}
            </TouchableOpacity>
        })
    }

    function exerList(eList, userTemp) {
        return eList.map((exer, i) => {
            return <View className='flex-row justify-between' key={`${userTemp ? 'user' : 'fixed'}-exer-${i}`} >
                <Text className='text-white text'>{`${exer.sets} X ${exer.name}`}</Text>
                {/* <View><TouchableOpacity onPress={() => handleExerDet(exer)}><FontAwesome5 name="info-circle" size={25} color="white" /></TouchableOpacity></View> */}
            </View>
        })
    }

    function handleExerDet(exer) {
        setDetMode(true);
        let exerIndex = exerLocal.findIndex(ex => ex.name === exer.name);
        setDetExer({ refIndex: exerIndex, item: exer });
    }

    function handleBack() {
        setDetMode(false);
        setDetExer(null);
    }

    function handleNewTemp() {
        navigation.navigate('NewTemp');
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        })
    }, []);

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
                        dispatch(updateUserData(data.data))
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
    }, [])

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

                </ScrollView>
                <FooterComp />
            </View>
        </View>
    )
}

export default Workout