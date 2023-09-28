import {
  Box,
  Flex,
  ScrollView,
  Icon,
  Input,
  Row,
  Pressable,
  Center,
} from 'native-base';
import { useEffect, useState } from 'react';
import useFlowStore, { DefaultCustomer, DefaultFlow } from '~/app/stores/flow';
import { ls, sp, ss } from '~/app/utils/style';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import EmptyBox from '~/app/components/empty-box';
import CustomerArchiveItem from '../components/customer-archive-item';
import SelectShop, { useSelectShops } from '~/app/components/select-shop';
import { debounce } from 'lodash';
import DatePickerModal from '~/app/components/date-picker-modal';

export default function Archive() {
  const navigation = useNavigation();
  const {
    archiveCustomers: { customers },
    updateCurrentArchiveCustomer,
  } = useFlowStore();

  return (
    <Flex flex={1}>
      <Filter />
      <ScrollView margin={ss(10)}>
        {customers.length == 0 ? (
          <EmptyBox />
        ) : (
          <Row
            flex={1}
            p={ss(40)}
            bgColor='white'
            borderRadius={ss(10)}
            minH={'100%'}>
            <Row flexWrap={'wrap'} alignItems={'flex-start'} w={'100%'}>
              {customers.map((customer, idx) => (
                <Center key={idx}>
                  <Pressable
                    _pressed={{
                      opacity: 0.8,
                    }}
                    mb={ss(20)}
                    ml={ss(20)}
                    hitSlop={ss(20)}
                    key={idx}
                    onPress={() => {
                      updateCurrentArchiveCustomer(customer);
                      navigation.navigate('CustomerArchive');
                    }}>
                    <CustomerArchiveItem customer={customer} />
                  </Pressable>
                </Center>
              ))}
            </Row>
          </Row>
        )}
      </ScrollView>
    </Flex>
  );
}

function Filter() {
  const navigation = useNavigation();
  const {
    archiveCustomers,
    updateArchiveCustomersFilter,
    updateCurrentArchiveCustomer,
    requestArchiveCustomers,
  } = useFlowStore();

  const [isOpenDatePicker, setIsOpenDatePicker] = useState<{
    type?: 'start' | 'end';
    isOpen: boolean;
  }>({
    type: 'start',
    isOpen: false,
  });

  const [defaultSelectShop, selectShops] = useSelectShops(true);

  useEffect(() => {
    if (defaultSelectShop) {
      updateArchiveCustomersFilter({
        shopId: defaultSelectShop._id,
      });
      console.log('requestArchiveCustomers', archiveCustomers);
      requestArchiveCustomers();
    }
  }, [defaultSelectShop]);
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
        <SelectShop
          onSelect={function (selectedItem: any, index: number): void {
            updateArchiveCustomersFilter({
              shopId: selectedItem._id,
            });
            requestArchiveCustomers();
          }}
          buttonHeight={ss(44)}
          buttonWidth={ls(140, 210)}
          shops={selectShops}
          defaultButtonText={defaultSelectShop?.name}
        />
        <Input
          borderWidth={ss(1)}
          borderColor={'#D8D8D8'}
          autoCorrect={false}
          minW={ls(240, 360)}
          ml={ls(20)}
          h={ss(44)}
          p={ss(9)}
          borderRadius={ss(4)}
          placeholderTextColor={'#6E6F73'}
          color={'#333333'}
          fontSize={sp(16)}
          defaultValue={archiveCustomers.searchKeywords}
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
        <DatePickerModal
          isOpen={isOpenDatePicker.isOpen}
          onClose={() => {
            setIsOpenDatePicker({
              isOpen: false,
            });
          }}
          onSelectedChange={(date: string) => {
            if (!isOpenDatePicker.type) return;
            if (isOpenDatePicker.type == 'start') {
              updateArchiveCustomersFilter({
                startDate: date,
              });
              requestArchiveCustomers();
            } else {
              updateArchiveCustomersFilter({
                endDate: date,
              });
              requestArchiveCustomers();
            }
          }}
          current={
            isOpenDatePicker.type == 'start'
              ? archiveCustomers.startDate
              : archiveCustomers.endDate
          }
          selected={
            isOpenDatePicker.type == 'start'
              ? archiveCustomers.startDate
              : archiveCustomers.endDate
          }
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
