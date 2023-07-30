import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppStackList } from '../types';
import HomeScreen from '../screens/home';
import RegisterScreen from '../screens/register-customer';
import FlowScreen from '../screens/flow';
import CameraScreen from '../screens/camera';
import CustomerInfo from '../screens/customer-info';
import FlowInfoScreen from '../screens/flow-info';

const Stack = createNativeStackNavigator<AppStackList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Home' component={HomeScreen} />
      <Stack.Screen name='RegisterCustomer' component={RegisterScreen} />
      <Stack.Screen name='CustomerInfo' component={CustomerInfo} />
      <Stack.Screen name='Flow' component={FlowScreen} />
      <Stack.Screen name='FlowInfo' component={FlowInfoScreen} />
      <Stack.Screen name='Camera' component={CameraScreen} />
    </Stack.Navigator>
  );
}
