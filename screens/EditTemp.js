import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
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

const EditTemp = () => {

    const navigation = useNavigation();

    const stateSelector = useSelector(state => state.workout)
    const dispatch = useDispatch();

    const currentTemp = stateSelector.userData.templateArr[stateSelector.userData.currentTemp.index];

    const [exerMode, setExerMode] = useState(false);
    const [tempName, setTempName] = useState(currentTemp.name);
    const [tempExerArr, setTempExerArr] = useState(currentTemp.exerList);
    const [detMode, setDetMode] = useState(false);
    const [exerObj, setExerObj] = useState(null);

    function handleDelChange() {
        return Alert.alert('Discard Unsaved Changes?', 'Are you sure you want to discard unsaved changes?', [
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
                    navigation.navigate('Workout');
                }
            }
        ])
    }

    function handleDetBack() {
        setDetMode(false);
        setExerObj(null);
    }

    async function saveTemplate(newTempArr, uid) {
        let updateURI = REACT_APP_API_URI + 'updateTemp';
        let res = await axios.post(updateURI, { userID: uid, templateArr: newTempArr }).catch(err => console.log(err));

        return res;
    }

    function saveTemp() {
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
        else {
            let updatedTemp = JSON.parse(JSON.stringify(currentTemp));
            updatedTemp.name = tempName;
            updatedTemp.exerList = tempExerArr;
            let newUserTempArr = JSON.parse(JSON.stringify(stateSelector.userData.templateArr));
            newUserTempArr[stateSelector.userData.currentTemp.index] = updatedTemp;
            dispatch(updateUserTempArr(newUserTempArr));

            dispatch(updateLoading(true));
            SecureSt.getVal('uid').then(uid => {
                if (uid) {
                    saveTemplate(newUserTempArr, uid).then(res => {
                        let data = res.data;
                        if (data.success) {
                            dispatch(updateUserTempArr(data.data.templateArr));
                            Alert.alert(`Success`, `Template ${tempName} updated successfully!`);
                            setTempName('');
                            setTempExerArr([]);
                            navigation.navigate('Workout');
                            dispatch(updateLoading(false));
                        }
                        else {
                            dispatch(updateLoading(false));
                            Alert.alert(`Error`, `${data.err}`)
                        }
                    })
                }
                else console.log('invalid uid')

            })
        }
    }

    function handleTempName(text) {
        setTempName(text);
    }

    function removeExer(index) {
        let newTempExerArr = JSON.parse(JSON.stringify(tempExerArr));
        newTempExerArr.splice(index, 1);
        setTempExerArr(newTempExerArr);
    }

    function addSet(index) {
        let newTempExerArr = JSON.parse(JSON.stringify(tempExerArr));
        newTempExerArr[index].sets++;
        setTempExerArr(newTempExerArr);
    }

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

    return (
        <View className='bg-[#28547B] flex-1 max-h-screen min-w-screen overflow-hidden'>
            <Loading />
            <View className='pt-[45px] h-full w-full' >
                {exerMode ? <SearchComp tempExerArr={tempExerArr} setTempExerArr={setTempExerArr} setExerMode={setExerMode} /> : detMode ?
                    <>
                        <View className='w-full h-10 shadow-2xl flex-row items-center justify-between px-3 sticky'>
                            <>
                                <TouchableOpacity onPress={handleDetBack}>
                                    <FontAwesome5 name="arrow-left" size={17} color="white" />
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
                                    <FontAwesome5 name="times" size={17} color="white" />
                                </TouchableOpacity>
                                <Text className='text-white text-lg font-semibold'>Edit Template</Text>
                                <TouchableOpacity onPress={saveTemp}>
                                    <FontAwesome5 name="save" size={17} color="white" />
                                </TouchableOpacity>
                            </>
                        </View>
                        <ScrollView className='px-3' keyboardShouldPersistTaps='handled'>
                            <View>
                                <TextInput
                                    className='h-7 w-60  border-white border-2 rounded-md bg-[#345b7c] px-2 text-white'
                                    cursorColor={'white'}
                                    placeholder='template name'
                                    placeholderTextColor={'gray'}
                                    value={tempName}
                                    onChangeText={(text) => handleTempName(text)} />
                            </View>
                            <View className='pt-3'>
                                <TempExerComp exerArr={tempExerArr} removeExer={removeExer} addSet={addSet} removeSet={removeSet} setExerObj={setExerObj} setDetMode={setDetMode} />
                            </View>
                            <View className='justify-center items-center py-3'>
                                <TouchableOpacity onPress={() => setExerMode(true)}><Text className='text-white'>ADD EXERCISE</Text></TouchableOpacity>
                            </View>
                        </ScrollView>
                    </>}
            </View>
        </View>
    )
}

export default EditTemp