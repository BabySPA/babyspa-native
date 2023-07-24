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
import { AntDesign, Feather } from '@expo/vector-icons';
import dayjs from 'dayjs';
import DashedLine from 'react-native-dashed-line';

export default function SolutionInfo() {
  const { guidanceTemplate, currentFlow, updateCurrentFlow } = useFlowStore();

  const {
    solution: { applications, massages },
  } = currentFlow;
  const [selectTemplateGroup, setSelectTemplateGroup] = useState(0);

  return (
    <Row flex={1}>
      <Column flex={1}>
        <BoxItem
          flex={2}
          title={'贴敷'}
          icon={require('~/assets/images/tiefu.png')}>
          <Box flex={1}>
            {applications.map((item, idx) => {
              return (
                <Box
                  key={idx}
                  borderWidth={1}
                  borderRadius={ss(4)}
                  borderColor={'#7AB6AF'}
                  borderStyle={'dashed'}
                  bgColor={'#F2F9F8'}
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
                    <Pressable>
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
                      <Pressable>
                        <Icon
                          as={<AntDesign name='minuscircle' />}
                          size={ss(20, { min: 16 })}
                          color={'#99A9BF'}
                        />
                      </Pressable>
                      <Text color='#E36C36' fontSize={sp(18)} mx={ss(20)}>
                        {item.count}
                      </Text>
                      <Pressable>
                        <Icon
                          as={<AntDesign name='pluscircle' />}
                          size={ss(20, { min: 16 })}
                          color={'#99A9BF'}
                        />
                      </Pressable>
                    </Row>
                  </Row>
                </Box>
              );
            })}
          </Box>
        </BoxItem>
        <BoxItem
          mt={ss(10)}
          title={'注意事项'}
          autoScroll={false}
          icon={require('~/assets/images/guidance.png')}>
          <Box flex={1} pt={ss(10)}>
            <TextInput
              multiline={true}
              placeholder='您可输入，或从模板选择'
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
          <Box flex={1}>
            {massages.map((item, idx) => {
              return (
                <Box
                  key={idx}
                  borderWidth={1}
                  borderRadius={ss(4)}
                  borderColor={'#7AB6AF'}
                  borderStyle={'dashed'}
                  bgColor={'#F2F9F8'}
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
                    <Pressable>
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
                      贴敷时长：
                      <Text color='#E36C36'>{item.remark}</Text>
                    </Text>
                    <Row alignItems={'center'}>
                      <Pressable>
                        <Icon
                          as={<AntDesign name='minuscircle' />}
                          size={ss(20, { min: 16 })}
                          color={'#99A9BF'}
                        />
                      </Pressable>
                      <Text color='#E36C36' fontSize={sp(18)} mx={ss(20)}>
                        {item.count}
                      </Text>
                      <Pressable>
                        <Icon
                          as={<AntDesign name='pluscircle' />}
                          size={ss(20, { min: 16 })}
                          color={'#99A9BF'}
                        />
                      </Pressable>
                    </Row>
                  </Row>
                </Box>
              );
            })}
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
              name='isFllowUp'
              flexDirection={'row'}
              onChange={(event) => {}}>
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
            <Select
              ml={ss(20)}
              selectedValue={`1`}
              minWidth={ss(80)}
              accessibilityLabel='Choose Service'
              placeholder='Choose Service'
              _selectedItem={{
                bg: 'teal.600',
                endIcon: (
                  <Icon
                    as={<AntDesign name='delete' />}
                    size={ss(20, { min: 16 })}
                    color={'#99A9BF'}
                  />
                ),
              }}
              mt={1}
              onValueChange={(itemValue) => {}}>
              {Array.from({ length: 30 }).map((_, idx) => {
                return <Select.Item label={`${idx}`} value={`${idx}`} />;
              })}
            </Select>
            <Text fontSize={sp(20)} color='#333' ml={ls(10)}>
              天
            </Text>
          </Row>
          <Row alignItems={'center'} mt={ss(20)}>
            <Text fontSize={sp(20)} color='#333' mr={ls(20)}>
              继续调理
            </Text>
            <Radio.Group
              name='isFllowUp'
              flexDirection={'row'}
              onChange={(event) => {}}>
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
            <Select
              ml={ss(20)}
              selectedValue={`1`}
              minWidth={ss(80)}
              accessibilityLabel='Choose Service'
              placeholder='Choose Service'
              _selectedItem={{
                bg: 'teal.600',
                endIcon: (
                  <Icon
                    as={<AntDesign name='delete' />}
                    size={ss(20, { min: 16 })}
                    color={'#99A9BF'}
                  />
                ),
              }}
              mt={1}
              onValueChange={(itemValue) => {}}>
              {Array.from({ length: 30 }).map((_, idx) => {
                return <Select.Item label={`${idx}`} value={`${idx}`} />;
              })}
            </Select>
            <Text fontSize={sp(20)} color='#333' ml={ls(10)}>
              天
            </Text>
          </Row>
        </BoxItem>
      </Column>
    </Row>
  );
}
