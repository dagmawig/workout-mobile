import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import exerLocal from '../assets/ExerData/exercisesLocal.json';
import { useSelector } from 'react-redux';
import ExerDetComp from '../components/ExerDetComp';
import FooterComp from '../components/FooterComp';

const Workout = () => {

    const navigation = useNavigation();
    const stateSelector = useSelector(state => state.workout);

    const [detMode, setDetMode] = useState(false);
    const [detExer, setDetExer] = useState(null);

    function calcTime(template) {
        let arr = template.workoutTimeArr;
        if (arr.length === 0) return 'Never';
        let lastTime = new Date(arr[arr.length - 1]).getTime();
        let hourDiff = Math.floor((new Date().getTime() - lastTime) / (1000 * 3600));
        return (hourDiff < 24) ? `${hourDiff} hour(s) ago` : `${Math.floor(hourDiff / 24)} day(s) ago`;
    }

    function tempList(tList, userTemp) {
        return tList.map((temp, i) => {
            return <TouchableOpacity className='border-[1px] rounded-lg p-1 border-white m-1' key={`${userTemp ? 'user' : 'fixed'}-temp-${i}`}>
                <View><Text className='text-white font-bold'>{temp.name}</Text></View>
                <View><Text className='text-white pb-2 italic'>{`Last Performed: ${calcTime(temp)}`}</Text></View>
                {exerList(temp.exerList, userTemp)}
            </TouchableOpacity>
        })
    }

    function exerList(eList, userTemp) {
        return eList.map((exer, i) => {
            return <View className='flex-row justify-between' key={`${userTemp ? 'user' : 'fixed'}-exer-${i}`} >
                <Text className='text-white'>{`${exer.sets} X ${exer.name}`}</Text>
                <View><TouchableOpacity onPress={() => handleExerDet(exer)}><FontAwesome5 name="info-circle" size={18} color="white" /></TouchableOpacity></View>
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

    return (
        <View className='bg-[#28547B] flex-1 max-h-screen min-w-screen overflow-hidden'>
            <View className='pt-[45px] h-full w-full' >
                <View className='w-full h-10 shadow-2xl flex-row items-center justify-between px-3 sticky'>
                    <View className=''>
                        {detMode ? <TouchableOpacity onPress={handleBack}><FontAwesome5 name="arrow-left" size={17} color="white" /></TouchableOpacity> : <Text className='text-white text-lg font-semibold'>Workout</Text>}
                    </View>
                </View>
                <ScrollView className='px-3 pt-3' contentContainerStyle={{paddingBottom: 70}}>
                    {detMode ? <ExerDetComp exerObj={detExer} /> :
                        <>
                            <View>
                                <View className='flex-row justify-between py-3'>
                                    <View>
                                        <Text className='text-white text-xs'>MY TEMPLATES</Text>
                                    </View>
                                    <View>
                                        <TouchableOpacity onPress={handleNewTemp}><FontAwesome5 name="plus" size={18} color="white" /></TouchableOpacity>
                                    </View>
                                </View>
                                {tempList(stateSelector.userData.userTempArr, true)}
                            </View>
                            <View>
                                <View className='flex-row justify-between py-3'>
                                    <View>
                                        <Text className='text-white text-xs'>SAMPLE TEMPLATES</Text>
                                    </View>
                                </View>
                                <View>
                                    {tempList(stateSelector.userData.fixTempArr, false)}
                                    {tempList(stateSelector.userData.fixTempArr, false)}
                                </View>
                            </View>
                        </>
                    }

                </ScrollView>
                <FooterComp/>
            </View>
        </View>
    )
}

export default Workout