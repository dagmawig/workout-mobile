import { View, Text, TouchableOpacity, TextInput, FlatList, Image, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { FontAwesome5 } from '@expo/vector-icons';
import TagComp from './TagComp';
import Search from './Search';
import { IMAGES } from '../assets';
import { useDispatch, useSelector } from 'react-redux';
import FilterTagComp from './FilterTagComp';
import { updateActiveB, updateActiveM } from './workoutSlice';
import exerLocal from '../assets/ExerData/exercisesLocal.json';

const SearchComp = ({ tempExerArr, setTempExerArr, setExerMode }) => {

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

    const stateSelector = useSelector(state => state.workout)
    const dispatch = useDispatch();

    const activeB = stateSelector.activeB;
    const activeM = stateSelector.activeM;

    const [searchMode, setSearchMode] = useState(false);
    const [filterMode, setFilterMode] = useState(false);
    const [selIndex, setSelIndex] = useState(new Array(1327).fill(false));
    const [searchTerm, setSearchTerm] = useState([]);
    const [exerArr, setExerArr] = useState(Search.sort(Search.search('')));
    const [fExerArr, setFExerArr] = useState(exerArr);
    const [loadList, setLoadList] = useState(fExerArr.slice(0, 50));
    const [tagList, setTagList] = useState([]);

    function handleX() {
        setSearchMode(false);
        setFilterMode(false);
        let resetArr = Search.search('')
        setExerArr(Search.sort(resetArr));
        setFExerArr(Search.sort(resetArr));
        setLoadList(resetArr.slice(0, 50));
        setSelIndex(new Array(1327).fill(false));
        setSearchTerm([]);
        setTagList([]);
        dispatch(updateActiveB(new Array(10).fill(false)));
        dispatch(updateActiveM(new Array(17).fill(false)));
        setExerMode(false);
    }

    function handleSBack() {
        setSearchMode(false);
    }

    function handleBackF() {
        setFilterMode(false);
    }

    function handleChange(text) {
        if (text === '') {
            let sRes = Search.sort(Search.search(''));
            setExerArr(sRes);
            setSearchTerm([]);
            let filArr = Search.filter(sRes, activeB, activeM)
            setFExerArr(filArr);
            setLoadList(filArr.slice(0, 50));
        }
        else {
            let sRes = Search.search(text)
            setExerArr(sRes);
            setSearchTerm([text]);
            let filArr = Search.filter(sRes, activeB, activeM);
            setFExerArr(filArr);
            setLoadList(filArr.slice(0, 50));
        }
    }

    function handleFilter() {
        setFilterMode(true);
    }

    function handleExerSel(refIndex) {
        let newSelIndex = JSON.parse(JSON.stringify(selIndex));
        newSelIndex[refIndex] = !newSelIndex[refIndex];
        setSelIndex(newSelIndex);
    }

    function updateResFil(activeB, activeM, filTag) {
        let filteredArr = Search.filter(exerArr, activeB, activeM)
        setFExerArr(filteredArr);
        setLoadList(filteredArr.slice(0, 50));
        if (filTag.remove) {
            const tagIndex = tagList.indexOf(filTag.tag);
            let newTagList = [...tagList];
            newTagList.splice(tagIndex, 1);

            setTagList(newTagList);
        }
        else {
            let newTagList = [...tagList];
            newTagList.push(filTag.tag);
            setTagList(newTagList)
        }
    }

    function fetchMore() {
        if (loadList.length < fExerArr.length) {
            setLoadList([...loadList, ...fExerArr.slice(loadList.length, loadList.length + 50)])
        }
    }

    function addExer() {
        let exerList = [];
        selIndex.filter((index, i) => {
            if (index === true) exerList.push({ ...exerLocal[i], sets: 4 })
        });

        let newTempExerArr = JSON.parse(JSON.stringify(tempExerArr));
        newTempExerArr.push(...exerList);
        setTempExerArr(newTempExerArr);
        handleX();
    }

    function clearSearch() {
        let sRes = Search.sort(Search.search(''));
        setExerArr(sRes);
        setSearchTerm([]);
        let filArr = Search.filter(sRes, activeB, activeM);
        setFExerArr(filArr);
        setLoadList(filArr.slice(0, 50));
    }

    function clearTag(tagIndex, tag) {
        const newTagList = tagList.slice(0, tagIndex).concat(tagList.slice(tagIndex + 1));
        setTagList(newTagList);

        if (bodyParts.indexOf(tag) !== -1) {
            let index = bodyParts.indexOf(tag);
            let newActiveB = JSON.parse(JSON.stringify(activeB));
            newActiveB[index] = false;
            dispatch(updateActiveB(newActiveB));
            let filArr = Search.filter(exerArr, newActiveB, activeM);
            setFExerArr(filArr);
            setLoadList(filArr.slice(0, 50));
        }
        else {
            let index = muscleGroups.indexOf(tag);
            let newActiveM = JSON.parse(JSON.stringify(activeM));
            newActiveM[index] = false;
            dispatch(updateActiveM(newActiveM));
            let filArr = Search.filter(exerArr, activeB, newActiveM);
            setFExerArr(filArr);
            setLoadList(filArr.slsice(0, 50));
        }
    }

    const SearchList = () => {
        return (
            <>
                {!filterMode ? <>
                    <FlatList
                        keyboardShouldPersistTaps='handled'
                        className='px-3'
                        data={loadList}
                        onEndReached={fetchMore}
                        onEndReachedThreshold={3}
                        ListHeaderComponent={<View className='flex-row flex-wrap w-full justify-left items-center'>
                            <TagComp tagArr={searchTerm} clearSearch={clearSearch} search={true} />
                            <TagComp tagArr={tagList} clearTag={clearTag} search={false} />
                        </View>}
                        ListFooterComponent={loadList.length < fExerArr.length ? <View className='flex-row justify-center'><Text className='text-white'>Loading...</Text></View> : null}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity key={`exer-${index}`} onPress={() => handleExerSel(item.refIndex)}>
                                {/* <Text className='text-gray-400'>{exer.name}</Text> */}
                                <View className='flex-row mb-2 space-x-2 bg-[#28547B] border-red-500'>
                                    <View>
                                        <Image
                                            source={IMAGES[item.refIndex]}
                                            className='w-20 h-20 object-cover bg-white'
                                            style={{ opacity: selIndex[item.refIndex] ? .4 : 1 }}
                                        />
                                    </View>
                                    <View className='w-64 justify-center px-2' style={{ backgroundColor: selIndex[item.refIndex] ? '#1a364f' : '' }}>
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
                </> : <ScrollView className='mb-11 px-3' keyboardShouldPersistTaps='handled'>
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
                </ScrollView>
                }
            </>
        )
    }

    return (
        <>
            <View className='w-full h-10 shadow-2xl flex-row items-center justify-between px-3 sticky'>
                {searchMode && !filterMode ? <>
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
                </> : filterMode ? <>
                    <TouchableOpacity onPress={handleBackF}>
                        <FontAwesome5 name="arrow-left" size={17} color="white" />
                    </TouchableOpacity>
                </> :
                    <>
                        <TouchableOpacity onPress={handleX}>
                            <FontAwesome5 name="times" size={17} color="white" />
                        </TouchableOpacity>
                        <View className=''>
                            <Text className='text-white text-lg font-semibold'>Select Exercises ({selIndex.filter(ind => ind === true).length})</Text>
                        </View>
                        <View className='flex-row space-x-2'>
                            <TouchableOpacity className='' onPress={e => setSearchMode(true)}>
                                <FontAwesome5 name="search" size={16} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity className='' onPress={handleFilter}>
                                <FontAwesome5 name="filter" size={16} color="white" />
                            </TouchableOpacity>
                        </View>
                    </>}
            </View>
            <SearchList />
            {!filterMode && selIndex.filter(ind => ind === true).length > 0 ? <View className='absolute bottom-8 right-0 mr-2  bg-[#28547B] justify-end flex-row z-50 rounded-full'>
                <TouchableOpacity className='bg-[#1a364f] justify-center items-center rounded-full  p-7' onPress={addExer}><FontAwesome5 name="check" size={26} color="white" /></TouchableOpacity>
            </View> : null}
        </>
    )
}



export default SearchComp