import dayjs from 'dayjs';
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
import { GridComponent } from 'echarts/components';
import { SVGRenderer, SkiaChart } from '@wuba/react-native-echarts';
import { useEffect, useRef } from 'react';

echarts.use([SVGRenderer, LineChart, GridComponent]);

interface GrowthCurveParams {
  growthCurves: GrowthCurveStatisticsResponse[];
}
export function GrowthCurve(params: GrowthCurveParams) {
  const skiaRef = useRef<any>(null);
  const { growthCurves } = params;
  console.log(params);
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
          justifyContent={'space-around'}>
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
              justifyContent={'space-around'}>
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
                <Pressable>
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
  useEffect(() => {
    const option = {
      xAxis: {
        type: 'category',
        data: growthCurves.map((item) => {
          return dayjs(item.date).format('YYYY-MM-DD');
        }),
        axisLabel: {
          interval: 0, // 强制显示所有刻度标签
          rotate: 45, // 旋转刻度标签使其水平显示，角度可以根据需要调整
          textStyle: {
            fontSize: 10, // 刻度标签文字大小
          },
        },
      },
      dataZoom: [
        {
          type: 'slider',
          xAxisIndex: 0,
          start: 0,
          end: 60, // 初始数据显示的范围，这里设置为显示前60%的数据
          zoomLock: true,
          moveOnMouseMove: true, // 开启鼠标移动时滑动
          showDetail: false, // 隐藏滑块上的详细信息
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: '身高',
          min: 0,
          max: 120,
        },
      ],
      series: [
        {
          name: '身高',
          type: 'line',
          smooth: true,
          data: growthCurves.map((item) => item.heightData.height),
        },
        {
          name: '标准值',
          type: 'line',
          smooth: true,
          data: growthCurves.map((item) => item.heightData.heightStandard),
        },
      ],
    };
    let chart: any;
    if (skiaRef.current) {
      chart = echarts.init(skiaRef.current, 'light', {
        renderer: 'svg',
        height: ss(300),
        width: ls(1300),
      });
      chart.setOption(option);
    }
    return () => chart?.dispose();
  }, []);
  return (
    <ScrollView>
      <Center
        borderWidth={1}
        borderRadius={ss(4)}
        borderColor={'#F0F0F0'}
        mt={ss(30)}>
        <SkiaChart ref={skiaRef} useRNGH />
      </Center>
      <List />
    </ScrollView>
  );
}
