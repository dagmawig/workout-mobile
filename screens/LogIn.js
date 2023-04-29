import { View, Text, ImageBackground, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { auth } from '../components/FirebaseConfig';
import { signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import SecureSt from '../components/SecureStore';
import { useDispatch } from 'react-redux';
import { updateEmail, updateLoading } from '../components/workoutSlice';
import Loading from '../components/Loading';
import { customStyle } from '../components/Style';

const LogIn = () => {

    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [invisible, setVisible] = useState(true);

    function handleEmail(email) {
        setEmail(email)
    }

    function handlePass(password) {
        setPassword(password)
    }

    function logIn() {
        dispatch(updateLoading(true));
        signInWithEmailAndPassword(auth, email, password)
            .then(userCred => {
                const user = userCred.user;

                if (user.emailVerified) {
                    SecureSt.save('email', email);
                    SecureSt.save('password', password);
                    setPassword('');
                    SecureSt.save('uid', user.uid).then(() => {
                        dispatch(updateEmail(email));
                        navigation.navigate('Workout'); 
                    });
                }
                else {
                    sendEmailVerification(auth.currentUser).then(() => {
                        Alert.alert(`Email not verified!`, `Verification link sent to: \n${email}. \nPlease verify your email.`);
                    });
                    setPassword('');
                    auth.signOut().then(() => { }).catch(err => console.log(err))
                }

                dispatch(updateLoading(false));
            }).catch(error => {
                Alert.alert(`${error.name}`, `${error.code}`);
                setPassword('')
                dispatch(updateLoading(false));
            });
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
                                onSubmitEditing={logIn} />
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
                                    onSubmitEditing={logIn} />
                                <TouchableOpacity className='bg-[#1b4264] w-1/6 h-7 items-center justify-center' onPress={() => setVisible(!invisible)}><FontAwesome5 className='items-center' name={invisible ? "eye" : "eye-slash"} size={16} color="white" /></TouchableOpacity>
                            </View>
                            <TouchableOpacity className='w-60 h-7 mt-3' onPress={logIn}>
                                <Text className='text-white w-full text-center font-semibold text-lg'>Log In</Text>
                            </TouchableOpacity>
                            <View className='w-60 flex-row justify-between items-center mt-10'>
                                <TouchableOpacity onPress={() => { navigation.navigate('SignUp'); setEmail(''); setPassword('') }}><Text className='text-gray-300  text-center italic'>New User?</Text></TouchableOpacity>
                                <TouchableOpacity onPress={() => { navigation.navigate('ResetPass'); setEmail(''), setPassword('') }}><Text className='text-gray-300 text-center italic'>Forgot Password?</Text></TouchableOpacity>
                            </View>
                        </View>
                    </ImageBackground>
                </View>
            </View>
        </View>
    )
}

export default LogIn;