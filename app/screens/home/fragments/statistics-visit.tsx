import {
  Box,
  Flex,
  Text,
  ScrollView,
  Icon,
  Row,
  Column,
  Pressable,
} from 'native-base';
import { useEffect, useRef, useState } from 'react';
import useFlowStore from '~/app/stores/flow';
import { ls, sp, ss } from '~/app/utils/style';
import { MaterialIcons } from '@expo/vector-icons';
import DatePickerModal from '~/app/components/date-picker-modal';
import SelectShop, { useSelectShops } from '~/app/components/select-shop';
import dayjs from 'dayjs';
import StatisticsCountBox from '../components/statistic-count-box';
import { Shop, ShopType } from '~/app/stores/manager/type';
import { FollowUpResultText, FollowUpStatusTextConfig } from '~/app/constants';
import { FlowItemResponse, FollowUpResult } from '~/app/stores/flow/type';
import { generateFollowUpFlows } from '~/app/utils/generateFlowCounts';
import { useNavigation } from '@react-navigation/native';

const ShopStatisticBox = () => {
  const {
    statisticShop: { flows },
  } = useFlowStore();

  const [followUpData, setFollowUpData] = useState<{
    flows: FlowItemResponse[];
    counts: {
      all: number;
      done: number;
      overdue: number;
      cancel: number;
      well: number;
      bad: number;
      worse: number;
    };
  }>();

  useEffect(() => {
    setFollowUpData(generateFollowUpFlows(flows));
  }, [flows]);

  const List = () => {
    return (
      <Column>
        <Row
          bgColor={'#EDF7F6'}
          px={ls(40)}
          h={ss(60)}
          alignItems={'center'}
          borderTopRadius={ss(10)}
          width={'100%'}
          justifyContent={'space-around'}>
          <Row w={ls(100)}>
            <Text fontSize={sp(18)} color={'#333'}>
              客户姓名
            </Text>
          </Row>
          <Row w={ls(80)}>
            <Text fontSize={sp(18)} color={'#333'}>
              状态
            </Text>
          </Row>
          <Row w={ls(100)}>
            <Text fontSize={sp(18)} color={'#333'}>
              理疗时间
            </Text>
          </Row>
          <Row w={ls(110)}>
            <Text fontSize={sp(18)} color={'#333'}>
              随访结果
            </Text>
          </Row>
          <Row w={ls(180)} justifyContent={'center'}>
            <Text fontSize={sp(18)} color={'#333'}>
              随访内容
            </Text>
          </Row>
          <Row w={ls(80)} justifyContent={'center'}>
            <Text fontSize={sp(18)} color={'#333'}>
              随访人
            </Text>
          </Row>
          <Row w={ls(110)} justifyContent={'center'}>
            <Text fontSize={sp(18)} color={'#333'}>
              计划随访时间
            </Text>
          </Row>
          <Row w={ls(110)} justifyContent={'center'}>
            <Text fontSize={sp(18)} color={'#333'}>
              实际随访时间
            </Text>
          </Row>
        </Row>
        <Column bgColor='white'>
          {followUpData?.flows?.map((flow, idx) => {
            return (
              <Row
                key={idx}
                px={ls(40)}
                minH={ss(60)}
                py={ss(10)}
                alignItems={'center'}
                borderBottomRadius={ss(10)}
                width={'100%'}
                borderBottomWidth={ss(1)}
                borderBottomColor={'#DFE1DE'}
                borderBottomStyle={'solid'}
                justifyContent={'space-around'}>
                <Row w={ls(100)}>
                  <Text fontSize={sp(16)} color={'#333'}>
                    {flow.customer.name}
                  </Text>
                </Row>
                <Row w={ls(80)}>
                  <Text fontSize={sp(16)} color={'#333'}>
                    {
                      FollowUpStatusTextConfig[
                        flow.analyze.followUp.followUpStatus
                      ].text
                    }
                  </Text>
                </Row>
                <Row w={ls(100)}>
                  <Text fontSize={sp(16)} color={'#333'}>
                    {dayjs(flow.analyze.updatedAt).format('YY-MM-DD')}
                  </Text>
                </Row>
                <Row w={ls(110)}>
                  <Text fontSize={sp(16)} color={'#333'}>
                    {flow.analyze.followUp.followUpResult
                      ? FollowUpResultText[flow.analyze.followUp.followUpResult]
                      : '无'}
                  </Text>
                </Row>
                <Row w={ls(180)}>
                  <Text fontSize={sp(16)} color={'#333'}>
                    {flow.analyze.followUp.followUpContent || '无'}
                  </Text>
                </Row>
                <Row w={ls(80)}>
                  <Text fontSize={sp(16)} color={'#333'}>
                    {flow.followUpOperator?.name || '无'}
                  </Text>
                </Row>
                <Row w={ls(110)} justifyContent={'center'}>
                  <Text
                    fontSize={sp(16)}
                    color={'#333'}
                    numberOfLines={2}
                    ellipsizeMode='tail'>
                    {dayjs(flow.analyze.followUp.followUpTime).format(
                      'YY-MM-DD',
                    )}
                  </Text>
                </Row>
                <Row w={ls(110)}>
                  <Text fontSize={sp(16)} color={'#333'}>
                    {dayjs(flow.analyze.followUp.actualFollowUpTime).format(
                      'YY-MM-DD',
                    )}
                  </Text>
                </Row>
              </Row>
            );
          })}
        </Column>
      </Column>
    );
  };
  return (
    <ScrollView margin={ss(10)}>
      <Row flex={1}>
        <StatisticsCountBox
          image={require('~/assets/images/statistic-followup-good.png')}
          title={FollowUpResultText[FollowUpResult.GOOD]}
          count={followUpData?.counts.well || 0}
        />
        <StatisticsCountBox
          image={require('~/assets/images/statistic-followup-bad.png')}
          title={FollowUpResultText[FollowUpResult.BAD]}
          count={followUpData?.counts.bad || 0}
          style={{ marginLeft: ss(10) }}
        />
        <StatisticsCountBox
          image={require('~/assets/images/statistic-followup-worse.png')}
          title={FollowUpResultText[FollowUpResult.WORSE]}
          count={followUpData?.counts.worse || 0}
          style={{ marginLeft: ss(10) }}
        />
        <StatisticsCountBox
          image={require('~/assets/images/statistic-followup-cancel.png')}
          style={{ marginLeft: ss(10) }}
          title={'取消'}
          count={followUpData?.counts.cancel || 0}
        />
      </Row>
      <Box mt={ss(10)}>
        <List />
      </Box>
    </ScrollView>
  );
};
const CenterStatisticBox = () => {
  const navigation = useNavigation();
  const { statisticShops } = useFlowStore();

  const [flowsWithShopData, setFlowsWithShopData] = useState<{
    flowsWithShop: {
      shop: Pick<Shop, 'name' | '_id'>;
      counts: {
        all: number;
        done: number;
        overdue: number;
        cancel: number;
        well: number;
        bad: number;
        worse: number;
      };
    }[];
    allCounts: {
      all: number;
      done: number;
      overdue: number;
      cancel: number;
      well: number;
      bad: number;
      worse: number;
    };
  }>({
    flowsWithShop: [],
    allCounts: {
      all: 0,
      done: 0,
      overdue: 0,
      cancel: 0,
      well: 0,
      bad: 0,
      worse: 0,
    },
  });

  useEffect(() => {
    const tempFlowsWithShopData = [];
    const allCounts = {
      all: 0,
      done: 0,
      overdue: 0,
      cancel: 0,
      well: 0,
      bad: 0,
      worse: 0,
    };
    for (let index = 0; index < statisticShops.length; index++) {
      const flows = statisticShops[index].flows;
      const followUpData = generateFollowUpFlows(flows);
      allCounts.all += followUpData.counts.all;
      allCounts.done += followUpData.counts.done;
      allCounts.overdue += followUpData.counts.overdue;
      allCounts.cancel += followUpData.counts.cancel;
      allCounts.well += followUpData.counts.well;
      allCounts.bad += followUpData.counts.bad;
      allCounts.worse += followUpData.counts.worse;
      tempFlowsWithShopData.push({
        shop: statisticShops[index].shop,
        counts: followUpData.counts,
      });
    }

    setFlowsWithShopData({
      flowsWithShop: tempFlowsWithShopData,
      allCounts,
    });
  }, [statisticShops]);

  const List = () => {
    return (
      <Column>
        <Row
          bgColor={'#EDF7F6'}
          px={ls(40)}
          h={ss(60)}
          alignItems={'center'}
          borderTopRadius={ss(10)}
          width={'100%'}
          justifyContent={'space-around'}>
          <Row w={ls(100)}>
            <Text fontSize={sp(18)} color={'#333'}>
              门店
            </Text>
          </Row>
          <Row w={ls(80)}>
            <Text fontSize={sp(18)} color={'#333'}>
              随访数
            </Text>
          </Row>
          <Row w={ls(100)}>
            <Text fontSize={sp(18)} color={'#333'}>
              随访率
            </Text>
          </Row>
          <Row w={ls(100)}>
            <Text fontSize={sp(18)} color={'#333'}>
              {FollowUpResultText[FollowUpResult.GOOD]}
            </Text>
          </Row>
          <Row w={ls(100)} justifyContent={'center'}>
            <Text fontSize={sp(18)} color={'#333'}>
              {FollowUpResultText[FollowUpResult.BAD]}
            </Text>
          </Row>
          <Row w={ls(140)} justifyContent={'center'}>
            <Text fontSize={sp(18)} color={'#333'}>
              {FollowUpResultText[FollowUpResult.WORSE]}
            </Text>
          </Row>
          <Row w={ls(100)} justifyContent={'center'}>
            <Text fontSize={sp(18)} color={'#333'}>
              取消
            </Text>
          </Row>
          <Row w={ls(100)} justifyContent={'center'}>
            <Text fontSize={sp(18)} color={'#333'}>
              逾期
            </Text>
          </Row>
          <Row w={ls(100)} justifyContent={'center'}>
            <Text fontSize={sp(18)} color={'#333'}>
              操作
            </Text>
          </Row>
        </Row>
        <Column bgColor={'#fff'} borderBottomRadius={ss(10)}>
          {flowsWithShopData?.flowsWithShop.map((item, idx) => {
            return (
              <Row
                key={idx}
                px={ls(40)}
                minH={ss(60)}
                py={ss(10)}
                alignItems={'center'}
                width={'100%'}
                borderBottomWidth={ss(1)}
                borderBottomColor={'#DFE1DE'}
                borderBottomStyle={'solid'}
                justifyContent={'space-around'}>
                <Row w={ls(100)}>
                  <Text fontSize={sp(18)} color={'#333'}>
                    {item.shop.name}
                  </Text>
                </Row>
                <Row w={ls(80)} justifyContent={'center'}>
                  <Text fontSize={sp(18)} color={'#333'}>
                    {item.counts.done}
                  </Text>
                </Row>
                <Row w={ls(100)}>
                  <Text fontSize={sp(18)} color={'#333'}>
                    {item.counts.done
                      ? Math.floor((item.counts.done / item.counts.all) * 100)
                      : 0}
                    %
                  </Text>
                </Row>
                <Row w={ls(100)}>
                  <Text fontSize={sp(18)} color={'#333'}>
                    {item.counts.well}
                  </Text>
                </Row>
                <Row w={ls(100)} justifyContent={'center'}>
                  <Text fontSize={sp(18)} color={'#333'}>
                    {item.counts.bad}
                  </Text>
                </Row>
                <Row w={ls(140)} justifyContent={'center'}>
                  <Text fontSize={sp(18)} color={'#333'}>
                    {item.counts.worse}
                  </Text>
                </Row>
                <Row w={ls(100)} justifyContent={'center'}>
                  <Text fontSize={sp(18)} color={'#333'}>
                    {item.counts.cancel}
                  </Text>
                </Row>
                <Row w={ls(100)} justifyContent={'center'}>
                  <Text fontSize={sp(18)} color={'#333'}>
                    {item.counts.overdue}
                  </Text>
                </Row>
                <Row w={ls(100)} justifyContent={'center'}>
                  <Pressable
                    _pressed={{
                      opacity: 0.8,
                    }}
                    hitSlop={ss(20)}
                    onPress={() => {
                      //
                      navigation.navigate('FollowUp', {
                        currentShop: item.shop,
                      });
                    }}>
                    <Text fontSize={sp(18)} color={'#03CBB2'}>
                      查看
                    </Text>
                  </Pressable>
                </Row>
              </Row>
            );
          })}
        </Column>
      </Column>
    );
  };

  return (
    <ScrollView margin={ss(10)}>
      <Row flex={1}>
        <StatisticsCountBox
          image={require('~/assets/images/statistic-followup-good.png')}
          title={FollowUpResultText[FollowUpResult.GOOD]}
          count={flowsWithShopData?.allCounts.well || 0}
        />
        <StatisticsCountBox
          image={require('~/assets/images/statistic-followup-bad.png')}
          title={FollowUpResultText[FollowUpResult.BAD]}
          count={flowsWithShopData?.allCounts.bad || 0}
          style={{ marginLeft: ss(10) }}
        />
        <StatisticsCountBox
          image={require('~/assets/images/statistic-followup-worse.png')}
          title={FollowUpResultText[FollowUpResult.WORSE]}
          count={flowsWithShopData?.allCounts.worse || 0}
          style={{ marginLeft: ss(10) }}
        />
        <StatisticsCountBox
          image={require('~/assets/images/statistic-followup-cancel.png')}
          style={{ marginLeft: ss(10) }}
          title={'取消'}
          count={flowsWithShopData?.allCounts.cancel || 0}
        />
      </Row>

      <Box mt={ss(10)}>
        <List />
      </Box>
    </ScrollView>
  );
};
export default function StatisticsVisit() {
  const [selectShop, setSelectShop] = useState<Shop>();
  const [renderWaiting, setRenderWaiting] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setRenderWaiting(true);
    }, 50);
  }, []);
  return (
    <Flex flex={1}>
      <Filter
        onSelectShop={function (shop: Shop): void {
          setSelectShop(shop);
        }}
      />
      {renderWaiting && (
        <>
          {selectShop?.type === ShopType.CENTER ? (
            <CenterStatisticBox />
          ) : (
            <ShopStatisticBox />
          )}
        </>
      )}
    </Flex>
  );
}

