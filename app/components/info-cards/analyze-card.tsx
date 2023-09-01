import { Column, Divider, Icon, Pressable, Row, Text } from 'native-base';
import { StyleProp, ViewStyle } from 'react-native';
import useFlowStore from '~/app/stores/flow';
import BoxTitle from '~/app/components/box-title';
import { ss, ls, sp } from '~/app/utils/style';
import { Image } from 'expo-image';
import dayjs from 'dayjs';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackList, FlowStatus } from '~/app/types';
import { FollowUpStatus } from '~/app/stores/flow/type';

interface AnalyzeCardParams {
  style?: StyleProp<ViewStyle>;
  edit: boolean;
}

export default function AnalyzeCard(params: AnalyzeCardParams) {
  const {
    currentFlow: { analyze },
  } = useFlowStore();
  const { style = {}, edit } = params;

  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackList, 'FlowInfo'>>();

  return (
    <Column
      flex={1}
      bgColor={'#fff'}
      p={ss(20)}
      borderRadius={ss(10)}
      style={style}>
      <BoxTitle
        title='分析信息'
        rightElement={
          edit &&
          analyze.editable !== false && (
            <Pressable
              hitSlop={ss(10)}
              onPress={() => {
                navigation.replace('Flow', {
                  type: FlowStatus.ToBeAnalyzed,
                });
              }}>
              <Text fontSize={sp(14)} color='#03CBB2'>
                修改
              </Text>
            </Pressable>
          )
        }
      />
      <Divider color={'#DFE1DE'} my={ss(14)} />
      <Column px={ls(20)}>
        {analyze.solution.applications.map((item, idx) => {
          return (
            <Column key={idx}>
              {item.count ? (
                <Column
                  mt={idx === 0 ? 0 : ss(20)}
                  bgColor={'#F2F9F8'}
                  borderRadius={1}
                  borderStyle={'dashed'}
                  borderWidth={1}
                  borderColor={'#7AB6AF'}
                  p={ss(20)}>
                  <Row
                    alignItems={'flex-start'}
                    justifyContent={'space-between'}>
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
                        {dayjs(item.duration).minute() + '分钟'}
                      </Text>
                    </Text>
                    <Text
                      fontSize={sp(18)}
                      color='#999'
                      noOfLines={4}
                      maxW={'60%'}>
                      穴位：
                      <Text fontSize={sp(16)} color='#333'>
                        {item.acupoint || '未设置'}
                      </Text>
                    </Text>
                  </Row>
                </Column>
              ) : null}
            </Column>
          );
        })}
        {analyze.solution.massages.map((item, idx) => {
          return (
            <Column key={idx}>
              {item.count ? (
                <Column
                  mt={ss(20)}
                  bgColor={'#F2F9F8'}
                  borderRadius={1}
                  borderStyle={'dashed'}
                  borderWidth={1}
                  borderColor={'#7AB6AF'}
                  p={ss(20)}>
                  <Row
                    alignItems={'flex-start'}
                    justifyContent={'space-between'}>
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
                      {item.remark || '未设置'}
                    </Text>
                  </Text>
                </Column>
              ) : null}
            </Column>
          );
        })}

        <Row mt={ss(20)}>
          <Text fontSize={sp(18)} color='#999' w={ls(100)} textAlign={'right'}>
            注意事项：
          </Text>
          <Text fontSize={sp(18)} color='#333'>
            {analyze.remark || '未设置'}
          </Text>
        </Row>

        <Row mt={ss(20)}>
          <Text fontSize={sp(18)} color='#999' w={ls(100)} textAlign={'right'}>
            分析师：
          </Text>
          <Text fontSize={sp(18)} color='#333'>
            {analyze.operator?.name || '未分析'}
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
            {analyze.followUp.followUpStatus === FollowUpStatus.NOT_SET
              ? '未设置随访'
              : dayjs(analyze.followUp?.followUpTime).format(
                  'YYYY-MM-DD HH:mm:ss',
                )}
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
