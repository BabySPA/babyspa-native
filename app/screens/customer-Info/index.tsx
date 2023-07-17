import { Box, Text, Pressable, Row, useToast, Spinner } from 'native-base';
import { AppStackScreenProps, CustomerScreenType } from '../../types';
import NavigationBar from '~/app/components/navigation-bar';
import { sp, ss, ls } from '~/app/utils/style';
import EditCustomer from '~/app/components/edit-customer';
import SelectCustomer from '~/app/components/select-customer';
import { useEffect, useState } from 'react';
import useFlowStore from '~/app/stores/flow';
import { toastAlert } from '~/app/utils/toast';

export default function CustomerInfoScreen({
  navigation,
  route: { params },
}: AppStackScreenProps<'CustomerInfo'>) {
  const { type } = params;
  const isRegister = type == CustomerScreenType.register;

  const {
    requestGetOperators,
    requestPostCustomerInfo,
    requestRegisterCustomers,
  } = useFlowStore();

  const toast = useToast();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    requestGetOperators();
  }, [requestGetOperators]);

  return (
    <Box flex={1}>
      <NavigationBar
        onBackIntercept={() => false}
        leftElement={
          <Text color='white' fontWeight={600} fontSize={sp(20, { min: 14 })}>
            {isRegister ? '登记' : '快速采集'}
          </Text>
        }
        rightElement={
          <Pressable
            onPress={() => {
              if (loading) return;

              setLoading(true);

              requestPostCustomerInfo()
                .then(() => {
                  toastAlert(
                    toast,
                    'success',
                    isRegister ? '登记成功！' : '快速采集客户信息成功！',
                  );
                  requestRegisterCustomers();
                  if (isRegister) {
                    navigation.goBack();
                  } else {
                    // 进入流程页面
                    navigation.navigate('Flow');
                  }
                })
                .catch(() => {
                  toastAlert(
                    toast,
                    'error',
                    isRegister
                      ? '登记失败，请检查客户信息是否正确！'
                      : '快速采集客户信息失败！',
                  );
                })
                .finally(() => {
                  setLoading(false);
                });
            }}>
            <Row bgColor={'white'} borderRadius={ss(4)} px={ls(26)} py={ss(10)}>
              {loading && <Spinner mr={ls(5)} />}
              <Text
                color={'#03CBB2'}
                opacity={loading ? 0.2 : 1}
                fontSize={sp(14, { min: 12 })}>
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
