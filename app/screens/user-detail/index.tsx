import { Box, Text, Row } from 'native-base';
import { AppStackScreenProps } from '../../types';
import NavigationBar from '~/app/components/navigation-bar';
import { sp, ss } from '~/app/utils/style';
import { useState } from 'react';
import InfoBox from './components/info-box';
import useManagerStore from '~/app/stores/manager';
import dayjs from 'dayjs';
import EditBox from './components/edit-box';

export default function UserDetail({
  navigation,
  route: { params },
}: AppStackScreenProps<'UserDetail'>) {
  const currentUser = useManagerStore((state) => state.currentUser);

  const [edit, setEdit] = useState(params.type === 'edit' || !currentUser._id);

  return (
    <Box flex={1}>
      <NavigationBar
        onBackIntercept={() => false}
        leftElement={
          <Text color='white' fontWeight={600} fontSize={sp(20)}>
            {currentUser._id ? '员工详情' : '新增员工'}
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
