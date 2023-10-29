import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import { Column, Row, Text, Flex, Icon, Box } from 'native-base';
import { Image } from 'react-native';
import OperateButton from '~/app/components/operate-button';
import {
  FollowUpResultText,
  getFollowUpStatusTextConfig,
} from '~/app/constants';
import useFlowStore from '~/app/stores/flow';
import { FlowItemResponse, FollowUpStatus } from '~/app/stores/flow/type';
import { getAge } from '~/app/utils';
import { ss, ls, sp } from '~/app/utils/style';

export default function CustomerFollowUpItem({
  flow,
}: {
  flow: FlowItemResponse;
}) {
  const followup = flow.analyze.followUp;
  const customer = flow.customer;
  const hasNotFollowup =
    followup?.followUpStatus === FollowUpStatus.WAIT ||
    followup?.followUpStatus === FollowUpStatus.OVERDUE;
  const age = getAge(customer.birthday);
  const ageText = `${age?.year}岁${age?.month}月`;
  const navigation = useNavigation();

  const updateCurrentFlow = useFlowStore((state) => state.updateCurrentFlow);
  const OperatorStatusFlag = () => {
    return (
      <Box
        bgColor={getFollowUpStatusTextConfig(followup?.followUpStatus).bgColor}
        px={ls(12)}
        py={ss(6)}
        _text={{
          fontSize: sp(16),
          color: getFollowUpStatusTextConfig(followup?.followUpStatus)
            ?.textColor,
        }}
        borderBottomLeftRadius={ss(8)}
        borderTopRightRadius={ss(8)}>
        {getFollowUpStatusTextConfig(followup?.followUpStatus)?.text}
      </Box>
    );
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
      <Row p={ss(20)} maxW={'80%'} alignItems={'center'}>
        <Image
          style={{ width: ss(80), height: ss(80) }}
          source={
            customer.gender == 1
              ? require('~/assets/images/boy.png')
              : require('~/assets/images/girl.png')
          }
        />

        <Flex ml={ls(20)}>
          <Row alignItems={'center'}>
            <Text
              color='#333'
              fontSize={sp(20)}
              fontWeight={400}
              maxW={ls(200)}
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
              {hasNotFollowup
                ? `理疗师：${flow.collectionOperator?.name}`
                : `随访人：${flow.followUpOperator?.name}`}
            </Text>
          </Row>
          <Row alignItems={'center'} mt={ss(12)}>
            {hasNotFollowup ? (
              <Text color={'#666'} fontWeight={400} fontSize={sp(18)}>
                随访日期：
                <Text color='#C87939'>
                  {dayjs(followup?.followUpTime).format('MM-DD')}
                </Text>
              </Text>
            ) : (
              <Text color={'#666'} fontWeight={400} fontSize={sp(18)}>
                随访结果：
                <Text color='#C87939'>
                  {FollowUpResultText[followup?.followUpResult || 0]}
                </Text>
              </Text>
            )}
          </Row>
        </Flex>
      </Row>
      <Flex justifyContent={'space-between'} alignItems={'flex-end'} flex={1}>
        <OperatorStatusFlag />

        {hasNotFollowup && (
          <OperateButton
            text={'随访'}
            onPress={function (): void {
              // goto followup
              navigation.navigate('FlowInfo', {
                from: 'follow-up',
                currentFlow: flow,
              });
            }}
          />
        )}
      </Flex>
    </Row>
  );
}
