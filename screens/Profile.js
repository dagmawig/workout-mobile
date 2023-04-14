import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import FooterComp from '../components/FooterComp';
import { FontAwesome5 } from '@expo/vector-icons'; 
import SecureSt from '../components/SecureStore';

const Profile = () => {

    const navigation = useNavigation();

    const [email, setEmail] = useState('');

    SecureSt.getVal('email').then((res)=> {
        if(res) setEmail(res);
        else setEmail('undefined')
    })

    function handleLogOut() {
        SecureSt.save('email', '');
        SecureSt.save('password', '');
        navigation.navigate('LogIn');
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        })
    }, []);

    return (
        <View className='bg-[#28547B] flex-1 max-h-screen min-w-screen overflow-hidden'>
            <View className='pt-[45px] h-full w-full' >
                <View className='w-full h-10 shadow-2xl flex-row items-center justify-between px-3 sticky'>
                    <View className=''>
                        <Text className='text-white text-lg font-semibold'>Profile</Text>
                    </View>
                </View>
                <ScrollView className='px-3 pt-3 space-y-5' contentContainerStyle={{paddingBottom: 70}}>
                    <View className='flex-row justify-start items-center space-x-2'>
                        <FontAwesome5 name="user-circle" size={45} color="white" />
                        <Text className='text-white'>{email}</Text>
                    </View>
                    <View className='mx-2 h-8 w-full items-center'> 
                        <TouchableOpacity className='h-full w-60 bg-[#1a364f]  rounded-md flex justify-center' onPress={handleLogOut}>
                            <Text className='text-white text-center'>Log Out</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <FooterComp/>
            </View>
        </View>
    )
}

export default Profile;