import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const FooterComp = () => {
    const navigation = useNavigation();

    function handleNav(screen) {
        switch (screen) {
            case 'workout':
                navigation.navigate('Workout');
                break;
            case 'exercises':
                navigation.navigate('Exercises');
                break;
            default:
                navigation.navigate('Workout');
        }
    }

    return (
        <View className='absolute bottom-0 h-[50px] bg-[#28547B] w-full items-center justify-around flex-row'>
            <TouchableOpacity className='items-center justify-center' onPress={() => handleNav('')}>
                <FontAwesome5 name="clock" size={16} color="white" />
                <Text className='text-white text-xs'>History</Text>
            </TouchableOpacity>
            <TouchableOpacity className='items-center justify-center' onPress={() => handleNav('workout')}>
                <FontAwesome5 name="plus" size={16} color="white" />
                <Text className='text-white text-xs'>Workout</Text>
            </TouchableOpacity>
            <TouchableOpacity className='items-center justify-center' onPress={() => handleNav('exercises')}>
                <FontAwesome5 name="dumbbell" size={16} color="white" />
                <Text className='text-white text-xs'>Exercises</Text>
            </TouchableOpacity>
        </View>
    )
}

export default FooterComp