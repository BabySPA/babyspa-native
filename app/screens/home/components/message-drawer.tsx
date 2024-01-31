import { AntDesign } from '@expo/vector-icons';
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
  Icon,
} from 'native-base';
import { useEffect, useState } from 'react';
import { Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useToast } from 'react-native-toast-notifications';
import EmptyBox from '~/app/components/empty-box';
import { DialogModal } from '~/app/components/modals';

import useFlowStore from '~/app/stores/flow';
import {
  AnalyzeStatus,
  CollectStatus,
  FollowUpStatus,
} from '~/app/stores/flow/type';
import useMessageStore, { Message, MessageAction } from '~/app/stores/message';
import { FlowStatus } from '~/app/types';
import { ls, sp, ss } from '~/app/utils/style';
import { toastAlert } from '~/app/utils/toast';

export default function MessageDrawer() {
  const messages = useMessageStore((state) => state.messages);
  const requestDeleteAllMessage = useMessageStore(
    (state) => state.requestDeleteAllMessage,
  );
  const requestMessages = useMessageStore((state) => state.requestMessages);
  const unReadCount = useMessageStore((state) => state.unReadCount);
  const readMessage = useMessageStore((state) => state.readMessage);

  const updateCurrentFlow = useFlowStore((state) => state.updateCurrentFlow);
  const requestGetFlowById = useFlowStore((state) => state.requestGetFlowById);

  const navigation = useNavigation();

  const toast = useToast();

  useEffect(() => {
    requestMessages();
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
            if (flow.analyze.status === AnalyzeStatus.NOT_SET) {
              updateCurrentFlow(flow);
              navigation.navigate('Flow', {
                type: FlowStatus.ToBeCollected,
              });
            } else {
              navigation.navigate('FlowInfo', {
                from: 'analyze',
                currentFlow: flow,
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
            if (flow.analyze.followUp.followUpStatus === FollowUpStatus.WAIT) {
              navigation.navigate('FlowInfo', {
                from: 'follow-up',
                currentFlow: flow,
              });
            } else {
              navigation.navigate('FlowInfo', {
                from: 'follow-up-detail',
                currentFlow: flow,
              });
            }
            // 更新message hasRead
            readMessage(message._id);
          });
        },
      },
    };
    // @ts-ignore
    return actions[message.action];
  };

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const safe = useSafeAreaInsets();
  return (
    <Column paddingBottom={safe.bottom + 50} bgColor={'#fff'} h={'100%'}>
      <Row p={ss(24)} justifyContent={'space-between'}>
        <Row>
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
              <Text color={'#fff'} fontSize={sp(10)}>
                {unReadCount}
              </Text>
            </Circle>
          )}
        </Row>
        <Pressable
          alignItems={'center'}
          flexDirection={'row'}
          onPress={() => {
            setIsDeleteDialogOpen(true);
          }}>
          <Icon
            as={<AntDesign name='delete' />}
            size={sp(16)}
            color={'#99A9BF'}
          />
          <Text fontSize={sp(16)} color={'#333'} ml={ss(3)}>
            清空
          </Text>
          {isDeleteDialogOpen && (
            <DialogModal
              isOpen={isDeleteDialogOpen}
              onClose={function (): void {
                setIsDeleteDialogOpen(false);
              }}
              title='是否确认清空所有消息，清空后不可恢复。'
              onConfirm={function (): void {
                setIsDeleteDialogOpen(false);

                requestDeleteAllMessage()
                  .then(async (res) => {
                    // 取消成功
                    toastAlert(toast, 'success', '清空消息成功！');
                    navigation.goBack();
                  })
                  .catch(() => {
                    // 取消失败
                    toastAlert(toast, 'error', '清空消息失败！');
                  });
              }}
            />
          )}
        </Pressable>
      </Row>
      <Divider h={ss(1)} />
      {messages.length > 0 ? (
        <FlatList
          nestedScrollEnabled
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
