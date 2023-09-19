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
            py={ss(40)}
            pl={ss(40)}
            pr={ss(20)}
            pb={0}
            bgColor='white'
            borderRadius={ss(10)}
            minH={'100%'}>
            <Row flexWrap={'wrap'} alignItems={'flex-start'} w={'100%'}>
              {customers.map((customer, idx) => (
                <Center w={'33.33%'} key={idx}>
                  <Pressable
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
    isOpen: false,
  });

  const [defaultSelectShop, selectShops] = useSelectShops(true);

  useEffect(() => {
    if (defaultSelectShop) {
      updateArchiveCustomersFilter({
        shopId: defaultSelectShop._id,
      });
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
      <Row py={ss(20)} alignItems={'center'}>
        <SelectShop
          onSelect={function (selectedItem: any, index: number): void {
            updateArchiveCustomersFilter({
              shopId: selectedItem._id,
            });
            requestArchiveCustomers();
          }}
          buttonHeight={ss(44)}
          buttonWidth={ls(140)}
          shops={selectShops}
          defaultButtonText={defaultSelectShop?.name}
        />
        <Input
          autoCorrect={false}
          w={ls(240)}
          ml={ls(20)}
          h={ss(44)}
          p={ss(8)}
          borderRadius={ss(4)}
          placeholderTextColor={'#6E6F73'}
          color={'#333333'}
          fontSize={ss(16)}
          onChangeText={debounce((text) => {
            updateArchiveCustomersFilter({
              searchKeywords: text,
            });
            requestArchiveCustomers();
          }, 1000)}
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
          hitSlop={ss(20)}
          onPress={() => {
            setIsOpenDatePicker({
              isOpen: true,
              type: 'start',
            });
          }}
          flexDirection={'row'}
          ml={ls(20)}
          h={ss(44)}
          alignItems={'center'}
          pl={ls(12)}
          pr={ls(25)}
          borderRadius={ss(4)}
          borderColor={'#D8D8D8'}
          borderWidth={1}>
          <Icon
            as={<MaterialIcons name='date-range' />}
            size={ss(20)}
            color='rgba(0,0,0,0.2)'
          />
          <Text color={'#333333'} fontSize={ss(18)} ml={ls(8)}>
            {archiveCustomers.startDate}
          </Text>
        </Pressable>
        <Text mx={ls(10)} color='#333' fontSize={sp(16)}>
          至
        </Text>
        <Pressable
          hitSlop={ss(20)}
          onPress={() => {
            setIsOpenDatePicker({
              isOpen: true,
              type: 'end',
            });
          }}
          flexDirection={'row'}
          h={ss(44)}
          pl={ls(12)}
          pr={ls(25)}
          alignItems={'center'}
          borderRadius={ss(4)}
          borderColor={'#D8D8D8'}
          borderWidth={1}>
          <Icon
            as={<MaterialIcons name='date-range' />}
            size={ss(20)}
            color='rgba(0,0,0,0.2)'
          />
          <Text color={'#333333'} fontSize={ss(18)} ml={ls(8)}>
            {archiveCustomers.endDate}
          </Text>
        </Pressable>

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
            isOpenDatePicker.type == archiveCustomers.startDate
              ? archiveCustomers.startDate
              : archiveCustomers.endDate
          }
        />
      </Row>
      <Pressable
        hitSlop={ss(20)}
        onPress={() => {
          updateCurrentArchiveCustomer(DefaultCustomer);
          navigation.navigate('AddNewCustomer');
        }}>
        <Box
          borderRadius={ss(4)}
          borderWidth={1}
          borderColor={'#03CBB2'}
          bgColor={'rgba(3, 203, 178, 0.20)'}
          px={ls(13)}
          py={ss(10)}
          _text={{ fontSize: ss(14), color: '#0C1B16' }}>
          新增客户
        </Box>
      </Pressable>
    </Row>
  );
}
