import { View, Text, TouchableOpacity, ScrollView, Alert, BackHandler } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import TempExerComp from '../components/TempExerComp';
import SearchComp from '../components/SearchComp';
import { useDispatch, useSelector } from 'react-redux';
import { updateCurrentTemp, updateLoading, updateStartTime, updateUserData } from '../components/workoutSlice';
import ExerDetComp from '../components/ExerDetComp';
import Loading from '../components/Loading';
import { REACT_APP_API_URI } from '@env'
import axios from 'axios';
import SecureSt from '../components/SecureStore';
import { customStyle } from '../components/Style';

const LogWorkout = () => {

    const stateSelector = useSelector(state => state.workout);
    const dispatch = useDispatch();

    const currentTempObj = stateSelector.currentTemp;
    let currentTemp = currentTempObj.userTemp ? stateSelector.userData.templateArr[currentTempObj.index] :
        stateSelector.userData.fixTempArr[currentTempObj.index];

    let inputArr = [];
    currentTemp.exerList.map(exer => {
        let arr = [];
        let totSets = exer.sets;
        if (exer.metric === 'wr' || exer.metric === 'dt') arr = new Array(2).fill().map(() => new Array(totSets));
        else arr = new Array(1).fill().map(() => new Array(totSets));
        inputArr.push(arr);
    })

    const [tempExerArr, setTempExerArr] = useState(currentTemp.exerList);
    const [exerMode, setExerMode] = useState(false);
    const [inputState, setInputState] = useState(inputArr);
    const [detMode, setDetMode] = useState(false);
    const [exerObj, setExerObj] = useState(null);
    const [seconds, setSeconds] = useState(0);
    const navigation = useNavigation();

    setTimeout(() => {
        setSeconds(Math.floor(Date.now() / 1000) - stateSelector.startTime);
        //setSeconds(seconds + 1);
    }, 1000);

    function updateInput(i, j, k, val) {
        if (+val || val === '' || val === '0') {
            inputState[i][j][k] = val === '' ? undefined : val;
            setInputState(JSON.parse(JSON.stringify(inputState)));
        }
    }

    function checkInput(arr) {
        for (let exer of arr) {
            for (let metric of exer) {
                for (let set of metric) {
                    if (set === undefined || set === null) return false
                }
            }
        }

        return true;
    }

    function handleCancel() {
        Alert.alert('Cancel Workout?', 'Are you sure you want to cancel workout session?', [
            {
                text: 'NO',
                onPress: null,
                style: 'default'
            },
            {
                text: 'YES',
                onPress: () => {
                    setTempExerArr([]);
                    navigation.navigate('Workout');
                    dispatch(updateCurrentTemp(null));
                    dispatch(updateStartTime(null));
                },
                style: 'destructive'
            }
        ])
    }

    function handleDetBack() {
        setDetMode(false);
        setExerObj(null);
    }

    function updateExerRecord(inputStateExer, exer, record) {
        let maxVal = Math.max(...inputStateExer[0]);
        let maxIndex = inputStateExer[0].indexOf(maxVal.toString());
        let maxRep;
        if (exer.metric === 'wr' && maxVal === 0) {
            maxRep = Math.max(...inputStateExer[1]);
            maxIndex = inputStateExer[1].indexOf(maxRep.toString());
        }
        if (exer.name in record) {
            let exerRecord = record[exer.name];
            exerRecord.metric = exer.metric;

            exerRecord.prev1 = inputStateExer[0][inputStateExer[0].length - 1];
            if (exer.metric === 'wr' || exer.metric === 'dt') {
                exerRecord.prev2 = inputStateExer[1][inputStateExer[1].length - 1];
            }

            if (maxVal > exerRecord.pr1) {
                exerRecord.pr1 = maxVal;
                if (exer.metric === 'wr' || exer.metric === 'dt') {
                    exerRecord.pr2 = parseInt(inputStateExer[1][maxIndex]);
                }
            }
            else if (exer.metric === 'wr' && maxVal === 0 && exerRecord.pr1 === 0) {
                if (maxRep > exerRecord.pr2) exerRecord.pr2 = maxRep;
            }
        }
        else {
            let exerRecord = {};
            exerRecord.metric = exer.metric;
            exerRecord.prev1 = inputStateExer[0][inputStateExer[0].length - 1];
            exerRecord.pr1 = maxVal;

            if (exer.metric === 'wr' || exer.metric === 'dt') {
                exerRecord.prev2 = inputStateExer[1][inputStateExer[1].length - 1];
                exerRecord.pr2 = parseInt(inputStateExer[1][maxIndex]);
            }

            record[exer.name] = exerRecord;
        }

        return record;
    }

    async function saveWorkout(workoutObj, user, updatedTempArr, record, uid) {
        let updateURI = REACT_APP_API_URI + 'updateWorkoutObj';
        let res = await axios.post(updateURI, { userID: uid, workoutObj, user, updatedTempArr, record }).catch(err => console.log(err));

        return res;
    }

    function handleSave() {
        if (tempExerArr.length === 0) {
            Alert.alert('No Exercise under Template!', 'There are no exercises under current template. Please add exercise(s) and log workout data before saving current sesssion.', [
                {
                    text: 'OK',
                    onPress: null,
                    style: 'default'
                }
            ])
        }
        else if (!checkInput(inputState)) {
            Alert.alert('Missing set data!', 'Some exercise sets are not complete. Either complete sets or remove incomplete sets before saving current sesssion. If doing weightless exercise, put 0 in the LBS box.', [
                {
                    text: 'OK',
                    onPress: null,
                    style: 'default'
                }
            ])
        }
        else {
            Alert.alert('Finish workout?', 'Do you want to finish workout?', [
                {
                    text: 'No',
                    onPress: null,
                    style: 'cancel'
                },
                {
                    text: 'Yes',
                    onPress: () => {
                        let record = JSON.parse(JSON.stringify(stateSelector.userData.record));
                        let timeStamp = new Date().toISOString();
                        let workObj = {};
                        workObj.tempName = currentTemp.name;
                        let workoutList = [];

                        for (let i = 0; i < inputState.length; i++) {
                            let inputStateExer = inputState[i];
                            let exer = tempExerArr[i];
                            let exercise = {};
                            exercise.exerName = exer.name;
                            exercise.metric = exer.metric;
                            exercise.metric1 = inputStateExer[0];
                            if (exer.metric === 'wr' || exer.metric === 'dt') exercise.metric2 = inputStateExer[1];
                            workoutList.push(exercise);

                            updateExerRecord(inputStateExer, exer, record);
                        }

                        workObj.workoutList = workoutList;
                        workObj.duration = seconds;
                        let tempUserObj = JSON.parse(JSON.stringify(stateSelector.userData.workoutObj));
                        tempUserObj[timeStamp] = workObj;

                        let newTemplateArr = JSON.parse(JSON.stringify(currentTempObj.userTemp ? stateSelector.userData.templateArr : stateSelector.userData.fixTempArr));
                        newTemplateArr[currentTempObj.index].workoutTimeArr.push(new Date().toISOString());

                        dispatch(updateLoading(true));
                        SecureSt.getVal('uid').then(uid => {
                            if (uid) {
                                saveWorkout(tempUserObj, currentTempObj.userTemp, newTemplateArr, record, uid).then(res => {
                                    let data = res.data;
                                    if (data.success) {
                                        dispatch(updateUserData(data.data));
                                        Alert.alert(`Success`, `Workout under template "${currentTemp.name}" saved successfully!`);
                                        setTempExerArr([]);
                                        navigation.navigate('Workout');
                                        dispatch(updateCurrentTemp(null));
                                        dispatch(updateLoading(false));
                                        dispatch(updateStartTime(null))
                                    }
                                    else {
                                        dispatch(updateLoading(false));
                                        Alert.alert(`Error`, `${data.err}`)
                                    }
                                })
                            }
                            else console.log('invalid uid: ', uid)
                        })
                    }
                }
            ])
        }
    }

    function addSet(index) {
        let newTempExerArr = JSON.parse(JSON.stringify(tempExerArr));
        newTempExerArr[index].sets++;
        setTempExerArr(newTempExerArr);
        inputState[index].map(ar => ar.push(undefined));
    }

    function removeSet(index) {
        let newTempExerArr = JSON.parse(JSON.stringify(tempExerArr));
        newTempExerArr[index].sets--;
        setTempExerArr(newTempExerArr);
        inputState[index].map(ar => ar.pop());
    }

    function removeExer(index) {
        let newTempExerArr = JSON.parse(JSON.stringify(tempExerArr));
        newTempExerArr.splice(index, 1);
        setTempExerArr(newTempExerArr);
        inputState.splice(index, 1);
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        })
    }, []);

    useEffect(() => {

    }, [])

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                if (detMode) {
                    handleDetBack();
                    return true;
                }
                else {
                    handleCancel();
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
                {
                    exerMode ? <SearchComp tempExerArr={tempExerArr} setTempExerArr={setTempExerArr} setExerMode={setExerMode} inputState={inputState} /> :
                        detMode ?
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
                                    <TouchableOpacity onPress={handleCancel}><FontAwesome5 name="times" size={25} color="white" /></TouchableOpacity>
                                    <View className='items-center'>
                                        <Text className='text-white text-lg font-semibold'>{currentTemp.name}</Text>
                                        <Text className='text-white'>{new Date(seconds * 1000).toISOString().substr(11, 8)}</Text>
                                    </View>
                                    <TouchableOpacity onPress={handleSave}><FontAwesome5 name="save" size={25} color="white" /></TouchableOpacity>
                                </View>
                                <ScrollView className='px-3' keyboardShouldPersistTaps='handled'>
                                    <View className='pt-3'>
                                        <TempExerComp exerArr={tempExerArr} removeExer={removeExer} addSet={addSet} removeSet={removeSet} editable={true} inputState={inputState} updateInput={updateInput} setExerObj={setExerObj} setDetMode={setDetMode} />
                                    </View>
                                    <View className='justify-center items-center py-3 space-y-2'>
                                        <TouchableOpacity onPress={() => setExerMode(true)}><Text className='text-white text-lg'>ADD EXERCISE</Text></TouchableOpacity>
                                        <TouchableOpacity onPress={handleSave}><Text className='text-white text-xl'>FINISH WORKOUT</Text></TouchableOpacity>
                                        <TouchableOpacity onPress={handleCancel}><Text className='text-white text-lg'>CANCEL WORKOUT</Text></TouchableOpacity>
                                    </View>
                                </ScrollView>
                            </>
                }
            </View>
        </View>
    )
}

export default LogWorkout