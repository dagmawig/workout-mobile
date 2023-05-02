import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { IMAGES } from '../assets'
import { Image } from 'expo-image'
import gifLink from '../assets/ExerData/gitLink.json'
const ExerDetComp = ({ exerObj }) => {

  const [valid, setValid] = useState(true);

  return (
    <View>
      {/* <Image
        source={IMAGES[exerObj.refIndex]}
        className='w-full h-96 sobject-contain bg-white' /> */}
      <Image
        transition={1000}
        contentFit='contain'
        source={valid? gifLink[exerObj.refIndex] : IMAGES[exerObj.refIndex]}
        onError={()=>setValid(false)}
        className='w-full h-96 object-contain bg-white' />
      <View className='flex-row w-full flex-wrap pt-3'>
        <Text className='w-1/3 text-right text-white text-base'>WORKOUT:</Text>
        <Text className='w-2/3 text-left pl-2 text-white text-base'>{exerObj.item.name}</Text>
        <Text className='w-1/3 text-right  text-white text-base'>BODY-PART:</Text>
        <Text className='w-2/3 text-left pl-2 text-white text-base'>{exerObj.item.bodyPart}</Text>
        <Text className='w-1/3 text-right text-white text-base'>EQUIPMENT:</Text>
        <Text className='w-2/3 text-left pl-2 text-white text-base'>{exerObj.item.equipment}</Text>
        <Text className='w-1/3 text-right text-white text-base'>TARGET:</Text>
        <Text className='w-2/3 text-left pl-2 text-white text-base'>{exerObj.item.target}</Text>
      </View>
    </View>
  )
}

export default ExerDetComp