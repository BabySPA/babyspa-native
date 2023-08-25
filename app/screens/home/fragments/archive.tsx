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
import SelectShop from '~/app/components/select-shop';
import useAuthStore from '~/app/stores/auth';
import debounce from 'lodash/debounce';
import DatePickerModal from '~/app/components/date-picker-modal';

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
  const navigation = useNavigation();
  const {
    customersArchive,
    updateCustomersArchiveFilter,
    requestCustomersArchive,
  } = useFlowStore();

  const [isOpenDatePicker, setIsOpenDatePicker] = useState<{
    type?: 'start' | 'end';
    isOpen: boolean;
  }>({
    isOpen: false,
  });

  return (
    <Column mx={ss(10)} mt={ss(10)} bgColor='white' borderRadius={ss(10)}>
      <Row py={ss(20)} px={ls(40)} alignItems={'center'}>
        <SelectShop
          onSelect={function (selectedItem: any, index: number): void {
            updateCustomersArchiveFilter({
              shopId: selectedItem._id,
            });
            requestCustomersArchive();
          }}
          buttonHeight={ss(40)}
          buttonWidth={ls(160)}
        />
        <Input
          autoCorrect={false}
          w={ls(240)}
          ml={ls(20)}
          minH={ss(40, { max: 18 })}
          p={ss(8)}
          placeholderTextColor={'#6E6F73'}
          color={'#333333'}
          fontSize={ss(16)}
          onChangeText={debounce((text) => {
            updateCustomersArchiveFilter({
              searchKeywords: text,
            });
            requestCustomersArchive();
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
          borderRadius={ss(4)}
          borderColor={'#D8D8D8'}
          borderWidth={1}>
          <Icon
            as={<MaterialIcons name='date-range' />}
            size={ss(20)}
            color='rgba(0,0,0,0.2)'
          />
          <Text color={'#333333'} fontSize={ss(18)} ml={ls(8)}>
            {customersArchive.startDate}
          </Text>
        </Pressable>
        <Text mx={ls(10)} color='#333' fontSize={sp(16)}>
          至
        </Text>
        <Pressable
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
          borderRadius={ss(4)}
          borderColor={'#D8D8D8'}
          borderWidth={1}>
          <Icon
            as={<MaterialIcons name='date-range' />}
            size={ss(20)}
            color='rgba(0,0,0,0.2)'
          />
          <Text color={'#333333'} fontSize={ss(18)} ml={ls(8)}>
            {customersArchive.endDate}
          </Text>
        </Pressable>
        <Pressable
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
              updateCustomersArchiveFilter({
                startDate: date,
              });
              requestCustomersArchive();
            } else {
              updateCustomersArchiveFilter({
                endDate: date,
              });
              requestCustomersArchive();
            }
          }}
          current={
            isOpenDatePicker.type == 'start'
              ? customersArchive.startDate
              : customersArchive.endDate
          }
          selected={
            isOpenDatePicker.type == customersArchive.startDate
              ? customersArchive.startDate
              : customersArchive.endDate
          }
        />
      </Row>
    </Column>
  );
}
