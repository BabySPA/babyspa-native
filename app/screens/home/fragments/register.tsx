import {
  Box,
  Flex,
  Text,
  ScrollView,
  Icon,
  Input,
  Row,
  Column,
  Pressable,
} from 'native-base';
import { useEffect, useState } from 'react';
import useFlowStore from '~/app/stores/flow';
import { ls, sp, ss } from '~/app/utils/style';
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import CustomerItem from '../components/customer-item';

export default function Register() {
  const {
    requestRegisterCustomers,
    register: { customers },
  } = useFlowStore();
  useEffect(() => {
    requestRegisterCustomers();
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
