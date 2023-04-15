import { View, Text } from 'react-native'
import React from 'react';
import { useSelector } from 'react-redux';


const Loading = () => {

    const stateSelector = useSelector(state => state.workout);

    return (
        <View className='absolute top-0 bottom-0 right-0 left-0 opacity-50 justify-center items-center z-50 bg-gray-600' style={{ display: stateSelector.loading? 'flex' : 'none'}}>
            <Text className='text-white text-[50px]'>Loading...</Text>
        </View>
    )
}

export default Loading