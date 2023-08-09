import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppStackList } from '../types';
import HomeScreen from '../screens/home';
import RegisterScreen from '../screens/register-customer';
import FlowScreen from '../screens/flow';
import CameraScreen from '../screens/camera';
import CustomerDetail from '../screens/customer-detail';
import FlowInfoScreen from '../screens/flow-info';
import ManagerShop from '../screens/manager/manager-shop';
import ManagerLogger from '../screens/manager/manager-logger';
import ManagerRole from '../screens/manager/manager-role';
import ManagerTemplate from '../screens/manager/manager-template';
import ManagerUser from '../screens/manager/manager-user';

const Stack = createNativeStackNavigator<AppStackList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Home' component={HomeScreen} />
      <Stack.Screen name='RegisterCustomer' component={RegisterScreen} />
      <Stack.Screen name='CustomerDetail' component={CustomerDetail} />
      <Stack.Screen name='Flow' component={FlowScreen} />
      <Stack.Screen name='FlowInfo' component={FlowInfoScreen} />
      <Stack.Screen name='Camera' component={CameraScreen} />
      <Stack.Screen name='ManagerLogger' component={ManagerLogger} />
      <Stack.Screen name='ManagerShop' component={ManagerShop} />
      <Stack.Screen name='ManagerRole' component={ManagerRole} />
      <Stack.Screen name='ManagerTemplate' component={ManagerTemplate} />
      <Stack.Screen name='ManagerUser' component={ManagerUser} />
    </Stack.Navigator>
  );
}
