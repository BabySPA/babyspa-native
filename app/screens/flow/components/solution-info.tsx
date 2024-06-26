import {
  Box,
  Center,
  Column,
  Icon,
  Input,
  Pressable,
  Row,
  Text,
} from 'native-base';
import BoxItem from './box-item';
import { ls, sp, ss } from '~/app/utils/style';
import useFlowStore from '~/app/stores/flow';
import { useState } from 'react';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { FlowOperatorConfigItem, TemplateGroupKeys } from '~/app/constants';
import SelectDay, { getDay } from '~/app/components/select-day';
import AddCountSelector from '~/app/components/add-count-selector';
import { TemplateModal } from '~/app/components/modals';
import useManagerStore from '~/app/stores/manager';
import { FollowUpStatus } from '~/app/stores/flow/type';
import { RadioBox } from '~/app/components/radio';
import { TemplateExtraModal } from '../../../components/modals';
import { KeyboardAvoidingView, Platform } from 'react-native';
import DatePickerModal from '~/app/components/date-picker-modal';

export default function SolutionInfo({
  selectedConfig,
}: {
  selectedConfig: FlowOperatorConfigItem;
}) {
  const currentFlow = useFlowStore((state) => state.currentFlow);
  const updateSolutionMassage = useFlowStore(
    (state) => state.updateSolutionMassage,
  );
  const updateSolutionApplication = useFlowStore(
    (state) => state.updateSolutionApplication,
  );
  const addSolutionApplication = useFlowStore(
    (state) => state.addSolutionApplication,
  );
  const removeSolutionApplication = useFlowStore(
    (state) => state.removeSolutionApplication,
  );
  const updateAnalyzeRemark = useFlowStore(
    (state) => state.updateAnalyzeRemark,
  );
  const addSolutionMassage = useFlowStore((state) => state.addSolutionMassage);
  const removeSolutionMassage = useFlowStore(
    (state) => state.removeSolutionMassage,
  );
  const updateFollowUp = useFlowStore((state) => state.updateFollowUp);
  const updateNextTime = useFlowStore((state) => state.updateNextTime);

  const getTemplateGroups = useManagerStore((state) => state.getTemplateGroups);
  const [isFollowUpDatePicker, setIsFollowUpDatePicker] =
    useState<boolean>(false);
  const [isNextDatePicker, setIsNextDatePicker] = useState<boolean>(false);
  const {
    analyze: {
      solution: { applications, massages },
      remark,
      followUp,
      next,
    },
  } = currentFlow;

  const [showRemarkModal, setShowRemarkModal] = useState(false);
  const [editAcupoint, setEditAcupoint] = useState(false);
  const [editMassageRemark, setEditMassageRemark] = useState(false);
  const [showExtraModal, setShowExtraModal] = useState<{
    isOpen: boolean;
    type: 'application' | 'massage';
  }>({
    isOpen: false,
    type: 'application',
  });

  return (
    <KeyboardAvoidingView
      style={{ height: '100%' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Row flex={1}>
        <Column flex={1}>
          <BoxItem
            flex={3}
            title={'贴敷'}
            icon={require('~/assets/images/tiefu.png')}>
            <Box>
              {applications.map((item, idx) => {
                return (
                  <Box
                    key={idx}
                    borderWidth={ss(1)}
                    borderRadius={ss(4)}
                    borderColor={'#7AB6AF'}
                    // borderStyle={'dashed'}
                    bgColor={'#F2F9F8'}
                    mt={idx === 0 ? 0 : ss(10)}
                    p={ss(20)}>
                    <Row justifyContent={'space-between'}>
                      <Row alignItems={'center'}>
                        <Center
                          w={ss(30)}
                          h={ss(30)}
                          bgColor={'#5EACA3'}
                          borderRadius={ss(15)}>
                          <Text color={'#fff'}>{idx + 1}</Text>
                        </Center>
                        <Text ml={ls(10)} color='#666' fontSize={sp(20)}>
                          {item.name}
                        </Text>
                      </Row>
                      <Pressable
                        _pressed={{
                          opacity: 0.6,
                        }}
                        hitSlop={ss(20)}
                        onPress={() => {
                          removeSolutionApplication(idx);
                        }}>
                        <Icon
                          as={<AntDesign name='delete' />}
                          size={sp(20)}
                          color={'#99A9BF'}
                        />
                      </Pressable>
                    </Row>
                    <Row
                      alignItems={'center'}
                      mt={ss(25)}
                      justifyContent={'space-between'}>
                      <Row alignItems={'flex-start'}>
                        <Row alignItems={'center'}>
                          <Text color='#666' fontSize={sp(16)}>
                            穴位：
                          </Text>

                          <Pressable
                            _pressed={{
                              opacity: 0.6,
                            }}
                            hitSlop={ss(20)}
                            onPress={() => {
                              setEditAcupoint(true);
                            }}>
                            {editAcupoint ? (
                              <Input
                                borderWidth={ss(1)}
                                borderColor={'#D8D8D8'}
                                autoFocus
                                onChangeText={(text) => {
                                  updateSolutionApplication(
                                    { ...item, acupoint: text },
                                    idx,
                                  );
                                }}
                                defaultValue={item.acupoint}
                                w={ls(130)}
                                height={ss(48)}
                                fontSize={sp(16)}
                                onBlur={() => {
                                  setEditAcupoint(false);
                                }}
                              />
                            ) : (
                              <Text
                                color='#E36C36'
                                fontSize={sp(16)}
                                maxW={ls(130)}>
                                {item.acupoint}
                              </Text>
                            )}
                          </Pressable>
                        </Row>
                      </Row>
                      <Row alignItems={'center'}>
                        <AddCountSelector
                          count={item.count}
                          onSubtraction={function (): void {
                            updateSolutionApplication(
                              { ...item, count: item.count - 1 },
                              idx,
                            );
                          }}
                          onAddition={function (): void {
                            updateSolutionApplication(
                              { ...item, count: item.count + 1 },
                              idx,
                            );
                          }}
                        />
                      </Row>
                    </Row>
                  </Box>
                );
              })}
              <Row justifyContent={'flex-end'}>
                <Pressable
                  _pressed={{
                    opacity: 0.6,
                  }}
                  hitSlop={ss(20)}
                  onPress={() => {
                    setShowExtraModal({
                      ...showExtraModal,
                      isOpen: true,
                    });
                  }}>
                  <Center
                    mt={ss(20)}
                    bgColor={'#fff'}
                    borderRadius={ss(4)}
                    borderWidth={ss(1)}
                    borderColor={'#5EACA3'}
                    w={ls(120)}
                    h={ss(44)}
                    _text={{
                      color: '#5EACA3',
                      fontSize: sp(18),
                    }}>
                    新增贴敷
                  </Center>
                </Pressable>
              </Row>
            </Box>
          </BoxItem>
          {/* <BoxItem
            flex={2}
            mt={ss(10)}
            title={'注意事项'}
            autoScroll={true}
            icon={require('~/assets/images/guidance.png')}>
            <Pressable
              _pressed={{
                opacity: 0.6,
              }}
              hitSlop={ss(20)}
              pt={ss(10)}
              onPress={() => {
                setShowRemarkModal(true);
              }}>
              <Text
                style={{
                  borderRadius: ss(4),
                  borderColor: '#DFE1DE',
                  borderWidth: ss(1),
                  height: ss(107),
                  backgroundColor: '#fff',
                  padding: ss(10),
                  fontSize: sp(18),
                  color: '#999',
                }}>
                {remark || '您可输入，或从模板选择'}
              </Text>
              {showRemarkModal && (
                <TemplateModal
                  template={getTemplateGroups(TemplateGroupKeys['flow-remark'])}
                  defaultText={remark}
                  isOpen={showRemarkModal}
                  onClose={function (): void {
                    setShowRemarkModal(false);
                  }}
                  onConfirm={function (text: string): void {
                    updateAnalyzeRemark(text);
                    setShowRemarkModal(false);
                  }}
                />
              )}
            </Pressable>
          </BoxItem> */}
        </Column>
        <Column flex={1} ml={ss(10)}>
          <BoxItem
            flex={3}
            title={'理疗'}
            icon={require('~/assets/images/massages.png')}>
            <Box>
              {massages.map((item, idx) => {
                return (
                  <Box
                    key={idx}
                    borderWidth={ss(1)}
                    borderRadius={ss(4)}
                    borderColor={'#7AB6AF'}
                    // borderStyle={'dashed'}
                    bgColor={'#F2F9F8'}
                    mt={idx === 0 ? 0 : ss(10)}
                    p={ss(20)}>
                    <Row justifyContent={'space-between'}>
                      <Row alignItems={'center'}>
                        <Center
                          w={ss(30)}
                          h={ss(30)}
                          bgColor={'#5EACA3'}
                          borderRadius={ss(15)}>
                          <Text color={'#fff'}>{idx + 1}</Text>
                        </Center>
                        <Text ml={ls(10)} color='#666' fontSize={sp(20)}>
                          {item.name}
                        </Text>
                      </Row>
                      <Pressable
                        _pressed={{
                          opacity: 0.6,
                        }}
                        hitSlop={ss(20)}
                        onPress={() => {
                          removeSolutionMassage(idx);
                        }}>
                        <Icon
                          as={<AntDesign name='delete' />}
                          size={sp(20)}
                          color={'#99A9BF'}
                        />
                      </Pressable>
                    </Row>
                    <Row
                      alignItems={'center'}
                      mt={ss(25)}
                      justifyContent={'space-between'}>
                      <Row alignItems={'flex-start'} maxW={'65%'}>
                        <Text ml={ls(10)} color='#666' fontSize={sp(16)}>
                          备注：
                        </Text>

                        <Pressable
                          _pressed={{
                            opacity: 0.6,
                          }}
                          hitSlop={ss(20)}
                          onPress={() => {
                            setEditMassageRemark(true);
                          }}>
                          {editMassageRemark ? (
                            <Input
                              borderWidth={ss(1)}
                              borderColor={'#D8D8D8'}
                              autoFocus
                              onChangeText={(text) => {
                                updateSolutionMassage(
                                  { ...item, remark: text },
                                  idx,
                                );
                              }}
                              multiline
                              textAlignVertical='top'
                              defaultValue={item.remark}
                              w={ls(300)}
                              fontSize={sp(16)}
                              onBlur={() => {
                                setEditMassageRemark(false);
                              }}
                            />
                          ) : (
                            <Text color='#E36C36' fontSize={sp(16)}>
                              {item.remark || '无'}
                            </Text>
                          )}
                        </Pressable>
                      </Row>

                      <Row alignItems={'center'}>
                        <AddCountSelector
                          count={item.count}
                          onSubtraction={function (): void {
                            updateSolutionMassage(
                              { ...item, count: item.count - 1 },
                              idx,
                            );
                          }}
                          onAddition={function (): void {
                            updateSolutionMassage(
                              { ...item, count: item.count + 1 },
                              idx,
                            );
                          }}
                        />
                      </Row>
                    </Row>
                  </Box>
                );
              })}
              <Row justifyContent={'flex-end'}>
                <Pressable
                  _pressed={{
                    opacity: 0.6,
                  }}
                  hitSlop={ss(20)}
                  onPress={() => {
                    setShowExtraModal({
                      isOpen: true,
                      type: 'massage',
                    });
                  }}>
                  <Center
                    mt={ss(20)}
                    bgColor={'#fff'}
                    borderRadius={ss(4)}
                    borderWidth={ss(1)}
                    borderColor={'#5EACA3'}
                    w={ls(120)}
                    h={ss(44)}
                    _text={{
                      color: '#5EACA3',
                      fontSize: sp(18),
                    }}>
                    新增理疗
                  </Center>
                </Pressable>
              </Row>
            </Box>
          </BoxItem>
          <BoxItem
            flex={2}
            mt={ss(10)}
            title={'随访'}
            autoScroll={true}
            icon={require('~/assets/images/guidance.png')}>
            <Row alignItems={'center'}>
              <Text fontSize={sp(20)} color='#333' mr={ls(20)}>
                是否随访
              </Text>
              <RadioBox
                margin={ss(20)}
                config={[
                  { label: '是', value: 1 },
                  { label: '否', value: 0 },
                ]}
                current={
                  followUp.followUpStatus === FollowUpStatus.NOT_SET ? 0 : 1
                }
                onChange={({ label, value }) => {
                  updateFollowUp({
                    followUpStatus:
                      value == 1 ? FollowUpStatus.WAIT : FollowUpStatus.NOT_SET,
                  });
                }}
              />
              <Text fontSize={sp(20)} color='#333' ml={ls(20)} mr={ls(10)}>
                随访时间
              </Text>

              <Pressable
                _pressed={{
                  opacity: 0.6,
                }}
                hitSlop={ss(20)}
                onPress={() => {
                  setIsFollowUpDatePicker(true);
                }}
                flexDirection={'row'}
                h={ss(44)}
                alignItems={'center'}
                pl={ls(12)}
                pr={ls(25)}
                borderRadius={ss(4)}
                borderColor={'#D8D8D8'}
                borderWidth={ss(1)}>
                <Icon
                  as={<MaterialIcons name='date-range' />}
                  size={sp(20)}
                  color='rgba(0,0,0,0.2)'
                />
                <Text color={'#333333'} fontSize={sp(14)} ml={ls(4)}>
                  {followUp.followUpTime || '未设置'}
                </Text>
              </Pressable>
            </Row>
            <Row alignItems={'center'} mt={ss(20)}>
              <Text fontSize={sp(20)} color='#333' mr={ls(20)}>
                继续调理
              </Text>
              <RadioBox
                margin={ss(20)}
                config={[
                  { label: '是', value: 1 },
                  { label: '否', value: 0 },
                ]}
                current={next.hasNext ? 1 : 0}
                onChange={({ label, value }) => {
                  updateNextTime({
                    hasNext: value == 1,
                  });
                }}
              />
              <Text fontSize={sp(20)} color='#333' ml={ls(20)} mr={ls(10)}>
                复推时间
              </Text>
              <Pressable
                _pressed={{
                  opacity: 0.6,
                }}
                hitSlop={ss(20)}
                onPress={() => {
                  setIsNextDatePicker(true);
                }}
                flexDirection={'row'}
                h={ss(44)}
                alignItems={'center'}
                pl={ls(12)}
                pr={ls(25)}
                borderRadius={ss(4)}
                borderColor={'#D8D8D8'}
                borderWidth={ss(1)}>
                <Icon
                  as={<MaterialIcons name='date-range' />}
                  size={sp(20)}
                  color='rgba(0,0,0,0.2)'
                />
                <Text color={'#333333'} fontSize={sp(14)} ml={ls(4)}>
                  {next.nextTime || '未设置'}
                </Text>
              </Pressable>
            </Row>
          </BoxItem>
        </Column>
        {showExtraModal.isOpen && (
          <TemplateExtraModal
            template={getTemplateGroups(TemplateGroupKeys[showExtraModal.type])}
            isOpen={showExtraModal.isOpen}
            onClose={function (): void {
              setShowExtraModal({
                isOpen: false,
                type: 'application',
              });
            }}
            onConfirm={function (res): void {
              if (showExtraModal.type === 'application') {
                addSolutionApplication({
                  name: res.title,
                  acupoint: res.content,
                  count: 1,
                });
              } else {
                addSolutionMassage({
                  name: res.title,
                  remark: res.content,
                  count: 1,
                });
              }
              setShowExtraModal({
                isOpen: false,
                type: 'application',
              });
            }}
          />
        )}

        {isFollowUpDatePicker && (
          <DatePickerModal
            isOpen={isFollowUpDatePicker}
            onClose={() => {
              setIsFollowUpDatePicker(false);
            }}
            onSelectedChange={(date: string) => {
              updateFollowUp({
                followUpTime: `${date} 23:59`,
              });
            }}
            current={followUp.followUpTime}
            selected={followUp.followUpTime}
            disabledWithoutToday={false}
          />
        )}

        {isNextDatePicker && (
          <DatePickerModal
            isOpen={isNextDatePicker}
            onClose={() => {
              setIsNextDatePicker(false);
            }}
            onSelectedChange={(date: string) => {
              updateNextTime({
                nextTime: `${date} 23:59`,
              });
            }}
            current={next.nextTime}
            selected={next.nextTime}
            disabledWithoutToday={false}
          />
        )}
      </Row>
    </KeyboardAvoidingView>
  );
}
