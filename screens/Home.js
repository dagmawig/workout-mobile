import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import SecureSt from '../components/SecureStore';
import Workout from './Workout';
import LogIn from './LogIn';

// returns login page or workout page based on whether the user is logged in or not
const Home = () => {

    const navigation = useNavigation();

    const [logged, setLogged] = useState(false)

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        })
    }, []);


    useEffect(() => {
        SecureSt.getVal('uid').then(uid => {
            if (uid) {
                setLogged(true);
                navigation.replace('Workout');
            }
        })
    })
    return (
        <>
            {
                logged ? <Workout /> : <LogIn />
            }
        </>
    )
}

export default Home