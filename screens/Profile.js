import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import FooterComp from '../components/FooterComp';
import SecureSt from '../components/SecureStore';
import { useSelector, useDispatch } from 'react-redux';
import { initialState, updateLoading, updateReset, updateUserData } from '../components/workoutSlice';
import Loading from '../components/Loading';
import { REACT_APP_API_URI } from '@env';
import axios from 'axios';
import { Alert } from 'react-native';
import { customStyle } from '../components/Style';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { useState } from 'react';
import { auth } from '../components/FirebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';


const Profile = () => {

    const navigation = useNavigation();
    const stateSelector = useSelector(state => state.workout)
    const dispatch = useDispatch();

    const [delMode, setDelMode] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [invisible, setInvisible] = useState(true);

    // handles user logout
    function handleLogOut() {
        dispatch(updateLoading(true));
        SecureSt.save('email', '');
        SecureSt.save('password', '');
        SecureSt.save('uid', '');
        dispatch(updateReset(initialState));
        navigation.reset({
            index: 1,
            routes: [
                { name: 'LogIn' }
            ]
        })
        dispatch(updateLoading(false));
    }

    // handles database update after reset/deletion of user workout data
    async function resetD(uid) {
        let updateURI = REACT_APP_API_URI + 'resetData';
        let res = await axios.post(updateURI, { userID: uid }).catch(err => console.log(err));

        return res;
    }

    // handles user workout data reset
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
                                    navigation.reset({
                                        index: 1,
                                        routes: [
                                            { name: 'Workout' }
                                        ]
                                    })
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

    // handles deletion of user data from database
    async function deleteAcc(uid) {
        let updateURI = REACT_APP_API_URI + 'deleteAccount';
        let res = await axios.post(updateURI, { userID: uid }).catch(err => console.log(err));

        return res;
    }

    // handles of deletion of user account
    function handleDelete() {
        dispatch(updateLoading(true));

        SecureSt.getVal('email').then(value => {
            if (value !== email) {
                Alert.alert(`Error`, `Email not correct!`, [
                    {
                        text: 'Ok',
                        onPress: null,
                        style: 'cancel'
                    }
                ]);
                dispatch(updateLoading(false));
            }
            else {
                signInWithEmailAndPassword(auth, email, password).then(userCred => {
                    const user = userCred.user;

                    SecureSt.getVal('uid').then(uid => {
                        deleteAcc(uid).then(res => {
                            let data = res.data;
                            if (data.success) {
                                user.delete().then(() => {
                                    SecureSt.save('uid', '');
                                    navigation.reset({
                                        index: 1,
                                        routes: [
                                            { name: 'LogIn' }
                                        ]
                                    });
                                    Alert.alert(`Account Deleted`, `User account successfully deleted!!`, [
                                        {
                                            text: 'Ok',
                                            onPress: null,
                                            style: 'cancel'
                                        }
                                    ]);
                                    setPassword('');
                                    setDelMode(false);
                                    dispatch(updateLoading(false));
                                })
                            }
                            else {
                                Alert.alert(`Error`, `User data deletion failed!`, [
                                    {
                                        text: 'Ok',
                                        onPress: null,
                                        style: 'cancel'
                                    }
                                ]);
                                dispatch(updateLoading(false))
                            }
                        })
                    })
                }).catch(error => {
                    Alert.alert(`${error.name}`, `${error.code}`)
                    dispatch(updateLoading(false));
                })
            }
        }).catch(e => {
            console.log(e);
            dispatch(updateLoading(false));
        })
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        })
    }, []);

    return (
        <View className='bg-[#28547B] flex-1 max-h-screen min-w-screen overflow-hidden'>
            <Loading />
            <View className='h-full w-full' style={customStyle.topPad}>
                <View className='w-full h-10 shadow-2xl flex-row items-center justify-between px-3 sticky'>
                    <View className=''>
                        <Text className='text-white text-lg font-semibold'>Profile</Text>
                    </View>
                </View>
                <ScrollView className='px-3 pt-3 space-y-5' contentContainerStyle={{ paddingBottom: 70 }} keyboardShouldPersistTaps='handled'>
                    <View className='flex-row justify-start items-center space-x-2'>
                        <FontAwesome5 name="user-circle" size={45} color="white" />
                        <Text className='text-white'>{stateSelector.userData.email}</Text>
                    </View>
                    {delMode ? <View className='mx-2 h-18 w-full items-center space-y-3'>
                        <Text className='w-5/6 text-white text-lg'>Are you sure you want to delete your account? If so please enter email and password, and enter 'delete' button. This can't be undone.</Text>
                        <TextInput
                            className='h-9 w-60  border-white border-2 rounded-md px-2 text-white bg-[#1b4264]'
                            cursorColor={'white'}
                            placeholder='email'
                            placeholderTextColor={'gray'}
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                            onSubmitEditing={handleDelete} />
                        <View className='flex-row items-center w-60 border-white border-2 rounded-md mb-1'>
                            <TextInput
                                className='h-9 w-5/6   bg-[#1b4264]  text-white px-2'
                                cursorColor={'white'}
                                placeholder='password'
                                placeholderTextColor={'gray'}
                                value={password}
                                autoCorrect={false}
                                autoComplete='off'
                                spellCheck={false}
                                secureTextEntry={invisible}
                                onChangeText={(text) => setPassword(text)}
                                onSubmitEditing={handleDelete} />
                            <TouchableOpacity className='bg-[#1b4264] w-1/6 h-9 items-center justify-center' onPress={() => setInvisible(!invisible)}><FontAwesome5 className='items-center' name={invisible ? "eye" : "eye-slash"} size={16} color="white" /></TouchableOpacity>
                        </View>
                        <View className='flex-row space-x-2'>
                            <TouchableOpacity className='h-10 w-1/3 bg-gray-500  rounded-md flex-row justify-center items-center space-x-2' onPress={() => { setDelMode(false); setEmail(''); setPassword('') }}>
                                <Text className='text-white text-center'>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className='h-10 w-1/3 bg-red-900  rounded-md flex-row justify-center items-center space-x-2' onPress={handleDelete}>
                                <Text className='text-white text-center'>Delete</Text><FontAwesome name="warning" size={15} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View> :
                        <View className='mx-2 h-18 w-full items-center space-y-3'>
                            <TouchableOpacity className='h-10 w-60 bg-[#1a364f]  rounded-md flex justify-center' onPress={handleLogOut}>
                                <Text className='text-white text-center'>Log Out</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className='h-10 w-60 bg-yellow-600  rounded-md flex justify-center' onPress={handleReset}>
                                <Text className='text-white text-center'>Reset Account</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className='h-10 w-60 bg-red-900  rounded-md flex-row justify-center items-center space-x-2' onPress={() => setDelMode(true)}>
                                <Text className='text-white text-center'>Delete Account</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </ScrollView>
                <FooterComp />
            </View>
        </View>
    )
}

export default Profile;