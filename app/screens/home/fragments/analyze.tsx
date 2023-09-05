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
import { FlowStatus, OperateType } from '~/app/types';
import EmptyBox from '~/app/components/empty-box';
import { debounce } from 'lodash';
import dayjs from 'dayjs';
import DatePickerModal from '~/app/components/date-picker-modal';
import FlowCustomerItem from '../components/flow-customer-item';
import { AnalyzeStatus } from '~/app/stores/flow/type';
import { getFlowStatus } from '~/app/constants';
import useGlobalLoading from '~/app/stores/loading';

export default function Analyze() {
  const navigation = useNavigation();
  const {
    requestGetAnalyzeFlows,
    updateCurrentFlow,
    analyze: { flows },
  } = useFlowStore();

  useEffect(() => {
    requestGetAnalyzeFlows();
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
            {flows.map((flow, idx) => {
              return (
                <Pressable
                  hitSlop={ss(10)}
                  key={idx}
                  onPress={() => {
                    if (flow.analyze.status !== AnalyzeStatus.NOT_SET) {
                      updateCurrentFlow(flow);
                      navigation.navigate('FlowInfo', { from: 'analyze' });
                    }
                  }}>
                  <Box ml={idx % 2 == 1 ? ss(20) : 0}>
                    <FlowCustomerItem flow={flow} type={OperateType.Analyze} />
                  </Box>
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
  const [isOpenDatePicker, setIsOpenDatePicker] = useState<{
    type?: 'start' | 'end';
    isOpen: boolean;
  }>({
    isOpen: false,
  });
  const { analyze, updateAnalyzeFilter, requestGetAnalyzeFlows } =
    useFlowStore();

  const [count, setCount] = useState({
    done: 0,
    todo: 0,
  });

  useEffect(() => {
    let done = 0,
      todo = 0;

    analyze.flows.forEach((flow) => {
      const flowStatus = getFlowStatus(flow);
      if (flowStatus == FlowStatus.Analyzed) {
        done++;
      } else if (flowStatus == FlowStatus.ToBeAnalyzed) {
        todo++;
      }
      setCount({
        done,
        todo,
      });
    });
  }, [analyze.flows]);

  const { openLoading, closeLoading } = useGlobalLoading();

  return (
    <Column mx={ss(10)} mt={ss(10)} bgColor='white' borderRadius={ss(10)}>
      <Row py={ss(20)} px={ls(40)} alignItems={'center'}>
        <Icon
          as={<Ionicons name={'people'} />}
          size={ss(35)}
          color={'#5EACA3'}
        />
        <Text color='#000' fontSize={sp(20)} fontWeight={600} ml={ls(10)}>
          待分析：
          <Text color='#F7BA2A'>{count.todo || 0}</Text>
        </Text>
        <Text color='#000' fontSize={sp(20)} fontWeight={600} ml={ls(10)}>
          已分析：
          <Text color='#5EACA3'>{count.done || 0}</Text>
        </Text>
        <Input
          ml={ls(30)}
          w={ls(240)}
          h={ss(40)}
          p={ss(8)}
          defaultValue={analyze.searchKeywords}
          placeholderTextColor={'#6E6F73'}
          color={'#333333'}
          fontSize={ss(16)}
          onChangeText={debounce((text) => {
            updateAnalyzeFilter({
              searchKeywords: text,
            });
            requestGetAnalyzeFlows();
          }, 1000)}
          InputLeftElement={
            <Icon
              as={<MaterialIcons name='search' />}
              size={ss(20)}
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
              as={<Feather name='filter' />}
              size={ss(16)}
              color='#00B49E'
              ml={ls(27)}
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
              borderRadius={ss(4)}
              borderColor={'#D8D8D8'}
              borderWidth={1}>
              <Icon
                as={<MaterialIcons name='date-range' />}
                size={ss(20)}
                color='rgba(0,0,0,0.2)'
              />
              <Text color={'#333333'} fontSize={ss(18)} ml={ls(8)}>
                {analyze.startDate}
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
                {analyze.endDate}
              </Text>
            </Pressable>
          </Row>
          <Row alignItems={'center'} mt={ss(20)}>
            <Text color='#666' fontSize={sp(18)}>
              状态选择
            </Text>
            <Row ml={ls(20)}>
              {analyze.allStatus?.map((status) => {
                return (
                  <Pressable
                    hitSlop={ss(10)}
                    onPress={() => {
                      updateAnalyzeFilter({
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
                      analyze.status === status.value ? '#00B49E' : '#D8D8D8'
                    }>
                    <Text
                      color={
                        analyze.status === status.value ? '#00B49E' : '#666'
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
                updateAnalyzeFilter({
                  searchKeywords: '',
                  startDate: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
                  endDate: dayjs().format('YYYY-MM-DD'),
                  status: FlowStatus.NO_SET,
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
              onPress={async () => {
                openLoading();
                await requestGetAnalyzeFlows();
                setTimeout(() => {
                  closeLoading();
                }, 300);
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
                updateAnalyzeFilter({
                  startDate: date,
                });
              } else {
                updateAnalyzeFilter({
                  endDate: date,
                });
              }
            }}
            current={
              isOpenDatePicker.type == 'start'
                ? analyze.startDate
                : analyze.endDate
            }
            selected={
              isOpenDatePicker.type == analyze.startDate
                ? analyze.startDate
                : analyze.endDate
            }
          />
        </Column>
      )}
    </Column>
  );
}
