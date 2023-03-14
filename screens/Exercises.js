import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import ExerComp from '../components/ExerComp';

const Exercises = () => {

    const navigation = useNavigation();
    const [searchMode, updateSearchMode] = useState(true);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        })
    }, [])

    return (
        <View className='bg-[#28547B] flex-1 max-h-screen min-w-screen overflow-hidden'>
            <View className='pt-[20px] h-full w-full' >
                <View className='w-full h-10 shadow-2xl flex-row items-center justify-between px-3 sticky'>
                    {searchMode ? <>
                        <TouchableOpacity onPress={e => updateSearchMode(false)}>
                            <FontAwesome5 name="arrow-left" size={17} color="white" />
                        </TouchableOpacity>
                        <TextInput className='h-7 w-60  border-white border-2 rounded-md bg-[#345b7c] px-2 text-white' cursorColor={'white'} placeholder='exercise name' placeholderTextColor={'gray'} />
                        <TouchableOpacity className=''>
                            <FontAwesome5 name="filter" size={16} color="white" />
                        </TouchableOpacity>
                    </> :
                        <>
                            <View className=''>
                                <Text className='text-white text-lg font-semibold'>Exercises</Text>
                            </View>
                            <View className='flex-row space-x-2'>
                                <TouchableOpacity className='' onPress={e => updateSearchMode(true)}>
                                    <FontAwesome5 name="search" size={16} color="white" />
                                </TouchableOpacity>
                                <TouchableOpacity className=''>
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
                <ScrollView className='mb-11 px-3'>

                    {/* <ExerComp /> */}
                </ScrollView>
                <View className='absolute bottom-0 h-10 bg-[#28547B] w-full items-center justify-center'>
                    <Text> dfgdf</Text>
                </View>
            </View>

        </View>
    )
}

export default Exercises