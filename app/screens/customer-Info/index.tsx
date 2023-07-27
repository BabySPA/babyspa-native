import { Box, Text, Pressable, Row, useToast, Spinner } from 'native-base';
import { AppStackScreenProps } from '../../types';
import NavigationBar from '~/app/components/navigation-bar';
import { sp, ss, ls } from '~/app/utils/style';
import { useEffect, useState } from 'react';
import useFlowStore from '~/app/stores/flow';
import { toastAlert } from '~/app/utils/toast';
import InfoBox from './components/info-box';
import EditBox from './components/edit-box';

export default function CustomerInfo({
  navigation,
}: AppStackScreenProps<'CustomerInfo'>) {
  const {
    currentRegisterCustomer,
    requestGetOperators,
    requestPostCustomerInfo,
    requestRegisterCustomers,
    updateCurrentFlowCustomer,
  } = useFlowStore();

  const toast = useToast();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    requestGetOperators();
  }, [requestGetOperators]);

  const [edit, setEdit] = useState(false);

  return (
    <Box flex={1}>
      <NavigationBar
        onBackIntercept={() => false}
        leftElement={
          <Text color='white' fontWeight={600} fontSize={sp(20, { min: 14 })}>
            客户详情
          </Text>
        }
        rightElement={
          <Pressable
            onPress={() => {
              if (loading) return;

              setLoading(true);
            }}>
            <Row bgColor={'white'} borderRadius={ss(4)} px={ls(26)} py={ss(10)}>
              {loading && <Spinner mr={ls(5)} />}
              <Text
                color={'#03CBB2'}
                opacity={loading ? 0.2 : 1}
                fontSize={sp(14, { min: 12 })}>
                取消登记
              </Text>
            </Row>
          </Pressable>
        }
      />
      <Row safeAreaLeft bgColor={'#F6F6FA'} flex={1} p={ss(20)} safeAreaBottom>
        {edit ? (
          <EditBox />
        ) : (
          <InfoBox
            onPressEdit={() => {
              setEdit(true);
            }}
          />
        )}
      </Row>
    </Box>
  );
}
