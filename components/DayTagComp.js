import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const DayTagComp = ({ dayTag, setDayTag }) => {

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    function updateTag(ind) {
        let newTag = [...dayTag];
        newTag[ind] = !newTag[ind];
        setDayTag(newTag);
    }

    return dayTag.map((tag, i) => {
        return (
            <TouchableOpacity key={'dayTag' + i} className='flex-row p-1 self-start items-center space-x-2 rounded-xl border-2 border-white m-1' style={{backgroundColor: tag? '#24323f' : 'transparent'}} onPress={()=>updateTag(i)}>
                <Text className='text-white'>
                    {days[i]}
                </Text>
            </TouchableOpacity>
        )
    }

    )
}

export default DayTagComp