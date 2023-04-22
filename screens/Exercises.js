import { View, Text, TouchableOpacity, ScrollView, TextInput, FlatList, Image } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import TagComp from '../components/TagComp';
import FilterTagComp from '../components/FilterTagComp';
import { useSelector, useDispatch } from 'react-redux';
import { updateActiveB, updateActiveM } from '../components/workoutSlice';
import ExerDetComp from '../components/ExerDetComp';
import { IMAGES } from '../assets';
import FooterComp from '../components/FooterComp';
import Search from '../components/Search';
import Loading from '../components/Loading';

const Exercises = () => {

    const navigation = useNavigation();
    const stateSelector = useSelector(state => state.workout);
    const dispatch = useDispatch()

    const [searchMode, setSearchMode] = useState(false);
    const [exerArr, setExerArr] = useState((Search.sort(Search.search(''))));
    const [searchTerm, setSearchTerm] = useState([]);
    const [tagList, setTagList] = useState([]);
    const [filterMode, setFilterMode] = useState(false);
    const [fExerArr, setFExerArr] = useState(exerArr);
    const [detMode, setDetMode] = useState(false);
    const [exerDetIndex, setExerDetIndex] = useState(null);
    const [loadList, setLoadList] = useState(fExerArr.slice(0, 50));

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

    function handleChange(text) {
        if (text === '') clearSearch()
        else {
            let sRes = Search.search(text);
            setExerArr(sRes);
            setSearchTerm([text]);
            let filArr = Search.filter(sRes, activeB, activeM);
            setFExerArr(filArr);
            setLoadList(filArr.slice(0, 50));
        }
    }

    function handleBack() {
        setSearchMode(false);
    }

    function handleBackF() {
        setFilterMode(false);
        setDetMode(false);
        setExerDetIndex(null);
    }

    function handleFilter() {
        setFilterMode(true);
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
            setLoadList(filArr.slice(0, 50));
        }
    }

    function clearSearch() {
        let sRes = Search.sort(Search.search(''));
        setExerArr(sRes);
        setSearchTerm([]);
        let filArr = Search.filter(sRes, activeB, activeM);
        setFExerArr(filArr);
        setLoadList(filArr.slice(0, 50));
    }

    function exerDet(exerIndex) {
        setDetMode(true);
        setExerDetIndex(exerIndex);
    }

    function fetchMore() {
        if (loadList.length < fExerArr.length) {
            setLoadList([...loadList, ...fExerArr.slice(loadList.length, loadList.length + 50)])
        }
    }

    return (
        <View className='bg-[#28547B] flex-1 max-h-screen min-w-screen overflow-hidden'>
            <Loading />
            <View className='pt-[45px] h-full w-full' >
                <View className='w-full h-10 shadow-2xl flex-row items-center justify-between px-3 sticky'>
                    {searchMode && !filterMode && !detMode ? <>
                        <TouchableOpacity onPress={handleBack}>
                            <FontAwesome5 name="arrow-left" size={25} color="white" />
                        </TouchableOpacity>
                        <TextInput
                            autoFocus
                            className='h-7 w-60  border-white border-2 rounded-md bg-[#345b7c] px-2 text-white'
                            cursorColor={'white'}
                            placeholder='exercise name'
                            placeholderTextColor={'gray'}
                            value={searchTerm.length > 0 ? searchTerm[0] : ''}
                            onChangeText={(text) => handleChange(text)} />
                        <TouchableOpacity className='' onPress={() => handleFilter('search')}>
                            <FontAwesome5 name="filter" size={23} color="white" />
                        </TouchableOpacity>
                    </> : filterMode || detMode ? <>
                        <TouchableOpacity onPress={handleBackF}>
                            <FontAwesome5 name="arrow-left" size={25} color="white" />
                        </TouchableOpacity>
                    </> :
                        <>
                            <View className=''>
                                <Text className='text-white text-xl font-semibold'>Exercises</Text>
                            </View>
                            <View className='flex-row space-x-2'>
                                <TouchableOpacity className='' onPress={e => setSearchMode(true)}>
                                    <FontAwesome5 name="search" size={23} color="white" />
                                </TouchableOpacity>
                                <TouchableOpacity className='' onPress={() => handleFilter('notS')}>
                                    <FontAwesome5 name="filter" size={23} color="white" />
                                </TouchableOpacity>
                            </View>
                        </>
                    }

                </View>
                {filterMode ?
                    <ScrollView className='px-3'
                        keyboardShouldPersistTaps='handled'
                        contentContainerStyle={{ paddingBottom: 70 }}>
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
                    : detMode ?
                        <ScrollView className='px-3' keyboardShouldPersistTaps='handled'
                            contentContainerStyle={{ paddingBottom: 70 }}>
                            <View>
                                <ExerDetComp exerObj={fExerArr[exerDetIndex]} />
                            </View>
                        </ScrollView>
                        :
                        <>

                            <FlatList
                                className='px-3'
                                contentContainerStyle={{ paddingBottom: 70 }}
                                data={loadList}
                                onEndReached={fetchMore}
                                onEndReachedThreshold={3}
                                ListHeaderComponent={<View className='flex-row flex-wrap w-full justify-left items-center'>
                                    <TagComp tagArr={searchTerm} clearSearch={clearSearch} search={true} />
                                    <TagComp tagArr={tagList} clearTag={clearTag} search={false} />
                                </View>}
                                ListFooterComponent={loadList.length < fExerArr.length ? <View className='flex-row justify-center'><Text className='text-white'>Loading...</Text></View> : null}
                                renderItem={({ item, index }) => (
                                    <TouchableOpacity key={`exer-${index}`} onPress={() => exerDet(index)}>
                                        <View className='flex-row mb-2 space-x-2 bg-[#28547B] border-red-500'>
                                            <View>
                                                <Image
                                                    source={IMAGES[item.refIndex]}
                                                    className='w-20 h-20 object-cover bg-white'
                                                />
                                            </View>
                                            <View className='w-64 justify-center'>
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
                        </>
                }

                <FooterComp />
            </View>
        </View>
    )
}

export default Exercises