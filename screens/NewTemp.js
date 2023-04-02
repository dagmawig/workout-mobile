import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserTempArr } from '../components/workoutSlice';
import TempExerComp from '../components/TempExerComp';
import SearchComp from '../components/SearchComp';

const NewTemp = () => {

    const stateSelector = useSelector(state => state.workout);
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [exerMode, setExerMode] = useState(false);
    const [tempExerArr, setTempExerArr] = useState([]);
    const [tempName, setTempName] = useState('');

    function handleDelTemp() {
        // if (tempName.split(' ').join('') || tempExerArr.length !== 0) return Alert.alert('Delete Template?', 'Are you sure you want to delete template?', [
        //     {
        //         text: 'CANCEL',
        //         onPress: () => null,
        //         style: 'cancel'
        //     },
        //     {
        //         text: 'DELETE',
        //         onPress: () => {
        //             setTempName('');
        //             setTempExerArr([]);
        //             navigation.navigate('Workout');
        //         }
        //     }
        // ])

        setTempName('');
        setTempExerArr([]);
        return navigation.navigate('Workout');
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

            let newUserTempArr = JSON.parse(JSON.stringify(stateSelector.userData.userTempArr));
            newUserTempArr.push(workoutTemp);
            dispatch(updateUserTempArr(newUserTempArr));
            setTempName('');
            setTempExerArr([]);
            return navigation.navigate('Workout');
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
            <View className='pt-[45px] h-full w-full' >
                {exerMode ? <SearchComp tempExerArr={tempExerArr} setTempExerArr={setTempExerArr} setExerMode={setExerMode} /> :
                    <>
                        <View className='w-full h-10 shadow-2xl flex-row items-center justify-between px-3 sticky'>
                            <>
                                <TouchableOpacity onPress={handleDelTemp}>
                                    <FontAwesome5 name="times" size={17} color="white" />
                                </TouchableOpacity>
                                <Text className='text-white text-lg font-semibold'>New Template</Text>
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
                                <TempExerComp exerArr={tempExerArr} removeExer={removeExer} addSet={addSet} removeSet={removeSet} />
                            </View>
                            <View className='justify-center items-center py-3'>
                                <TouchableOpacity onPress={() => setExerMode(true)}><Text className='text-white'>ADD EXERCISE</Text></TouchableOpacity>
                            </View>
                        </ScrollView>
                    </>
                }
            </View>
        </View>
    )
}

export default NewTemp