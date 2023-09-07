import {
  Box,
  Center,
  CheckIcon,
  Column,
  Container,
  Icon,
  Pressable,
  Radio,
  Row,
  Text,
} from 'native-base';
import BoxItem from './box-item';
import { ls, sp, ss } from '~/app/utils/style';
import useFlowStore from '~/app/stores/flow';
import { useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import dayjs from 'dayjs';
import {
  FlowOperatorConfigItem,
  SolutionDefault,
  TemplateGroupKeys,
} from '~/app/constants';
import SelectDay, { getDay } from '~/app/components/select-day';
import AddCountSelector from '~/app/components/add-count-selector';
import { TemplateModal } from '~/app/components/modals';
import useManagerStore from '~/app/stores/manager';
import SelectTimeLength from '~/app/components/select-time-length';
import { FollowUpStatus } from '~/app/stores/flow/type';
import { RadioBox } from '~/app/components/radio';

export default function SolutionInfo({
  selectedConfig,
}: {
  selectedConfig: FlowOperatorConfigItem;
}) {
  const {
    currentFlow,
    updateSolutionMassage,
    updateSolutionApplication,
    addSolutionApplication,
    removeSolutionApplication,
    updateAnalyzeRemark,
    addSolutionMassage,
    removeSolutionMassage,
    updateFollowUp,
    updateNextTime,
  } = useFlowStore();

  const { getTemplateGroups } = useManagerStore();

  const {
    analyze: {
      solution: { applications, massages },
      remark,
      followUp,
      next,
    },
  } = currentFlow;

  const [showRemarkModal, setShowRemarkModal] = useState(false);
  const [showMassageRemarkModal, setShowMassageRemarkModal] = useState(false);
  const [showAcupointModal, setShowAcupointModal] = useState(false);

  return (
    <Row flex={1}>
      <Column flex={1}>
        <BoxItem
          flex={2}
          title={'贴敷'}
          icon={require('~/assets/images/tiefu.png')}>
          <Box>
            {applications.map((item, idx) => {
              return (
                <Box
                  key={idx}
                  borderWidth={1}
                  borderRadius={4}
                  borderColor={'#7AB6AF'}
                  borderStyle={'dashed'}
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
                      hitSlop={ss(10)}
                      onPress={() => {
                        removeSolutionApplication(idx);
                      }}>
                      <Icon
                        as={<AntDesign name='delete' />}
                        size={ss(20, { min: 16 })}
                        color={'#99A9BF'}
                      />
                    </Pressable>
                  </Row>
                  <Row
                    alignItems={'center'}
                    mt={ss(25)}
                    justifyContent={'space-between'}>
                    <Row alignItems={'flex-start'}>
                      <Text ml={ls(10)} color='#666' fontSize={sp(16)}>
                        贴敷时长：
                      </Text>
                      <SelectTimeLength
                        onSelect={function (
                          selectedItem: any,
                          index: number,
                        ): void {
                          updateSolutionApplication(
                            { ...item, duration: selectedItem.value },
                            idx,
                          );
                        }}
                        defaultButtonText={
                          item.duration === 0
                            ? '请选择'
                            : dayjs(item.duration).minute() + '分钟'
                        }
                      />
                      <Row alignItems={'flex-start'}>
                        <Text color='#666' fontSize={sp(16)}>
                          穴位：
                        </Text>

                        <Pressable
                          hitSlop={ss(10)}
                          onPress={() => {
                            setShowAcupointModal(true);
                          }}>
                          <Text
                            color='#E36C36'
                            fontSize={sp(16)}
                            maxW={ls(130)}>
                            {item.acupoint || '请选择'}
                          </Text>

                          <TemplateModal
                            template={getTemplateGroups(
                              TemplateGroupKeys['application-acupoint'],
                            )}
                            defaultText={item.acupoint}
                            isOpen={showAcupointModal}
                            onClose={function (): void {
                              setShowAcupointModal(false);
                            }}
                            onConfirm={function (text: string): void {
                              // update(text);
                              updateSolutionApplication(
                                { ...item, acupoint: text },
                                idx,
                              );
                              setShowAcupointModal(false);
                            }}
                          />
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
                hitSlop={ss(10)}
                onPress={() => {
                  addSolutionApplication(SolutionDefault.application);
                }}>
                <Center
                  mt={ss(20)}
                  bgColor={'#fff'}
                  borderRadius={4}
                  borderWidth={1}
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
        <BoxItem
          mt={ss(10)}
          title={'注意事项'}
          autoScroll={false}
          icon={require('~/assets/images/guidance.png')}>
          <Pressable
            hitSlop={ss(10)}
            flex={1}
            pt={ss(10)}
            onPress={() => {
              setShowRemarkModal(true);
            }}>
            <Text
              style={{
                borderRadius: ss(4),
                borderColor: '#DFE1DE',
                borderWidth: 1,
                height: ss(107),
                backgroundColor: '#fff',
                padding: ss(10),
                fontSize: sp(18),
                color: '#999',
              }}>
              {remark || '您可输入，或从模板选择'}
            </Text>
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
          </Pressable>
        </BoxItem>
      </Column>
      <Column flex={1} ml={ss(10)}>
        <BoxItem
          flex={2}
          title={'理疗'}
          icon={require('~/assets/images/massages.png')}>
          <Box>
            {massages.map((item, idx) => {
              return (
                <Box
                  key={idx}
                  borderWidth={1}
                  borderRadius={4}
                  borderColor={'#7AB6AF'}
                  borderStyle={'dashed'}
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
                      hitSlop={ss(10)}
                      onPress={() => {
                        removeSolutionMassage(idx);
                      }}>
                      <Icon
                        as={<AntDesign name='delete' />}
                        size={ss(20, { min: 16 })}
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
                        hitSlop={ss(10)}
                        onPress={() => {
                          setShowMassageRemarkModal(true);
                        }}>
                        <Text color='#E36C36' fontSize={sp(16)}>
                          {item.remark}
                        </Text>
                        <TemplateModal
                          template={getTemplateGroups(
                            TemplateGroupKeys['massage-remark'],
                          )}
                          defaultText={remark}
                          isOpen={showMassageRemarkModal}
                          onClose={function (): void {
                            setShowMassageRemarkModal(false);
                          }}
                          onConfirm={function (text: string): void {
                            // update(text);
                            updateSolutionMassage(
                              { ...item, remark: text },
                              idx,
                            );
                            setShowMassageRemarkModal(false);
                          }}
                        />
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
                hitSlop={ss(10)}
                onPress={() => {
                  addSolutionMassage(SolutionDefault.massage);
                }}>
                <Center
                  mt={ss(20)}
                  bgColor={'#fff'}
                  borderRadius={4}
                  borderWidth={1}
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
          mt={ss(10)}
          title={'随访'}
          autoScroll={false}
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
            <Text fontSize={sp(20)} color='#333' ml={ls(60)} mr={ls(10)}>
              随访时间
            </Text>
            <SelectDay
              onSelect={function (selectedItem: any, index: number): void {
                updateFollowUp({
                  followUpTime: dayjs()
                    .add(selectedItem.value, 'day')
                    .format('YYYY-MM-DD HH:mm'),
                });
              }}
              defaultButtonText={
                followUp.followUpTime
                  ? '今'
                  : getDay(
                      Math.ceil(
                        dayjs(followUp.followUpTime).diff(dayjs(), 'hours') /
                          24,
                      ),
                    )
              }
            />
            <Text fontSize={sp(20)} color='#333' ml={ls(10)}>
              天
            </Text>
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
            <Text fontSize={sp(20)} color='#333' ml={ls(60)} mr={ls(10)}>
              复推时间
            </Text>
            <SelectDay
              onSelect={function (selectedItem: any, index: number): void {
                updateNextTime({
                  nextTime: dayjs()
                    .add(selectedItem.value, 'day')
                    .format('YYYY-MM-DD HH:mm'),
                });
              }}
              defaultButtonText={
                next.nextTime
                  ? '今'
                  : getDay(
                      Math.ceil(
                        dayjs(next.nextTime).diff(dayjs(), 'hours') / 24,
                      ),
                    )
              }
            />
            <Text fontSize={sp(20)} color='#333' ml={ls(10)}>
              天
            </Text>
          </Row>
        </BoxItem>
      </Column>
    </Row>
  );
}
