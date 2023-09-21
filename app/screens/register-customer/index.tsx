import { Box, Text, Pressable, Row, useToast, Spinner } from 'native-base';
import {
  AppStackScreenProps,
  CustomerScreenType,
  FlowStatus,
} from '../../types';
import NavigationBar from '~/app/components/navigation-bar';
import { sp, ss, ls } from '~/app/utils/style';
import EditCustomer from './components/edit-customer';
import SelectCustomer from '~/app/components/select-customer';
import { useEffect, useState } from 'react';
import useFlowStore from '~/app/stores/flow';
import { toastAlert } from '~/app/utils/toast';
import useManagerStore from '~/app/stores/manager';

export default function RegisterCustomerScreen({
  navigation,
  route: { params },
}: AppStackScreenProps<'RegisterCustomer'>) {
  const { type } = params;
  const isRegister = type == CustomerScreenType.register;

  const {
    currentFlow,
    requestGetOperators,
    requestPostRegisterInfo,
    requestGetInitializeData,
    updateCurrentFlow,
  } = useFlowStore();

  const { requestGetTemplates } = useManagerStore();

  const toast = useToast();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    requestGetOperators();
    requestGetTemplates();
  }, []);

  return (
    <Box flex={1}>
      <NavigationBar
        onBackIntercept={() => false}
        leftElement={
          <Text color='white' fontWeight={600} fontSize={sp(20)}>
            {isRegister ? '登记' : '快速采集'}
          </Text>
        }
        rightElement={
          <Pressable
            _pressed={{
              opacity: 0.6,
            }}
            hitSlop={ss(20)}
            onPress={() => {
              if (loading) return;

              setLoading(true);

              if (!currentFlow.customer.name) {
                toastAlert(toast, 'error', '请输入姓名！');
                setLoading(false);
                return;
              }
              if (!currentFlow.customer.phoneNumber) {
                toastAlert(toast, 'error', '请输入电话！');
                setLoading(false);
                return;
              }

              if (currentFlow.customer.phoneNumber.length !== 11) {
                toastAlert(toast, 'error', '电话格式输入有误请检查！');
                setLoading(false);
                return;
              }

              if (!currentFlow.customer.birthday) {
                toastAlert(toast, 'error', '请选择生日！');
                setLoading(false);
                return;
              }

              requestPostRegisterInfo()
                .then((res) => {
                  toastAlert(
                    toast,
                    'success',
                    isRegister ? '登记成功！' : '快速采集客户信息成功！',
                  );
                  requestGetInitializeData();
                  if (isRegister) {
                    navigation.goBack();
                  } else {
                    // 进入流程页面
                    updateCurrentFlow(res);
                    navigation.replace('Flow', {
                      type: FlowStatus.ToBeCollected,
                    });
                  }
                })
                .catch((err) => {
                  if (err.code === 30004) {
                    toastAlert(
                      toast,
                      'error',
                      '当前客户正在流程中，不可登记。',
                    );
                  } else {
                    toastAlert(
                      toast,
                      'error',
                      isRegister
                        ? '登记失败，请检查客户信息是否正确！'
                        : '快速采集客户信息失败！',
                    );
                  }
                })
                .finally(() => {
                  setLoading(false);
                });
            }}>
            <Row bgColor={'white'} borderRadius={ss(4)} px={ls(26)} py={ss(10)}>
              {loading && (
                <Spinner mr={ls(5)} color='emerald.500' size={ss(20)} />
              )}
              <Text
                color={'#03CBB2'}
                opacity={loading ? 0.6 : 1}
                fontSize={sp(14)}>
                确定
              </Text>
            </Row>
          </Pressable>
        }
      />
      <Row safeAreaLeft bgColor={'#F6F6FA'} flex={1} p={ss(20)} safeAreaBottom>
        <EditCustomer style={{ marginRight: ss(10) }} />
        <SelectCustomer style={{ marginLeft: ss(10) }} />
      </Row>
    </Box>
  );
}
