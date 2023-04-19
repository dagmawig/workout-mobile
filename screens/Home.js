import { View, Text, ImageBackground, TouchableOpacity } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import SecureSt from '../components/SecureStore';

const Home = () => {

    const navigation = useNavigation();

    function handleGo() {
        SecureSt.getVal('uid').then(uid => {
            if (uid) navigation.navigate('Workout');
            else navigation.navigate('LogIn')
        })
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        })
    }, []);


    return (
        <View className='bg-[#28547B] flex-1 max-h-screen min-w-screen overflow-hidden'>
            <View className='pt-[18px] h-full w-full' >
                <View className='w-full h-full items-center justify-top pt-[130px]'>
                    <View className='flex-row px-6 mt-8 items-center space-x-2'>
                        <View className='w-60 h-18 rounded-lg items-center justify-center'>
                            <Text className='w-full text-white text-[55px] font-bold items-center justify-center text-center'>FitFUSE</Text>
                        </View>
                    </View>
                    <Text className=' text-[30px] text-white font-bold text-center pt-2'>Let's break a sweat!</Text>
                    <ImageBackground
                        source={require('../assets/home_logo.png')}
                        className='w-80 h-80'
                    >
                        <View
                            className='absolute top-0 left-0 right-0 bottom-0 items-center justify-center'>
                            <Animatable.View
                                animation={'pulse'}
                                easing='ease-in-out'
                                iterationCount={'infinite'}
                                className='w-28 h-28 items-center justify-center bg-[#28547B] rounded-full'>
                                <TouchableOpacity className='w-full h-full items-center justify-center' onPress={handleGo}>
                                    <Text className='text-white  font-bold text-[40px]'>GO</Text>
                                </TouchableOpacity>
                            </Animatable.View>
                        </View>
                    </ImageBackground>
                </View>
            </View>
        </View>
    )
}

export default Home