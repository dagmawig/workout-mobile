import { View, Text } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import RNDateTimePicker from '@react-native-community/datetimepicker'
import { useState } from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import DayTagComp from './DayTagComp';


const ReminderComp = ({ rType, setRType, dispH, minute, meridian, day, setHour, setMinute, setDispH, setMeridian, setDay, setIndex, dayTag, setDayTag }) => {

    const [show, setShow] = useState(false);
    
    function updateTime(event, date) {
        setShow(false);
        if (event.type === 'set') {
            let pickedTime = new Date(date);
            setHour(pickedTime.getHours());
            setMinute(pickedTime.getMinutes());
            setDispH(pickedTime.toLocaleTimeString().split(':')[0]);
            setMeridian(pickedTime.toLocaleTimeString().slice(-2));
        }
    }

    return (
        <View className='border-[1px] border-white rounded-md p-2 mt-2 w-3/4'>
            <View className='flex-row items-center justify-around'>
                <TouchableOpacity onPress={() => setRType('daily')} className='p-2 rounded-full' style={{ backgroundColor: rType === 'daily' ? '#1a364f' : 'transparent' }}><Text className='text-white text-lg'>Daily</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => setRType('weekly')} className='p-2 rounded-full' style={{ backgroundColor: rType === 'weekly' ? '#1a364f' : 'transparent' }}><Text className='text-white text-lg'>Weekly</Text></TouchableOpacity>
            </View>
            <View className='items-center justify-center'>
                
                    <TouchableOpacity onPress={() => setShow(true)} className='m-1 bg-[#1a364f] rounded-full p-3'>
                    <View className='items-center justify-center space-y-2'>
                        <FontAwesome5 name="clock" size={20} color="white" />
                        <Text className='text-white'>{`${Math.floor(dispH / 10)}${dispH % 10}:${Math.floor(minute / 10)}${minute % 10} ${meridian}`}</Text>
                        </View>

                    </TouchableOpacity>
                {rType==='weekly' && <View className='flex-row flex-wrap w-full justify-around items-center'>
                <DayTagComp dayTag={dayTag} setDayTag={setDayTag} />
                </View>}
                {show && <RNDateTimePicker mode="time" value={new Date()} onChange={updateTime} />}
            </View>
        </View>
    )
}

export default ReminderComp