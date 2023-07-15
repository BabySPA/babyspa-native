import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppStackList } from '../types';
import HomeScreen from '../screens/home';
import RegisterScreen from '../screens/register';

const Stack = createNativeStackNavigator<AppStackList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* <Stack.Screen name='Home' component={HomeScreen} /> */}
      <Stack.Screen name='Register' component={RegisterScreen} />
    </Stack.Navigator>
  );
}
