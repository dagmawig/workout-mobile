import { View, Text, Image } from 'react-native'
import React from 'react'
import { IMAGESGIF } from '../assets'

const ExerDetComp = ({exerObj}) => {
  return (
    <View>
      <Image 
      source={IMAGESGIF[exerObj.refIndex]}
      className='w-full h-96 object-contain' />
      <View className='flex-row w-full flex-wrap pt-3'>
        <Text className='w-1/4 text-right pr-1 text-white text-lg'>Workout:</Text>
        <Text className='w-3/4 text-left pl-2 text-white text-lg'>{exerObj.item.name}</Text>
        <Text className='w-1/4 text-right pr-1 text-white text-lg'>Body Part:</Text>
        <Text className='w-3/4 text-left pl-2 text-white text-lg'>{exerObj.item.bodyPart}</Text>
        <Text className='w-1/4 text-right pr-1 text-white text-lg'>Tool:</Text>
        <Text className='w-3/4 text-left pl-2 text-white text-lg'>{exerObj.item.equipment}</Text>
        <Text className='w-1/4 text-right pr-1 text-white text-lg'>Target:</Text>
        <Text className='w-3/4 text-left pl-2 text-white text-lg'>{exerObj.item.target}</Text>
      </View>
    </View>
  )
}

export default ExerDetComp