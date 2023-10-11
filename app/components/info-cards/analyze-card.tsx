import { Column, Divider, Icon, Pressable, Row, Text } from 'native-base';
import { StyleProp, ViewStyle } from 'react-native';
import useFlowStore from '~/app/stores/flow';
import BoxTitle from '~/app/components/box-title';
import { ss, ls, sp } from '~/app/utils/style';
import { Image } from 'expo-image';
import dayjs from 'dayjs';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackList, FlowStatus } from '~/app/types';
import { AnalyzeStatus, FollowUpStatus } from '~/app/stores/flow/type';

interface AnalyzeCardParams {
  style?: StyleProp<ViewStyle>;
  edit: boolean;
}

export default function AnalyzeCard(params: AnalyzeCardParams) {
  const analyze = useFlowStore((state) => state.currentFlow.analyze);
  const analyzeOperator = useFlowStore(
    (state) => state.currentFlow.analyzeOperator,
  );

  const { style = {}, edit } = params;

  const navigation =
    useNavigation<StackNavigationProp<AppStackList, 'FlowInfo'>>();

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
              _pressed={{
                opacity: 0.6,
              }}
              hitSlop={ss(20)}
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
      {analyze.status === AnalyzeStatus.NOT_SET ||
      analyze.status === AnalyzeStatus.IN_PROGRESS ? (
        <Column alignItems={'center'} py={ss(20)}>
          <Image
            source={require('~/assets/images/empty-box.png')}
            style={{ width: ls(250), height: ls(170) }}
            contentFit='contain'
          />
          <Text color='#909499' fontSize={sp(16)} mt={ss(20)}>
            暂无分析信息
          </Text>
        </Column>
      ) : (
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
                    borderWidth={ss(1)}
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
                      <Text fontSize={sp(18)} color='#999' maxW={'60%'}>
                        穴位：
                        <Text fontSize={sp(16)} color='#333'>
                          {item.acupoint || '无'}
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
                    borderWidth={ss(1)}
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
                      maxW={'100%'}
                      mt={ss(20)}>
                      备注：
                      <Text fontSize={sp(16)} color='#333'>
                        {item.remark || '无'}
                      </Text>
                    </Text>
                  </Column>
                ) : null}
              </Column>
            );
          })}

          <Row mt={ss(20)}>
            <Text
              fontSize={sp(18)}
              color='#999'
              w={ls(100, 140)}
              textAlign={'right'}>
              注意事项：
            </Text>
            <Text fontSize={sp(18)} color='#333' maxW={ls(400)}>
              {analyze.remark || '无'}
            </Text>
          </Row>

          <Row mt={ss(20)}>
            <Text
              fontSize={sp(18)}
              color='#999'
              w={ls(100, 140)}
              textAlign={'right'}>
              分析师：
            </Text>
            <Text fontSize={sp(18)} color='#333'>
              {analyzeOperator?.name || '未分析'}
            </Text>
          </Row>

          <Row mt={ss(20)}>
            <Text
              fontSize={sp(18)}
              color='#999'
              w={ls(100, 140)}
              textAlign={'right'}>
              分析时间：
            </Text>
            <Text fontSize={sp(18)} color='#333'>
              {dayjs(analyze.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
            </Text>
          </Row>

          <Row mt={ss(20)}>
            <Text
              fontSize={sp(18)}
              color='#999'
              w={ls(100, 140)}
              textAlign={'right'}>
              随访时间：
            </Text>
            <Text fontSize={sp(18)} color='#333'>
              {analyze.followUp.followUpStatus === FollowUpStatus.NOT_SET
                ? '无'
                : dayjs(analyze.followUp?.followUpTime).format(
                    'YYYY-MM-DD HH:mm:ss',
                  )}
            </Text>
          </Row>

          <Row mt={ss(20)}>
            <Text
              fontSize={sp(18)}
              color='#999'
              w={ls(100, 140)}
              textAlign={'right'}>
              复推时间：
            </Text>
            <Text fontSize={sp(18)} color='#333'>
              {analyze.next.hasNext
                ? dayjs(analyze.next?.nextTime).format('YYYY-MM-DD HH:mm:ss')
                : '无'}
            </Text>
          </Row>
        </Column>
      )}
    </Column>
  );
}
