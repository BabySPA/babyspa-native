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
import { memo, useEffect, useState } from 'react';
import useFlowStore from '../stores/flow';
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import { getAge } from '../utils';
import dayjs from 'dayjs';
import { Customer } from '../stores/flow/type';
import { debounce } from 'lodash';

interface SelectCustomerParams {
  style?: StyleProp<ViewStyle>;
}

const SelectCustomerItem = memo(({ customer }: { customer: Customer }) => {
  const age = getAge(customer.birthday);
  const ageText = `${age?.year}岁${age?.month}月`;

  return (
    <Row
      borderRadius={ss(4)}
      borderWidth={ss(1)}
      borderColor={'#15BD8F'}
      w={'100%'}
      mb={ss(30)}
      p={ss(20)}
      justifyContent={'space-between'}>
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
            <Text
              color='#333'
              fontSize={sp(14)}
              fontWeight={400}
              maxW={ls(140)}
              numberOfLines={1}
              ellipsizeMode='tail'>
              {customer.name}
              {customer.nickname && <Text>({customer.nickname})</Text>}
            </Text>
            <Icon
              as={
                <MaterialCommunityIcons
                  name={customer.gender == 1 ? 'gender-male' : 'gender-female'}
                />
              }
              size={sp(12)}
              ml={ls(16)}
              color={customer.gender == 1 ? '#648B62' : '#F3AF62'}
            />
            <Text
              color={'#99A9BF'}
              fontWeight={400}
              fontSize={sp(12)}
              ml={ls(6)}>
              {ageText}
            </Text>
            <Text
              color={'#99A9BF'}
              fontWeight={400}
              fontSize={sp(12)}
              ml={ls(20)}>
              {customer.phoneNumber}
            </Text>
          </Row>
          <Row alignItems={'center'} mt={ss(6)}>
            <Icon
              as={<Ionicons name={'ios-time-outline'} />}
              size={sp(14)}
              color={'#F7BA2A'}
              mt={0.5}
            />
            <Text color={'#F7BA2A'} fontWeight={400} fontSize={sp(12)}>
              {dayjs(customer.updatedAt).format('YYYY-MM-DD HH:mm')}
            </Text>
          </Row>
        </Flex>
      </Row>
    </Row>
  );
});

function SelectCustomer(params: SelectCustomerParams) {
  const requestAllCustomers = useFlowStore(
    (state) => state.requestAllCustomers,
  );
  const allCustomers = useFlowStore((state) => state.allCustomers);
  const updateCurrentFlow = useFlowStore((state) => state.updateCurrentFlow);
  const currentFlowCustomerId = useFlowStore(
    (state) => state.currentFlow.customer._id,
  );

  useEffect(() => {
    requestAllCustomers('');
  }, []);

  const [renderWaiting, setRenderWaiting] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setRenderWaiting(true);
    }, 100);
  }, []);
  const { style = {} } = params;

  const PureFlatList = memo(
    () => {
      return (
        <FlatList
          data={allCustomers}
          renderItem={({ item, index }) => {
            return (
              <Pressable
                _pressed={{
                  opacity: 0.6,
                }}
                hitSlop={ss(20)}
                onPress={() => {
                  updateCurrentFlow({
                    customer: item,
                  });
                }}>
                <SelectCustomerItem customer={item} />
                {currentFlowCustomerId === item._id && (
                  <Image
                    style={{
                      position: 'absolute',
                      bottom: ss(31),
                      right: 0,
                      width: ss(20),
                      height: ss(20),
                    }}
                    source={require('~/assets/images/border-select.png')}
                  />
                )}
              </Pressable>
            );
          }}
          keyExtractor={(item) => item._id}
        />
      );
    },
    () => true,
  );

  return (
    <Column
      flex={1}
      bgColor={'#fff'}
      style={style}
      py={ss(20)}
      borderRadius={ss(10)}>
      <Box mx={ls(20)}>
        <BoxTitle title='选择客户' />
      </Box>

      <Flex mx={ls(40)}>
        <Input
          autoCorrect={false}
          mt={ss(20)}
          w={'100%'}
          h={ss(50)}
          p={ss(10)}
          placeholderTextColor={'#C0CCDA'}
          color={'#333333'}
          fontSize={sp(16)}
          borderWidth={ss(1)}
          borderColor={'#D8D8D8'}
          InputLeftElement={
            <Icon
              as={<MaterialIcons name='search' />}
              size={sp(25)}
              color='#C0CCDA'
              ml={ss(10)}
            />
          }
          placeholder='姓名、手机号'
          onChangeText={debounce((text) => {
            requestAllCustomers(text);
          }, 1000)}
        />

        <Box mt={ss(30)}>{renderWaiting && <PureFlatList />}</Box>
      </Flex>
    </Column>
  );
}

export default memo(SelectCustomer);
