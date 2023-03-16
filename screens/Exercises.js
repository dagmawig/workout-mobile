import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import ExerComp from '../components/ExerComp';
import exerLocal from '../assets/ExerData/exercisesLocal.json';
import exerNames from '../assets/ExerData/exerciseNames.json';
import Fuse from 'fuse.js';
import TagComp from '../components/TagComp';
import FilterTagComp from '../components/FilterTagComp';

const Exercises = () => {

    const options = {
        includeScore: true,
        shouldSort: true,
        findAllMatches: true,
        useExtendedSearch: true,
        ignoreLocation: true,
        threshold: 0.06,
        keys: ['name']
    }

    const exerFuse = new Fuse(exerLocal.slice(0, 100), options);

    const navigation = useNavigation();
    const [searchMode, setSearchMode] = useState(false);
    const [exerArr, setExerArr] = useState([]);
    const [searchTerm, setSearchTerm] = useState([]);
    const [tagList, setTagList] = useState([]);
    const [filterMode, setFilterMode] = useState(true);
    const [lastMode, setLastMode] = useState('');

    const bodyParts = [
        "back",
        "cardio",
        "chest",
        "lower arms",
        "lower legs",
        "neck",
        "shoulders",
        "upper arms",
        "upper legs",
        "waist"
    ];

    const muscleGroups = [
        "abductors",
        "abs",
        "biceps",
        "calves",
        "cardiovascular system",
        "delts",
        "forearms",
        "glutes",
        "hamstrings",
        "lats",
        "levator scapulae",
        "pectorals",
        "quads",
        "serratus anterior",
        "spine",
        "traps",
        "triceps"
    ];

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        })
    }, [])

    function handleChange(text) {
        if (text === '') {
            setExerArr(exerFuse.search("!0123456789"));
            setSearchTerm([]);
        }
        else {
            setExerArr(exerFuse.search("'" + text.trim()));
            setSearchTerm([text]);
        }
        //console.log(exerArr)
    }

    function handleBack() {
        setSearchMode(false);
    }

    function handleBackF() {
        setFilterMode(false);
    }

    function handleFilter(mode) {
        setFilterMode(true);
        if (mode === 'search') {
            setLastMode('search');
        }
        else setLastMode('notS')
    }

    function clearTag(tagIndex) {
        const newTagList = tagList.slice(0, tagIndex).concat(tagList.slice(tagIndex + 1));
        setTagList(newTagList);
    }

    function clearSearch() {
        console.log("finds function");
        setExerArr(exerFuse.search("!0123456789"));
        setSearchTerm([]);
    }

    return (
        <View className='bg-[#28547B] flex-1 max-h-screen min-w-screen overflow-hidden'>
            <View className='pt-[20px] h-full w-full' >
                <View className='w-full h-10 shadow-2xl flex-row items-center justify-between px-3 sticky'>
                    {searchMode && !filterMode ? <>
                        <TouchableOpacity onPress={handleBack}>
                            <FontAwesome5 name="arrow-left" size={17} color="white" />
                        </TouchableOpacity>
                        <TextInput
                            className='h-7 w-60  border-white border-2 rounded-md bg-[#345b7c] px-2 text-white'
                            cursorColor={'white'}
                            placeholder='exercise name'
                            placeholderTextColor={'gray'}
                            value={searchTerm.length > 0 ? searchTerm[0] : ''}
                            onChangeText={(text) => handleChange(text)} />
                        <TouchableOpacity className='' onPress={() => handleFilter('search')}>
                            <FontAwesome5 name="filter" size={16} color="white" />
                        </TouchableOpacity>
                    </> : filterMode ? <>
                        <TouchableOpacity onPress={handleBackF}>
                            <FontAwesome5 name="arrow-left" size={17} color="white" />
                        </TouchableOpacity>
                    </> :
                        <>
                            <View className=''>
                                <Text className='text-white text-lg font-semibold'>Exercises</Text>
                            </View>
                            <View className='flex-row space-x-2'>
                                <TouchableOpacity className='' onPress={e => setSearchMode(true)}>
                                    <FontAwesome5 name="search" size={16} color="white" />
                                </TouchableOpacity>
                                <TouchableOpacity className='' onPress={() => handleFilter('notS')}>
                                    <FontAwesome5 name="filter" size={16} color="white" />
                                </TouchableOpacity>
                            </View>
                        </>
                    }


                    {/* <View className=''>
                        <Text className='text-white text-lg font-semibold'>Exercises</Text>
                    </View>
                    <View className='flex-row space-x-2'>
                        <TouchableOpacity className=''>
                            <FontAwesome5 name="search" size={16} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity className=''>
                            <FontAwesome5 name="filter" size={16} color="white" />
                        </TouchableOpacity>
                    </View> */}
                </View>
                <ScrollView className='mb-11 px-3' keyboardShouldPersistTaps='handled'>
                    {filterMode ?
                        <View className=''>
                            <View className='pt-2'>
                                <Text className='text-[30px] text-white'>Filter {`(${exerArr.length})`}</Text>
                            </View>
                            <View className='mt-3'>
                                <View className='my-2'>
                                    <Text className='text-white'>Body Part</Text>
                                </View>
                                <View className='flex-row flex-wrap w-full justify-left items-center'>
                                    <FilterTagComp filterTags={bodyParts} filterType={'body'} />
                                </View>
                            </View>
                            <View className='mt-3'>
                                <View className='my-2'>
                                    <Text className='text-white'>Muscle Group</Text>
                                </View>
                                <View className='flex-row flex-wrap w-full justify-left items-center'>
                                    <FilterTagComp filterTags={muscleGroups} filterType={'muscle'} />
                                </View>
                            </View>
                        </View> :
                        <>
                            <View className='flex-row flex-wrap w-full justify-left items-center'>
                                <TagComp tagArr={searchTerm} clearSearch={clearSearch} search={true} />
                                <TagComp tagArr={tagList} clearTag={clearTag} search={false} />
                            </View>
                            <ExerComp filterExer={exerArr} /></>
                    }
                </ScrollView>
                <View className='absolute bottom-0 h-10 bg-[#28547B] w-full items-center justify-center'>
                    <Text> dfgdf</Text>
                </View>
            </View>

        </View>
    )
}

export default Exercises