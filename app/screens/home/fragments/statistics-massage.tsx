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
  const statisticShop = useFlowStore((state) => state.statisticShop);
  const statisticFlowWithDate = useFlowStore(
    (state) => state.statisticFlowWithDate,
  );

  const options = {
    grid: {
      top: ss(20),
      left: ls(50),
      right: 0,
      bottom: ss(50, 60),
    },
    textStyle: {
      fontSize: sp(16),
      fontFamily: 'PingFang SC', // 指定字体类型
    },
    tooltip: {
      fontSize: sp(16),
      fontFamily: 'PingFang SC', // 指定字体类型
      trigger: 'axis',
      position: function (pt: any) {
        return [pt[0], '10%'];
      },
    },
    xAxis: {
      type: 'category',
      data: statisticFlowWithDate.map((item) => {
        return item.date;
      }),
      axisLabel: {
        margin: ss(0, 20),
        align: 'center', // 设置刻度标签居中对齐，显示在刻度线正下方
        rotate: Platform.OS == 'android' ? 1 : 0, // 可选：如果有旋转刻度标签的需求，可以设置旋转角度
        interval: 0, // 强制显示所有刻度标签
        fontSize: sp(14),
        color: '#8C8C8C',
      },
    },
    dataZoom: [
      {
        type: 'inside', // 滑动条型数据缩放器
        start: statisticFlowWithDate.length > 7 ? 60 : 0, // 默认显示数据的起始位置
        end: 100, // 默认显示数据的结束位置，可以通过滑动来调整
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
        interval: 20,
      },
    ],
    series: [
      {
        name: '贴敷数',
        type: 'bar',
        data: statisticFlowWithDate.map(
          (item) => item.counts?.application || 0,
        ),
        barWidth: ls(22), // 设置柱子的宽度
        itemStyle: {
          color: '#75BFF0', // 设置柱子颜色为绿色
        },
      },
      {
        name: '推拿数',
        type: 'bar',
        data: statisticFlowWithDate.map((item) => item.counts?.massage || 0),
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
  }, [statisticFlowWithDate]);

  return (
    <ScrollView margin={ss(10)}>
      <Row flex={1}>
        <StatisticsCountBox
          image={require('~/assets/images/statistic-application.png')}
          title={'贴敷总量（贴）'}
          count={statisticShop.counts?.application || 0}
        />
        <StatisticsCountBox
          image={require('~/assets/images/statistic-massage.png')}
          title={'推拿总量（次）'}
          count={statisticShop.counts?.massage || 0}
          style={{ marginLeft: ss(10) }}
        />
      </Row>
      <Box mt={ss(10)} bgColor={'#fff'} borderRadius={ss(8)}>
        <Text color={'#141414'} fontSize={sp(16)} margin={sp(20)}>
          调理情况
        </Text>
        <Row alignItems={'center'} justifyContent={'center'}>
          <Box
            w={ss(12)}
            height={ss(12)}
            borderRadius={2}
            bgColor={'#75BFF0'}
          />
          <Text fontSize={sp(14)} color='rgba(0,0,0,0.45)' ml={ls(8)}>
            贴敷
          </Text>
          <Box
            w={ss(12)}
            height={ss(12)}
            borderRadius={2}
            bgColor={'#82DF9E'}
            ml={ls(24)}
          />
          <Text fontSize={sp(14)} color='rgba(0,0,0,0.45)' ml={ls(8)}>
            推拿
          </Text>
        </Row>
        <SvgChart ref={svgRef} />
      </Box>
    </ScrollView>
  );
};
const CenterStatisticBox = () => {
  const statisticShops = useFlowStore((state) => state.statisticShops);

  const options = {
    grid: {
      top: ss(20),
      left: ls(50),
      right: 0,
      bottom: ss(50, 60),
    },
    textStyle: {
      fontSize: sp(16),
      fontFamily: 'PingFang SC', // 指定字体类型
    },
    tooltip: {
      fontSize: sp(16),
      fontFamily: 'PingFang SC', // 指定字体类型
      trigger: 'axis',
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
        margin: ss(0, 20),
        align: 'center', // 设置刻度标签居中对齐，显示在刻度线正下方
        rotate: Platform.OS == 'android' ? 1 : 0, // 可选：如果有旋转刻度标签的需求，可以设置旋转角度
        interval: 0, // 强制显示所有刻度标签
        fontSize: sp(14),
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
        interval: 20,
      },
    ],
    series: [
      {
        name: '贴敷数',
        type: 'bar',
        data: statisticShops.map((item) => item.counts?.application || 0),
        barWidth: ls(22), // 设置柱子的宽度
        itemStyle: {
          color: '#75BFF0', // 设置柱子颜色为绿色
        },
      },
      {
        name: '推拿数',
        type: 'bar',
        data: statisticShops.map((item) => item.counts?.massage || 0),
        barWidth: ls(22), // 设置柱子的宽度
        itemStyle: {
          color: '#82DF9E', // 设置柱子颜色为绿色
        },
      },
    ],
  };
  const svgRef = useRef<any>(null);

  const [counts, setCounts] = useState({
    application: 0,
    massage: 0,
  });
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

    setCounts({
      application: statisticShops.reduce((prev, cur) => {
        return prev + cur.counts?.application || 0;
      }, 0),
      massage: statisticShops.reduce((prev, cur) => {
        return prev + cur.counts?.massage || 0;
      }, 0),
    });

    return () => chart?.dispose();
  }, [statisticShops]);

  return (
    <ScrollView margin={ss(10)}>
      <Row flex={1}>
        <StatisticsCountBox
          image={require('~/assets/images/statistic-application.png')}
          title={'贴敷总量（贴）'}
          count={counts?.application || 0}
        />
        <StatisticsCountBox
          image={require('~/assets/images/statistic-massage.png')}
          title={'推拿总量（次）'}
          count={counts?.massage || 0}
          style={{ marginLeft: ss(10) }}
        />
      </Row>

      <Box mt={ss(10)} bgColor={'#fff'} borderRadius={ss(8)}>
        <Text color={'#141414'} fontSize={sp(16)} margin={sp(20)}>
          调理情况
        </Text>
        <Row alignItems={'center'} justifyContent={'center'}>
          <Box
            w={ss(12)}
            height={ss(12)}
            borderRadius={2}
            bgColor={'#75BFF0'}
          />
          <Text fontSize={sp(14)} color='rgba(0,0,0,0.45)' ml={ls(8)}>
            贴敷
          </Text>
          <Box
            w={ss(12)}
            height={ss(12)}
            borderRadius={2}
            bgColor={'#82DF9E'}
            ml={ls(24)}
          />
          <Text fontSize={sp(14)} color='rgba(0,0,0,0.45)' ml={ls(8)}>
            推拿
          </Text>
        </Row>
        <SvgChart ref={svgRef} />
      </Box>
    </ScrollView>
  );
};
export default function StatisticsMassage() {
  const [selectShop, setSelectShop] = useState<Shop>();
  const [renderWaiting, setRenderWaiting] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setRenderWaiting(true);
    }, 10);
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

  const requestGetStatisticFlow = useFlowStore(
    (state) => state.requestGetStatisticFlow,
  );
  const requestGetStatisticFlowWithShop = useFlowStore(
    (state) => state.requestGetStatisticFlowWithShop,
  );

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
