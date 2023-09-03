import {
  Box,
  Center,
  Column,
  Pressable,
  Row,
  ScrollView,
  Text,
} from 'native-base';
import { GrowthCurveStatisticsResponse } from '~/app/stores/flow/type';
import { getHeightComparsionText, getWeightComparsionText } from '~/app/utils';
import { ls, ss, sp } from '~/app/utils/style';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import {
  GridComponent,
  DataZoomComponent,
  TooltipComponent,
} from 'echarts/components';
import SvgChart, { SVGRenderer } from '@wuba/react-native-echarts/svgChart';
import { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';

echarts.use([
  SVGRenderer,
  LineChart,
  GridComponent,
  DataZoomComponent,
  TooltipComponent,
]);

interface GrowthCurveParams {
  growthCurves: GrowthCurveStatisticsResponse[];
  onEditClick: (item: GrowthCurveStatisticsResponse) => void;
}
export function GrowthCurve(params: GrowthCurveParams) {
  const svgRef = useRef<any>(null);
  const { growthCurves, onEditClick } = params;

  // 获取最大高度
  const getMaxAndMinHeight = () => {
    let max = growthCurves[0].heightData.height;
    let min = growthCurves[0].heightData.height;
    growthCurves.forEach((item) => {
      if (item.heightData.height > max) {
        max = item.heightData.height;
      }
      if (item.heightData.height < min) {
        min = item.heightData.height;
      }
    });
    return {
      max: max,
      min: min,
    };
  };

  // 获取最大体重
  const getMaxAndMinWeight = () => {
    let max = growthCurves[0].weightData.weight;
    let min = growthCurves[0].weightData.weight;
    growthCurves.forEach((item) => {
      if (item.weightData.weight > max) {
        max = item.weightData.weight;
      }
      if (item.weightData.weight < min) {
        min = item.weightData.weight;
      }
    });
    return {
      max: max,
      min: min,
    };
  };

  const { max: maxHeight, min: minHeight } = getMaxAndMinHeight();
  const { max: maxWeight, min: minWeight } = getMaxAndMinWeight();

  const List = () => {
    return (
      <Column mt={ss(30)}>
        <Row
          bgColor={'#F0F0F0'}
          px={ls(40)}
          h={ss(60)}
          alignItems={'center'}
          borderTopRadius={ss(10)}
          width={'100%'}
          justifyContent={'space-around'}
        >
          <Row w={ls(120)}>
            <Text fontSize={sp(14)} color={'#8C8C8C'}>
              日期
            </Text>
          </Row>
          <Row w={ls(120)}>
            <Text fontSize={sp(14)} color={'#8C8C8C'}>
              身高(CM)
            </Text>
          </Row>

          <Row w={ls(120)}>
            <Text fontSize={sp(14)} color={'#8C8C8C'}>
              标准值
            </Text>
          </Row>
          <Row w={ls(120)}>
            <Text fontSize={sp(14)} color={'#8C8C8C'}>
              对比结果
            </Text>
          </Row>
          <Row w={ls(120)}>
            <Text fontSize={sp(14)} color={'#8C8C8C'}>
              体重(KG)
            </Text>
          </Row>
          <Row w={ls(120)}>
            <Text fontSize={sp(14)} color={'#8C8C8C'}>
              标准值
            </Text>
          </Row>
          <Row w={ls(120)}>
            <Text fontSize={sp(14)} color={'#8C8C8C'}>
              对比结果
            </Text>
          </Row>
          <Row w={ls(120)}>
            <Text fontSize={sp(14)} color={'#8C8C8C'}>
              操作
            </Text>
          </Row>
        </Row>
        {params.growthCurves.map((growthCurve, idx) => {
          return (
            <Row
              key={idx}
              px={ls(40)}
              minH={ss(60)}
              py={ss(10)}
              alignItems={'center'}
              borderTopRadius={ss(10)}
              width={'100%'}
              borderBottomWidth={1}
              borderBottomColor={'#DFE1DE'}
              borderBottomStyle={'solid'}
              justifyContent={'space-around'}
            >
              <Row w={ls(120)}>
                <Text fontSize={sp(14)} color={'#333'}>
                  {dayjs(growthCurve.date).format('YYYY-MM-DD')}
                </Text>
              </Row>
              <Row w={ls(120)}>
                <Text fontSize={sp(14)} color={'#333'}>
                  {growthCurve.heightData.height}
                </Text>
              </Row>
              <Row w={ls(120)}>
                <Text fontSize={sp(14)} color={'#333'}>
                  {growthCurve.heightData.heightStandard}
                </Text>
              </Row>
              <Row w={ls(120)}>
                <Text fontSize={sp(14)} color={'#333'}>
                  {getHeightComparsionText(
                    growthCurve.heightData.heightComparison,
                  )}
                </Text>
              </Row>
              <Row w={ls(120)}>
                <Text fontSize={sp(14)} color={'#333'}>
                  {growthCurve.weightData.weight}
                </Text>
              </Row>
              <Row w={ls(120)}>
                <Text fontSize={sp(14)} color={'#333'}>
                  {growthCurve.weightData.weightStandard}
                </Text>
              </Row>
              <Row w={ls(120)}>
                <Text fontSize={sp(14)} color={'#333'}>
                  {getWeightComparsionText(
                    growthCurve.weightData.weightComparison,
                  )}
                </Text>
              </Row>

              <Row w={ls(120)}>
                <Pressable
                  hitSlop={ss(10)}
                  onPress={() => {
                    onEditClick(growthCurve);
                  }}
                >
                  <Text fontSize={sp(14)} color={'#03CBB2'}>
                    编辑
                  </Text>
                </Pressable>
              </Row>
            </Row>
          );
        })}
      </Column>
    );
  };

  const [selectOption, seSelectOption] = useState<'height' | 'weight'>(
    'height',
  );

  const options = {
    height: {
      grid: {
        top: ss(20),
        left: ls(50),
        right: 0,
      },
      textStyle: {
        fontFamily: 'PingFang SC', // 指定字体类型
      },
      tooltip: {
        fontFamily: 'PingFang SC', // 指定字体类型
        trigger: 'axis',
        position: function (pt: any) {
          return [pt[0], '10%'];
        },
      },
      xAxis: {
        type: 'category',
        data: growthCurves.map((item) => {
          return dayjs(item.date).format('YYYY-MM-DD');
        }),
        axisLine: {
          lineStyle: {
            color: '#DCDFE6', // 设置X轴刻度线的颜色为红色
            width: 1, // 设置刻度线的宽度
          },
        },
        axisLabel: {
          align: 'center', // 设置刻度标签居中对齐，显示在刻度线正下方
          rotate: 0, // 可选：如果有旋转刻度标签的需求，可以设置旋转角度
          interval: 0, // 强制显示所有刻度标签
          fontSize: sp(12),
          color: '#8C8C8C',
          padding: [ss(10), 0, 0, 0],
        },
      },
      dataZoom: [
        {
          type: 'inside',
          start: 40,
          end: 100, // 初始数据显示的范围，这里设置为显示前60%的数据
        },
      ],
      yAxis: [
        {
          type: 'value',
          min: minHeight,
          axisLabel: {
            formatter: '{value}cm', // 在刻度标签后添加"cm"
          },
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
          name: '身高',
          type: 'line',
          smooth: true,
          lineStyle: {
            color: '#18A0FB',
            width: 2, // 设置线的宽度
          },

          data: growthCurves.map((item) => item.heightData.height),
        },
        {
          name: '标准值',
          type: 'line',
          smooth: true,
          lineStyle: {
            color: '#2FC25B',
            width: 2, // 设置线的宽度
          },
          data: growthCurves.map((item) => item.heightData.heightStandard),
        },
      ],
    },
    weight: {
      grid: {
        top: ss(20),
        left: ls(50),
        right: 0,
      },
      textStyle: {
        fontFamily: 'PingFang SC', // 指定字体类型
      },
      tooltip: {
        fontFamily: 'PingFang SC', // 指定字体类型
        trigger: 'axis',
        position: function (pt: any) {
          return [pt[0], '10%'];
        },
      },
      xAxis: {
        type: 'category',
        data: growthCurves.map((item) => {
          return dayjs(item.date).format('YYYY-MM-DD');
        }),
        axisLine: {
          lineStyle: {
            color: '#DCDFE6', // 设置X轴刻度线的颜色为红色
            width: 1, // 设置刻度线的宽度
          },
        },
        axisLabel: {
          align: 'center', // 设置刻度标签居中对齐，显示在刻度线正下方
          rotate: 0, // 可选：如果有旋转刻度标签的需求，可以设置旋转角度
          interval: 0, // 强制显示所有刻度标签
          fontSize: sp(12),
          color: '#8C8C8C',
          padding: [ss(10), 0, 0, 0],
        },
      },
      dataZoom: [
        {
          type: 'inside',
          start: 40,
          end: 100, // 初始数据显示的范围，这里设置为显示前60%的数据
        },
      ],
      yAxis: [
        {
          type: 'value',
          min: minWeight,
          axisLabel: {
            formatter: '{value}kg', // 在刻度标签后添加"cm"
          },
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
          name: '体重',
          type: 'line',
          smooth: true,
          lineStyle: {
            color: '#FAA037',
            width: 2, // 设置线的宽度
          },
          data: growthCurves.map((item) => item.weightData.weight),
        },
        {
          name: '标准值',
          type: 'line',
          smooth: true,
          lineStyle: {
            color: '#2FC25B',
            width: 2, // 设置线的宽度
          },
          data: growthCurves.map((item) => item.weightData.weightStandard),
        },
      ],
    },
  };

  useEffect(() => {
    let chart: any;
    if (svgRef.current) {
      chart = echarts.init(svgRef.current, 'light', {
        renderer: 'svg',
        height: ss(306),
        width: ls(1046),
      });
      chart.setOption(options[selectOption]);
    }
    return () => chart?.dispose();
  }, [growthCurves, selectOption]);
  return (
    <ScrollView>
      <Column
        borderWidth={1}
        borderRadius={ss(4)}
        alignItems={'center'}
        borderColor={'#F0F0F0'}
        h={ss(386)}
        w={'100%'}
        mt={ss(30)}
      >
        <Row
          w={'100%'}
          alignItems={'center'}
          justifyContent={'space-between'}
          px={ls(40)}
          py={ss(20)}
        >
          <Text color='#141414' fontSize={sp(16)}>
            身高曲线
          </Text>
          <Row>
            <Pressable
              hitSlop={ss(10)}
              onPress={() => {
                seSelectOption('height');
              }}
            >
              <Box
                w={ss(80)}
                h={ss(40)}
                bgColor={'#FFF'}
                borderLeftRadius={2}
                borderRightRadius={0}
                borderWidth={1}
                borderColor={selectOption === 'height' ? '#03CBB2' : '#D9D9D9'}
                alignItems={'center'}
                justifyContent={'center'}
              >
                <Text
                  fontSize={sp(14)}
                  color={selectOption === 'height' ? '#03CBB2' : '#333'}
                >
                  身高
                </Text>
              </Box>
            </Pressable>
            <Pressable
              hitSlop={ss(10)}
              onPress={() => {
                seSelectOption('weight');
              }}
            >
              <Box
                w={ss(80)}
                h={ss(40)}
                bgColor={'#FFF'}
                borderRightRadius={2}
                borderLeftRadius={0}
                borderWidth={1}
                borderColor={selectOption === 'weight' ? '#03CBB2' : '#D9D9D9'}
                alignItems={'center'}
                justifyContent={'center'}
              >
                <Text
                  fontSize={sp(14)}
                  color={selectOption === 'weight' ? '#03CBB2' : '#333'}
                >
                  体重
                </Text>
              </Box>
            </Pressable>
          </Row>
        </Row>
        <Row alignItems={'center'}>
          <Box
            w={ss(12)}
            height={ss(12)}
            borderRadius={2}
            bgColor={'#18A0FB'}
          />
          <Text fontSize={sp(14)} color='rgba(0,0,0,0.45)' ml={ls(8)}>
            身高
          </Text>
          <Box
            w={ss(12)}
            height={ss(12)}
            borderRadius={2}
            bgColor={'#FAA037'}
            ml={ls(24)}
          />
          <Text fontSize={sp(14)} color='rgba(0,0,0,0.45)' ml={ls(8)}>
            体重
          </Text>
          <Box
            w={ss(12)}
            height={ss(12)}
            borderRadius={2}
            bgColor={'#2FC25B'}
            ml={ls(24)}
          />
          <Text fontSize={sp(14)} color='rgba(0,0,0,0.45)' ml={ls(8)}>
            标准值
          </Text>
        </Row>
        <SvgChart ref={svgRef} />
      </Column>
      <List />
    </ScrollView>
  );
}
