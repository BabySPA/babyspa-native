import {
  Column,
  Divider,
  Input,
  Pressable,
  Row,
  Spinner,
  Text,
} from 'native-base';
import { StyleProp, ViewStyle, Image } from 'react-native';
import useFlowStore from '~/app/stores/flow';
import BoxTitle from '~/app/components/box-title';
import { ss, ls, sp } from '~/app/utils/style';
import dayjs from 'dayjs';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackList, FlowStatus } from '~/app/types';
import {
  FlowItemResponse,
  FollowUpResult,
  FollowUpStatus,
} from '~/app/stores/flow/type';
import {
  FollowUpResultText,
  getFollowUpStatusTextConfig,
} from '~/app/constants';
import Dot from '../dot';
import { useEffect, useRef, useState } from 'react';
import { DialogModal } from '../modals';

interface FollowUpCardParams {
  style?: StyleProp<ViewStyle>;
  edit: boolean;
  currentFlow: FlowItemResponse;
}

export default function FollowUpCard(params: FollowUpCardParams) {
  const { style = {}, edit, currentFlow } = params;

  const analyze = currentFlow.analyze;
  const requestPatchFollowUp = useFlowStore(
    (state) => state.requestPatchFollowUp,
  );
  const requestGetFollowUps = useFlowStore(
    (state) => state.requestGetFollowUps,
  );

  const navigation =
    useNavigation<StackNavigationProp<AppStackList, 'FlowInfo'>>();

  const { followUp } = analyze;

  const [selectResult, setSelectResult] = useState<FollowUpResult | undefined>(
    followUp?.followUpResult || 0,
  );

  const [isEdit] = useState(edit);

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const [followupContent, setFollowupContent] = useState(
    followUp.followUpContent,
  );

  const inputRef = useRef(null);

  useEffect(() => {
    // @ts-ignore
    inputRef.current?.setNativeProps({
      text: followupContent,
    });
  }, []);
  return (
    <>
      {followUp &&
        (isEdit ? (
          <Column
            flex={1}
            bgColor={'#fff'}
            p={ss(20)}
            borderRadius={ss(10)}
            style={style}>
            <BoxTitle title='随访单' rightElement={null} />
            <Divider color={'#DFE1DE'} my={ss(14)} />
            <Column px={ls(20)}>
              <Row mt={ss(20)}>
                <Text
                  fontSize={sp(18)}
                  color='#333'
                  w={ls(100, 140)}
                  textAlign={'right'}>
                  随访编号：
                </Text>
                <Text
                  fontSize={sp(18)}
                  color='#333'
                  borderRadius={ss(4)}
                  borderWidth={ss(1)}
                  borderColor={'#EBEBEB'}
                  w={ls(362)}
                  px={ls(20)}
                  py={ss(10)}>
                  {followUp.id}
                </Text>
              </Row>
              <Row mt={ss(20)} alignItems={'center'}>
                <Text
                  fontSize={sp(18)}
                  color='#333'
                  w={ls(100, 140)}
                  textAlign={'right'}>
                  随访状态：
                </Text>
                <Text
                  fontSize={sp(18)}
                  color='#333'
                  borderRadius={ss(4)}
                  borderWidth={ss(1)}
                  borderColor={'#EBEBEB'}
                  w={ls(362)}
                  px={ls(20)}
                  py={ss(10)}>
                  {getFollowUpStatusTextConfig(followUp.followUpStatus)?.text}
                </Text>
              </Row>
              <Row mt={ss(20)}>
                <Text
                  fontSize={sp(18)}
                  color='#333'
                  w={ls(100, 140)}
                  textAlign={'right'}
                  pr={ls(20)}>
                  计划随访日期：
                </Text>
                <Text
                  fontSize={sp(18)}
                  color='#333'
                  borderRadius={ss(4)}
                  borderWidth={ss(1)}
                  borderColor={'#EBEBEB'}
                  w={ls(362)}
                  px={ls(20)}
                  py={ss(10)}>
                  {dayjs(followUp.followUpTime).format('YYYY-MM-DD')}
                </Text>
              </Row>
              <Row mt={ss(20)}>
                <Text
                  fontSize={sp(18)}
                  color='#333'
                  w={ls(100, 140)}
                  textAlign={'right'}
                  pr={ls(20)}>
                  实际随访日期：
                </Text>
                <Text
                  fontSize={sp(18)}
                  color='#333'
                  borderRadius={ss(4)}
                  borderWidth={ss(1)}
                  borderColor={'#EBEBEB'}
                  w={ls(362)}
                  px={ls(20)}
                  py={ss(10)}>
                  {dayjs(followUp.actualFollowUpTime).format('YYYY-MM-DD')}
                </Text>
              </Row>
              <Row mt={ss(20)} alignItems={'center'}>
                <Text
                  fontSize={sp(18)}
                  color='#333'
                  w={ls(120)}
                  textAlign={'right'}>
                  <Dot color='#333' w={ss(15)} h={ss(15)} /> 随访结果：
                </Text>
                <Row>
                  {Object.keys(FollowUpResultText).map((key) => (
                    <Pressable
                      _pressed={{
                        opacity: 0.6,
                      }}
                      hitSlop={ss(20)}
                      key={key}
                      onPress={() => {
                        setSelectResult(Number(key) as FollowUpResult);
                      }}>
                      <Row mr={ls(10)} alignItems={'center'}>
                        <Image
                          source={
                            selectResult == Number(key)
                              ? require('~/assets/images/check-yes.png')
                              : require('~/assets/images/check-no.png')
                          }
                          style={{ width: ss(20), height: ss(20) }}
                        />
                        <Text
                          fontSize={sp(18)}
                          ml={ls(2)}
                          color={
                            selectResult === Number(key) ? '#333' : '#999'
                          }>
                          {/* @ts-ignore */}
                          {FollowUpResultText[+key]}
                        </Text>
                      </Row>
                    </Pressable>
                  ))}
                </Row>
              </Row>
              <Row mt={ss(20)}>
                <Text
                  fontSize={sp(18)}
                  color='#333'
                  w={ls(100, 140)}
                  textAlign={'right'}>
                  随访内容：
                </Text>
                <Input
                  ref={inputRef}
                  borderWidth={ss(1)}
                  borderColor={'#D8D8D8'}
                  w={ls(362)}
                  h={ss(120)}
                  p={ss(8)}
                  textAlignVertical='top'
                  multiline={true}
                  placeholderTextColor={'#999'}
                  color={'#333333'}
                  fontSize={sp(16)}
                  onChangeText={(text) => {
                    setFollowupContent(text);
                  }}
                  placeholder='请输入'
                />
              </Row>
            </Column>
            <Row mt={ss(100)} justifyContent={'flex-end'} pr={ss(30)}>
              <Pressable
                _pressed={{
                  opacity: 0.6,
                }}
                hitSlop={ss(20)}
                onPress={() => {
                  // 取消随访
                  setShowCancelDialog(true);
                }}
                borderRadius={ss(4)}
                borderWidth={ss(1)}
                borderColor={'#F3AF62'}
                bgColor={'rgba(243, 175, 98, 0.20)'}
                width={ls(100)}
                height={ss(40)}
                flexDirection={'row'}
                justifyContent={'center'}
                alignItems={'center'}>
                {cancelLoading && (
                  <Spinner mr={ls(5)} size={sp(20)} color='#F3AF62' />
                )}
                <Text fontSize={sp(14)} color='#F3AF62'>
                  结束随访
                </Text>
              </Pressable>
              <Pressable
                _pressed={{
                  opacity: 0.6,
                }}
                hitSlop={ss(20)}
                onPress={() => {
                  // 随访
                  setShowConfirmDialog(true);
                }}
                ml={ls(20)}
                borderRadius={ss(4)}
                borderWidth={ss(1)}
                borderColor={'#03CBB2'}
                bgColor={'rgba(3, 203, 178, 0.20)'}
                width={ls(100)}
                height={ss(40)}
                flexDirection={'row'}
                justifyContent={'center'}
                alignItems={'center'}>
                {confirmLoading && (
                  <Spinner mr={ls(5)} size={sp(20)} color='#03CBB2' />
                )}
                <Text fontSize={sp(14)} color='#03CBB2'>
                  完成随访
                </Text>
              </Pressable>
              {showCancelDialog && (
                <DialogModal
                  title='是否确认结束随访？'
                  isOpen={showCancelDialog}
                  onClose={function (): void {
                    setShowCancelDialog(false);
                  }}
                  onConfirm={function (): void {
                    setCancelLoading(true);
                    requestPatchFollowUp({
                      followUpStatus: FollowUpStatus.CANCEL,
                    }).then(async (res) => {
                      await requestGetFollowUps();
                      setCancelLoading(false);
                      navigation.goBack();
                    });
                  }}
                />
              )}
              {showConfirmDialog && (
                <DialogModal
                  title='是否确认完成随访？'
                  isOpen={showConfirmDialog}
                  onClose={function (): void {
                    setShowConfirmDialog(false);
                  }}
                  onConfirm={function (): void {
                    setConfirmLoading(true);
                    requestPatchFollowUp({
                      followUpStatus: FollowUpStatus.DONE,
                      followUpResult: selectResult,
                      followUpContent: followupContent,
                    }).then(async (res) => {
                      await requestGetFollowUps();
                      setConfirmLoading(false);
                      navigation.goBack();
                    });
                  }}
                />
              )}
            </Row>
          </Column>
        ) : followUp.followUpStatus == FollowUpStatus.CANCEL ? (
          <Column
            flex={1}
            bgColor={'#fff'}
            p={ss(20)}
            borderRadius={ss(10)}
            style={style}>
            <BoxTitle title='随访单' rightElement={null} />
            <Divider color={'#DFE1DE'} my={ss(14)} />
            <Image
              source={require('~/assets/images/followup-cancel.png')}
              style={{
                width: ss(100),
                height: ss(100),
                position: 'absolute',
                right: ls(20),
                top: ss(20),
              }}
            />
            <Column alignItems={'center'} paddingBottom={ss(60)}>
              <Image
                source={require('~/assets/images/empty-box.png')}
                style={{ width: ls(360), height: ss(283) }}
              />
              <Text color='#909499' fontSize={sp(24)}>
                暂无随访信息
              </Text>
            </Column>
          </Column>
        ) : (
          <Column
            flex={1}
            bgColor={'#fff'}
            p={ss(20)}
            borderRadius={ss(10)}
            style={style}>
            <BoxTitle title='随访单' rightElement={null} />
            <Divider color={'#DFE1DE'} my={ss(14)} />
            <Column px={ls(20)}>
              <Row mt={ss(20)}>
                <Text
                  fontSize={sp(18)}
                  color='#999'
                  w={ls(100, 140)}
                  textAlign={'right'}>
                  随访编号：
                </Text>
                <Text fontSize={sp(18)} color='#333'>
                  {followUp.id}
                </Text>
              </Row>
              <Row mt={ss(20)}>
                <Text
                  fontSize={sp(18)}
                  color='#999'
                  w={ls(100, 140)}
                  textAlign={'right'}>
                  随访状态：
                </Text>
                <Text fontSize={sp(18)} color='#333'>
                  {getFollowUpStatusTextConfig(followUp.followUpStatus)?.text}
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
                  {followUp.followUpStatus === FollowUpStatus.DONE
                    ? dayjs(followUp.actualFollowUpTime).format('YYYY-MM-DD')
                    : dayjs(followUp.followUpTime).format('YYYY-MM-DD')}
                </Text>
              </Row>
              {followUp.followUpResult !== undefined && (
                <Row mt={ss(20)}>
                  <Text
                    fontSize={sp(18)}
                    color='#999'
                    w={ls(100, 140)}
                    textAlign={'right'}>
                    随访结果：
                  </Text>
                  <Text fontSize={sp(18)} color='#333'>
                    {FollowUpResultText[followUp.followUpResult]}
                  </Text>
                </Row>
              )}
              {followUp.followUpContent && (
                <Row mt={ss(20)}>
                  <Text
                    fontSize={sp(18)}
                    color='#999'
                    w={ls(100, 140)}
                    textAlign={'right'}>
                    随访内容：
                  </Text>
                  <Text fontSize={sp(18)} color='#333'>
                    {followUp.followUpContent}
                  </Text>
                </Row>
              )}
              {followUp.operator?.name && (
                <Row mt={ss(20)}>
                  <Text
                    fontSize={sp(18)}
                    color='#999'
                    w={ls(100, 140)}
                    textAlign={'right'}>
                    随访人：
                  </Text>
                  <Text fontSize={sp(18)} color='#333'>
                    {followUp.operator?.name}
                  </Text>
                </Row>
              )}
            </Column>
          </Column>
        ))}
    </>
  );
}
