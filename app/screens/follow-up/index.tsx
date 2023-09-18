import { Box, Text, Row } from 'native-base';
import { AppStackScreenProps } from '../../types';
import NavigationBar from '~/app/components/navigation-bar';
import { sp, ss } from '~/app/utils/style';
import dayjs from 'dayjs';
import FollowUpVisit from '../home/fragments/follow-up-visit';

export default function FollowUp({
  navigation,
  route: { params },
}: AppStackScreenProps<'FollowUp'>) {
  const currentShop = params.currentShop;

  return (
    <Box flex={1}>
      <NavigationBar
        onBackIntercept={() => false}
        leftElement={
          <Text color='white' fontWeight={600} fontSize={sp(20)}>
            客户随访
          </Text>
        }
        rightElement={
          <Text color={'#fff'} fontSize={sp(20)}>
            {dayjs().format('YYYY-MM-DD')}
          </Text>
        }
      />
      <Row safeAreaLeft bgColor={'#F6F6FA'} flex={1} p={ss(20)} safeAreaBottom>
        <FollowUpVisit shop={currentShop} />
      </Row>
    </Box>
  );
}
