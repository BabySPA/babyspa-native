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
  Center,
  Image,
} from 'native-base';
import { useEffect, useState } from 'react';
import useFlowStore from '~/app/stores/flow';
import { ls, sp, ss } from '~/app/utils/style';
import {
  Feather,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import CustomerItem from '../components/flow-customer-item';
import { FlowStatus, OperateType } from '~/app/types';
import EmptyBox from '~/app/components/empty-box';
import { debounce } from 'lodash';
import dayjs from 'dayjs';
import DatePickerModal from '~/app/components/date-picker-modal';
import { CollectStatus, EvaluateStatus } from '~/app/stores/flow/type';
import { Image as NativeImage } from 'react-native';
import useGlobalLoading from '~/app/stores/loading';

export default function Evaluate() {
  const navigation = useNavigation();
  const {
    updateCurrentFlow,
    requestGetEvaluateFlows,
    evaluate: { flows },
  } = useFlowStore();

  useEffect(() => {
    requestGetEvaluateFlows();
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
            p={ss(40)}
            pb={0}
            bgColor='white'
            borderRadius={ss(10)}
            minH={'100%'}>
            <Row flexWrap={'wrap'} alignItems={'flex-start'} w={'100%'}>
              {flows.map((flow, idx) => {
                return (
                  <Center width={'50%'} key={idx}>
                    <Pressable
                      ml={idx % 2 == 1 ? ss(20) : 0}
                      mr={idx % 2 == 0 ? ss(20) : 0}
                      mb={ss(40)}
                      hitSlop={ss(10)}
                      onPress={() => {
                        updateCurrentFlow(flow);
                        navigation.navigate('FlowInfo', {
                          from: 'evaluate-detail',
                        });
                      }}>
                      <CustomerItem flow={flow} type={OperateType.Evaluate} />
                    </Pressable>
                  </Center>
                );
              })}
            </Row>
          </Row>
        )}
      </ScrollView>
    </Flex>
  );
}

function Filter() {
  const [showFilter, setShowFilter] = useState(false);
  const [isOpenDatePicker, setIsOpenDatePicker] = useState<{
    type?: 'start' | 'end';
    isOpen: boolean;
  }>({
    isOpen: false,
  });
  const { evaluate, updateEvaluateFilter, requestGetEvaluateFlows } =
    useFlowStore();

  const [count, setCount] = useState({
    done: 0,
    todo: 0,
  });

  const { openLoading, closeLoading } = useGlobalLoading();

  useEffect(() => {
    let done = 0,
      todo = 0;

    evaluate.flows.forEach((flow) => {
      if (flow.evaluate.status === EvaluateStatus.DONE) {
        done++;
      } else if (flow.evaluate.status == EvaluateStatus.NOT_SET) {
        todo++;
      }
      setCount({
        done,
        todo,
      });
    });
  }, [evaluate.flows]);

  return (
    <Column mx={ss(10)} mt={ss(10)} bgColor='white' borderRadius={ss(10)}>
      <Row py={ss(20)} px={ls(40)} alignItems={'center'}>
        <Icon
          as={<Ionicons name={'people'} />}
          size={ss(35)}
          color={'#5EACA3'}
        />
        <Text color='#000' fontSize={sp(20)} fontWeight={600} ml={ls(10)}>
          待评价：
          <Text color='#F7BA2A'>{count.todo || 0}</Text>
        </Text>
        <Text color='#000' fontSize={sp(20)} fontWeight={600} ml={ls(10)}>
          已评价：
          <Text color='#5EACA3'>{count.done || 0}</Text>
        </Text>
        <Input
          ml={ls(30)}
          w={ls(240)}
          minH={ss(40, { max: 18 })}
          p={ss(8)}
          borderRadius={4}
          defaultValue={evaluate.searchKeywords}
          placeholderTextColor={'#6E6F73'}
          color={'#333333'}
          fontSize={ss(16)}
          onChangeText={debounce((text) => {
            updateEvaluateFilter({
              searchKeywords: text,
            });
            requestGetEvaluateFlows();
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
            <NativeImage
              source={
                showFilter
                  ? require('~/assets/images/filter-on.png')
                  : require('~/assets/images/filter-off.png')
              }
              style={{
                width: ss(16),
                height: ss(16),
                marginLeft: ls(27),
              }}
            />
            <Text color='#00B49E' fontSize={sp(18)} ml={ls(4)}>
              筛选
            </Text>
          </Row>
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
              borderRadius={4}
              borderColor={'#D8D8D8'}
              borderWidth={1}>
              <Icon
                as={<MaterialIcons name='date-range' />}
                size={ss(20)}
                color='rgba(0,0,0,0.2)'
              />
              <Text color={'#333333'} fontSize={ss(18)} ml={ls(8)}>
                {evaluate.startDate}
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
                {evaluate.endDate}
              </Text>
            </Pressable>
          </Row>
          <Row alignItems={'center'} mt={ss(20)}>
            <Text color='#666' fontSize={sp(18)}>
              状态选择
            </Text>
            <Row ml={ls(20)}>
              {evaluate.allStatus?.map((status) => {
                return (
                  <Pressable
                    hitSlop={ss(10)}
                    onPress={() => {
                      updateEvaluateFilter({
                        status: status.value,
                      });
                    }}
                    key={status.value}
                    w={ls(90)}
                    h={ss(44)}
                    borderRadius={4}
                    borderWidth={1}
                    alignItems={'center'}
                    justifyContent={'center'}
                    mr={ls(20)}
                    borderColor={
                      evaluate.status === status.value ? '#00B49E' : '#D8D8D8'
                    }>
                    <Text
                      fontSize={sp(18)}
                      color={
                        evaluate.status === status.value ? '#00B49E' : '#666'
                      }>
                      {status.label}
                    </Text>
                    {evaluate.status === status.value && (
                      <Image
                        position={'absolute'}
                        bottom={0}
                        right={0}
                        alt=''
                        source={require('~/assets/images/border-select.png')}
                        w={ss(20)}
                        h={ss(20)}
                      />
                    )}
                  </Pressable>
                );
              })}
            </Row>
          </Row>
          <Row alignItems={'center'} mt={ss(20)} justifyContent={'flex-end'}>
            <Pressable
              hitSlop={ss(10)}
              onPress={() => {
                updateEvaluateFilter({
                  searchKeywords: '',
                  startDate: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
                  endDate: dayjs().format('YYYY-MM-DD'),
                  status: FlowStatus.NO_SET,
                });
              }}
              borderRadius={4}
              borderWidth={1}
              w={ls(80)}
              h={ss(44)}
              justifyContent={'center'}
              alignItems={'center'}
              borderColor='#D8D8D8'>
              <Text color='#333' fontSize={sp(14)}>
                重置
              </Text>
            </Pressable>
            <Pressable
              hitSlop={ss(10)}
              onPress={async () => {
                openLoading();
                await requestGetEvaluateFlows();
                setTimeout(() => {
                  closeLoading();
                }, 300);
              }}
              borderRadius={4}
              borderWidth={1}
              borderColor='#00B49E'
              w={ls(80)}
              h={ss(44)}
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
                updateEvaluateFilter({
                  startDate: date,
                });
              } else {
                updateEvaluateFilter({
                  endDate: date,
                });
              }
            }}
            current={
              isOpenDatePicker.type == 'start'
                ? evaluate.startDate
                : evaluate.endDate
            }
            selected={
              isOpenDatePicker.type == evaluate.startDate
                ? evaluate.startDate
                : evaluate.endDate
            }
          />
        </Column>
      )}
    </Column>
  );
}
