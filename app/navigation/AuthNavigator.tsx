import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthStackList } from '../../types';
import LoginScreen from '../screens/LoginScreen';

const Stack = createNativeStackNavigator<AuthStackList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}
