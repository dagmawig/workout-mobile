import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { updateLoading, updateUserTempArr } from '../components/workoutSlice';
import TempExerComp from '../components/TempExerComp';
import SearchComp from '../components/SearchComp';
import ExerDetComp from '../components/ExerDetComp';
import Loading from '../components/Loading';
import { REACT_APP_API_URI } from '@env';
import SecureSt from '../components/SecureStore';
import axios from 'axios';
import { customStyle } from '../components/Style';

const NewTemp = () => {

    const stateSelector = useSelector(state => state.workout);
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [exerMode, setExerMode] = useState(false);
    const [tempExerArr, setTempExerArr] = useState([]);
    const [tempName, setTempName] = useState('');
    const [detMode, setDetMode] = useState(false);
    const [exerObj, setExerObj] = useState(null);

    function handleDelTemp() {
        setTempName('');
        setTempExerArr([]);
        return navigation.navigate('Workout');
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
            let workoutTemp = {
                tempID: new Date().toISOString(),
                workoutTimeArr: [],
                name: tempName,
                exerList: JSON.parse(JSON.stringify(tempExerArr))
            }

            let newUserTempArr = JSON.parse(JSON.stringify(stateSelector.userData.templateArr));
            newUserTempArr.push(workoutTemp);

            dispatch(updateLoading(true));
            SecureSt.getVal('uid').then(uid => {
                if (uid) {
                    saveTemplate(newUserTempArr, uid).then(res => {
                        let data = res.data;
                        if (data.success) {
                            dispatch(updateUserTempArr(data.data.templateArr));
                            Alert.alert(`Success`, `Template "${tempName}" saved successfully!`);
                            navigation.navigate('Workout');
                            setTempName('');
                            setTempExerArr([]);
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
            <View className='h-full w-full' style={customStyle.topPad}>
                {exerMode ? <SearchComp tempExerArr={tempExerArr} setTempExerArr={setTempExerArr} setExerMode={setExerMode} /> :
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
                                <>
                                    <TouchableOpacity onPress={handleDelTemp}>
                                        <FontAwesome5 name="times" size={25} color="white" />
                                    </TouchableOpacity>
                                    <Text className='text-white text-xl font-semibold'>New Template</Text>
                                    <TouchableOpacity onPress={saveTemp}>
                                        <FontAwesome5 name="save" size={25} color="white" />
                                    </TouchableOpacity>
                                </>
                            </View>
                            <ScrollView className='px-3' keyboardShouldPersistTaps='handled'>
                                <View>
                                    <TextInput
                                        className='h-10 w-60  border-white text-base border-2 rounded-md bg-[#345b7c] px-2 text-white mt-1'
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
                                    <TouchableOpacity onPress={() => setExerMode(true)}><Text className='text-white text-lg'>ADD EXERCISE</Text></TouchableOpacity>
                                </View>
                            </ScrollView>
                        </>
                }
            </View>
        </View>
    )
}

export default NewTemp