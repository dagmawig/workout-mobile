import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import FooterComp from '../components/FooterComp';
import { FontAwesome5 } from '@expo/vector-icons';
import SecureSt from '../components/SecureStore';
import { useSelector, useDispatch } from 'react-redux';
import { initialState, updateLoading, updateReset, updateUserData } from '../components/workoutSlice';
import Loading from '../components/Loading';
import { REACT_APP_API_URI } from '@env';
import axios from 'axios';
import { Alert } from 'react-native';

const Profile = () => {

    const navigation = useNavigation();
    const stateSelector = useSelector(state => state.workout)
    const dispatch = useDispatch();

    function handleLogOut() {
        dispatch(updateLoading(true));
        SecureSt.save('email', '');
        SecureSt.save('password', '');
        SecureSt.save('uid', '');
        dispatch(updateReset(initialState));
        navigation.navigate('LogIn');
        dispatch(updateLoading(false));
    }

    async function resetD(uid) {
        let updateURI = REACT_APP_API_URI + 'resetData';
        let res = await axios.post(updateURI, { userID: uid }).catch(err => console.log(err));

        return res;
    }

    function handleReset() {
        Alert.alert(`Warning!`, `Are you sure you want to reset account? This would wipe out ALL workout data including user created templates.`, [
            {
                text: 'No',
                onPress: () => null,
                style: 'cancel'
            },
            {
                text: 'Yes',
                onPress: () => {
                    dispatch(updateLoading(true));
                    SecureSt.getVal('uid').then(uid => {
                        if (uid) {
                            resetD(uid).then(res => {
                                let data = res.data;
                                if (data.success) {
                                    dispatch(updateUserData(data.data))
                                    Alert.alert(`Success`, `Account reset successfully!`);
                                    navigation.navigate('Workout');
                                    dispatch(updateLoading(false));
                                }
                                else {
                                    dispatch(updateLoading(false));
                                    Alert.alert(`Error`, `${data.err}`);
                                }
                            }).catch(err => console.log(err))
                        }
                        else console.log('invalid uid: ', uid)
                    }).catch(err => console.log(err))
                },
                style: 'destructive'
            }
        ])

    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        })
    }, []);

    return (
        <View className='bg-[#28547B] flex-1 max-h-screen min-w-screen overflow-hidden'>
            <Loading />
            <View className='pt-[45px] h-full w-full' >
                <View className='w-full h-10 shadow-2xl flex-row items-center justify-between px-3 sticky'>
                    <View className=''>
                        <Text className='text-white text-lg font-semibold'>Profile</Text>
                    </View>
                </View>
                <ScrollView className='px-3 pt-3 space-y-5' contentContainerStyle={{ paddingBottom: 70 }}>
                    <View className='flex-row justify-start items-center space-x-2'>
                        <FontAwesome5 name="user-circle" size={45} color="white" />
                        <Text className='text-white'>{stateSelector.userData.email}</Text>
                    </View>
                    <View className='mx-2 h-8 w-full items-center space-y-3'>
                        <TouchableOpacity className='h-full w-60 bg-[#1a364f]  rounded-md flex justify-center' onPress={handleLogOut}>
                            <Text className='text-white text-center'>Log Out</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className='h-full w-60 bg-red-900  rounded-md flex justify-center' onPress={handleReset}>
                            <Text className='text-white text-center'>Reset Account</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <FooterComp />
            </View>
        </View>
    )
}

export default Profile;