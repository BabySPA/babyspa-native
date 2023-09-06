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
            bgColor='white'
            borderRadius={ss(10)}
            flexWrap={'wrap'}
            p={ss(20)}>
            {customers.map((customer, idx) => (
              <Pressable
                hitSlop={ss(10)}
                ml={idx % 3 == 0 ? 0 : ss(10)}
                key={idx}
                onPress={() => {
                  updateCurrentArchiveCustomer(customer);
                  navigation.navigate('CustomerArchive');
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
    <Column mx={ss(10)} mt={ss(10)} bgColor='white' borderRadius={ss(10)}>
      <Row py={ss(20)} px={ls(40)} alignItems={'center'}>
        <SelectShop
          onSelect={function (selectedItem: any, index: number): void {
            updateArchiveCustomersFilter({
              shopId: selectedItem._id,
            });
            requestArchiveCustomers();
          }}
          buttonHeight={ss(40)}
          buttonWidth={ls(140)}
          shops={selectShops}
          defaultButtonText={defaultSelectShop?.name}
        />
        <Input
          autoCorrect={false}
          w={ls(240)}
          ml={ls(20)}
          minH={ss(40, { max: 18 })}
          p={ss(8)}
          borderRadius={4}
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
          hitSlop={ss(10)}
          onPress={() => {
            setIsOpenDatePicker({
              isOpen: true,
              type: 'start',
            });
          }}
          flexDirection={'row'}
          ml={ls(20)}
          minH={ss(40, { max: 18 })}
          alignItems={'center'}
          py={ss(8)}
          pl={ls(12)}
          pr={ls(25)}
          borderRadius={4}
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
          hitSlop={ss(10)}
          onPress={() => {
            setIsOpenDatePicker({
              isOpen: true,
              type: 'end',
            });
          }}
          flexDirection={'row'}
          minH={ss(40, { max: 18 })}
          py={ss(8)}
          pl={ls(12)}
          pr={ls(25)}
          alignItems={'center'}
          borderRadius={4}
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
        <Pressable
          hitSlop={ss(10)}
          onPress={() => {
            updateCurrentArchiveCustomer(DefaultCustomer);
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
    </Column>
  );
}
