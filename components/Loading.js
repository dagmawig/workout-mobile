import { View } from 'react-native'
import React from 'react';
import { useSelector } from 'react-redux';
import { Image } from 'expo-image';
import { LOADING } from '../assets';

// returns loading spinner component
const Loading = () => {

    const stateSelector = useSelector(state => state.workout);

    return (
        <View className='absolute top-0 bottom-0 right-0 left-0 opacity-50 justify-center items-center z-50 bg-gray-600' style={{ display: stateSelector.loading ? 'flex' : 'none' }}>
            <Image
                source={LOADING}
                className='w-20 h-20 object-contain' />
            <View className='flex-row w-full flex-wrap pt-3'></View>
        </View>
    )
}

export default Loading