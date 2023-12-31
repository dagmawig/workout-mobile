import { View, Text, ScrollView } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import FooterComp from '../components/FooterComp';
import { FontAwesome5, FontAwesome } from '@expo/vector-icons';
import { Collapse, CollapseHeader, CollapseBody } from 'accordion-collapse-react-native'
import { useDispatch, useSelector } from 'react-redux';
import * as Animatable from 'react-native-animatable'
import Loading from '../components/Loading';
import { TouchableOpacity } from 'react-native';
import { Alert } from 'react-native';
import { updateLoading, updateUserData } from '../components/workoutSlice';
import { REACT_APP_API_URI } from '@env';
import axios from 'axios';
import SecureSt from '../components/SecureStore';
import { customStyle } from '../components/Style';

const History = () => {

    const navigation = useNavigation();
    const stateSelector = useSelector(state => state.workout);
    const dispatch = useDispatch();

    const userWorkObj = stateSelector.userData.workoutObj;

    const [expanded, setExpanded] = useState(
        Object.keys(userWorkObj).reduce((expObj, key) => {
            expObj[key] = new Array(userWorkObj[key].workoutList.length).fill(false);
            return expObj;
        }, {})
    );

    // returns workout session history list component
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

    // returns workout session exercise list component
    function exerList(workoutList, key) {
        return workoutList?.map((workout, i) => {
            return (
                <View key={'history-exer' + key + i} className=' my-[1px] '>
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

    // returns set list component with workout record for a given exercise
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

    // handles the expansion of a given workout session to reveal the workout record
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

    // handles the update of database after workout history is cleared
    async function resetH(uid) {
        let updateURI = REACT_APP_API_URI + 'resetHistory';
        let res = await axios.post(updateURI, { userID: uid }).catch(err => console.log(err));

        return res;
    }

    // handles clearing of workout history
    function clearHistory() {
        Alert.alert(`Clear History`, `Are you sure you want to clear workout history?`, [
            {
                text: 'No',
                onPress: null,
                style: 'cancel'
            },
            {
                text: 'Yes',
                onPress: () => {
                    dispatch(updateLoading(true));
                    SecureSt.getVal('uid').then(uid => {
                        if (uid) {
                            resetH(uid).then(res => {
                                let data = res.data;
                                if (data.success) {
                                    dispatch(updateUserData(data.data))
                                    Alert.alert(`Success`, `Workout history cleared successfully!`);
                                    dispatch(updateLoading(false));
                                }
                                else {
                                    dispatch(updateLoading(false));
                                    Alert.alert(`Error`, `${data.err}`);
                                }
                            }).catch(err => console.log(err))
                        }
                        else console.log('invalid uid: ', uid)
                    }).catch(err => console.log(err))
                },
                style: 'destructive'
            }
        ])
    }


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
                    <Text className='text-white text-xl font-semibold'>History</Text>
                    {Object.keys(userWorkObj).length !== 0 ? <TouchableOpacity onPress={clearHistory}><FontAwesome name="eraser" size={25} color="white" /></TouchableOpacity> : null}
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