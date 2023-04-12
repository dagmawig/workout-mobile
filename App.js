import { NavigationContainer } from '@react-navigation/native';
import { TailwindProvider } from 'tailwindcss-react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <TailwindProvider>
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator>
          <Stack.Screen name='SignUp' component={SignUp} />
          <Stack.Screen name='Workout' component={Workout} />
          <Stack.Screen name='History' component={History} />
          <Stack.Screen name='LogWorkout' component={LogWorkout} />
            <Stack.Screen name='EditTemp' component={EditTemp} />
            <Stack.Screen name='ShowTemp' component={ShowTemp} />
            <Stack.Screen name='NewTemp' component={NewTemp} />
            <Stack.Screen name='Exercises' component={Exercises} />
            <Stack.Screen name='Home' component={Home} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </TailwindProvider>
  );
}

