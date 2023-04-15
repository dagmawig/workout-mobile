import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { updateCurrentTemp, updateUserTempArr } from '../components/workoutSlice';
import exerLocal from '../assets/ExerData/exercisesLocal.json';
import ExerDetComp from '../components/ExerDetComp';
import Loading from '../components/Loading';

const ShowTemp = () => {

    const stateSelector = useSelector(state => state.workout);
    const dispatch = useDispatch();

    const currentTempObj = stateSelector.currentTemp;
    let currentTemp = currentTempObj.userTemp? stateSelector.userData.templateArr[currentTempObj.index] :
    stateSelector.userData.fixTempArr[currentTempObj.index];

    const [detMode, setDetMode] = useState(false);
    const [detExer, setDetExer] = useState(null);

    // const temp = {
    //     tempID: '2023-03-29T01:50:05.740Z',
    //     workoutTimeArr: [],
    //     name: 'Dagmawi',
    //     exerList: [
    //         {
    //             bodyPart: 'back',
    //             equipment: 'leverage machine',
    //             gifUrl: 'http://d205bpvrqc9yn1.cloudfront.net/0015.gif',
    //             id: '0015',
    //             name: 'assisted parallel close grip pull-up',
    //             target: 'lats',
    //             localUrl: '22.gif',
    //             metric: 'wr',
    //             timeStamp: [],
    //             localPng: '22.png',
    //             sets: 3
    //         },
    //         {
    //             bodyPart: 'upper legs',
    //             equipment: 'band',
    //             gifUrl: 'http://d205bpvrqc9yn1.cloudfront.net/0980.gif',
    //             id: '0980',
    //             name: 'band bent-over hip extension',
    //             target: 'glutes',
    //             localUrl: '47.gif',
    //             metric: 'wr',
    //             timeStamp: [],
    //             localPng: '47.png',
    //             sets: 2
    //         },
    //         {
    //             bodyPart: 'chest',
    //             equipment: 'barbell',
    //             gifUrl: 'http://d205bpvrqc9yn1.cloudfront.net/0025.gif',
    //             id: '0025',
    //             name: 'barbell bench press',
    //             target: 'pectorals',
    //             localUrl: '98.gif',
    //             metric: 'wr',
    //             timeStamp: [],
    //             localPng: '98.png',
    //             sets: 5
    //         }
    //     ]
    // };

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
        navigation.navigate('LogWorkout')
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
                    navigation.navigate('Workout');
                    dispatch(updateUserTempArr(newUserTempArr));
                    dispatch(updateCurrentTemp(null));
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
            <Loading/>
            <View className='pt-[45px] h-full w-full' >
                <View className='w-full h-10 shadow-2xl flex-row items-center justify-between px-3 sticky'>
                    <View className='w-full flex-row items-center justify-between'>
                        <View>
                            <TouchableOpacity onPress={detMode ? handleBack2 : handleBack}>
                                <FontAwesome5 name="arrow-left" size={17} color="white" />
                            </TouchableOpacity>
                        </View>
                        <View>
                            {currentTempObj.userTemp && !detMode ? <TouchableOpacity onPress={handleEditTemp}>
                                <FontAwesome5 name="edit" size={17} color="white" />
                            </TouchableOpacity> : null}
                        </View>
                        <View>
                            {currentTempObj.userTemp && !detMode ? <TouchableOpacity onPress={handleDel}>
                                <FontAwesome5 name="trash-alt" size={17} color="white" />
                            </TouchableOpacity> : null}
                        </View>
                    </View>
                </View>
                <ScrollView className='px-3 pt-3'>
                    {detMode ? <ExerDetComp exerObj={detExer} /> :
                        <>
                            <View className='border-[1px] rounded-lg p-1 border-white m-1' key='temp'>
                                <View><Text className='text-white font-bold'>{currentTemp.name}</Text></View>
                                <View><Text className='text-white pb-2 italic'>{`Last Performed: ${calcTime(currentTemp)}`}</Text></View>
                                {exerList(currentTemp.exerList, currentTempObj.userTemp)}
                            </View>
                            <View className='w-full justify-center items-center'>
                                <TouchableOpacity onPress={handleLogWork}><Text className='text-white font-semibold'>START WORKOUT</Text></TouchableOpacity>
                            </View>
                        </>
                    }
                </ScrollView>
            </View>
        </View>
    )
}

export default ShowTemp