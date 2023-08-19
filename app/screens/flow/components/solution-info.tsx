import {
  Box,
  Center,
  CheckIcon,
  Column,
  Container,
  Icon,
  Radio,
  Row,
  Select,
  Text,
} from 'native-base';
import BoxItem from './box-item';
import { Pressable, TextInput } from 'react-native';
import { ls, sp, ss } from '~/app/utils/style';
import useFlowStore from '~/app/stores/flow';
import { useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { SolutionDefault } from '~/app/constants';
import SelectDay, { getDay } from '~/app/components/select-day';
import AddCountSelector from '~/app/components/add-count-selector';

export default function SolutionInfo() {
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

  const {
    analyze: {
      solution: { applications, massages },
      remark,
      followUp,
      next,
    },
  } = currentFlow;

  const [selectTemplateGroup, setSelectTemplateGroup] = useState(0);

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
                  borderRadius={ss(4)}
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
                    <Row>
                      <Text ml={ls(10)} color='#666' fontSize={sp(16)}>
                        贴敷时长：
                        <Text color='#E36C36'>
                          {dayjs(item.duration).minute()} 分钟
                        </Text>
                      </Text>
                      <Text ml={ls(30)} color='#666' fontSize={sp(16)}>
                        穴位：
                        <Text color='#E36C36'>{item.acupoint}</Text>
                      </Text>
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
                onPress={() => {
                  addSolutionApplication(SolutionDefault.application);
                }}>
                <Center
                  mt={ss(20)}
                  bgColor={'#fff'}
                  borderRadius={ss(4)}
                  borderWidth={1}
                  borderColor={'#5EACA3'}
                  w={ls(120)}
                  h={ss(40)}
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
          <Box flex={1} pt={ss(10)}>
            <TextInput
              autoCorrect={false}
              multiline={true}
              placeholder='您可输入，或从模板选择'
              value={remark}
              onChangeText={(text) => {
                updateAnalyzeRemark(text);
              }}
              style={{
                borderRadius: ss(4),
                borderColor: '#DFE1DE',
                borderWidth: 1,
                height: ss(107),
                backgroundColor: '#fff',
                padding: ss(10),
                fontSize: sp(18),
                color: '#999',
              }}
            />
          </Box>
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
                  borderRadius={ss(4)}
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
                    <Text
                      ml={ls(10)}
                      color='#666'
                      fontSize={sp(16)}
                      maxW={'70%'}>
                      备注：
                      <Text color='#E36C36'>{item.remark}</Text>
                    </Text>
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
                onPress={() => {
                  addSolutionMassage(SolutionDefault.massage);
                }}>
                <Center
                  mt={ss(20)}
                  bgColor={'#fff'}
                  borderRadius={ss(4)}
                  borderWidth={1}
                  borderColor={'#5EACA3'}
                  w={ls(120)}
                  h={ss(40)}
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
            <Radio.Group
              name='isFollowUp'
              flexDirection={'row'}
              defaultValue={followUp.isFollowed ? '1' : '0'}
              onChange={(event) => {
                updateFollowUp({
                  isFollowed: event === '1',
                });
              }}>
              <Radio colorScheme='green' value='1' size={'sm'}>
                <Text fontSize={sp(20)} color='#333'>
                  是
                </Text>
              </Radio>
              <Radio colorScheme='green' value='0' ml={ls(20)} size={'sm'}>
                <Text fontSize={sp(20)} color='#333'>
                  否
                </Text>
              </Radio>
            </Radio.Group>
            <Text fontSize={sp(20)} color='#333' ml={ls(60)}>
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
                        dayjs('2023-08-02 05:49').diff(dayjs(), 'hours') / 24,
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
            <Radio.Group
              name='next'
              flexDirection={'row'}
              defaultValue={next.hasNext ? '1' : '0'}
              onChange={(event) => {
                updateNextTime({
                  hasNext: event === '1',
                });
              }}>
              <Radio colorScheme='green' value='1' size={'sm'}>
                <Text fontSize={sp(20)} color='#333'>
                  是
                </Text>
              </Radio>
              <Radio colorScheme='green' value='0' ml={ls(20)} size={'sm'}>
                <Text fontSize={sp(20)} color='#333'>
                  否
                </Text>
              </Radio>
            </Radio.Group>
            <Text fontSize={sp(20)} color='#333' ml={ls(60)}>
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
                        dayjs('2023-08-02 05:49').diff(dayjs(), 'hours') / 24,
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
