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
  FlatList,
} from 'native-base';
import { useEffect, useRef, useState } from 'react';
import useFlowStore from '~/app/stores/flow';
import { ls, sp, ss } from '~/app/utils/style';
import { MaterialIcons } from '@expo/vector-icons';
import DatePickerModal from '~/app/components/date-picker-modal';
import SelectShop, { useSelectShops } from '~/app/components/select-shop';
import dayjs from 'dayjs';
import StatisticsCountBox from '../components/statistic-count-box';
import { Gender } from '~/app/types';
import { getAge } from '~/app/utils';
import { Shop, ShopType } from '~/app/stores/manager/type';

import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import {
  GridComponent,
  DataZoomComponent,
  TooltipComponent,
} from 'echarts/components';
import SvgChart, { SVGRenderer } from '@wuba/react-native-echarts/svgChart';
import { Dimensions, Platform } from 'react-native';

echarts.use([
  SVGRenderer,
  BarChart,
  GridComponent,
  DataZoomComponent,
  TooltipComponent,
]);

const ShopStatisticBox = () => {
  const {
    statisticShop: { counts, flows },
  } = useFlowStore();
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
          <Row w={ls(60)}>
            <Text fontSize={sp(18)} color={'#333'}>
              性别
            </Text>
          </Row>
          <Row w={ls(80)}>
            <Text fontSize={sp(18)} color={'#333'}>
              年龄
            </Text>
          </Row>
          <Row w={ls(110)}>
            <Text fontSize={sp(18)} color={'#333'}>
              电话
            </Text>
          </Row>
          <Row w={ls(100)} justifyContent={'center'}>
            <Text fontSize={sp(18)} color={'#333'}>
              调理时间
            </Text>
          </Row>
          <Row w={ls(80)} justifyContent={'center'}>
            <Text fontSize={sp(18)} color={'#333'}>
              理疗师
            </Text>
          </Row>
          <Row w={ls(180)} justifyContent={'center'}>
            <Text fontSize={sp(18)} color={'#333'}>
              调理导向
            </Text>
          </Row>
          <Row w={ls(80)} justifyContent={'center'}>
            <Text fontSize={sp(18)} color={'#333'}>
              分析师
            </Text>
          </Row>
          <Row w={ls(80)} justifyContent={'center'}>
            <Text fontSize={sp(18)} color={'#333'}>
              注意事项
            </Text>
          </Row>
        </Row>
        <Column bgColor='white'>
          {flows?.map((flow, idx) => {
            const age = getAge(flow.customer.birthday);
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
                  <Text fontSize={sp(18)} color={'#333'}>
                    {flow.customer.name}
                  </Text>
                </Row>
                <Row w={ls(60)}>
                  <Text fontSize={sp(18)} color={'#333'}>
                    {flow.customer.gender == Gender.MAN ? '男' : '女'}
                  </Text>
                </Row>
                <Row w={ls(80)}>
                  <Text fontSize={sp(18)} color={'#333'}>
                    {`${age?.year}岁${age?.month}月`}
                  </Text>
                </Row>
                <Row w={ls(110)}>
                  <Text fontSize={sp(18)} color={'#333'}>
                    {flow.customer.phoneNumber}
                  </Text>
                </Row>
                <Row w={ls(100)}>
                  <Text fontSize={sp(18)} color={'#333'}>
                    {dayjs(flow.analyze.updatedAt).format('YY-MM-DD')}
                  </Text>
                </Row>
                <Row w={ls(80)}>
                  <Text fontSize={sp(18)} color={'#333'}>
                    {flow.collectionOperator?.name}
                  </Text>
                </Row>
                <Row w={ls(180)} justifyContent={'center'}>
                  <Text
                    fontSize={sp(18)}
                    color={'#333'}
                    numberOfLines={2}
                    ellipsizeMode='tail'>
                    {flow.collect.guidance || '未设置'}
                  </Text>
                </Row>
                <Row w={ls(80)}>
                  <Text fontSize={sp(18)} color={'#333'}>
                    {flow.analyzeOperator?.name}
                  </Text>
                </Row>
                <Row w={ls(80)}>
                  <Text
                    fontSize={sp(18)}
                    color={'#333'}
                    numberOfLines={2}
                    ellipsizeMode='tail'>
                    {flow.analyze.remark || '未设置'}
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
          title={'登记人数'}
          count={counts?.register}
          image={require('~/assets/images/statistic-register.png')}
        />
        <StatisticsCountBox
          title={'采集人数'}
          count={counts?.collect}
          style={{ marginLeft: ss(10) }}
          image={require('~/assets/images/statistic-collect.png')}
        />
        <StatisticsCountBox
          title={'分析人数'}
          count={counts?.analyze}
          style={{ marginLeft: ss(10) }}
          image={require('~/assets/images/statistic-analyze.png')}
        />
      </Row>
      <Row flex={1} mt={ss(10)}>
        <StatisticsCountBox
          title={'贴敷总量（贴）'}
          count={counts?.application}
          image={require('~/assets/images/statistic-application.png')}
        />
        <StatisticsCountBox
          title={'推拿总量（次）'}
          count={counts?.massage}
          style={{ marginLeft: ss(10) }}
          image={require('~/assets/images/statistic-massage.png')}
        />
      </Row>

      <Box mt={ss(10)}>
        <List />
      </Box>
    </ScrollView>
  );
};
const CenterStatisticBox = () => {
  const { statisticShops } = useFlowStore();

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
              门店名称
            </Text>
          </Row>
          <Row w={ls(100)}>
            <Text fontSize={sp(18)} color={'#333'}>
              调理数
            </Text>
          </Row>
          <Row w={ls(100)}>
            <Text fontSize={sp(18)} color={'#333'}>
              登记数
            </Text>
          </Row>
          <Row w={ls(100)}>
            <Text fontSize={sp(18)} color={'#333'}>
              转化率
            </Text>
          </Row>
          <Row w={ls(100)} justifyContent={'center'}>
            <Text fontSize={sp(18)} color={'#333'}>
              贴敷量
            </Text>
          </Row>
          <Row w={ls(100)} justifyContent={'center'}>
            <Text fontSize={sp(18)} color={'#333'}>
              推拿量
            </Text>
          </Row>
        </Row>
        <Column bgColor={'#fff'} borderBottomRadius={ss(10)}>
          {statisticShops.map((item, idx) => {
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
                <Row w={ls(100)}>
                  <Text fontSize={sp(18)} color={'#333'}>
                    {item.counts.analyze}
                  </Text>
                </Row>
                <Row w={ls(100)}>
                  <Text fontSize={sp(18)} color={'#333'}>
                    {item.counts.register}
                  </Text>
                </Row>
                <Row w={ls(100)}>
                  <Text fontSize={sp(18)} color={'#333'}>
                    {item.counts.analyze != 0
                      ? Math.floor(
                          (item.counts.analyze / item.counts.register) * 100,
                        )
                      : 0}
                    %
                  </Text>
                </Row>
                <Row w={ls(100)} justifyContent={'center'}>
                  <Text fontSize={sp(18)} color={'#333'}>
                    {item.counts.application}
                  </Text>
                </Row>
                <Row w={ls(100)} justifyContent={'center'}>
                  <Text fontSize={sp(18)} color={'#333'}>
                    {item.counts.massage}
                  </Text>
                </Row>
              </Row>
            );
          })}
        </Column>
      </Column>
    );
  };

  const options = {
    grid: {
      top: ss(20),
      left: ls(50),
      right: 0,
      bottom: ss(50),
    },
    textStyle: {
      fontFamily: 'PingFang SC', // 指定字体类型
      fontSize: sp(16),
    },
    tooltip: {
      fontFamily: 'PingFang SC', // 指定字体类型
      trigger: 'axis',
      fontSize: sp(16),
      position: function (pt: any) {
        return [pt[0], '10%'];
      },
    },
    xAxis: {
      type: 'category',
      data: statisticShops.map((item) => {
        return item.shop.name;
      }),
      axisLabel: {
        align: 'center', // 设置刻度标签居中对齐，显示在刻度线正下方
        rotate: Platform.OS == 'android' ? 1 : 0, // 可选：如果有旋转刻度标签的需求，可以设置旋转角度
        interval: 0, // 强制显示所有刻度标签
        fontSize: sp(12),
        color: '#8C8C8C',
      },
    },
    dataZoom: [
      {
        type: 'inside', // 滑动条型数据缩放器
        start: 0, // 默认显示数据的起始位置
        end: statisticShops.length > 6 ? 60 : 100, // 默认显示数据的结束位置，可以通过滑动来调整
      },
    ],
    yAxis: [
      {
        type: 'value',
        splitLine: {
          show: true, // 显示网格线
          lineStyle: {
            type: 'dashed', // 将网格线显示为虚线
          },
        },
      },
    ],
    series: [
      {
        name: '登记人数',
        type: 'bar',
        data: statisticShops.map((item) => item.counts.register),
        barWidth: ls(22), // 设置柱子的宽度
        itemStyle: {
          color: '#75BFF0', // 设置柱子颜色为绿色
        },
      },
      {
        name: '调理人数',
        type: 'bar',
        data: statisticShops.map((item) => item.counts.analyze),
        barWidth: ls(22), // 设置柱子的宽度
        itemStyle: {
          color: '#82DF9E', // 设置柱子颜色为绿色
        },
      },
    ],
  };
  const svgRef = useRef<any>(null);

  useEffect(() => {
    let chart: any;
    if (svgRef.current) {
      chart = echarts.init(svgRef.current, 'light', {
        renderer: 'svg',
        height: ss(306),
        width: Dimensions.get('window').width * 0.85,
      });
      chart.setOption(options);
    }
    return () => chart?.dispose();
  }, [statisticShops]);
  return (
    <ScrollView margin={ss(10)}>
      <ScrollView horizontal>
        <Row>
          {statisticShops.map((item, idx) => {
            return (
              <StatisticsCountBox
                image={require('~/assets/images/statistic-shop.png')}
                key={idx}
                title={item.shop.name}
                count={item.counts.analyze}
                style={idx == 0 ? {} : { marginLeft: ss(10) }}
              />
            );
          })}
        </Row>
      </ScrollView>

      <Box mt={ss(10)} bgColor={'#fff'} borderRadius={ss(8)}>
        <Text color={'#141414'} fontSize={sp(16)} margin={sp(20)}>
          业绩排行
        </Text>
        <Row alignItems={'center'} justifyContent={'center'}>
          <Box
            w={ss(12)}
            height={ss(12)}
            borderRadius={2}
            bgColor={'#75BFF0'}
          />
          <Text fontSize={sp(14)} color='rgba(0,0,0,0.45)' ml={ls(8)}>
            登记人数
          </Text>
          <Box
            w={ss(12)}
            height={ss(12)}
            borderRadius={2}
            bgColor={'#82DF9E'}
            ml={ls(24)}
          />
          <Text fontSize={sp(14)} color='rgba(0,0,0,0.45)' ml={ls(8)}>
            调理人数
          </Text>
        </Row>
        <SvgChart ref={svgRef} />
      </Box>
      <Box mt={ss(10)}>
        <List />
      </Box>
    </ScrollView>
  );
};
export default function StatisticsShop() {
  const [selectShop, setSelectShop] = useState<Shop>();

  return (
    <Flex flex={1}>
      <Filter
        onSelectShop={function (shop: Shop): void {
          setSelectShop(shop);
        }}
      />
      {selectShop?.type === ShopType.CENTER ? (
        <CenterStatisticBox />
      ) : (
        <ShopStatisticBox />
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
      <Row py={ss(20)} px={ls(40)} alignItems={'center'}>
        <SelectShop
          onSelect={function (selectedItem: any, index: number): void {
            onSelectShop(selectedItem);
            setSelectShop(selectedItem);
          }}
          defaultButtonText={defaultSelectShop?.name}
          buttonHeight={ss(44)}
          buttonWidth={ls(140)}
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
          selected={isOpenDatePicker.type == startDate ? startDate : endDate}
        />
      </Row>
    </Column>
  );
}
