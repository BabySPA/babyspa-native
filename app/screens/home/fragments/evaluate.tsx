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
  Switch,
} from 'native-base';
import { useEffect, useState } from 'react';
import useFlowStore from '~/app/stores/flow';
import { ls, sp, ss } from '~/app/utils/style';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import CustomerItem from '../components/customer-item';
import { CustomerStatus, OperateType } from '~/app/types';
import EmptyBox from '~/app/components/empty-box';

export default function Evaluate() {
  const navigation = useNavigation();
  const {
    requestEvaluateCustomers,
    updateCurrentFlowCustomer,
    evaluate: { customers },
  } = useFlowStore();

  useEffect(() => {
    requestEvaluateCustomers();
  }, []);

  return (
    <Flex flex={1}>
      <Filter />
      <ScrollView margin={ss(10)}>
        {customers.length == 0 ? (
          <EmptyBox />
        ) : (
          <Row
            flex={1}
            bgColor='white'
            borderRadius={ss(10)}
            flexWrap={'wrap'}
            p={ss(40)}>
            {customers.map((customer, idx) => {
              return (
                <Pressable
                  key={customer.id}
                  onPress={() => {
                    if (customer.status === CustomerStatus.Completed) {
                      updateCurrentFlowCustomer(customer);
                      navigation.navigate('FlowInfo', {
                        from: 'evaluate-detail',
                      });
                    }
                  }}>
                  <Box ml={idx % 2 == 1 ? ss(20) : 0}>
                    <CustomerItem
                      customer={customer}
                      type={OperateType.Evaluate}
                    />
                  </Box>
                </Pressable>
              );
            })}
          </Row>
        )}
      </ScrollView>
    </Flex>
  );
}

function Filter() {
  const [showFilter, setShowFilter] = useState(false);
  return (
    <Column mx={ss(10)} mt={ss(10)} bgColor='white' borderRadius={ss(10)}>
      <Row
        py={ss(20)}
        px={ls(40)}
        alignItems={'center'}
        justifyContent={'space-between'}>
        <Row alignItems={'center'}>
          <Icon
            as={<Ionicons name={'people'} />}
            size={ss(40)}
            color={'#5EACA3'}
          />
          <Text color='#000' fontSize={sp(20)} fontWeight={600} ml={ls(10)}>
            待评价：<Text color='#F7BA2A'>7</Text>
          </Text>
          <Text color='#000' fontSize={sp(20)} fontWeight={600} ml={ls(10)}>
            已评价：<Text color='#5EACA3'>1</Text>
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
        </Row>
        <Row alignItems={'center'}>
          <Text color='#000' fontSize={sp(16, { min: 12 })}>
            接收通知：
            <Switch
              onChange={() => {
                console.log('接收通知');
              }}
            />
          </Text>
        </Row>
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
