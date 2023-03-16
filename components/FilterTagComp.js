import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const FilterTagComp = ({ filterTags, filterType }) => {
    return filterTags.map((tag, i) => {
        const pref = (filterType==='body'? 'b' : 'm');
        return (
            <TouchableOpacity key={pref + 'TagF' + i.toString()} className='flex-row p-1 self-start items-center space-x-2 rounded-xl border-2 border-white m-1'>
                <Text className='text-white'>{tag}</Text>
            </TouchableOpacity>
        )
    })
}

export default FilterTagComp