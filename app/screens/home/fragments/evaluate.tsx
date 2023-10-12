import {
  Flex,
  Text,
  Icon,
  Input,
  Row,
  Column,
  Pressable,
  Center,
  Image,
  Box,
  FlatList,
} from 'native-base';
import { useEffect, useState } from 'react';
import useFlowStore from '~/app/stores/flow';
import { ls, sp, ss } from '~/app/utils/style';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import CustomerItem from '../components/flow-customer-item';
import { FlowStatus, OperateType } from '~/app/types';
import EmptyBox from '~/app/components/empty-box';
import { debounce } from 'lodash';
import dayjs from 'dayjs';
import DatePickerModal from '~/app/components/date-picker-modal';
import { EvaluateStatus } from '~/app/stores/flow/type';
import { Image as NativeImage } from 'react-native';
import useGlobalLoading from '~/app/stores/loading';

export default function Evaluate() {
  const navigation = useNavigation();

  const updateCurrentFlow = useFlowStore((state) => state.updateCurrentFlow);
  const requestGetEvaluateFlows = useFlowStore(
    (state) => state.requestGetEvaluateFlows,
  );
  const flows = useFlowStore((state) => state.evaluate.flows);

  useEffect(() => {
    requestGetEvaluateFlows();
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
            {renderWaiting && (
              <FlatList
                mb={ss(120)}
                data={flows}
                numColumns={2}
                renderItem={({ item: flow, index: idx }) => {
                  return (
                    <Center width={'50%'} key={idx}>
                      <Pressable
                        _pressed={{
                          opacity: 0.6,
                        }}
                        ml={idx % 2 == 1 ? ss(20) : 0}
                        mr={idx % 2 == 0 ? ss(20) : 0}
                        mb={ss(40)}
                        hitSlop={ss(20)}
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
  const [showFilter, setShowFilter] = useState(false);
  const [isOpenDatePicker, setIsOpenDatePicker] = useState<{
    type?: 'start' | 'end';
    isOpen: boolean;
  }>({
    isOpen: false,
  });

  const evaluate = useFlowStore((state) => state.evaluate);
  const updateEvaluateFilter = useFlowStore(
    (state) => state.updateEvaluateFilter,
  );
  const requestGetEvaluateFlows = useFlowStore(
    (state) => state.requestGetEvaluateFlows,
  );

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
      <Row px={ls(40)} alignItems={'center'} h={ss(75)}>
        <Icon
          as={<Ionicons name={'people'} />}
          size={sp(35)}
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
          minW={ls(240, 360)}
          h={ss(44)}
          p={ss(9)}
          borderWidth={ss(1)}
          borderColor={'#D8D8D8'}
          borderRadius={ss(4)}
          defaultValue={evaluate.searchKeywords}
          placeholderTextColor={'#6E6F73'}
          color={'#333333'}
          fontSize={sp(16)}
          onChangeText={debounce((text) => {
            updateEvaluateFilter({
              searchKeywords: text,
            });
            requestGetEvaluateFlows();
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
        <Pressable
          _pressed={{
            opacity: 0.8,
          }}
          hitSlop={ss(20)}
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
                width: sp(16),
                height: sp(16),
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
              _pressed={{
                opacity: 0.6,
              }}
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
              borderWidth={ss(1)}>
              <Icon
                as={<MaterialIcons name='date-range' />}
                size={sp(20)}
                color='rgba(0,0,0,0.2)'
              />
              <Text color={'#333333'} fontSize={sp(18)} ml={ls(8)}>
                {evaluate.startDate}
              </Text>
            </Pressable>
            <Text mx={ls(10)} color='#333' fontSize={sp(16)}>
              至
            </Text>
            <Pressable
              _pressed={{
                opacity: 0.6,
              }}
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
              borderWidth={ss(1)}>
              <Icon
                as={<MaterialIcons name='date-range' />}
                size={sp(20)}
                color='rgba(0,0,0,0.2)'
              />
              <Text color={'#333333'} fontSize={sp(18)} ml={ls(8)}>
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
                    _pressed={{
                      opacity: 0.8,
                    }}
                    hitSlop={ss(20)}
                    onPress={() => {
                      updateEvaluateFilter({
                        status: status.value,
                      });
                    }}
                    key={status.value}
                    w={ls(90)}
                    h={ss(44)}
                    borderRadius={ss(4)}
                    borderWidth={ss(1)}
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
              _pressed={{
                opacity: 0.6,
              }}
              hitSlop={ss(20)}
              onPress={() => {
                updateEvaluateFilter({
                  searchKeywords: '',
                  startDate: dayjs().format('YYYY-MM-DD'),
                  endDate: dayjs().format('YYYY-MM-DD'),
                  status: FlowStatus.NO_SET,
                });
              }}
              borderRadius={ss(4)}
              borderWidth={ss(1)}
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
              _pressed={{
                opacity: 0.6,
              }}
              hitSlop={ss(20)}
              onPress={async () => {
                openLoading();
                await requestGetEvaluateFlows();
                setTimeout(() => {
                  closeLoading();
                }, 300);
              }}
              borderRadius={ss(4)}
              borderWidth={ss(1)}
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
          {isOpenDatePicker.isOpen && (
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
                isOpenDatePicker.type == 'start'
                  ? evaluate.startDate
                  : evaluate.endDate
              }
            />
          )}
        </Column>
      )}
    </Column>
  );
}
