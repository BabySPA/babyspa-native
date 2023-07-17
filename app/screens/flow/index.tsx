import {
  Box,
  Text,
  Pressable,
  Row,
  Icon,
  Button,
  Center,
  Flex,
  View,
  Container,
} from 'native-base';
import { AppStackScreenProps } from '../../types';
import NavigationBar from '~/app/components/navigation-bar';
import { sp, ss, ls } from '~/app/utils/style';
import { useEffect, useState } from 'react';
import useFlowStore from '~/app/stores/flow';
import { getAge, getFlowOperatorConfigByUser } from '~/app/utils';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import HealthInfo from './components/health-info';

export default function FlowScreen({
  navigation,
  route,
}: AppStackScreenProps<'Flow'>) {
  const { status, customer } = route.params;
  const age = getAge(customer.birthday);
  const ageText = `${age?.year}岁${age?.month}月`;
  const { requestGetFlow } = useFlowStore();

  const FlowOperators = getFlowOperatorConfigByUser();

  useEffect(() => {
    requestGetFlow(customer.flowId).then((res) => {
      console.log(res);
    });
  }, [requestGetFlow]);

  const [operatorIdx, setOperatorIdx] = useState(0);

  return (
    <Box flex={1}>
      <NavigationBar
        onBackIntercept={() => false}
        leftElement={
          <Row alignItems={'center'}>
            <Text color='white' fontWeight={600} fontSize={sp(20)}>
              {customer.name}
            </Text>
            <Icon
              as={
                <MaterialCommunityIcons
                  name={customer.gender == 1 ? 'gender-male' : 'gender-female'}
                />
              }
              size={ss(26)}
              color={'#FFF'}
              ml={ls(12)}
            />
            <Text color={'#FFF'} fontWeight={400} fontSize={sp(20)} ml={ls(12)}>
              {ageText}
            </Text>
            <Text color={'#FFF'} fontWeight={400} fontSize={sp(20)} ml={ls(12)}>
              {customer.phoneNumber}
            </Text>
            <Pressable>
              <Row alignItems={'center'} bgColor={'#fff'} p={ss(8)} ml={ls(12)}>
                <Text color='#03CBB2'>历史记录</Text>
                <Icon
                  as={<AntDesign name='doubleright' size={ss(20)} />}
                  color={'#03CBB2'}
                />
              </Row>
            </Pressable>
          </Row>
        }
        rightElement={
          <Text color={'#fff'} fontSize={sp(20)}>
            {dayjs().format('YYYY-MM-DD HH:mm')}
          </Text>
        }
      />
      <Box safeAreaLeft safeAreaBottom bgColor={'#F6F6FA'} flex={1} p={ss(10)}>
        <Box bgColor='#fff' borderRadius={ss(10)}>
          <Container px={ls(20)} py={ss(16)}>
            <Row
              borderRadius={ss(4)}
              borderColor={'#99A9BF'}
              borderWidth={1}
              borderStyle={'solid'}>
              {FlowOperators.map((item, idx) => {
                return (
                  <Pressable
                    onPress={() => {
                      setOperatorIdx(idx);
                    }}>
                    <Box
                      minW={ss(120)}
                      key={item.key}
                      px={ss(20)}
                      py={ss(10)}
                      bgColor={operatorIdx == idx ? '#03CBB2' : '#F1F1F1'}
                      borderRightWidth={idx == FlowOperators.length - 1 ? 0 : 1}
                      borderRightColor={'#99A9BF'}>
                      <Text
                        fontSize={sp(20)}
                        fontWeight={600}
                        color={operatorIdx == idx ? '#fff' : '#333'}>
                        {item.text}
                      </Text>
                    </Box>
                  </Pressable>
                );
              })}
            </Row>
          </Container>
        </Box>
        <Box borderRadius={ss(10)} flex={1} mt={ss(10)}>
          <HealthInfo />
        </Box>
      </Box>
    </Box>
  );
}
