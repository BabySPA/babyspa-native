import { Box, Text, Pressable, Row, useToast, Spinner } from 'native-base';
import { AppStackScreenProps, CustomerStatus } from '../../types';
import NavigationBar from '~/app/components/navigation-bar';
import { sp, ss, ls } from '~/app/utils/style';
import { useEffect, useState } from 'react';
import useFlowStore from '~/app/stores/flow';
import { toastAlert } from '~/app/utils/toast';
import EditBox from './components/edit-box';
import InfoBox from './components/info-box';
import { DialogModal } from '~/app/components/modals';
import useManagerStore from '~/app/stores/manager';
import dayjs from 'dayjs';

export default function ShopDetail({
  navigation,
}: AppStackScreenProps<'ShopDetail'>) {
  const { requestGetShops, currentShop } = useManagerStore();

  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(currentShop === null);
  const [showModal, setShowModal] = useState(false);

  return (
    <Box flex={1}>
      <NavigationBar
        onBackIntercept={() => false}
        leftElement={
          <Text color='white' fontWeight={600} fontSize={sp(20, { min: 14 })}>
            门店详情
          </Text>
        }
        rightElement={
          <Text color={'#fff'} fontSize={sp(20)}>
            {dayjs().format('YYYY-MM-DD')}
          </Text>
        }
      />
      <Row safeAreaLeft bgColor={'#F6F6FA'} flex={1} p={ss(20)} safeAreaBottom>
        {edit ? (
          <EditBox
            onEditFinish={function (): void {
              setEdit(false);
            }}
          />
        ) : (
          <InfoBox
            onPressCancel={() => {
              navigation.goBack();
            }}
            onPressEdit={() => {
              setEdit(true);
            }}
          />
        )}
      </Row>
    </Box>
  );
}
