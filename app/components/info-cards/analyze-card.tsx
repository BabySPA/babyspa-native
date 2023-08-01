import { Column, Divider, Icon, Row, Text } from 'native-base';
import { StyleProp, ViewStyle } from 'react-native';
import useFlowStore from '~/app/stores/flow';
import BoxTitle from '~/app/components/box-title';
import { ss, ls, sp } from '~/app/utils/style';
import { Image } from 'expo-image';
import dayjs from 'dayjs';

interface AnalyzeCardParams {
  style?: StyleProp<ViewStyle>;
}

export default function AnalyzeCard(params: AnalyzeCardParams) {
  const {
    currentFlow: { analyze },
  } = useFlowStore();
  const { style = {} } = params;

  return (
    <Column
      flex={1}
      bgColor={'#fff'}
      p={ss(20)}
      borderRadius={ss(10)}
      style={style}>
      <BoxTitle title='分析信息' />
      <Divider color={'#DFE1DE'} my={ss(14)} />
      <Column px={ls(20)}>
        {analyze.solution.applications.map((item, idx) => {
          return (
            <Column
              key={idx}
              mt={idx === 0 ? 0 : ss(20)}
              bgColor={'#F2F9F8'}
              borderRadius={1}
              borderStyle={'dashed'}
              borderWidth={1}
              borderColor={'#7AB6AF'}
              p={ss(20)}>
              <Row alignItems={'flex-start'} justifyContent={'space-between'}>
                <Text fontSize={sp(20)} color='#666'>
                  {item.name}
                </Text>
                <Text fontSize={sp(18)} color='#999'>
                  贴数： {item.count}贴
                </Text>
              </Row>
              <Row
                alignItems={'flex-start'}
                justifyContent={'space-between'}
                mt={ss(20)}>
                <Text fontSize={sp(18)} color='#999'>
                  贴敷时长：
                  <Text fontSize={sp(16)} color='#333'>
                    {item.duration / (1000 * 60 * 60)}小时
                  </Text>
                </Text>
                <Text fontSize={sp(18)} color='#999' noOfLines={4} maxW={'60%'}>
                  穴位：
                  <Text fontSize={sp(16)} color='#333'>
                    {item.acupoint}
                  </Text>
                </Text>
              </Row>
            </Column>
          );
        })}
        <Column mt={ss(20)}>
          {analyze.solution.massages.map((item, idx) => {
            return (
              <Column
                key={idx}
                mt={idx === 0 ? 0 : ss(20)}
                bgColor={'#F2F9F8'}
                borderRadius={1}
                borderStyle={'dashed'}
                borderWidth={1}
                borderColor={'#7AB6AF'}
                p={ss(20)}>
                <Row alignItems={'flex-start'} justifyContent={'space-between'}>
                  <Text fontSize={sp(20)} color='#666'>
                    {item.name}
                  </Text>
                  <Text fontSize={sp(18)} color='#999'>
                    次数： {item.count}次
                  </Text>
                </Row>
                <Text
                  fontSize={sp(18)}
                  color='#999'
                  noOfLines={4}
                  maxW={'60%'}
                  mt={ss(20)}>
                  备注：
                  <Text fontSize={sp(16)} color='#333'>
                    {item.remark}
                  </Text>
                </Text>
              </Column>
            );
          })}
        </Column>

        <Row mt={ss(20)}>
          <Text fontSize={sp(18)} color='#999' w={ls(100)} textAlign={'right'}>
            注意事项：
          </Text>
          <Text fontSize={sp(18)} color='#333'>
            {analyze.remark}
          </Text>
        </Row>

        <Row mt={ss(20)}>
          <Text fontSize={sp(18)} color='#999' w={ls(100)} textAlign={'right'}>
            分析师：
          </Text>
          <Text fontSize={sp(18)} color='#333'>
            {analyze.operator?.name}
          </Text>
        </Row>

        <Row mt={ss(20)}>
          <Text fontSize={sp(18)} color='#999' w={ls(100)} textAlign={'right'}>
            分析时间：
          </Text>
          <Text fontSize={sp(18)} color='#333'>
            {dayjs(analyze.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
          </Text>
        </Row>

        <Row mt={ss(20)}>
          <Text fontSize={sp(18)} color='#999' w={ls(100)} textAlign={'right'}>
            随访时间：
          </Text>
          <Text fontSize={sp(18)} color='#333'>
            {analyze.followUp.isFollowed
              ? dayjs(analyze.followUp?.followUpTime).format(
                  'YYYY-MM-DD HH:mm:ss',
                )
              : '未设置随访'}
          </Text>
        </Row>

        <Row mt={ss(20)}>
          <Text fontSize={sp(18)} color='#999' w={ls(100)} textAlign={'right'}>
            复推时间：
          </Text>
          <Text fontSize={sp(18)} color='#333'>
            {analyze.next.hasNext
              ? dayjs(analyze.next?.nextTime).format('YYYY-MM-DD HH:mm:ss')
              : '未设置复推'}
          </Text>
        </Row>
      </Column>
    </Column>
  );
}