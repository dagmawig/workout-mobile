import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import React from 'react'
import { FontAwesome5 } from '@expo/vector-icons';
import { useSelector } from 'react-redux';


const TempExerComp = ({ exerArr, removeExer, addSet, removeSet }) => {

    const stateSelector = useSelector(state=>state.workout)
    function getRec(exer) {
        if (exer.name in stateSelector.userData.record) {
            let exerRecord = stateSelector.userData.record[exer.name];
            let ans = '';
            let ans2 = '';
            ans += exerRecord.prev1;
            ans2 += exerRecord.pr1;
            if (exerRecord.metric === 'wr') {
                ans += ` LBS|${exerRecord.prev2} REPS`;
                ans2 += ` LBS|${exerRecord.pr2} REPS`;
            }
            else if (exerRecord.metric === 'dt') {
                ans += ` MI | ${exerRecord.prev2} MIN`;
                ans2 += ` MI | ${exerRecord.pr2} MIN`;
            }
            else {
                ans += ' SEC';
                ans2 += ' SEC';
            }

            return [ans, ans2];
        }
        else return ['-', '-'];
        return 'Personal Record'
    }
    return exerArr.map((exer, i) => {
        return (
            <View key={'newTemp-' + i} className='border-[1px] border-white rounded-md p-2 mb-2'>
                <View className='flex-row justify-between items-center pb-2'>
                    <Text className='text-white text-lg font-bold'>{exer.name}</Text>
                    <TouchableOpacity onPress={() => removeExer(i)}><FontAwesome5 name="minus-circle" size={16} color="white" /></TouchableOpacity>
                </View>
                <View className='flex-row justify-between items-center mb-1'>
                    <Text className='w-1/6 text-center text-white'>SET</Text>
                    <Text className='w-1/3 text-center text-white'>{exer.metric === 'wr' ? 'LBS' : exer.metric === 'dt' ? 'MILES' : 'SECONDS'}</Text>
                    <Text className='w-1/3 text-center text-white'>{exer.metric === 'wr' ? 'REPS' : exer.metric === 'dt' ? 'MIN' : ''}</Text>
                </View>
                {setList(exer)}
                <View className='justify-center items-center mt-3'>
                    <View className='flex-row'>
                        <Text className='text-white w-1/4 text-right pr-2 italic'>PREV:</Text>
                        <Text className='text-white w-3/4 text-left italic'>{getRec(exer)[0]}</Text>
                    </View>
                    <View className='flex-row'>
                        <Text className='text-white w-1/4 text-right pr-2 italic'>PR:</Text>
                        <Text className='text-white w-3/4 text-left italic'>{getRec(exer)[1]}</Text>
                    </View>
                </View>
                <View className='flex-row justify-between items-center mt-2'>
                    <View className='w-1/6 mb-1'>

                    </View>
                    <View className='w-1/3 mb-1'>
                        <TouchableOpacity onPress={()=>addSet(i)}><Text className='text-white text-right'>ADD SET</Text></TouchableOpacity>
                    </View>
                    <View className='w-1/3 mb-1'>
                        {exer.sets>1? <TouchableOpacity onPress={()=>removeSet(i)}><Text className='text-white text-left'>REMOVE SET</Text></TouchableOpacity> : null}
                    </View>
                </View>
            </View>
        )
    })

}

const setList = (exer) => {
    let tempArr = [...Array(exer.sets).keys()];
    return tempArr.map(item => {
        return (
            <View key={item + exer.name + 'setList'} className='flex-row justify-between items-center'>
                <View className='w-1/6 mb-1'>
                    <Text className='text-white text-center'>{item + 1}</Text>
                </View>
                <View className='w-1/3 mb-1'>
                    <TextInput editable={false} className='text-white text-center border-white border-[1px] bg-[#576b7c]' />
                </View>
                <View className='w-1/3 mb-1'>
                    {exer.metric === 'wr' || exer.metric === 'dt' ? <TextInput editable={false} className='text-white text-center border-white border-[1px] bg-[#576b7c]' /> : null}
                </View>
            </View>
        )
    })
}

export default TempExerComp