function Filter({ onSelectShop }: { onSelectShop: (shop: Shop) => void }) {
  const [isOpenDatePicker, setIsOpenDatePicker] = useState<{
    type?: 'start' | 'end';
    isOpen: boolean;
  }>({
    isOpen: false,
  });

  const { requestGetStatisticFlow, requestGetStatisticFlowWithShop } =
    useFlowStore();

  const [defaultSelectShop, selectShops] = useSelectShops(false);
  const [selectShop, setSelectShop] = useState<Shop>();
  const [startDate, setStartDate] = useState<string>(
    dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
  );
  const [endDate, setEndDate] = useState<string>(dayjs().format('YYYY-MM-DD'));

  useEffect(() => {
    if (defaultSelectShop) {
      onSelectShop(defaultSelectShop);
      setSelectShop(defaultSelectShop);
    }
  }, [defaultSelectShop]);

  useEffect(() => {
    if (selectShop?._id)
      if (selectShop.type == ShopType.CENTER) {
        requestGetStatisticFlowWithShop({
          startDate,
          endDate,
        });
      } else {
        requestGetStatisticFlow({
          shopId: selectShop._id,
          startDate,
          endDate,
        });
      }
  }, [selectShop, startDate, endDate]);

  return (
    <Column mx={ss(10)} mt={ss(10)} bgColor='white' borderRadius={ss(10)}>
      <Row h={ss(75)} px={ls(40)} alignItems={'center'}>
        <SelectShop
          onSelect={function (selectedItem: any, index: number): void {
            onSelectShop(selectedItem);
            setSelectShop(selectedItem);
          }}
          defaultButtonText={defaultSelectShop?.name}
          buttonHeight={ss(44)}
          buttonWidth={ls(140, 210)}
          shops={selectShops}
        />
        <Pressable
          _pressed={{
            opacity: 0.8,
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
            {startDate}
          </Text>
        </Pressable>
        <Text mx={ls(10)} color='#333' fontSize={sp(16)}>
          至
        </Text>
        <Pressable
          _pressed={{
            opacity: 0.8,
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
            {endDate}
          </Text>
        </Pressable>

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
                setStartDate(date);
              } else {
                setEndDate(date);
              }
            }}
            current={isOpenDatePicker.type == 'start' ? startDate : endDate}
            selected={isOpenDatePicker.type == 'start' ? startDate : endDate}
          />
        )}
      </Row>
    </Column>
  );
}
