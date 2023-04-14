import { View, Text } from 'react-native'
import React from 'react'
import * as SecureStore from 'expo-secure-store';


async function save(key, value) {
    await SecureStore.setItemAsync(key, value);
}

async function getValueFor(key) {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
      return result;
    } else {
      return null;
    }
  }

export default {save: save, getVal: getValueFor}