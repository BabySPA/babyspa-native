import {
  Box,
  Flex,
  Text,
  Icon,
  Input,
  Row,
  Pressable,
  Center,
  FlatList,
  Spinner,
} from 'native-base';
import {
  PureComponent,
  ReactNode,
  memo,
  useEffect,
  useRef,
  useState,
} from 'react';
import useFlowStore, { DefaultCustomer } from '~/app/stores/flow';
import { ls, sp, ss } from '~/app/utils/style';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import EmptyBox from '~/app/components/empty-box';
import CustomerArchiveItem from '../components/customer-archive-item';
import { debounce, set } from 'lodash';
import { View } from 'react-native';
import SelectShop, { useSelectShops } from '~/app/components/select-shop';
import { ShopType } from '~/app/stores/manager/type';

function Archive() {
  const navigation = useNavigation();

  const customers = useFlowStore((state) => state.archiveCustomers.customers);
  const resetArchiveCustomers = useFlowStore(
    (state) => state.resetArchiveCustomers,
  );
  const totalPages = useFlowStore((state) => state.archiveCustomers.totalPages);

  const requestPage = useRef(1);

  const updateCurrentArchiveCustomer = useFlowStore(
    (state) => state.updateCurrentArchiveCustomer,
  );

  const requestArchiveCustomers = useFlowStore(
    (state) => state.requestArchiveCustomers,
  );
  const [defaultSelectShop, selectShops] = useSelectShops(false);
  const updateArchiveCustomersFilter = useFlowStore(
    (state) => state.updateArchiveCustomersFilter,
  );
  useEffect(() => {
    if (defaultSelectShop) {
      updateArchiveCustomersFilter({
        shopId:
          defaultSelectShop.type === ShopType.CENTER
            ? ''
            : defaultSelectShop._id,
      });
      refresh();
    }

    return () => {
      resetArchiveCustomers();
    };
  }, [defaultSelectShop]);

  const refresh = async () => {
    requestPage.current = 1;
    setRefreshing(true);
    await requestArchiveCustomers(requestPage.current);
    setRefreshing(false);
  };

  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(true);

  return (
    <View style={{ flex: 1 }}>
      <Filter
        onRequest={() => {
          refresh();
        }}
      />
      <Box margin={ss(10)} flex={1}>
        <Row
          flex={1}
          py={ss(40)}
          pl={ss(40)}
          pr={ss(20)}
          pb={0}
          bgColor='white'
          borderRadius={ss(10)}
          minH={'100%'}>
          <FlatList
            nestedScrollEnabled
            onEndReachedThreshold={0}
            onEndReached={async () => {
              if (customers.length > 0) {
                requestPage.current = requestPage.current + 1;
                if (requestPage.current <= totalPages) {
                  await requestArchiveCustomers(requestPage.current);
                } else {
                  setLoadingMore(false);
                }
              }
            }}
            refreshing={refreshing}
            onRefresh={() => {
              refresh();
            }}
            initialNumToRender={15}
            numColumns={3}
            mb={ss(120)}
            data={customers}
            ListEmptyComponent={<EmptyBox />}
            keyExtractor={(item) => item._id}
            renderItem={({ item: customer }) => {
              return (
                <ArchiveItem
                  onPress={() => {
                    updateCurrentArchiveCustomer(customer);
                    navigation.navigate('CustomerArchive', {
                      defaultSelect: 0,
                    });
                  }}
                  customer={customer}
                />
              );
            }}
            ListFooterComponent={
              loadingMore ? (
                <Spinner size={sp(20)} mr={ls(5)} color={'emerald.500'} />
              ) : null
            }
          />
        </Row>
      </Box>
    </View>
  );
}

export default memo(Archive);

class ArchiveItem extends PureComponent<{
  onPress: any;
  customer: any;
}> {
  render(): ReactNode {
    const { onPress, customer } = this.props;
    return (
      <Pressable
        _pressed={{
          opacity: 0.8,
        }}
        hitSlop={ss(20)}
        pr={ls(20)}
        onPress={() => {
          onPress();
        }}>
        <CustomerArchiveItem customer={customer} />
      </Pressable>
    );
  }
}

function Filter({ onRequest }: { onRequest: () => void }) {
  const navigation = useNavigation();

  const total = useFlowStore((state) => state.archiveCustomers.total);

  const searchKeywords = useFlowStore(
    (state) => state.archiveCustomers.searchKeywords,
  );

  const updateArchiveCustomersFilter = useFlowStore(
    (state) => state.updateArchiveCustomersFilter,
  );
  const updateCurrentArchiveCustomer = useFlowStore(
    (state) => state.updateCurrentArchiveCustomer,
  );
  const [defaultSelectShop, selectShops] = useSelectShops(false);

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
        <Text color='#000' fontSize={sp(20)} fontWeight={600} mr={ls(20)}>
          当前客户总量：
          <Text color='#5EACA3'>{total}</Text>
        </Text>
        <SelectShop
          onSelect={function (selectedItem: any, index: number): void {
            updateArchiveCustomersFilter({
              shopId:
                selectedItem.type === ShopType.CENTER ? '' : selectedItem._id,
            });
            onRequest();
          }}
          buttonHeight={ss(44)}
          buttonWidth={ls(180, 210)}
          shops={selectShops}
          defaultButtonText={defaultSelectShop?.name}
        />
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
            onRequest();
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
