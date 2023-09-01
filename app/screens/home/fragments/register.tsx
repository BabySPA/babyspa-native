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
import { CustomerScreenType, FlowStatus, OperateType } from '~/app/types';
import EmptyBox from '~/app/components/empty-box';
import DatePickerModal from '~/app/components/date-picker-modal';
import { debounce } from 'lodash';

import dayjs from 'dayjs';
import FlowCustomerItem from '../components/flow-customer-item';
import {
  AnalyzeStatus,
  CollectStatus,
  RegisterStatus,
} from '~/app/stores/flow/type';
import { getStatusTextConfig } from '~/app/constants';

export default function Register() {
  const navigation = useNavigation();

  const {
    requestGetRegisterFlows,
    updateCurrentFlow,
    register: { flows },
  } = useFlowStore();

  useEffect(() => {
    requestGetRegisterFlows();
  }, []);

  return (
    <Flex flex={1}>
      <Filter />
      <ScrollView margin={ss(10)}>
        {flows.length == 0 ? (
          <EmptyBox />
        ) : (
          <Row
            flex={1}
            bgColor='white'
            borderRadius={ss(10)}
            flexWrap={'wrap'}
            p={ss(40)}>
            {flows.map((flow, idx) => (
              <Pressable
                hitSlop={ss(10)}
                ml={idx % 2 == 1 ? ss(20) : 0}
                key={idx}
                onPress={() => {
                  updateCurrentFlow(flow);
                  navigation.navigate('CustomerDetail', { flow: flow });
                }}>
                <FlowCustomerItem flow={flow} type={OperateType.Register} />
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
  const [isOpenDatePicker, setIsOpenDatePicker] = useState<{
    type?: 'start' | 'end';
    isOpen: boolean;
  }>({
    isOpen: false,
  });
  const {
    register,
    updateRegisterFilter,
    requestGetRegisterFlows,
    updateCurrentFlow,
  } = useFlowStore();

  const [registerCount, setRegisterCount] = useState(0);

  useEffect(() => {
    setRegisterCount(
      register.flows.filter((item) => {
        return item.register.status === RegisterStatus.DONE;
      }).length,
    );
  }, [register.flows]);

  return (
    <Column mx={ss(10)} mt={ss(10)} bgColor='white' borderRadius={ss(10)}>
      <Row py={ss(20)} px={ls(40)} alignItems={'center'}>
        <Icon
          as={<Ionicons name={'people'} />}
          size={ss(40)}
          color={'#5EACA3'}
        />
        <Text color='#000' fontSize={sp(20)} fontWeight={600} ml={ls(10)}>
          已登记：
          <Text color='#5EACA3'>{registerCount}</Text>
        </Text>
        <Input
          ml={ls(30)}
          w={ls(240)}
          minH={ss(40, { max: 18 })}
          p={ss(8)}
          defaultValue={register.searchKeywords}
          placeholderTextColor={'#6E6F73'}
          color={'#333333'}
          fontSize={ss(16)}
          onChangeText={debounce((text) => {
            updateRegisterFilter({
              searchKeywords: text,
            });

            requestGetRegisterFlows();
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
          hitSlop={ss(10)}
          onPress={() => {
            updateCurrentFlow(DefaultRegisterCustomer);
            navigation.navigate('RegisterCustomer', {
              type: CustomerScreenType.register,
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
            登记
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
              borderRadius={ss(4)}
              borderColor={'#D8D8D8'}
              borderWidth={1}>
              <Icon
                as={<MaterialIcons name='date-range' />}
                size={ss(20)}
                color='rgba(0,0,0,0.2)'
              />
              <Text color={'#333333'} fontSize={ss(18)} ml={ls(8)}>
                {register.startDate}
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
              borderRadius={ss(4)}
              borderColor={'#D8D8D8'}
              borderWidth={1}>
              <Icon
                as={<MaterialIcons name='date-range' />}
                size={ss(20)}
                color='rgba(0,0,0,0.2)'
              />
              <Text color={'#333333'} fontSize={ss(18)} ml={ls(8)}>
                {register.endDate}
              </Text>
            </Pressable>
          </Row>
          <Row alignItems={'center'} mt={ss(20)}>
            <Text color='#666' fontSize={sp(18)}>
              状态选择
            </Text>
            <Row ml={ls(20)}>
              {register.allStatus?.map((status, idx) => {
                return (
                  <Pressable
                    hitSlop={ss(10)}
                    onPress={() => {
                      updateRegisterFilter({
                        status: status.value,
                      });
                    }}
                    key={idx}
                    w={ls(90)}
                    h={ss(40)}
                    borderRadius={ss(4)}
                    borderWidth={1}
                    alignItems={'center'}
                    justifyContent={'center'}
                    mr={ls(20)}
                    borderColor={
                      register.status === status.value ? '#00B49E' : '#D8D8D8'
                    }>
                    <Text
                      color={
                        register.status === status.value ? '#00B49E' : '#666'
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
              hitSlop={ss(10)}
              onPress={() => {
                updateRegisterFilter({
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
              hitSlop={ss(10)}
              onPress={() => {
                requestGetRegisterFlows();
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
                updateRegisterFilter({
                  startDate: date,
                });
              } else {
                updateRegisterFilter({
                  endDate: date,
                });
              }
            }}
            current={
              isOpenDatePicker.type == 'start'
                ? register.startDate
                : register.endDate
            }
            selected={
              isOpenDatePicker.type == register.startDate
                ? register.startDate
                : register.endDate
            }
          />
        </Column>
      )}
    </Column>
  );
}
