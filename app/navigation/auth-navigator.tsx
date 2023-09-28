import { createStackNavigator } from '@react-navigation/stack';

import { AuthStackList } from '../types';
import LoginScreen from '../screens/login';

const Stack = createStackNavigator<AuthStackList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Login' component={LoginScreen} />
    </Stack.Navigator>
  );
}
