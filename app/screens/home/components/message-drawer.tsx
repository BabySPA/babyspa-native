import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import {
  Column,
  Divider,
  FlatList,
  Row,
  Text,
  Pressable,
  Circle,
  Center,
} from 'native-base';
import { useEffect } from 'react';
import { Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import EmptyBox from '~/app/components/empty-box';

import useFlowStore from '~/app/stores/flow';
import {
  AnalyzeStatus,
  CollectStatus,
  FollowUpStatus,
} from '~/app/stores/flow/type';
import useMessageStore, { Message, MessageAction } from '~/app/stores/message';
import { FlowStatus } from '~/app/types';
import { ls, sp, ss } from '~/app/utils/style';

export default function MessageDrawer() {
  const { messages, requestMessages, unReadCount, readMessage } =
    useMessageStore();
  const { updateCurrentFlow, requestGetFlowById } = useFlowStore();
  const navigation = useNavigation();

  // 开启消息轮询
  let interval: any;
  const startRequestMessagesInterval = () => {
    if (interval) {
      return;
    }
    interval = setInterval(() => {
      requestMessages();
    }, 15 * 1000);
  };

  useEffect(() => {
    requestMessages();
    startRequestMessagesInterval();
    return () => {
      interval && clearInterval(interval);
    };
  }, []);

  const getAction = (message: Message) => {
    const actions = {
      [MessageAction.COLLECTION_TODO]: {
        title: '客户已登记',
        des: `当前有客户【${message.customer.name}】已登记，点击进行采集！`,
        action: () => {
          requestGetFlowById(message.flowId).then((flow) => {
            updateCurrentFlow(flow);

            if (flow.collect.status === CollectStatus.NOT_SET) {
              navigation.navigate('Flow', {
                type: FlowStatus.ToBeCollected,
              });
            } else {
              navigation.navigate('AnalyzeInfo');
            }

            // 更新message hasRead
            readMessage(message._id);
          });
        },
      },
      [MessageAction.COLLECTION_UPDATE]: {
        title: '客户采集更新',
        des: `当前有客户【${message.customer.name}】采集更新，点击查看并分析！`,
        action: () => {
          requestGetFlowById(message.flowId).then((flow) => {
            updateCurrentFlow(flow);

            if (flow.analyze.status === AnalyzeStatus.NOT_SET) {
              navigation.navigate('Flow', {
                type: FlowStatus.ToBeCollected,
              });
            } else {
              navigation.navigate('FlowInfo', {
                from: 'analyze',
              });
            }

            // 更新message hasRead
            readMessage(message._id);
          });
        },
      },
      [MessageAction.ANALYZE_UPDATE]: {
        title: '客户分析更新',
        des: `当前有客户【${message.customer.name}】分析更新，点击查看并开始理疗！`,
        action: () => {
          requestGetFlowById(message.flowId).then((flow) => {
            updateCurrentFlow(flow);
            navigation.navigate('AnalyzeInfo');
          });
          // 更新message hasRead
          readMessage(message._id);
        },
      },
      [MessageAction.FOLLOWUP_TODO]: {
        title: '客户待回访',
        des: `当前有客户【${message.customer.name}】设置待回访，请查看并及时跟进回访！`,
        action: () => {
          requestGetFlowById(message.flowId).then((flow) => {
            updateCurrentFlow(flow);
            if (flow.analyze.followUp.followUpStatus === FollowUpStatus.WAIT) {
              navigation.navigate('FlowInfo', {
                from: 'follow-up',
              });
            } else {
              navigation.navigate('FlowInfo', {
                from: 'follow-up-detail',
              });
            }
            // 更新message hasRead
            readMessage(message._id);
          });
        },
      },
    };
    return actions[message.action];
  };

  const safe = useSafeAreaInsets();
  return (
    <Column paddingBottom={safe.bottom + 50} bgColor={'#fff'} h={'100%'}>
      <Row alignItems={'flex-start'} p={ss(24)}>
        <Text fontSize={sp(20)} color={'#000'} fontWeight={600}>
          消息
        </Text>
        {unReadCount > 0 && (
          <Circle
            bgColor={'#E24A3D'}
            size={sp(16)}
            mt={-ss(5)}
            ml={-ss(5)}
            justifyContent={'center'}
            alignContent={'center'}>
            <Text color={'#fff'} fontSize={sp(12)}>
              {unReadCount}
            </Text>
          </Circle>
        )}
      </Row>
      <Divider h={ss(1)} />
      {messages.length > 0 ? (
        <FlatList
          p={ss(20)}
          data={messages}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            const action = getAction(item);
            return (
              <Pressable onPress={action.action}>
                <Column
                  p={ss(10)}
                  mb={ss(20)}
                  borderRadius={ss(4)}
                  borderWidth={ss(1)}
                  borderColor={'#D8D8D8'}>
                  <Row alignItems={'center'} justifyContent={'space-between'}>
                    <Row alignItems={'center'}>
                      <Image
                        source={
                          item.hasRead
                            ? require('~/assets/images/msg-item.png')
                            : require('~/assets/images/msg-item-read.png')
                        }
                        style={{ width: ss(40), height: ss(40) }}
                        resizeMode='cover'
                      />
                      <Text fontSize={sp(16)} color={'#333'} ml={ss(10)}>
                        {action.title}
                      </Text>
                    </Row>
                    <Text fontSize={sp(12)} color={'#666'}>
                      {dayjs(item.updatedAt).format('YYYY-MM-DD HH:mm')}
                    </Text>
                  </Row>
                  <Text color='#666' fontSize={sp(14)} mt={ss(12)}>
                    {action.des}
                  </Text>
                </Column>
              </Pressable>
            );
          }}
        />
      ) : (
        <Center mt={ss(60)}>
          <Image
            style={{ width: ls(260), height: ss(111) }}
            source={require('~/assets/images/no-data.png')}
            resizeMode='contain'
          />
          <Text fontSize={sp(14)} color='#999' mt={ss(46)}>
            暂无更多消息
          </Text>
        </Center>
      )}
    </Column>
  );
}
