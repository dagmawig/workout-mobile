import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useRef } from 'react'
import { IMAGES } from '../assets'
import exerLocal from '../assets/ExerData/exercisesLocal.json';
import exerNames from '../assets/ExerData/exerciseNames.json';

const ExerComp = ({filterExer, exerDet}) => {
    return filterExer.map((exer, i) => {
        return (
            <TouchableOpacity key={`exer-${i}`} onPress={()=>exerDet(i)}>
                {/* <Text className='text-gray-400'>{exer.name}</Text> */}
                <View className='flex-row mb-2 space-x-2 bg-[#28547B] border-red-500'>
                    <View>
                        <Image
                            source={IMAGES[exer.refIndex]}
                            className='w-20 h-20 object-cover'
                        />
                    </View>
                    <View className='w-64 justify-center'>
                        <Text className='text-lg text-white flex-wrap'>
                            {exer.item.name}
                        </Text>
                        <Text className='text-white italic'>
                            {exer.item.bodyPart}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    })
}

export default ExerComp