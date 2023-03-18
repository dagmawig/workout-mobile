import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { updateActiveB, updateActiveM, updateBodyTag, updateMuscleTag } from './workoutSlice';

const FilterTagComp = ({ filterTags, filterType }) => {
    
    const stateSelector = useSelector(state => state.workout);
    const dispatch = useDispatch();
    const activeB = stateSelector.activeB;
    const activeM = stateSelector.activeM;

    return filterTags.map((tag, i) => {
        const pref = (filterType==='body'? 'b' : 'm');
        
        function handleActive() {
            if(filterType==='body') {
                const newActiveB = [...activeB];
                newActiveB[i] = !activeB[i];
                dispatch(updateActiveB(newActiveB));
                
            } else {
                const newActiveM = [...activeM];
                newActiveM[i] = !activeM[i];
                dispatch(updateActiveM(newActiveM));
            }
        }

        return (
            <TouchableOpacity key={pref + 'TagF' + i.toString()} className='bg-[#24323f] flex-row p-1 self-start items-center space-x-2 rounded-xl border-2 border-white m-1' style={{backgroundColor: (filterType==='body' && activeB[i]) || (filterType==='muscle' && activeM[i])? '#24323f' : ''}} onPress={handleActive}>
                <Text className='text-white'>{tag}</Text>
            </TouchableOpacity>
        )
    })
}

export default FilterTagComp