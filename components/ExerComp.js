import { View, Text } from 'react-native'
import React from 'react'
var exerLocal = require('../assets/ExerData/exercisesLocal.json');
const ExerComp = (filter) => {
  return exerLocal.map((exer, i) => {
    return  (
        <View key={`exer-${i}`}>
          <Text >{exer.name}</Text>
        </View>
      )
  })
}

export default ExerComp