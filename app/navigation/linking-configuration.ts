import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import { RootStackParamList } from '../types';

//  <Stack.Screen name='RegisterCustomer' component={RegisterScreen} />
//         <Stack.Screen name='CustomerDetail' component={CustomerDetail} />
//         <Stack.Screen name='AddNewCustomer' component={AddNewCustomer} />
//         <Stack.Screen name='Flow' component={FlowScreen} />
//         <Stack.Screen name='FlowInfo' component={FlowInfoScreen} />
//         <Stack.Screen name='Camera' component={CameraScreen} />
//         <Stack.Screen name='ManagerLogger' component={ManagerLogger} />
//         <Stack.Screen name='ManagerShop' component={ManagerShop} />
//         <Stack.Screen name='ManagerRole' component={ManagerRole} />
//         <Stack.Screen name='ManagerTemplate' component={ManagerTemplate} />
//         <Stack.Screen name='ManagerUser' component={ManagerUser} />
//         <Stack.Screen name='ShopDetail' component={ShopDetail} />
//         <Stack.Screen name='UserDetail' component={UserDetail} />
//         <Stack.Screen name='RoleDetail' component={RoleDetail} />
//         <Stack.Screen name='CustomerArchive' component={CustomerArchive} />
//         <Stack.Screen name='Personal' component={Personal} />
//         <Stack.Screen name='FollowUp' component={FollowUp} />
//         <Stack.Screen name='AnalyzeInfo' component={AnalyzeInfo} />
const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL('/')],
  config: {
    screens: {
      Auth: 'login',
      App: 'app',
      RegisterCustomer: 'register-customer',
      CustomerDetail: 'customer-detail',
      Flow: 'flow',
      FlowInfo: 'flow-info',
      Camera: 'camera',
      ManagerLogger: 'manager-logger',
      ManagerShop: 'manager-shop',
      ManagerRole: 'manager-role',
      ManagerTemplate: 'manager-template',
      ManagerUser: 'manager-user',
      ShopDetail: 'shop-detail',
      UserDetail: 'user-detail',
      RoleDetail: 'role-detail',
      CustomerArchive: 'customer-archive',
      Personal: 'personal',
      FollowUp: 'follow-up',
      AnalyzeInfo: 'analyze-info',
    },
  },
};

export default linking;
