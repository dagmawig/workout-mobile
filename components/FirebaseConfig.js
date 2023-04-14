// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {REACT_APP_FB_API_KEY, REACT_APP_FB_AUTH_DOMAIN, REACT_APP_FB_PROJECT_ID, REACT_APP_FB_STORAGE_BUCKET, REACT_APP_FB_MESSAGING_SENDER_ID, REACT_APP_FB_APP_ID } from '@env'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: REACT_APP_FB_API_KEY,
    authDomain: REACT_APP_FB_AUTH_DOMAIN,
    projectId: REACT_APP_FB_PROJECT_ID,
    storageBucket: REACT_APP_FB_STORAGE_BUCKET,
    messagingSenderId: REACT_APP_FB_MESSAGING_SENDER_ID,
    appId: REACT_APP_FB_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { auth };

/*
 apiKey: process.env.REACT_APP_FB_API_KEY,
    authDomain: process.env.REACT_APP_FB_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FB_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FB_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FB_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FB_APP_ID
*/