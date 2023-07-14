import {
  Box,
  Flex,
  Text,
  ScrollView,
  Icon,
  Input,
  Row,
  Column,
} from 'native-base';
import { Image, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import useFlowStore, { Customer, CustomerStatus } from '~/app/stores/flow';
import { ls, sp, ss } from '~/app/utils/style';
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import { getAge } from '~/app/utils';
import dayjs from 'dayjs';
import { useNavigation } from '@react-navigation/native';

export default function Register() {
  const {
    getRegisterCustomers,
    register: { customers },
  } = useFlowStore();
  useEffect(() => {
    getRegisterCustomers();
  }, []);
  return (
    <Flex flex={1}>
      <Filter />
      <ScrollView margin={ss(10)}>
        <Row
          flex={1}
          bgColor='white'
          borderRadius={ss(10)}
          justifyContent={'space-between'}
          flexWrap={'wrap'}
          p={ss(40)}>
          {customers.map((customer) => (
            <CustomerItem customer={customer} key={customer.id} />
          ))}
        </Row>
      </ScrollView>
    </Flex>
  );
}

const StatusTextConfig = {
  [CustomerStatus.ToBeConfirmed]: {
    text: '待确认',
    textColor: '#FFC700',
    bgColor: 'rgba(255, 199, 0, 0.2)',
  },
  [CustomerStatus.ToBeCollected]: {
    text: '待采集',
    textColor: '#FE9505',
    bgColor: 'rgba(254, 149, 5, 0.2)',
  },
  [CustomerStatus.ToBeAnalyzed]: {
    text: '待分析',
    textColor: '#2AA1F7',
    bgColor: 'rgba(42, 161, 247, 0.2)',
  },
  [CustomerStatus.Completed]: {
    text: '已完成',
    textColor: '#00B49E',
    bgColor: 'rgba(0, 180, 158, 0.2)',
  },
  [CustomerStatus.Canceled]: {
    text: '已取消',
    textColor: '#FB6459',
    bgColor: 'rgba(251, 100, 89, 0.2)',
  },
};

function CustomerItem({ customer }: { customer: Customer }) {
  const age = getAge(customer.birthday);
  const ageText = `${age?.year}岁${age?.month}月`;
  return (
    <Row
      borderRadius={ss(8)}
      borderStyle={'dashed'}
      borderWidth={1}
      borderColor={'#15BD8F'}
      w={ls(467)}
      h={ss(148)}
      mb={ss(40)}
      justifyContent={'space-between'}>
      <Row pt={ss(20)} pl={ls(30)}>
        <Column justifyContent={'center'}>
          <Image
            style={{ width: ss(60), height: ss(60) }}
            source={
              customer.gender == 1
                ? require('~/assets/images/boy.png')
                : require('~/assets/images/girl.png')
            }
          />
          <Text color='#F7BA2A' fontSize={sp(24)}>
            {customer.tag}
          </Text>
        </Column>

        <Flex ml={ls(20)}>
          <Row alignItems={'center'}>
            <Text color='#333' fontSize={sp(20)} fontWeight={400}>
              {customer.name}({customer.nickname} {customer.gender})
            </Text>
            <Icon
              as={
                <MaterialCommunityIcons
                  name={customer.gender == 1 ? 'gender-male' : 'gender-female'}
                />
              }
              size={ss(26)}
              color={customer.gender == 1 ? '#648B62' : '#F3AF62'}
            />
            <Text
              color={'#99A9BF'}
              fontWeight={400}
              fontSize={sp(18)}
              ml={ls(3)}>
              {ageText}
            </Text>
          </Row>
          <Text mt={ss(10)} color={'#666'} fontSize={sp(18)}>
            理疗师：{customer.operator.name}
          </Text>
          <Row alignItems={'center'} mt={ss(10)}>
            <Icon
              as={<Ionicons name={'ios-time-outline'} />}
              size={ss(17)}
              color={'#C87939'}
            />
            <Text
              color={'#C87939'}
              fontWeight={400}
              fontSize={sp(18)}
              ml={ls(10)}>
              {dayjs(customer.updatedAt).format('YYYY-MM-DD HH:mm')}
            </Text>
          </Row>
        </Flex>
      </Row>
      <Flex justifyContent={'space-between'} alignItems={'flex-end'}>
        <Box
          bgColor={StatusTextConfig[customer.status].bgColor}
          px={ls(12)}
          py={ss(6)}
          _text={{
            fontSize: sp(16),
            color: StatusTextConfig[customer.status].textColor,
          }}
          borderBottomLeftRadius={ss(8)}
          borderTopRightRadius={ss(8)}>
          {StatusTextConfig[customer.status].text}
        </Box>
        {customer.status == CustomerStatus.ToBeAnalyzed && (
          <Pressable>
            <Box
              m={ss(10)}
              borderRadius={ss(6)}
              px={ls(20)}
              bg={{
                linearGradient: {
                  colors: ['#22D59C', '#1AB7BE'],
                  start: [0, 0],
                  end: [1, 1],
                },
              }}>
              <Text color='white' fontSize={sp(16)}>
                分析
              </Text>
            </Box>
          </Pressable>
        )}
      </Flex>
    </Row>
  );
}

function Filter() {
  const [showFilter, setShowFilter] = useState(false);
  const navigation = useNavigation();
  return (
    <Column mx={ss(10)} mt={ss(10)} bgColor='white' borderRadius={ss(10)}>
      <Row py={ss(20)} px={ls(40)} alignItems={'center'}>
        <Icon
          as={<Ionicons name={'people'} />}
          size={ss(40)}
          color={'#5EACA3'}
        />
        <Text color='#000' fontSize={sp(20)} fontWeight={600} ml={ls(10)}>
          已登记：<Text color='#5EACA3'>7</Text>
        </Text>
        <Input
          ml={ls(30)}
          w={ls(240)}
          h={ss(40)}
          p={ss(10)}
          placeholderTextColor={'#6E6F73'}
          color={'#333333'}
          fontSize={ss(16)}
          InputLeftElement={
            <Icon
              as={<MaterialIcons name='search' />}
              size={ss(25)}
              color='#AFB0B4'
              ml={ss(10)}
            />
          }
          placeholder='请输入客户姓名、手机号'
        />
        <Input
          ml={ls(20)}
          w={ls(160)}
          h={ss(40)}
          p={ss(10)}
          placeholderTextColor={'#AFB0B4'}
          color={'#333333'}
          fontSize={ss(18)}
          InputLeftElement={
            <Icon
              as={<MaterialIcons name='date-range' />}
              size={ss(25)}
              color='#AFB0B4'
              ml={ss(10)}
            />
          }
          value='2023-02-21'
          isReadOnly
        />
        <Text mx={ls(10)} color='#333' fontSize={sp(16)}>
          至
        </Text>
        <Input
          ml={ls(20)}
          w={ls(160)}
          h={ss(40)}
          p={ss(10)}
          placeholderTextColor={'#AFB0B4'}
          color={'#333333'}
          fontSize={ss(18)}
          InputLeftElement={
            <Icon
              as={<MaterialIcons name='date-range' />}
              size={ss(25)}
              color='#AFB0B4'
              ml={ss(10)}
            />
          }
          value='2023-02-21'
          isReadOnly
        />
        <Pressable
          onPress={() => {
            setShowFilter(!showFilter);
          }}>
          <Row alignItems={'center'}>
            <Icon
              as={<FontAwesome name='filter' />}
              size={ss(16)}
              color='#00B49E'
              ml={ss(10)}
            />
            <Text color='#00B49E' fontSize={sp(18)} ml={ls(4)}>
              筛选
            </Text>
          </Row>
        </Pressable>
        <Pressable
          onPress={() => {
            navigation.navigate('Register');
          }}>
          <Box
            ml={ls(20)}
            bg={{
              linearGradient: {
                colors: ['#22D59C', '#1AB7BE'],
                start: [0, 0],
                end: [1, 1],
              },
            }}
            px={ls(26)}
            py={ss(10)}
            _text={{ fontSize: ss(14), color: 'white' }}>
            登记
          </Box>
        </Pressable>
      </Row>
      {showFilter && (
        <Row pl={ls(40)}>
          <Text fontSize={sp(18)} color='#666'>
            状态选择
          </Text>
          <Text>TODO 筛选</Text>
        </Row>
      )}
    </Column>
  );
}
