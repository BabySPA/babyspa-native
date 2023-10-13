import {
  Box,
  Flex,
  Text,
  ScrollView,
  Icon,
  Input,
  Row,
  Pressable,
  Center,
  FlatList,
} from 'native-base';
import { useEffect, useState } from 'react';
import useFlowStore, { DefaultCustomer } from '~/app/stores/flow';
import { ls, sp, ss } from '~/app/utils/style';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import EmptyBox from '~/app/components/empty-box';
import CustomerArchiveItem from '../components/customer-archive-item';
import SelectShop, { useSelectShops } from '~/app/components/select-shop';
import { debounce } from 'lodash';

export default function Archive() {
  const navigation = useNavigation();

  const customers = useFlowStore((state) => state.archiveCustomers.customers);

  const updateCurrentArchiveCustomer = useFlowStore(
    (state) => state.updateCurrentArchiveCustomer,
  );

  const requestArchiveCustomers = useFlowStore(
    (state) => state.requestArchiveCustomers,
  );

  useEffect(() => {
    requestArchiveCustomers();
  }, []);

  const [renderWaiting, setRenderWaiting] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setRenderWaiting(true);
    }, 10);
  }, []);

  return (
    <Flex flex={1}>
      <Filter />
      <Box margin={ss(10)} flex={1}>
        {customers.length == 0 ? (
          <EmptyBox />
        ) : (
          <Row
            flex={1}
            py={ss(40)}
            pl={ss(40)}
            pr={ss(20)}
            pb={0}
            bgColor='white'
            borderRadius={ss(10)}
            minH={'100%'}>
            {renderWaiting && (
              <FlatList
                numColumns={3}
                mb={ss(120)}
                data={customers}
                renderItem={({ item: customer, index: idx }) => {
                  return (
                    <Center w={'33.33%'} key={idx}>
                      <Pressable
                        _pressed={{
                          opacity: 0.8,
                        }}
                        hitSlop={ss(20)}
                        key={idx}
                        pr={ls(20)}
                        onPress={() => {
                          updateCurrentArchiveCustomer(customer);
                          navigation.navigate('CustomerArchive');
                        }}>
                        <CustomerArchiveItem customer={customer} />
                      </Pressable>
                    </Center>
                  );
                }}
              />
            )}
          </Row>
        )}
      </Box>
    </Flex>
  );
}

function Filter() {
  const navigation = useNavigation();

  const customers = useFlowStore((state) => state.archiveCustomers.customers);
  const searchKeywords = useFlowStore(
    (state) => state.archiveCustomers.searchKeywords,
  );

  const updateArchiveCustomersFilter = useFlowStore(
    (state) => state.updateArchiveCustomersFilter,
  );
  const updateCurrentArchiveCustomer = useFlowStore(
    (state) => state.updateCurrentArchiveCustomer,
  );
  const requestArchiveCustomers = useFlowStore(
    (state) => state.requestArchiveCustomers,
  );

  return (
    <Row
      mx={ss(10)}
      mt={ss(10)}
      bgColor='white'
      borderRadius={ss(10)}
      px={ls(40)}
      justifyContent={'space-between'}
      alignItems={'center'}>
      <Row alignItems={'center'} h={ss(75)}>
        <Text color='#000' fontSize={sp(20)} fontWeight={600}>
          当前客户总量：
          <Text color='#5EACA3'>{customers.length}</Text>
        </Text>
        <Input
          borderWidth={ss(1)}
          borderColor={'#D8D8D8'}
          autoCorrect={false}
          ml={ls(20)}
          minW={ls(240, 360)}
          h={ss(44)}
          p={ss(9)}
          borderRadius={ss(4)}
          defaultValue={searchKeywords}
          placeholderTextColor={'#6E6F73'}
          color={'#333333'}
          fontSize={sp(16)}
          onChangeText={debounce((text) => {
            updateArchiveCustomersFilter({
              searchKeywords: text,
            });
            requestArchiveCustomers();
          }, 1000)}
          InputLeftElement={
            <Icon
              as={<MaterialIcons name='search' />}
              size={sp(25)}
              color='#AFB0B4'
              ml={ss(10)}
            />
          }
          placeholder='请输入客户姓名、手机号'
        />
      </Row>
      <Pressable
        _pressed={{
          opacity: 0.6,
        }}
        hitSlop={ss(20)}
        onPress={() => {
          updateCurrentArchiveCustomer(DefaultCustomer);
          navigation.navigate('AddNewCustomer');
        }}>
        <Box
          borderRadius={ss(4)}
          borderWidth={ss(1)}
          borderColor={'#03CBB2'}
          bgColor={'rgba(3, 203, 178, 0.20)'}
          px={ls(13)}
          py={ss(10)}
          _text={{ fontSize: sp(14), color: '#0C1B16' }}>
          新增客户
        </Box>
      </Pressable>
    </Row>
  );
}
