import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';

const FooterComp = () => {
    const navigation = useNavigation();
    const route = useRoute();

    function handleNav(screen) {
        switch (screen) {
            case 'profile':
                navigation.navigate('Profile');
                break;
            case 'workout':
                navigation.navigate('Workout');
                break;
            case 'exercises':
                navigation.navigate('Exercises');
                break;
            case 'history':
                navigation.navigate('History');
                break;
            default:
                navigation.navigate('Workout');
        }
    }

    return (
        <View className='absolute bottom-0 h-[50px] bg-[#28547B] w-full items-center justify-around flex-row'>
            <TouchableOpacity className='items-center justify-center p-2' style={{backgroundColor: route.name==='Profile'? '#1a364f' : ''}} onPress={() => handleNav('profile')}>
                <FontAwesome5 name="user" size={16} color="white" />
                <Text className='text-white text-xs'>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity className='items-center justify-center p-2' style={{backgroundColor: route.name==='History'? '#1a364f' : ''}} onPress={() => handleNav('history')}>
                <FontAwesome5 name="clock" size={16} color="white" />
                <Text className='text-white text-xs'>History</Text>
            </TouchableOpacity>
            <TouchableOpacity className='items-center justify-center p-2' style={{backgroundColor: route.name==='Workout' || route.name==='LogWorkout' || route.name==='EditTemp' || route.name==='ShowTemp' || route.name==='NewTemp'? '#1a364f' : ''}} onPress={() => handleNav('workout')}>
                <FontAwesome5 name="plus" size={16} color="white" />
                <Text className='text-white text-xs'>Workout</Text>
            </TouchableOpacity>
            <TouchableOpacity className='items-center justify-center p-2' style={{backgroundColor: route.name==='Exercises'? '#1a364f' : ''}} onPress={() => handleNav('exercises')}>
                <FontAwesome5 name="dumbbell" size={16} color="white" />
                <Text className='text-white text-xs'>Exercises</Text>
            </TouchableOpacity>
        </View>
    )
}

export default FooterComp