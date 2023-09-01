import { Box, Text, Pressable, Row, useToast, Spinner } from 'native-base';
import { AppStackScreenProps, FlowStatus } from '../../types';
import NavigationBar from '~/app/components/navigation-bar';
import { sp, ss, ls } from '~/app/utils/style';
import { useEffect, useState } from 'react';
import useFlowStore from '~/app/stores/flow';
import { toastAlert } from '~/app/utils/toast';
import EditBox from './components/edit-box';
import InfoBox from './components/info-box';
import { DialogModal } from '~/app/components/modals';

export default function AddNewCustomer({
  navigation,
}: AppStackScreenProps<'AddNewCustomer'>) {
  const { requestGetOperators, currentArchiveCustomer } = useFlowStore();

  useEffect(() => {
    requestGetOperators();
  }, []);

  return (
    <Box flex={1}>
      <NavigationBar
        onBackIntercept={() => false}
        leftElement={
          <Text color='white' fontWeight={600} fontSize={sp(20, { min: 14 })}>
            {currentArchiveCustomer.id ? '编辑客户信息' : '新增客户'}
          </Text>
        }
        rightElement={null}
      />
      <Row safeAreaLeft bgColor={'#F6F6FA'} flex={1} p={ss(20)} safeAreaBottom>
        <EditBox
          onEditFinish={function (): void {
            navigation.goBack();
          }}
          type={currentArchiveCustomer.id ? 'archive-edit' : 'archive-new'}
        />
      </Row>
    </Box>
  );
}
