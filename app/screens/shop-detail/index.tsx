import { Box, Text, Row, useToast } from 'native-base';
import { AppStackScreenProps } from '../../types';
import NavigationBar from '~/app/components/navigation-bar';
import { sp, ss } from '~/app/utils/style';
import { useState } from 'react';
import InfoBox from './components/info-box';
import useManagerStore from '~/app/stores/manager';
import dayjs from 'dayjs';
import EditBox from './components/edit-box';

export default function ShopDetail({
  navigation,
  route: { params },
}: AppStackScreenProps<'ShopDetail'>) {
  const { currentShop } = useManagerStore();

  const [edit, setEdit] = useState(params.type === 'edit' || !currentShop._id);

  return (
    <Box flex={1}>
      <NavigationBar
        onBackIntercept={() => false}
        leftElement={
          <Text color='white' fontWeight={600} fontSize={sp(20)}>
            {currentShop._id ? '门店详情' : '新增门店'}
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
