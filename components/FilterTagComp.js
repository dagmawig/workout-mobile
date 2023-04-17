import { Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { updateActiveB, updateActiveM } from './workoutSlice';

const FilterTagComp = ({ filterTags, filterType, updateResFil }) => {

    const stateSelector = useSelector(state => state.workout);
    const dispatch = useDispatch();

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

    function handleActive(i) {
        if (filterType === 'body') {
            const newActiveB = JSON.parse(JSON.stringify(activeB));
            newActiveB[i] = !activeB[i];
            dispatch(updateActiveB(newActiveB));
            updateResFil(newActiveB, activeM, { tag: bodyParts[i], remove: activeB[i] ? true : false });
        } else {
            const newActiveM = JSON.parse(JSON.stringify(activeM));
            newActiveM[i] = !activeM[i];
            dispatch(updateActiveM(newActiveM));
            updateResFil(activeB, newActiveM, { tag: muscleGroups[i], remove: activeM[i] ? true : false });
        }
    }

    return filterTags.map((tag, i) => {
        const pref = (filterType === 'body' ? 'b' : 'm');


        return (
            <TouchableOpacity id={pref + 'TagF' + i.toString()} key={pref + 'TagF' + i.toString()} className='flex-row p-1 self-start items-center space-x-2 rounded-xl border-2 border-white m-1' style={{ backgroundColor: (filterType === 'body' && activeB[i]) || (filterType === 'muscle' && activeM[i]) ? '#24323f' : 'transparent' }} onPress={(e) => handleActive(i)}>
                <Text className='text-white'>{tag}</Text>
            </TouchableOpacity>
        )
    })
}

export default FilterTagComp