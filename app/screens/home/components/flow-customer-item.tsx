import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import { Column, Row, Text, Flex, Icon, Box } from 'native-base';
import { memo } from 'react';
import { Image } from 'react-native';
import OperateButton from '~/app/components/operate-button';
import {
  EvaluateTextConfig,
  getFlowStatus,
  getStatusTextConfig,
} from '~/app/constants';
import useFlowStore from '~/app/stores/flow';
import {
  AnalyzeStatus,
  CollectStatus,
  Customer,
  EvaluateStatus,
  FlowItemResponse,
  RegisterStatus,
  Score,
} from '~/app/stores/flow/type';
import { FlowStatus, OperateType } from '~/app/types';
import { getAge } from '~/app/utils';
import { ss, ls, sp } from '~/app/utils/style';

function FlowCustomerItem({
  flow,
  type,
}: {
  flow: FlowItemResponse;
  type: OperateType;
}) {
  const customer: Customer = flow.customer;
  const age = getAge(customer.birthday);
  const ageText = `${age?.year}岁${age?.month}月`;
  const navigation = useNavigation();
  const updateCurrentFlow = useFlowStore((state) => state.updateCurrentFlow);

  const flowStatus = getFlowStatus(flow);

  const OperatorStatusFlag = () => {
    if (type === OperateType.Evaluate) {
      return (
        <Box
          bgColor={
            EvaluateTextConfig[
              flow.evaluate.status == EvaluateStatus.DONE ? 'DONE' : 'TODO'
            ].bgColor
          }
          px={ls(12)}
          py={ss(6)}
          _text={{
            fontSize: sp(16),
            color:
              EvaluateTextConfig[
                flow.evaluate.status == EvaluateStatus.DONE ? 'DONE' : 'TODO'
              ].textColor,
          }}
          borderBottomLeftRadius={ss(8)}
          borderTopRightRadius={ss(8)}>
          {
            EvaluateTextConfig[
              flow.evaluate.status == EvaluateStatus.DONE ? 'DONE' : 'TODO'
            ].text
          }
        </Box>
      );
    } else {
      const statusConfig = getStatusTextConfig(
        flowStatus,
        flow.analyze.updatedAt ? flow.analyzeOperator?.name : '',
      );
      return (
        <Box
          bgColor={statusConfig?.bgColor}
          px={ls(12)}
          py={ss(6)}
          _text={{
            fontSize: sp(16),
            color: statusConfig?.textColor,
          }}
          borderBottomLeftRadius={ss(8)}
          borderTopRightRadius={ss(8)}>
          {statusConfig?.text}
        </Box>
      );
    }
  };

  return (
    <Row
      borderRadius={ss(8)}
      borderStyle={'dashed'}
      borderWidth={ss(1)}
      borderColor={'#15BD8F'}
      w={'100%'}
      minH={ss(148)}
      justifyContent={'space-between'}>
      <Row p={ss(20)} maxW={'70%'}>
        <Column justifyContent={'flex-start'} alignItems={'center'}>
          <Image
            style={{ width: ss(60), height: ss(60) }}
            source={
              customer.gender == 1
                ? require('~/assets/images/boy.png')
                : require('~/assets/images/girl.png')
            }
          />
          <Text color='#F7BA2A' fontSize={sp(24)}>
            {flow.tag}
          </Text>
        </Column>

        <Flex ml={ls(20)}>
          <Row alignItems={'center'}>
            <Text
              color='#333'
              fontSize={sp(20)}
              fontWeight={400}
              maxW={ls(180)}
              numberOfLines={1}
              ellipsizeMode='tail'>
              {customer.name}
              {customer.nickname && <Text>({customer.nickname})</Text>}
            </Text>
            <Icon
              as={
                <MaterialCommunityIcons
                  name={customer.gender == 1 ? 'gender-male' : 'gender-female'}
                />
              }
              size={sp(26)}
              color={customer.gender == 1 ? '#648B62' : '#F3AF62'}
            />
            <Text
              color={'#99A9BF'}
              fontWeight={400}
              fontSize={sp(18)}
              ml={ls(3)}>
              {ageText}
            </Text>
          </Row>
          <Row alignItems={'center'}>
            <Text mt={ss(10)} color={'#666'} fontSize={sp(18)}>
              理疗师：{flow.collectionOperator?.name || '无'}
            </Text>
            {(type == OperateType.Evaluate ||
              (type == OperateType.Analyze &&
                flow.analyze.status === AnalyzeStatus.DONE)) && (
              <Text mt={ss(10)} color={'#666'} fontSize={sp(18)} ml={ss(30)}>
                分析师：{flow.analyzeOperator?.name}
              </Text>
            )}
          </Row>
          <Row alignItems={'center'}>
            {(type == OperateType.Analyze || type == OperateType.Evaluate) && (
              <Text color={'#666'} fontSize={sp(18)} mt={ss(10)}>
                门店：{flow.shop?.name}
              </Text>
            )}
            {type == OperateType.Evaluate &&
              flow.evaluate.status == EvaluateStatus.DONE && (
                <Text color={'#666'} fontSize={sp(18)} mt={ss(10)} ml={ss(30)}>
                  评价人：{flow.evaluateOperator?.name}
                </Text>
              )}
          </Row>
          {type == OperateType.Evaluate && (
            <Row alignItems={'center'} mt={ss(10)}>
              <Text color={'#666'} fontSize={sp(18)}>
                评星：
              </Text>
              {flow.evaluate.score ? (
                new Array(flow.evaluate.score).fill(1).map((item, idx) => {
                  return (
                    <Image
                      key={idx}
                      source={require('~/assets/images/star.png')}
                      style={{ width: ss(20), height: ss(20) }}
                    />
                  );
                })
              ) : (
                <Text color={'#999'} fontSize={sp(16)}>
                  暂未评价
                </Text>
              )}
            </Row>
          )}
          <Row alignItems={'center'} mt={ss(10)}>
            <Icon
              as={<Ionicons name={'ios-time-outline'} />}
              size={sp(17)}
              color={'#C87939'}
            />
            <Text
              color={'#C87939'}
              fontWeight={400}
              fontSize={sp(18)}
              ml={ls(10)}>
              {dayjs(flow.updatedAt).format('YYYY-MM-DD HH:mm')}
            </Text>
          </Row>
        </Flex>
      </Row>
      <Flex justifyContent={'space-between'} alignItems={'flex-end'} flex={1}>
        <OperatorStatusFlag />

        {type === OperateType.Collection &&
          flow.register.status == RegisterStatus.DONE && (
            <OperateButton
              text={'采集'}
              onPress={() => {
                updateCurrentFlow(flow);
                navigation.navigate('Flow', {
                  type: FlowStatus.ToBeCollected,
                });
              }}
            />
          )}

        {type === OperateType.Analyze &&
          flow.register.status == RegisterStatus.DONE &&
          flow.collect.status == CollectStatus.DONE &&
          (flow.analyze.status == AnalyzeStatus.NOT_SET ||
            flow.analyze.status === AnalyzeStatus.IN_PROGRESS) && (
            <OperateButton
              text={'分析'}
              onPress={() => {
                updateCurrentFlow(flow);
                navigation.navigate('Flow', {
                  type: FlowStatus.ToBeAnalyzed,
                });
              }}
            />
          )}

        {type === OperateType.Evaluate &&
          flow.evaluate.status == EvaluateStatus.NOT_SET && (
            <OperateButton
              text={'评价'}
              onPress={() => {
                navigation.navigate('FlowInfo', {
                  from: 'evaluate',
                  currentFlow: flow,
                });
              }}
            />
          )}
      </Flex>
    </Row>
  );
}

export default memo(FlowCustomerItem);
