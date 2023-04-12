import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import FooterComp from '../components/FooterComp';
import { FontAwesome5 } from '@expo/vector-icons';
import { Collapse, CollapseHeader, CollapseBody } from 'accordion-collapse-react-native'
import { useSelector } from 'react-redux';
import * as Animatable from 'react-native-animatable'

const History = () => {

    const navigation = useNavigation();
    const stateSelector = useSelector(state => state.workout);

    // let tempObj = {
    //     '2023-04-09T02:14:42.349Z': {
    //         tempName: 'Dagmawi',
    //         workoutList: [
    //             {
    //                 exerName: 'band bent-over hip extension',
    //                 metric: 'wr',
    //                 metric1: [
    //                     '0',
    //                     '0'
    //                 ],
    //                 metric2: [
    //                     '45',
    //                     '60'
    //                 ]
    //             }
    //         ],
    //         duration: 13
    //     },
    //     '2023-04-09T02:15:58.522Z': {
    //         tempName: 'Dagmawi',
    //         workoutList: [
    //             {
    //                 exerName: 'assisted parallel close grip pull-up',
    //                 metric: 'wr',
    //                 metric1: [
    //                     '1',
    //                     '4',
    //                     '56'
    //                 ],
    //                 metric2: [
    //                     '3',
    //                     '56',
    //                     '3445'
    //                 ]
    //             },
    //             {
    //                 exerName: 'band bent-over hip extension',
    //                 metric: 'wr',
    //                 metric1: [
    //                     '56',
    //                     '546'
    //                 ],
    //                 metric2: [
    //                     '675',
    //                     '879'
    //                 ]
    //             }
    //         ],
    //         duration: 35
    //     }
    // }

    const userWorkObj = stateSelector.userData.userWorkObj;

    const [expanded, setExpanded] = useState(
        Object.keys(userWorkObj).reduce((expObj, key) => {
            expObj[key] = new Array(userWorkObj[key].workoutList.length).fill(false);
            return expObj;
        }, {})
    );

    function historyList(userWorkObj) {
        return Object.keys(userWorkObj).sort((a, b) => new Date(b) - new Date(a)).map(key => {
            return (
                <View className='border-[1px] rounded-lg p-1 border-gray-300 m-1' key={'history-temp-' + key}>
                    <View className='flex-row justify-between items-center mb-2'>
                        <Text className='text-gray-300 text-lg font-semibold w-7/12'>
                            {userWorkObj[key].tempName}
                        </Text>
                        <View className='w-5/12 items-end space-y-1'>
                            <View className='flex-row items-center'>
                                <FontAwesome5 name="calendar" size={12} color="#d1d5db" />
                                <Text className='font-semibold text-gray-300'>
                                    {`  ${key.substring(0, 10)}`}
                                </Text>
                            </View>
                            <View className='flex-row items-center'>
                                <FontAwesome5 name="hourglass" size={12} color="#d1d5db" />
                                <Text className='text-gray-300 font-semibold'>
                                    {`  ${new Date(userWorkObj[key].duration * 1000).toISOString().substr(11, 8)}`}
                                </Text>
                            </View>
                        </View>
                    </View>
                    {exerList(userWorkObj[key].workoutList, key)}
                </View>)
        })
    }

    function exerList(workoutList, key) {
        return workoutList.map((workout, i) => {
            return (
                <View key={'history-exer' + key + i} className=' my-[1px] '>
                    {/* <TouchableOpacity
                    title={"Click here too"}
                    onPress={() => setExpanded(!expanded)}
                /> */}
                    <Collapse
                        isExpanded={expanded[key][i]}
                        onToggle={() => handleExpand(key, i)}>
                        <CollapseHeader >
                            <View className='flex-row justify-between bg-[#326592] p-2 rounded  drop-shadow-lg'>
                                <Text className='text-gray-300'>{workout.metric1.length} X {workout.exerName}</Text>
                                {
                                    expanded[key][i] ? <FontAwesome5 name="chevron-up" size={16} color="#d1d5db" /> :
                                        <FontAwesome5 name="chevron-down" size={16} color="#d1d5db" />
                                }
                            </View>
                        </CollapseHeader>
                        <CollapseBody>
                            <Animatable.View duration={500} easing='ease-in' animation='zoomIn' className='py-1'>
                                <View className='flex-row justify-around pb-1'>
                                    <Text className='text-gray-300 text-xs font-semibold w-1/3 text-center underline'>SET</Text>
                                    <Text className='text-gray-300 text-xs font-semibold w-1/3 text-center underline'>{workout.metric === 'wr' ? 'LBS' : workout.metric === 'dt' ? 'MILES' : 'SECONDS'}</Text>
                                    <Text className='text-gray-300 text-xs font-semibold w-1/3 text-center underline'>{workout.metric === 'wr' ? 'REPS' : workout.metric === 'dt' ? 'MIN' : ''}</Text>
                                </View>
                                {setList(workout.metric1, workout.metric2, workout.exerName, i)}
                            </Animatable.View>
                        </CollapseBody>
                    </Collapse>
                </View>)
        })
    }

    function setList(metric1, metric2, exerName, exerIndex) {
        return metric1.map((val, i) => {
            return (
                <View className='flex-row justify-around' key={exerName + i + exerIndex}>
                    <Text className='text-gray-300 text-xs w-1/3 text-center'>{i + 1}</Text>
                    <Text className='text-gray-300 text-xs w-1/3 text-center'>{`${val}${exerName in stateSelector.userData.record && +val === stateSelector.userData.record[exerName].pr1 && +val !== 0 ? '*' : ''}`}</Text>
                    <Text className='text-gray-300 text-xs w-1/3 text-center'>{metric2 === undefined ? '' :
                        `${metric2[i]}${stateSelector.userData.record[exerName].pr1 === 0 && +metric2[i] === stateSelector.userData.record[exerName].pr2 ? '*' : ''}`
                    }</Text>
                </View>
            )
        })
    }

    /*
 ${exerName in stateSelector.userData.record && +val===stateSelector.userData.record[exerName].pr1 && +val !== 0? '*' : ''}
 ${stateSelector.userData.record[exerName].pr1 === 0 && +metric2[i] === stateSelector.userData.record[exerName].pr2 ? '*' : ''}
    */

    function handleExpand(key, index) {
        let updatedExpanded = JSON.parse(JSON.stringify(expanded));

        if (updatedExpanded[key][index]) {
            updatedExpanded[key][index] = false;
            setExpanded(updatedExpanded);
        }
        else {
            let tempArr = new Array(updatedExpanded[key].length).fill(false);
            tempArr[index] = true;
            updatedExpanded[key] = tempArr;
            setExpanded(updatedExpanded);
        }
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
                    <Text className='text-white text-lg font-semibold'>History</Text>
                </View>
                <ScrollView className='px-3 pt-3' contentContainerStyle={{ paddingBottom: 70 }}>
                    {Object.keys(userWorkObj).length !== 0 ? historyList(userWorkObj) :
                        <View className=' p-1 m-1'>
                            <View className='flex-row justify-between items-center mb-2'>
                                <Text className='text-gray-300 text-lg font-semibold w-7/12 italic'>
                                    No workout history..
                                </Text>
                            </View>
                        </View>}
                </ScrollView>
                <FooterComp />
            </View>
        </View>
    )
}

export default History;