import * as SecureStore from 'expo-secure-store';

// handles saving key value pairs in a secure store
async function save(key, value) {
  await SecureStore.setItemAsync(key, value);
}

// handles fetching of value stored using key assigned
async function getValueFor(key) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    return result;
  } else {
    return null;
  }
}

export default { save: save, getVal: getValueFor }