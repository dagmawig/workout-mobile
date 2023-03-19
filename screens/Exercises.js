import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import ExerComp from '../components/ExerComp';
import exerLocal from '../assets/ExerData/exercisesLocal.json';
import exerNames from '../assets/ExerData/exerciseNames.json';
import Fuse from 'fuse.js';
import TagComp from '../components/TagComp';
import FilterTagComp from '../components/FilterTagComp';
import { useSelector, useDispatch } from 'react-redux';
import { updateActiveB, updateActiveM, updateBodyTag, updateMuscleTag } from '../components/workoutSlice';

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
    const stateSelector = useSelector(state => state.workout);
    const dispatch = useDispatch()

    const [searchMode, setSearchMode] = useState(false);
    const [exerArr, setExerArr] = useState(exerFuse.search("!0123456789"));
    const [searchTerm, setSearchTerm] = useState([]);
    const [tagList, setTagList] = useState([]);
    const [filterMode, setFilterMode] = useState(true);
    const [lastMode, setLastMode] = useState('');
    const [fExerArr, setFExerArr] = useState(exerArr);

    const activeB = stateSelector.activeB;
    const activeM = stateSelector.activeM;

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

    function applyFilter(eArr, activeB, activeM) {
        
        const bList = bodyParts.filter((body, i)=> {
            return activeB[i]
        });

        const mList = muscleGroups.filter((muscle, i) => {
            return activeM[i];
        })

        console.log(mList, bList)
        if(mList.length!==0 || bList.length!==0) return eArr.filter(exer=> {
           return bList.includes(exer.item.bodyPart) || mList.includes(exer.item.target);
        })
        else return eArr;
    }

    function updateResFil(activeB, activeM) {
        setFExerArr(applyFilter(exerArr, activeB, activeM))
    }

    function handleChange(text) {
        if (text === '') {
            let sRes = exerFuse.search("!0123456789")
            setExerArr(sRes);
            setSearchTerm([]);
            setFExerArr(applyFilter(sRes, activeB, activeM))
        }
        else {
            let sRes = exerFuse.search("'" + text.trim())
            setExerArr(sRes);
            setSearchTerm([text]);
            setFExerArr(applyFilter(sRes, activeB, activeM))
        }
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
        let sRes = exerFuse.search("!0123456789");
        setExerArr(sRes);
        setSearchTerm([]);
        setFExerArr(applyFilter(sRes, activeB, activeM))
    }

    function handleFilterUpdate() {

    }

    return (
        <View className='bg-[#28547B] flex-1 max-h-screen min-w-screen overflow-hidden'>
            <View className='pt-[45px] h-full w-full' >
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
                                <Text className='text-[30px] text-white'>Filter {`(${fExerArr.length})`}</Text>
                            </View>
                            <View className='mt-3'>
                                <View className='my-2'>
                                    <Text className='text-white'>Body Part</Text>
                                </View>
                                <View className='flex-row flex-wrap w-full justify-left items-center' activity={activeB}>
                                    <FilterTagComp filterTags={bodyParts} filterType={'body'} updateResFil={updateResFil} />
                                </View>
                            </View>
                            <View className='mt-3'>
                                <View className='my-2'>
                                    <Text className='text-white'>Muscle Group</Text>
                                </View>
                                <View className='flex-row flex-wrap w-full justify-left items-center' activity={activeM}>
                                    <FilterTagComp filterTags={muscleGroups} filterType={'muscle'} updateResFil={updateResFil} />
                                </View>
                            </View>
                        </View> :
                        <>
                            <View className='flex-row flex-wrap w-full justify-left items-center'>
                                <TagComp tagArr={searchTerm} clearSearch={clearSearch} search={true} />
                                <TagComp tagArr={tagList} clearTag={clearTag} search={false} />
                            </View>
                            <ExerComp filterExer={fExerArr} /></>
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