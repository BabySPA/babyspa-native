import {
  Box,
  Text,
  Pressable,
  Row,
  useToast,
  Spinner,
  Column,
  ScrollView,
} from 'native-base';
import { AppStackScreenProps, CustomerStatus } from '../../types';
import NavigationBar from '~/app/components/navigation-bar';
import { sp, ss, ls } from '~/app/utils/style';
import { useEffect, useState } from 'react';
import useFlowStore from '~/app/stores/flow';
import RegisterCard from '~/app/components/info-cards/register-card';
import CollectionCard from '~/app/components/info-cards/collection-card';
import AnalyzeCard from '~/app/components/info-cards/analyze-card';

export default function CustomerInfo({
  navigation,
}: AppStackScreenProps<'FlowInfo'>) {
  const { requestGetFlow, currentFlowCustomer } = useFlowStore();

  useEffect(() => {
    requestGetFlow(currentFlowCustomer.flowId);
  }, [requestGetFlow]);
  const toast = useToast();
  const [loading, setLoading] = useState(false);

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
          <Pressable onPress={() => {}}>
            <Row bgColor={'white'} borderRadius={ss(4)} px={ls(26)} py={ss(10)}>
              {loading && <Spinner mr={ls(5)} color='emerald.500' />}
              <Text
                color={'#03CBB2'}
                opacity={loading ? 0.6 : 1}
                fontSize={sp(14, { min: 12 })}>
                评价
              </Text>
            </Row>
          </Pressable>
        }
      />
      <Row safeAreaLeft bgColor={'#F6F6FA'} flex={1} p={ss(20)} safeAreaBottom>
        <Column flex={1}>
          <ScrollView>
            <RegisterCard />
            <CollectionCard style={{ marginTop: ls(10) }} />
          </ScrollView>
        </Column>
        <Column flex={1} ml={ls(10)}>
          <ScrollView>
            <AnalyzeCard />
          </ScrollView>
        </Column>
      </Row>
    </Box>
  );
}
