import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import TempExerComp from '../components/TempExerComp';

const EditTemp = () => {

    const navigation = useNavigation();

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

    const [exerMode, setExerMode] = useState(false);
    const [tempName, setTempName] = useState(temp.name);
    const [exerList, setExerList] = useState(temp.exerList);

    function handleDelChange() {

    }

    function saveTemp() {

    }

    function handleTempName(text) {
        setTempName(text);
    }

    function removeExer(index) {
        let newExerList = JSON.parse(JSON.stringify(exerList));
        newExerList.splice(index, 1);
        setExerList(newExerList);
    }

    function addSet(index) {
        let newExerList = JSON.parse(JSON.stringify(exerList));
        newExerList[index].sets++;
        setExerList(newExerList);
    }

    function removeSet(index) {
        let newExerList = JSON.parse(JSON.stringify(exerList));
        newExerList[index].sets--;
        setExerList(newExerList);
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
                    <TouchableOpacity onPress={handleDelChange}>
                        <FontAwesome5 name="times" size={17} color="white" />
                    </TouchableOpacity>
                    <Text className='text-white text-lg font-semibold'>Edit Template</Text>
                    <TouchableOpacity onPress={saveTemp}>
                        <FontAwesome5 name="save" size={17} color="white" />
                    </TouchableOpacity>
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
                        <TempExerComp exerArr={exerList} removeExer={removeExer} addSet={addSet} removeSet={removeSet} />
                    </View>
                    <View className='justify-center items-center py-3'>
                        <TouchableOpacity onPress={() => setExerMode(true)}><Text className='text-white'>ADD EXERCISE</Text></TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </View>
    )
}

export default EditTemp