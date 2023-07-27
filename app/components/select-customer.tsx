import {
  Box,
  Flex,
  Icon,
  Input,
  Row,
  Pressable,
  Text,
  FlatList,
  Column,
} from 'native-base';
import { StyleProp, ViewStyle, Image } from 'react-native';
import BoxTitle from './box-title';
import { ss, ls, sp } from '../utils/style';
import { useEffect, useState } from 'react';
import useFlowStore, { Customer } from '../stores/flow';
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import { getAge } from '../utils';
import dayjs from 'dayjs';

interface SelectCustomerParams {
  style?: StyleProp<ViewStyle>;
}

function CustomerItem({ customer }: { customer: Customer }) {
  const age = getAge(customer.birthday);
  const ageText = `${age?.year}岁${age?.month}月`;
  return (
    <Row
      borderRadius={ss(4)}
      borderWidth={1}
      borderColor={'#15BD8F'}
      w={'100%'}
      mb={ss(30)}
      p={ss(20)}
      justifyContent={'space-between'}
    >
      <Row>
        <Image
          style={{ width: ss(60), height: ss(60) }}
          source={
            customer.gender == 1
              ? require('~/assets/images/boy.png')
              : require('~/assets/images/girl.png')
          }
        />

        <Flex ml={ls(20)}>
          <Row alignItems={'center'}>
            <Text color='#333' fontSize={sp(14)} fontWeight={400}>
              {customer.name}({customer.nickname} {customer.gender})
            </Text>
            <Icon
              as={
                <MaterialCommunityIcons
                  name={customer.gender == 1 ? 'gender-male' : 'gender-female'}
                />
              }
              size={ss(12)}
              ml={ls(16)}
              color={customer.gender == 1 ? '#648B62' : '#F3AF62'}
            />
            <Text
              color={'#99A9BF'}
              fontWeight={400}
              fontSize={sp(12)}
              ml={ls(6)}
            >
              {ageText}
            </Text>
            <Text
              color={'#99A9BF'}
              fontWeight={400}
              fontSize={sp(12)}
              ml={ls(20)}
            >
              {customer.phoneNumber}
            </Text>
          </Row>
          <Row alignItems={'center'} mt={ss(6)}>
            <Icon
              as={<Ionicons name={'ios-time-outline'} />}
              size={ss(12)}
              color={'#C87939'}
            />
            <Text
              color={'#C87939'}
              fontWeight={400}
              fontSize={sp(12)}
              ml={ls(5)}
            >
              {dayjs(customer.updatedAt).format('YYYY-MM-DD HH:mm')}
            </Text>
          </Row>
        </Flex>
      </Row>
    </Row>
  );
}

export default function SelectCustomer(params: SelectCustomerParams) {
  const {
    register: { customers },
    requestRegisterCustomers,
    updateCurrentRegisterCustomer,
  } = useFlowStore();

  useEffect(() => {
    requestRegisterCustomers();
  }, [requestRegisterCustomers]);
  const { style = {} } = params;

  return (
    <Column
      flex={1}
      bgColor={'#fff'}
      style={style}
      p={ss(20)}
      borderRadius={ss(10)}
    >
      <Flex>
        <BoxTitle title='选择客户' />

        <Input
          mt={ss(30)}
          w={'100%'}
          h={ss(50)}
          p={ss(10)}
          placeholderTextColor={'#C0CCDA'}
          color={'#333333'}
          fontSize={ss(16)}
          borderColor={'#C0CCDA'}
          InputLeftElement={
            <Icon
              as={<MaterialIcons name='search' />}
              size={ss(25)}
              color='#C0CCDA'
              ml={ss(10)}
            />
          }
          placeholder='姓名、手机号'
        />

        <Box mt={ss(30)}>
          <FlatList
            data={customers}
            maxH={ss(520)}
            renderItem={({ item }) => {
              return (
                <Pressable
                  onPress={() => {
                    updateCurrentRegisterCustomer({
                      name: item.name,
                      nickname: item.birthday,
                      gender: item.gender,
                      birthday: item.birthday,
                      phoneNumber: item.phoneNumber,
                      allergy: item.allergy,
                      operator: item.operator,
                    });
                  }}
                >
                  <CustomerItem customer={item} />
                </Pressable>
              );
            }}
            keyExtractor={(item) => item.id}
          />
        </Box>
      </Flex>
    </Column>
  );
}
