import { View, Text, Image } from 'react-native'
import React, { useRef } from 'react'
import { IMAGES } from '../assets'
import exerLocal from '../assets/ExerData/exercisesLocal.json';
const ExerComp = (filter) => {

    return exerLocal.map((exer, i) => {
        return (
            <View key={`exer-${i}`}>
                {/* <Text className='text-gray-400'>{exer.name}</Text> */}
                <View className='flex-row mb-2 space-x-2 bg-[#28547B] border-red-500'>
                    <View>
                        <Image
                            source={IMAGES[i]}
                            className='w-20 h-20 object-cover'
                        />
                    </View>
                    <View className='w-64 justify-center'>
                        <Text className='text-lg text-white flex-wrap'>
                            {exer.name}
                        </Text>
                        <Text className='text-white italic'>
                            {exer.bodyPart}
                        </Text>
                    </View>
                </View>
            </View>
        )
    })
}

export default ExerComp