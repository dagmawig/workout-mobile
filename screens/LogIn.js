import { View, Text, ImageBackground, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { auth } from '../components/FirebaseConfig';
import {signInWithEmailAndPassword, sendEmailVerification} from 'firebase/auth';
import * as SecureStore from 'expo-secure-store';

const LogIn = () => {

    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [invisible, setVisible] = useState(true);

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

    function handleEmail(email) {
        setEmail(email)
    }

    function handlePass(password) {
        setPassword(password)
    }

    function logIn() {
        signInWithEmailAndPassword(auth, email, password)
        .then(userCred=> {
            const user = userCred.user;
            
            if(user.emailVerified) {
                save('email', email);
                save('password', password);
                navigation.navigate('Workout');
            }
            else {
                sendEmailVerification(auth.currentUser).then(()=> {
                    Alert.alert(`Email not verified. \nVerification link sent to ${email}. \nPlease verify your email.`)
                });

                auth.signOut().then(() => {}).catch(err=>console.log(err))
            }
        }).catch(error=> Alert.alert(error.message));
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        })
    }, []);

    return (
        <View className='bg-[#28547B] flex-1 max-h-screen min-w-screen overflow-hidden'>
            <View className='pt-[45px] h-full w-full' >
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
                                onChangeText={(text) => handleEmail(text)} />
                            <View className='flex-row items-center w-60 border-white border-2 rounded-md mb-1'>
                                <TextInput
                                    className='h-7 w-5/6   bg-[#1b4264]  text-white px-2'
                                    cursorColor={'white'}
                                    placeholder='password'
                                    placeholderTextColor={'gray'}
                                    secureTextEntry={invisible}
                                    value={password}
                                    autoCorrect={false}
                                    onChangeText={(text) => handlePass(text)} />
                                <TouchableOpacity className='bg-[#1b4264] w-1/6 h-7 items-center justify-center' onPress={() => setVisible(!invisible)}><FontAwesome5 className='items-center' name={invisible ? "eye-slash" : "eye"} size={16} color="white" /></TouchableOpacity>
                            </View>
                            <TouchableOpacity className='w-60 h-7 mt-3' onPress={logIn}>
                                <Text className='text-white w-full text-center font-semibold text-lg'>Log In</Text>
                            </TouchableOpacity>
                            <View className='w-60 flex-row justify-between items-center mt-10'>
                                <TouchableOpacity onPress={() => navigation.navigate('SignUp')}><Text className='text-gray-300  text-center italic'>New User?</Text></TouchableOpacity>
                                <TouchableOpacity onPress={() => navigation.navigate('ResetPass')}><Text className='text-gray-300 text-center italic'>Forgot Password?</Text></TouchableOpacity>
                            </View>
                        </View>
                    </ImageBackground>
                </View>
            </View>
        </View>
    )
}

export default LogIn;