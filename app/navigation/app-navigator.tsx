import {
  CardStyleInterpolators,
  StackCardStyleInterpolator,
  createStackNavigator,
} from '@react-navigation/stack';
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
import ShopDetail from '../screens/shop-detail';
import UserDetail from '../screens/user-detail';
import RoleDetail from '../screens/role-detail';
import AddNewCustomer from '../screens/customer-detail/new-customer';
import CustomerArchive from '../screens/customer-archive';
import Personal from '../screens/personal';
import { Box, Modal, Row, Spinner, StatusBar, Text } from 'native-base';
import { sp } from '../utils/style';
import useGlobalLoading from '../stores/loading';
import Picker from 'react-native-patchpicker';
import FollowUp from '../screens/follow-up';
import AnalyzeInfo from '../screens/analyze-info';
import { useEffect, useRef } from 'react';
import useAuthStore from '../stores/auth';

const Stack = createStackNavigator<AppStackList>();

export default function AppNavigator() {
  const { loading, loadingText, spinner, closeLoading } = useGlobalLoading();
  const userId = useAuthStore((state) => state.user?.id);
  const roleKey = useAuthStore(
    (state) => state.currentShopWithRole?.role.roleKey,
  );
  const shopId = useAuthStore((state) => state.currentShopWithRole?.shop._id);
  const socket = useRef(new WebSocket('ws://127.0.0.1:17000?a=1')).current;

  const closeSocket = () => {
    // 发送消息登录socket
    const message = {
      event: 'message', // 事件名称
      data: JSON.stringify({
        type: 'logout',
        data: {
          shopId,
          userId,
          roleKey,
        },
      }), // 消息内容
    };
    socket.send(JSON.stringify(message));
    socket.close();
  };

  const loginSocket = () => {
    // 发送消息登录socket
    const message = {
      event: 'message', // 事件名称
      data: JSON.stringify({
        type: 'login',
        data: {
          shopId,
          userId,
          roleKey,
        },
      }), // 消息内容
    };

    socket.send(JSON.stringify(message));
  };

  useEffect(() => {
    // @ts-ignore
    socket.onopen = (e) => {
      loginSocket();
    };
    socket.onmessage = (e) => {
      // 接收到服务器发送的消息
      console.log('接收到消息:', e);
    };

    socket.onerror = (e) => {
      console.error('WebSocket错误:', e);
    };

    socket.onclose = () => {
      console.log('WebSocket连接已关闭');
    };

    return () => {
      closeSocket();
    };
  });
  return (
    <Box flex={1} bgColor='white'>
      <Modal
        isOpen={loading}
        onClose={() => {
          Picker.hide();
          closeLoading();
        }}>
        {spinner && (
          <Row alignItems={'center'}>
            <Text color={'#f0f0f0'} fontSize={sp(16)}>
              {loadingText}
            </Text>
            <Spinner size={sp(40)} color='#fff' />
          </Row>
        )}
      </Modal>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}>
        <Stack.Screen name='Home' component={HomeScreen} />
        <Stack.Screen name='RegisterCustomer' component={RegisterScreen} />
        <Stack.Screen name='CustomerDetail' component={CustomerDetail} />
        <Stack.Screen name='AddNewCustomer' component={AddNewCustomer} />
        <Stack.Screen name='Flow' component={FlowScreen} />
        <Stack.Screen name='FlowInfo' component={FlowInfoScreen} />
        <Stack.Screen name='Camera' component={CameraScreen} />
        <Stack.Screen name='ManagerLogger' component={ManagerLogger} />
        <Stack.Screen name='ManagerShop' component={ManagerShop} />
        <Stack.Screen name='ManagerRole' component={ManagerRole} />
        <Stack.Screen name='ManagerTemplate' component={ManagerTemplate} />
        <Stack.Screen name='ManagerUser' component={ManagerUser} />
        <Stack.Screen name='ShopDetail' component={ShopDetail} />
        <Stack.Screen name='UserDetail' component={UserDetail} />
        <Stack.Screen name='RoleDetail' component={RoleDetail} />
        <Stack.Screen name='CustomerArchive' component={CustomerArchive} />
        <Stack.Screen name='Personal' component={Personal} />
        <Stack.Screen name='FollowUp' component={FollowUp} />
        <Stack.Screen name='AnalyzeInfo' component={AnalyzeInfo} />
      </Stack.Navigator>
    </Box>
  );
}
