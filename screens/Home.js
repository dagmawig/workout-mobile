import { View, Text, SafeAreaView } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { useNavigation } from '@react-navigation/native';

const Home = () => {

    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        })
    }, []);


    return (
        <SafeAreaView>
            <View>
               <Text>This is home</Text> 
            </View>
        </SafeAreaView>
    )
}

export default Home