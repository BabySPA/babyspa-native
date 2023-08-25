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
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { CustomerScreenType } from '~/app/types';
import EmptyBox from '~/app/components/empty-box';
import CustomerArchiveItem from '../components/customer-archive-item';

export default function Archive() {
  const navigation = useNavigation();
  const {
    requestCustomersArchive,
    customersArchive: { customers },
  } = useFlowStore();

  useEffect(() => {
    requestCustomersArchive();
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
            {customers.map((customer, idx) => (
              <Pressable
                mr={(idx + 1) % 3 == 0 ? 0 : ss(15)}
                key={idx}
                onPress={() => {
                  navigation.navigate('CustomerArchive', {
                    customer: customer,
                  });
                }}>
                <CustomerArchiveItem customer={customer} />
              </Pressable>
            ))}
          </Row>
        )}
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
        <Input
          autoCorrect={false}
          w={ls(240)}
          minH={ss(40, { max: 18 })}
          p={ss(8)}
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
          autoCorrect={false}
          ml={ls(20)}
          w={ls(160)}
          minH={ss(40, { max: 18 })}
          p={ss(8)}
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
          autoCorrect={false}
          w={ls(160)}
          minH={ss(40, { max: 18 })}
          p={ss(8)}
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
        {/* <Pressable
          onPress={() => {
            navigation.navigate('AddNewCustomer');
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
            新增客户
          </Box>
        </Pressable> */}
      </Row>
    </Column>
  );
}
