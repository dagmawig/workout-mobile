import { View, Text, TouchableOpacity, ScrollView, TextInput, FlatList, Image } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import exerLocal from '../assets/ExerData/exercisesLocal.json';
import Fuse from 'fuse.js';
import { useSelector } from 'react-redux';
import TagComp from '../components/TagComp';
import { IMAGES } from '../assets';
import FilterTagComp from '../components/FilterTagComp';

const NewTemp = () => {

    const options = {
        includeScore: true,
        shouldSort: true,
        findAllMatches: true,
        useExtendedSearch: true,
        ignoreLocation: true,
        threshold: 0.06,
        keys: ['name']
    }

    const exerFuse = new Fuse(exerLocal, options);
    const stateSelector = useSelector(state => state.workout);
    const navigation = useNavigation();

    function sortExer(exerArr) {
        return exerArr.sort((a, b) => {

            return a.item.name < b.item.name ? -1 : b.item.name > a.item.name ? 1 : 0;
        })
    }


    const activeB = stateSelector.activeB;
    const activeM = stateSelector.activeM;

    const [searchTerm, setSearchTerm] = useState([]);
    const [exerMode, setExerMode] = useState(false);
    const [exerArr, setExerArr] = useState(sortExer(exerFuse.search("!0123456789")));
    const [fExerArr, setFExerArr] = useState(exerArr);
    const [loadList, setLoadList] = useState(fExerArr.slice(0, 50));
    const [searchMode, setSearchMode] = useState(false);
    const [filterMode, setFilterMode] = useState(false);
    const [tagList, setTagList] = useState([]);
    const [selIndex, setSelIndex] = useState(new Array(1327).fill(false));

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

    function applyFilter(eArr, activeB, activeM) {

        const bList = bodyParts.filter((body, i) => {
            return activeB[i]
        });

        const mList = muscleGroups.filter((muscle, i) => {
            return activeM[i];
        })

        if (mList.length !== 0 || bList.length !== 0) return eArr.filter(exer => {
            return bList.includes(exer.item.bodyPart) || mList.includes(exer.item.target);
        })
        else return eArr;
    }

    function handleBack() {

    }

    function handleSBack() {
        setSearchMode(false);
    }

    function handleBackF() {
        setFilterMode(false);

    }

    function saveTemp() {

    }

    function handleX() {
        setExerMode(false);
        setSearchMode(false);
        setFilterMode(false);
        let resetArr = exerFuse.search("!0123456789")
        setExerArr(sortExer(resetArr));
        setFExerArr(sortExer(resetArr));
        setLoadList(resetArr.slice(0, 50));
        setSelIndex(new Array(1327));
    }

    function fetchMore() {

    }

    function clearSearch() {
        let sRes = sortExer(exerFuse.search("!0123456789"));
        setExerArr(sRes);
        setSearchTerm([]);
        let filArr = applyFilter(sRes, activeB, activeM);
        setFExerArr(filArr);
        setLoadList(filArr.slice(0, 50));
    }

    function clearTag(tagIndex, tag) {

    }

    function handleExerSel(refIndex) {
        let newSelIndex = JSON.parse(JSON.stringify(selIndex));
        newSelIndex[refIndex] = !newSelIndex[refIndex];
        setSelIndex(newSelIndex);
    }

    function handleFilter(mode) {
        setFilterMode(true);
        // if (mode === 'search') {
        //     setLastMode('search');
        // }
        // else setLastMode('notS')
    }

    function handleChange(text) {
        if (text === '') {
            let sRes = sortExer(exerFuse.search("!0123456789"));
            setExerArr(sRes);
            setSearchTerm([]);
            let filArr = applyFilter(sRes, activeB, activeM)
            setFExerArr(filArr);
            setLoadList(filArr.slice(0, 50));
        }
        else {
            let sRes = exerFuse.search("'" + text.trim())
            setExerArr(sRes);
            setSearchTerm([text]);
            let filArr = applyFilter(sRes, activeB, activeM);
            setFExerArr(filArr);
            setLoadList(filArr.slice(0, 50));
        }
    }

    function updateResFil(activeB, activeM, filTag) {
        // let filteredArr = applyFilter(exerArr, activeB, activeM)
        // setFExerArr(filteredArr);
        // setLoadList(filteredArr.slice(0, 50));
        // if (filTag.remove) {
        //     const tagIndex = tagList.indexOf(filTag.tag);
        //     let newTagList = [...tagList];
        //     newTagList.splice(tagIndex, 1);
        //     console.log(filTag, tagList, newTagList, tagIndex)

        //     setTagList(newTagList);
        // }
        // else {
        //     let newTagList = [...tagList];
        //     newTagList.push(filTag.tag);
        //     setTagList(newTagList)
        // }
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
                    {exerMode && !searchMode && !filterMode ? <>
                        <TouchableOpacity onPress={handleX}>
                            <FontAwesome5 name="times" size={17} color="white" />
                        </TouchableOpacity>
                        <View className=''>
                            <Text className='text-white text-lg font-semibold'>Exercises</Text>
                        </View>
                        <View className='flex-row space-x-2'>
                            <TouchableOpacity className='' onPress={e => setSearchMode(true)}>
                                <FontAwesome5 name="search" size={16} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity className='' onPress={handleFilter}>
                                <FontAwesome5 name="filter" size={16} color="white" />
                            </TouchableOpacity>
                        </View>
                    </> :
                        exerMode && searchMode && !filterMode ? <>
                            <TouchableOpacity onPress={handleSBack}>
                                <FontAwesome5 name="arrow-left" size={17} color="white" />
                            </TouchableOpacity>
                            <TextInput
                                autoFocus
                                className='h-7 w-60  border-white border-2 rounded-md bg-[#345b7c] px-2 text-white'
                                cursorColor={'white'}
                                placeholder='exercise name'
                                placeholderTextColor={'gray'}
                                value={searchTerm.length > 0 ? searchTerm[0] : ''}
                                onChangeText={(text) => handleChange(text)} />
                            <TouchableOpacity className='' onPress={handleFilter}>
                                <FontAwesome5 name="filter" size={16} color="white" />
                            </TouchableOpacity>
                        </> : exerMode && filterMode ? <>
                            <TouchableOpacity onPress={handleBackF}>
                                <FontAwesome5 name="arrow-left" size={17} color="white" />
                            </TouchableOpacity>
                        </>
                            : <>
                                <TouchableOpacity onPress={handleBack}>
                                    <FontAwesome5 name="arrow-left" size={17} color="white" />
                                </TouchableOpacity>
                                <Text className='text-white text-lg font-semibold'>New Template</Text>
                                <TouchableOpacity onPress={saveTemp}>
                                    <FontAwesome5 name="save" size={17} color="white" />
                                </TouchableOpacity>
                            </>
                    }

                </View>
                {exerMode && !filterMode ? <>
                    <FlatList
                        className='mb-9'
                        data={loadList}
                        onEndReached={fetchMore}
                        onEndReachedThreshold={3}
                        ListHeaderComponent={<View className='flex-row flex-wrap w-full justify-left items-center'>
                            <TagComp tagArr={searchTerm} clearSearch={clearSearch} search={true} />
                            <TagComp tagArr={tagList} clearTag={clearTag} search={false} />
                        </View>}
                        ListFooterComponent={loadList.length < fExerArr.length ? <View className='flex-row justify-center'><Text className='text-white'>Loading...</Text></View> : null}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity key={`exer-${index}`} onPress={()=>handleExerSel(item.refIndex)}>
                                {/* <Text className='text-gray-400'>{exer.name}</Text> */}
                                <View className='flex-row mb-2 space-x-2 bg-[#28547B] border-red-500'>
                                    <View>
                                        <Image
                                            source={IMAGES[item.refIndex]}
                                            className='w-20 h-20 object-cover bg-white'
                                        />
                                    </View>
                                    <View className='w-64 justify-center' style={{backgroundColor: selIndex[item.refIndex]? '#1a364f' : ''}}>
                                        <Text className='text-lg text-white flex-wrap'>
                                            {item.item.name}
                                        </Text>
                                        <Text className='text-white italic'>
                                            {item.item.bodyPart}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </> : exerMode && filterMode ?
                    <ScrollView className='mb-11 px-3' keyboardShouldPersistTaps='handled'>
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
                        </View>
                    </ScrollView> : <ScrollView className='mb-11 px-3' keyboardShouldPersistTaps='handled'>
                        <View>
                            <TextInput
                                className='h-7 w-60  border-white border-2 rounded-md bg-[#345b7c] px-2 text-white'
                                cursorColor={'white'}
                                placeholder='template name'
                                placeholderTextColor={'gray'}
                                value={searchTerm.length > 0 ? searchTerm[0] : ''}
                                onChangeText={(text) => handleChange(text)} />
                        </View>
                        <View className='justify-center items-center py-3'>
                            <TouchableOpacity onPress={() => setExerMode(true)}><Text>Add Exercise</Text></TouchableOpacity>
                        </View>
                    </ScrollView>}
            </View>
        </View>
    )
}

export default NewTemp