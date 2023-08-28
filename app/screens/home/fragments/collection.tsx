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
import useFlowStore, { DefaultRegisterCustomer } from '~/app/stores/flow';
import { ls, sp, ss } from '~/app/utils/style';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import CustomerItem from '../components/customer-item';
import { CustomerScreenType, CustomerStatus, OperateType } from '~/app/types';
import EmptyBox from '~/app/components/empty-box';
import { debounce } from 'lodash';
import dayjs from 'dayjs';
import DatePickerModal from '~/app/components/date-picker-modal';

export default function Collection() {
  const navigation = useNavigation();
  const {
    requestGetCollectionCustomers,
    updateCurrentRegisterCustomer,
    collection: { customers },
  } = useFlowStore();

  useEffect(() => {
    requestGetCollectionCustomers();
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
                  ml={idx % 2 == 1 ? ss(20) : 0}
                  key={idx}
                  onPress={() => {
                    updateCurrentRegisterCustomer(customer);
                    navigation.navigate('CustomerDetail');
                  }}>
                  <CustomerItem
                    customer={customer}
                    type={OperateType.Collection}
                  />
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
  const navigation = useNavigation();
  const [isOpenDatePicker, setIsOpenDatePicker] = useState<{
    type?: 'start' | 'end';
    isOpen: boolean;
  }>({
    isOpen: false,
  });
  const {
    collection,
    updateCollectionFilter,
    requestGetCollectionCustomers,
    updateCurrentRegisterCustomer,
  } = useFlowStore();

  return (
    <Column mx={ss(10)} mt={ss(10)} bgColor='white' borderRadius={ss(10)}>
      <Row py={ss(20)} px={ls(40)} alignItems={'center'}>
        <Icon
          as={<Ionicons name={'people'} />}
          size={ss(40)}
          color={'#5EACA3'}
        />
        <Text color='#000' fontSize={sp(20)} fontWeight={600} ml={ls(10)}>
          待采集：
          <Text color='#F7BA2A'>
            {collection.statusCount[CustomerStatus.ToBeCollected] || 0}
          </Text>
        </Text>
        <Text color='#000' fontSize={sp(20)} fontWeight={600} ml={ls(10)}>
          已采集：
          <Text color='#5EACA3'>
            {collection.statusCount[CustomerStatus.ToBeAnalyzed] || 0}
          </Text>
        </Text>
        <Input
          ml={ls(30)}
          w={ls(240)}
          minH={ss(40, { max: 18 })}
          p={ss(8)}
          defaultValue={collection.searchKeywords}
          placeholderTextColor={'#6E6F73'}
          color={'#333333'}
          fontSize={ss(16)}
          onChangeText={debounce((text) => {
            updateCollectionFilter({
              searchKeywords: text,
            });
            requestGetCollectionCustomers();
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
            setShowFilter(!showFilter);
          }}>
          <Row alignItems={'center'}>
            <Icon
              as={<FontAwesome name='filter' />}
              size={ss(16)}
              color='#00B49E'
              ml={ls(16)}
            />
            <Text color='#00B49E' fontSize={sp(18)} ml={ls(4)}>
              筛选
            </Text>
          </Row>
        </Pressable>
        <Pressable
          onPress={() => {
            updateCurrentRegisterCustomer(DefaultRegisterCustomer);
            navigation.navigate('RegisterCustomer', {
              type: CustomerScreenType.collection,
            });
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
            快速采集
          </Box>
        </Pressable>
      </Row>
      {showFilter && (
        <Column px={ls(40)} py={ss(20)}>
          <Row alignItems={'center'}>
            <Text color='#666' fontSize={sp(18)}>
              时间选择
            </Text>
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
                {collection.startDate}
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
                {collection.endDate}
              </Text>
            </Pressable>
          </Row>
          <Row alignItems={'center'} mt={ss(20)}>
            <Text color='#666' fontSize={sp(18)}>
              状态选择
            </Text>
            <Row ml={ls(20)}>
              {collection.allStatus?.map((status) => {
                return (
                  <Pressable
                    onPress={() => {
                      updateCollectionFilter({
                        status: status.value,
                      });
                    }}
                    key={status.value}
                    w={ls(90)}
                    h={ss(40)}
                    borderRadius={ss(4)}
                    borderWidth={1}
                    alignItems={'center'}
                    justifyContent={'center'}
                    mr={ls(20)}
                    borderColor={
                      collection.status === status.value ? '#00B49E' : '#D8D8D8'
                    }>
                    <Text
                      color={
                        collection.status === status.value ? '#00B49E' : '#666'
                      }>
                      {status.label}
                    </Text>
                  </Pressable>
                );
              })}
            </Row>
          </Row>
          <Row alignItems={'center'} mt={ss(20)} justifyContent={'flex-end'}>
            <Pressable
              onPress={() => {
                updateCollectionFilter({
                  startDate: dayjs().format('YYYY-MM-DD'),
                  endDate: dayjs().format('YYYY-MM-DD'),
                  status: -1,
                });
              }}
              borderRadius={ss(4)}
              borderWidth={1}
              w={ls(80)}
              h={ss(40)}
              justifyContent={'center'}
              alignItems={'center'}
              borderColor='#D8D8D8'>
              <Text color='#333' fontSize={sp(14)}>
                重置
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                requestGetCollectionCustomers();
              }}
              borderRadius={ss(4)}
              borderWidth={1}
              borderColor='#00B49E'
              w={ls(80)}
              h={ss(40)}
              justifyContent={'center'}
              alignItems={'center'}
              ml={ls(20)}
              bgColor={'rgba(0, 180, 158, 0.10)'}>
              <Text color='#00B49E' fontSize={sp(14)}>
                确定
              </Text>
            </Pressable>
          </Row>
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
                updateCollectionFilter({
                  startDate: date,
                });
              } else {
                updateCollectionFilter({
                  endDate: date,
                });
              }
            }}
            current={
              isOpenDatePicker.type == 'start'
                ? collection.startDate
                : collection.endDate
            }
            selected={
              isOpenDatePicker.type == collection.startDate
                ? collection.startDate
                : collection.endDate
            }
          />
        </Column>
      )}
    </Column>
  );
}
