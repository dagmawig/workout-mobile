import { View, Text, ImageBackground, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../components/FirebaseConfig';
import { customStyle } from '../components/Style';
import { updateLoading } from '../components/workoutSlice';
import { useDispatch } from 'react-redux';
import Loading from '../components/Loading';

const ResetPass = () => {

    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [email, setEmail] = useState('');

    function handleEmail(email) {
        setEmail(email)
    }

    function resetPass() {
        dispatch(updateLoading(true));
        sendPasswordResetEmail(auth, email).then(() => {
            Alert.alert(`Email sent!`, `Password reset link sent to: \n${email}.`);
            navigation.navigate('LogIn');
            dispatch(updateLoading(false));
        }).catch(error => {
            Alert.alert(`${error.name}`, `${error.code}`);
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
            <Loading/>
            <View className='h-full w-full' style={customStyle.topPad}>
                <View className='w-full h-full items-center justify-top pt-[200px]'>
                    <ImageBackground
                        source={require('../assets/home_logo_clear.png')}
                        className='h-80 w-full'>
                        <View className='justify-center items-center h-full w-full'>
                            <TextInput
                                className='h-7 w-60  border-white border-2 rounded-md px-2 mb-2 text-white bg-[#1b4264]'
                                cursorColor={'white'}
                                placeholder='email'
                                placeholderTextColor={'gray'}
                                value={email}
                                onChangeText={(text) => handleEmail(text)}
                                onSubmitEditing={resetPass} />
                            <TouchableOpacity className='w-60 h-7 mt-3'>
                                <Text className='text-white w-full text-center font-semibold text-lg' onPress={resetPass}>Reset Password</Text>
                            </TouchableOpacity>
                            <View className='w-60 flex-row justify-between items-center mt-10'>
                                <TouchableOpacity onPress={() => navigation.navigate('LogIn')}><Text className='text-gray-300  text-center italic'>Login</Text></TouchableOpacity>
                                <TouchableOpacity onPress={() => {navigation.navigate('SignUp'); setEmail('')}}><Text className='text-gray-300 text-center italic'>New User?</Text></TouchableOpacity>
                            </View>
                        </View>
                    </ImageBackground>
                </View>
            </View>
        </View>
    )
}

export default ResetPass;