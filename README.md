# Workout Android/Mobile App
This app is used  to log workout sessions. It allows users to create their own custom workout templates from a list of over a 1000 exercises. It logs workout session exercises and their corresponding data (such as weight, time and rep) under workout history page. The history page also shows the date each session was performed and the time it took to complete the session. During the workout session the app gives the users the flexibility to modify the workout template by adding and removing exercises and sets. It also gives users the ability to edit and save workout templates if needed. The app has a reminder feature that let users add recurring reminders in the form of local notifications for a given exercise template.

The app also shows previous record and personal record for each exercise type. In addition, it has both visual (gif) and textual details of each exercise to help users perform the exercises properly. The exercise search component gives users the option to filter out exercises based on body part, target muscle group and exercise name.

# App is published on Google Play Store at https://play.google.com/store/apps/details?id=com.fitfuse.workout.tracker

## Server side 
Server side is written in Javascript with Node framework and is located at https://github.com/dagmawig/workout-backend
It is hosted on Glitch platform.

### Services and Functions Used
I used React Native with Expo framework to build the frontend.
I used Tailwind CSS framework for styling.
I used Fuse.js library to implement fuzzy-search/approximate string matching.
I used firebase authentication to verify user email and authenticate using email and password.
I used axios method to make https request to server side.
I used MongoDB to store user data.
I used Glitch.com to host server code.
I used Redux Toolkit to manage global app state.
I used useState hook to manage local app state.
I used expo-notifications to set and manage local reminder notifications.