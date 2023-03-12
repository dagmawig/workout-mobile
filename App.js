import { NavigationContainer } from '@react-navigation/native';
import { TailwindProvider } from 'tailwindcss-react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/Home';
import Exercises from './screens/Exercises';
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <TailwindProvider>
      <NavigationContainer>
        <Stack.Navigator>
        <Stack.Screen name='Exercises' component={Exercises} />
        <Stack.Screen name='Home' component={Home} />
        </Stack.Navigator>
      </NavigationContainer>
    </TailwindProvider>
  );
}

