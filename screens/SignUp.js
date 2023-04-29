import { View, Text, ImageBackground, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { auth } from '../components/FirebaseConfig';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { customStyle } from '../components/Style';
import { useDispatch } from 'react-redux';
import { updateLoading } from '../components/workoutSlice';
import Loading from '../components/Loading';

const SignUp = () => {

    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [invisible, setVisible] = useState(true)

    function handleEmail(email) {
        setEmail(email)
    }

    function handlePass(password) {
        setPassword(password)
    }

    function signUp() {
        dispatch(updateLoading(true));
        createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                sendEmailVerification(auth.currentUser).then(() => {
                    auth.signOut().then(() => {
                        Alert.alert(`Email not verified!`, `Verification link sent to ${email}. \nPlease click on the link to verify your email and log into your acount.`);
                        navigation.navigate('LogIn');
                        dispatch(updateLoading(false));
                    })
                })
            }).catch(error =>{
                console.log(error.message)
                Alert.alert(`${error.name}`, `${error.code}` );
                setPassword('')
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
                                onSubmitEditing={signUp} />
                            <View className='flex-row items-center w-60 border-white border-2 rounded-md mb-1'>
                                <TextInput
                                    className='h-7 w-5/6   bg-[#1b4264]  text-white px-2'
                                    cursorColor={'white'}
                                    placeholder='password'
                                    placeholderTextColor={'gray'}
                                    secureTextEntry={invisible}
                                    value={password}
                                    autoCorrect={false}
                                    onChangeText={(text) => handlePass(text)}
                                    onSubmitEditing={signUp} />
                                <TouchableOpacity className='bg-[#1b4264] w-1/6 h-7 items-center justify-center' onPress={() => setVisible(!invisible)}><FontAwesome5 className='items-center' name={invisible ? "eye" : "eye-slash"} size={16} color="white" /></TouchableOpacity>
                            </View>
                            <TouchableOpacity className='w-60 h-7 mt-3'>
                                <Text className='text-white w-full text-center font-semibold text-lg' onPress={signUp}>Sign Up</Text>
                            </TouchableOpacity>
                            <View className='w-60 flex-row justify-between items-center mt-10'>
                                <TouchableOpacity onPress={() => {navigation.navigate('LogIn'); setEmail(''); setPassword('')}}><Text className='text-gray-300  text-center italic' >Login</Text></TouchableOpacity>
                                <TouchableOpacity onPress={() => {navigation.navigate('ResetPass'); setPassword(''); setEmail('')}}><Text className='text-gray-300 text-center italic'>Forgot Password?</Text></TouchableOpacity>
                            </View>
                        </View>
                    </ImageBackground>
                </View>
            </View>
        </View>
    )
}

export default SignUp;