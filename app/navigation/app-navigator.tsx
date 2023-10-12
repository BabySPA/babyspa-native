import {
  CardStyleInterpolators,
  StackCardStyleInterpolator,
  createStackNavigator,
} from '@react-navigation/stack';
import { AppStackList, FlowStatus } from '../types';
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
import {
  Box,
  Center,
  Modal,
  Pressable,
  Row,
  Spinner,
  StatusBar,
  Text,
} from 'native-base';
import { sp, ss, ls } from '../utils/style';
import useGlobalLoading from '../stores/loading';
import Picker from 'react-native-patchpicker';
import FollowUp from '../screens/follow-up';
import AnalyzeInfo from '../screens/analyze-info';
import { useEffect, useRef, useState } from 'react';
import useAuthStore from '../stores/auth';
import Environment from '../config/environment';
import useMessageStore, { MessageAction } from '../stores/message';
import { Audio } from 'expo-av';
import useFlowStore from '../stores/flow';
import { useNavigation } from '@react-navigation/native';
import { AnalyzeStatus } from '../stores/flow/type';

const Stack = createStackNavigator<AppStackList>();

export default function AppNavigator() {
  const { loading, loadingText, spinner, closeLoading } = useGlobalLoading();

  const requestMessages = useMessageStore((state) => state.requestMessages);
  const getSocketInstance = useMessageStore((state) => state.getSocketInstance);
  const loginSocket = useMessageStore((state) => state.loginSocket);
  const closeSocket = useMessageStore((state) => state.closeSocket);

  const [showActionDone, setShowActionDone] = useState({
    isOpen: false,
    type: '',
    customer: '',
    flowId: '',
  });
  const requestGetFlowById = useFlowStore((state) => state.requestGetFlowById);
  const updateCurrentFlow = useFlowStore((state) => state.updateCurrentFlow);
  const requestGetInitializeData = useFlowStore(
    (state) => state.requestGetInitializeData,
  );
  const navigation = useNavigation();

  useEffect(() => {
    console.log('初始化socket');
    const socket = getSocketInstance();
    // @ts-ignore
    socket.onopen = (e) => {
      console.log('WebSocket连接已打开');
      loginSocket();
    };

    socket.onmessage = async (e) => {
      // 接收到服务器发送的消息
      const payload = JSON.parse(e.data);
      console.log('接收到服务器发送的消息:', payload);

      const { event, message } = payload;
      if (event === MessageAction.ANALYZE_UPDATE) {
        setShowActionDone({
          isOpen: true,
          customer: message.customer,
          flowId: message.flowId,
          type: MessageAction.ANALYZE_UPDATE,
        });
        const { sound } = await Audio.Sound.createAsync(
          require('~/assets/analyze_done.mp3'),
        );
        sound.setIsLoopingAsync(false);
        sound.playAsync();
      } else if (event == MessageAction.COLLECTION_UPDATE) {
        setShowActionDone({
          isOpen: true,
          customer: message.customer,
          flowId: message.flowId,
          type: MessageAction.COLLECTION_TODO,
        });
        const { sound } = await Audio.Sound.createAsync(
          require('~/assets/collection_done.mp3'),
        );
        sound.setIsLoopingAsync(false);
        sound.playAsync();
      }
      requestMessages();
      requestGetInitializeData();
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
  }, []);

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

      {showActionDone.isOpen && (
        <Modal
          isOpen={showActionDone.isOpen}
          onClose={() => {
            setShowActionDone({
              ...showActionDone,
              isOpen: false,
            });
          }}>
          <Center bgColor={'#fff'} borderRadius={ss(8)} px={ss(60)} py={ss(30)}>
            <Text fontSize={sp(20)} color='#333' mt={ss(40)}>
              {showActionDone.type === MessageAction.ANALYZE_UPDATE
                ? `${showActionDone.customer}的信息已经完成分析，请及时处理。`
                : `${showActionDone.customer}需要进行分析，请及时处理。`}
            </Text>
            <Row mt={ss(50)} mb={ss(20)}>
              <Pressable
                _pressed={{
                  opacity: 0.6,
                }}
                hitSlop={ss(20)}
                onPress={() => {
                  setShowActionDone({
                    ...showActionDone,
                    isOpen: false,
                  });
                }}>
                <Center
                  borderRadius={ss(4)}
                  borderWidth={ss(1)}
                  borderColor={'#03CBB2'}
                  px={ls(30)}
                  py={ss(10)}>
                  <Text color='#00B49E' fontSize={sp(14)}>
                    知道了
                  </Text>
                </Center>
              </Pressable>
              <Pressable
                _pressed={{
                  opacity: 0.6,
                }}
                hitSlop={ss(20)}
                onPress={() => {
                  setShowActionDone({
                    ...showActionDone,
                    isOpen: false,
                  });
                  requestGetFlowById(showActionDone.flowId).then((flow) => {
                    updateCurrentFlow(flow);

                    if (showActionDone.type === MessageAction.ANALYZE_UPDATE) {
                      // 查看分析详情
                      navigation.navigate('AnalyzeInfo');
                    } else {
                      // 去分析
                      // 还未分析
                      navigation.navigate('Flow', {
                        type: FlowStatus.ToBeAnalyzed,
                      });
                    }
                  });
                }}>
                <Center
                  ml={ls(20)}
                  borderRadius={ss(4)}
                  borderWidth={ss(1)}
                  borderColor={'#03CBB2'}
                  bgColor={'rgba(3, 203, 178, 0.20)'}
                  px={ls(30)}
                  py={ss(10)}>
                  <Text color='#00B49E' fontSize={sp(14)}>
                    查看
                  </Text>
                </Center>
              </Pressable>
            </Row>
          </Center>
        </Modal>
      )}
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
