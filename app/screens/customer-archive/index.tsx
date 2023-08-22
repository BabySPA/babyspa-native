import dayjs from 'dayjs';
import {
  Box,
  Column,
  Icon,
  Pressable,
  Row,
  Text,
  Image,
  Container,
} from 'native-base';
import NavigationBar from '~/app/components/navigation-bar';
import { sp, ss, ls } from '~/app/utils/style';
import { AppStackScreenProps } from '~/app/types';
import { useEffect, useState } from 'react';
import {
  AntDesign,
  FontAwesome,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { getAge } from '~/app/utils';
import { ShopArchive } from './components/shop-archive';
import { HistoryArchive } from './components/history-archive';
import { GrowthCurve } from './components/growth-curve';
import useFlowStore from '~/app/stores/flow';
import { FlowArchive } from '~/app/stores/flow/type';

const configs = [
  {
    key: 'shop-archive',
    text: '门店记录',
  },
  {
    key: 'history-archive',
    text: '历史记录',
  },
  {
    key: 'growth-curve',
    text: '生长曲线',
  },
];
export default function CustomerArchive({
  navigation,
  route: {
    params: { customer },
  },
}: AppStackScreenProps<'CustomerArchive'>) {
  useEffect(() => {}, []);
  const age = getAge(customer.birthday);
  const { requestCustomerArchiveHistory } = useFlowStore();

  const [archives, setArchives] = useState<FlowArchive[]>([]);

  useEffect(() => {
    requestCustomerArchiveHistory(customer.id).then((res) => {
      setArchives(res);
    });
  }, []);

  const [selectFragment, setSelectedFragment] = useState(0);
  return (
    <Box flex={1}>
      <NavigationBar
        onBackIntercept={() => false}
        leftElement={
          <Text color='white' fontWeight={600} fontSize={sp(20, { min: 14 })}>
            客户档案
          </Text>
        }
        rightElement={
          <Text color={'#fff'} fontSize={sp(20)}>
            {dayjs().format('YYYY-MM-DD')}
          </Text>
        }
      />
      <Column
        safeAreaLeft
        bgColor={'#F6F6FA'}
        flex={1}
        p={ss(10)}
        safeAreaBottom>
        <Row
          py={ss(20)}
          px={ss(40)}
          bgColor='white'
          borderRadius={ss(10)}
          justifyContent={'space-between'}
          alignItems={'center'}>
          <Row alignItems={'center'}>
            <Image
              style={{ width: ss(60), height: ss(60) }}
              source={
                customer.gender == 1
                  ? require('~/assets/images/boy.png')
                  : require('~/assets/images/girl.png')
              }
              alt='头像'
            />
            <Text fontSize={sp(24)} ml={ls(26)} color={'#333'}>
              {customer.name}
              {customer.nickname && <Text>({customer.nickname})</Text>}
            </Text>
            <Icon
              ml={ss(10)}
              as={
                <MaterialCommunityIcons
                  name={customer.gender == 1 ? 'gender-male' : 'gender-female'}
                />
              }
              size={sp(26)}
              color={customer.gender == 1 ? '#648B62' : '#F3AF62'}
            />
            <Text ml={ls(16)} fontSize={sp(20)} color={'#666'}>
              {age?.year}岁{age?.month}月
            </Text>

            <Text ml={ls(16)} fontSize={sp(20)} color={'#666'}>
              {customer.phoneNumber}
            </Text>
          </Row>

          <Row>
            <Pressable>
              <Row alignItems={'center'}>
                <Icon
                  as={<AntDesign name='delete' />}
                  size={ss(24)}
                  color={'#99A9BF'}
                />
                <Text fontSize={sp(20)} color={'#000'} ml={ls(4)}>
                  删除
                </Text>
              </Row>
            </Pressable>
            <Pressable ml={ls(40)}>
              <Row alignItems={'center'}>
                <Icon
                  as={<FontAwesome name='edit' />}
                  size={ss(24)}
                  color={'#99A9BF'}
                />
                <Text fontSize={sp(20)} color={'#000'} ml={ls(4)}>
                  编辑
                </Text>
              </Row>
            </Pressable>
          </Row>
        </Row>

        <Box
          mt={ss(10)}
          bgColor='white'
          borderRadius={ss(10)}
          flex={1}
          p={ss(40)}>
          <Container>
            <Row
              borderRadius={ss(4)}
              borderColor={'#99A9BF'}
              borderWidth={1}
              borderStyle={'solid'}>
              {configs.map((item, idx) => {
                return (
                  <Pressable
                    key={item.key}
                    onPress={() => {
                      setSelectedFragment(idx);
                    }}>
                    <Box
                      minW={ss(120)}
                      px={ss(20)}
                      py={ss(10)}
                      bgColor={
                        configs[selectFragment].key == item.key
                          ? '#03CBB2'
                          : '#fff'
                      }
                      borderRightWidth={idx == configs.length - 1 ? 0 : 1}
                      borderRightColor={'#99A9BF'}>
                      <Text
                        fontSize={sp(20)}
                        fontWeight={600}
                        color={
                          configs[selectFragment].key == item.key
                            ? '#fff'
                            : '#333'
                        }>
                        {item.text}
                      </Text>
                    </Box>
                  </Pressable>
                );
              })}
            </Row>
          </Container>

          {configs[selectFragment].key == 'shop-archive' && (
            <ShopArchive archives={archives} />
          )}
          {configs[selectFragment].key == 'history-archive' && (
            <HistoryArchive customerId={customer.id} />
          )}
          {configs[selectFragment].key == 'growth-curve' && (
            <GrowthCurve customerId={customer.id} />
          )}
        </Box>
      </Column>
    </Box>
  );
}
