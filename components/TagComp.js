import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { FontAwesome5 } from '@expo/vector-icons';

const TagComp = ({ tagArr, clearTag, clearSearch, search }) => {
    return tagArr.map((tag, i) => {
        const trimTag = tag.trim();
        return (
            <View key={'tag' + i.toString()} className='flex-row p-1 self-start items-center space-x-2 rounded-xl border-2 border-white m-1'>
                <Text className='text-white'>{trimTag.length > 20 ? trimTag.slice(0, 20) + '...' : trimTag}</Text>
                <TouchableOpacity className='p-1' onPress={search ? clearSearch : (e) => clearTag(i, tag)}><FontAwesome5 name="times" size={18} color="white" /></TouchableOpacity>
            </View>
        )
    })
}

export default TagComp;