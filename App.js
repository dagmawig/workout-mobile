import { NavigationContainer } from '@react-navigation/native';
import { TailwindProvider } from 'tailwindcss-react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import Home from './screens/Home';
import Exercises from './screens/Exercises';
import { Provider } from 'react-redux';
import store from './components/store';
import Workout from './screens/Workout';
import NewTemp from './screens/NewTemp';
import ShowTemp from './screens/ShowTemp';
import EditTemp from './screens/EditTemp';
import LogWorkout from './screens/LogWorkout';
import History from './screens/History';
import SignUp from './screens/SignUp';
import LogIn from './screens/LogIn';
import ResetPass from './screens/ResetPass';
import Profile from './screens/Profile';

const Stack = createNativeStackNavigator();

SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 1000);

export default function App() {
  return (
    <TailwindProvider>
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name='Home' component={Home} />
            <Stack.Screen name='LogIn' component={LogIn} />
            <Stack.Screen name='Profile' component={Profile} />
            <Stack.Screen name='ResetPass' component={ResetPass} />
            <Stack.Screen name='SignUp' component={SignUp} />
            <Stack.Screen name='Workout' component={Workout} />
            <Stack.Screen name='History' component={History} />
            <Stack.Screen name='LogWorkout' component={LogWorkout} />
            <Stack.Screen name='EditTemp' component={EditTemp} />
            <Stack.Screen name='ShowTemp' component={ShowTemp} />
            <Stack.Screen name='NewTemp' component={NewTemp} />
            <Stack.Screen name='Exercises' component={Exercises} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </TailwindProvider>
  );
}

