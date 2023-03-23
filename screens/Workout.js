import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';


const Workout = () => {
    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        })
    }, []);

    return (
        <View className='bg-[#28547B] flex-1 max-h-screen min-w-screen overflow-hidden'>
            <View className='pt-[45px] h-full w-full' >
                <View className='w-full h-10 shadow-2xl flex-row items-center justify-between px-3 sticky'>
                    <View className=''>
                        <Text className='text-white text-lg font-semibold'>Workout</Text>
                    </View>
                </View>
                <ScrollView className='mb-11 px-3 pt-3'>
                    <View>
                        <View className='flex-row justify-between py-3'>
                            <View>
                                <Text className='text-white text-sm'>MY TEMPLATES</Text>
                            </View>
                            <View>
                                <TouchableOpacity><FontAwesome5 name="plus" size={18} color="white" /></TouchableOpacity>
                            </View>
                        </View>
                        <View>
                            <Text>List of user templates</Text>
                        </View>
                    </View>

                    <View>
                        <View className='flex-row justify-between py-3'>
                            <View>
                                <Text className='text-white text-sm'>SAMPLE TEMPLATES</Text>
                            </View>
                        </View>
                        <View>
                            <View>
                                <Text>List of sample templates</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </View>
    )
}

export default Workout