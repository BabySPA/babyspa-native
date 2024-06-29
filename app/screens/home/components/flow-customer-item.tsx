import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import { Text } from 'native-base';
import { memo } from 'react';
import { Image, View } from 'react-native';
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
    let statusConfig;
    if (type === OperateType.Evaluate) {
      statusConfig =
        EvaluateTextConfig[
          flow.evaluate.status == EvaluateStatus.DONE ? 'DONE' : 'TODO'
        ];
    } else {
      statusConfig = getStatusTextConfig(
        flowStatus,
        flow.analyze?.updatedAt ? flow.analyzeOperator?.name : '',
      );
    }

    return (
      <View
        style={{
          backgroundColor: statusConfig?.bgColor,
          paddingHorizontal: ls(12),
          paddingVertical: ss(6),
          borderBottomLeftRadius: ss(8),
          borderTopRightRadius: ss(8),
        }}>
        <Text
          style={{
            fontSize: sp(16),
            color: statusConfig?.textColor,
          }}>
          {statusConfig?.text}
        </Text>
      </View>
    );
  };

  return (
    <View
      style={{
        borderRadius: ss(8),
        borderWidth: ss(1),
        borderColor: '#15BD8F',
        width: '100%',
        minHeight: ss(148),
        justifyContent: 'space-between',
        flexDirection: 'row',
      }}>
      <View style={{ padding: ss(20), maxWidth: '70%', flexDirection: 'row' }}>
        <View style={{ justifyContent: 'flex-start', alignItems: 'center' }}>
          <Image
            style={{ width: ss(60), height: ss(60) }}
            source={
              customer.gender == 1
                ? require('~/assets/images/boy.png')
                : require('~/assets/images/girl.png')
            }
          />
          <Text
            style={{ color: '#F7BA2A', fontSize: sp(18), marginTop: ss(10) }}>
            {flow.tag}
          </Text>
        </View>

        <View style={{ marginLeft: ss(20) }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              style={{
                color: '#333',
                fontSize: sp(20),
                fontWeight: '400',
                maxWidth: ss(180),
                flexWrap: 'wrap',
              }}>
              {customer.name}
              {customer.nickname && <Text>({customer.nickname})</Text>}
            </Text>
            <MaterialCommunityIcons
              name={customer.gender == 1 ? 'gender-male' : 'gender-female'}
              size={sp(26)}
              color={customer.gender == 1 ? '#648B62' : '#F3AF62'}
            />
            <Text
              style={{
                color: '#99A9BF',
                fontWeight: '400',
                fontSize: sp(18),
                marginLeft: ss(3),
              }}>
              {ageText}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              style={{ marginTop: ss(10), color: '#666', fontSize: sp(18) }}>
              理疗师：{flow.collectionOperator?.name || '无'}
            </Text>
            {(type == OperateType.Evaluate ||
              (type == OperateType.Analyze &&
                flow.analyze.status === AnalyzeStatus.DONE)) && (
              <Text
                style={{
                  marginTop: ss(10),
                  color: '#666',
                  fontSize: sp(18),
                  marginLeft: ss(30),
                }}>
                分析师：{flow.analyzeOperator?.name}
              </Text>
            )}
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {(type == OperateType.Analyze || type == OperateType.Evaluate) && (
              <Text
                style={{ color: '#666', fontSize: sp(18), marginTop: ss(10) }}>
                门店：{flow.shop?.name}
              </Text>
            )}
            {type == OperateType.Evaluate &&
              flow.evaluate.status == EvaluateStatus.DONE && (
                <Text
                  style={{
                    color: '#666',
                    fontSize: sp(18),
                    marginTop: ss(10),
                    marginLeft: ss(30),
                  }}>
                  评价人：{flow.evaluateOperator?.name}
                </Text>
              )}
          </View>

          {type == OperateType.Evaluate && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: ss(10),
              }}>
              <Text style={{ color: '#666', fontSize: sp(18) }}>评星：</Text>
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
                <Text style={{ color: '#999', fontSize: sp(16) }}>
                  暂未评价
                </Text>
              )}
            </View>
          )}

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: ss(10),
            }}>
            <Ionicons
              name={'ios-time-outline'}
              size={sp(17)}
              color={'#C87939'}
            />
            <Text
              style={{
                color: '#C87939',
                fontWeight: '400',
                fontSize: sp(18),
                marginLeft: ss(10),
              }}>
              {dayjs(flow.analyze?.updatedAt || flow.updatedAt).format(
                'YYYY-MM-DD HH:mm',
              )}
            </Text>
          </View>
        </View>
      </View>

      <View
        style={{
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flex: 1,
        }}>
        <OperatorStatusFlag />

        {type === OperateType.Collection &&
          flow.register.status == RegisterStatus.DONE && (
            <OperateButton
              text={'采集'}
              onPress={() => {
                updateCurrentFlow(flow);
                navigation.navigate('Flow', { type: FlowStatus.ToBeCollected });
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
                navigation.navigate('Flow', { type: FlowStatus.ToBeAnalyzed });
              }}
            />
          )}

        {type === OperateType.Evaluate &&
          flow.evaluate.status == EvaluateStatus.NOT_SET && (
            <OperateButton
              text={'评价'}
              onPress={() => {
                updateCurrentFlow(flow);
                navigation.navigate('FlowInfo', {
                  from: 'evaluate',
                  currentFlow: flow,
                });
              }}
            />
          )}
      </View>
    </View>
  );
}

export default memo(FlowCustomerItem);
