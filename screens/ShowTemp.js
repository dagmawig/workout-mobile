import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { updateCurrentTemp } from '../components/workoutSlice';

const ShowTemp = () => {

    const stateSelector = useSelector(state => state.workout);
    const dispatch = useDispatch();

    const currentTemp = stateSelector.userData.currentTemp;

    const temp = {
        tempID: '2023-03-29T01:50:05.740Z',
        workoutTimeArr: [],
        name: 'Dagmawi',
        exerList: [
            {
                bodyPart: 'back',
                equipment: 'leverage machine',
                gifUrl: 'http://d205bpvrqc9yn1.cloudfront.net/0015.gif',
                id: '0015',
                name: 'assisted parallel close grip pull-up',
                target: 'lats',
                localUrl: '22.gif',
                metric: 'wr',
                timeStamp: [],
                localPng: '22.png',
                sets: 3
            },
            {
                bodyPart: 'upper legs',
                equipment: 'band',
                gifUrl: 'http://d205bpvrqc9yn1.cloudfront.net/0980.gif',
                id: '0980',
                name: 'band bent-over hip extension',
                target: 'glutes',
                localUrl: '47.gif',
                metric: 'wr',
                timeStamp: [],
                localPng: '47.png',
                sets: 2
            },
            {
                bodyPart: 'chest',
                equipment: 'barbell',
                gifUrl: 'http://d205bpvrqc9yn1.cloudfront.net/0025.gif',
                id: '0025',
                name: 'barbell bench press',
                target: 'pectorals',
                localUrl: '98.gif',
                metric: 'wr',
                timeStamp: [],
                localPng: '98.png',
                sets: 5
            }
        ]
    };

    function calcTime(template) {
        let arr = template.workoutTimeArr;
        if (arr.length === 0) return 'Never';
        let lastTime = new Date(arr[arr.length - 1]).getTime();
        let hourDiff = Math.floor((new Date().getTime() - lastTime) / (1000 * 3600));
        return (hourDiff < 24) ? `${hourDiff} hour(s) ago` : `${Math.floor(hourDiff / 24)} day(s) ago`;
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

    }

    function handleBack() {
        dispatch(updateCurrentTemp(null))
        navigation.navigate('Workout')
    }
    const navigation = useNavigation();
    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        })
    }, []);

    return (
        <View className='bg-[#28547B] flex-1 max-h-screen min-w-screen overflow-hidden'>
            <View className='pt-[45px] h-full w-full' >
                <View className='w-full h-10 shadow-2xl flex-row items-center justify-between px-3 sticky'>
                    <View className='w-full flex-row items-center justify-between'>
                        <View>
                            <TouchableOpacity onPress={handleBack}>
                                <FontAwesome5 name="arrow-left" size={17} color="white" />
                            </TouchableOpacity>
                        </View>
                        <View>
                            {currentTemp.userTemp? <TouchableOpacity>
                                <FontAwesome5 name="edit" size={17} color="white" />
                            </TouchableOpacity> : null}
                        </View>
                        <View>
                            {currentTemp.userTemp? <TouchableOpacity>
                                <FontAwesome5 name="trash-alt" size={17} color="white" />
                            </TouchableOpacity> : null}
                        </View>
                    </View>
                </View>
                <ScrollView className='px-3 pt-3'>
                    <View className='border-[1px] rounded-lg p-1 border-white m-1' key='temp'>
                        <View><Text className='text-white font-bold'>{currentTemp.temp.name}</Text></View>
                        <View><Text className='text-white pb-2 italic'>{`Last Performed: ${calcTime(currentTemp.temp)}`}</Text></View>
                        {exerList(currentTemp.temp.exerList, currentTemp.userTemp)}
                    </View>
                    <View className='w-full justify-center items-center'>
                        <TouchableOpacity><Text className='text-white font-semibold'>START WORKOUT</Text></TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </View>
    )
}

export default ShowTemp