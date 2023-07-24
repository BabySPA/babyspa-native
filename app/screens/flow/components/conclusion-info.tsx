import { Box, Center, Column, Container, Icon, Row, Text } from 'native-base';
import BoxItem from './box-item';
import { Pressable, TextInput } from 'react-native';
import { ls, sp, ss } from '~/app/utils/style';
import useFlowStore from '~/app/stores/flow';
import { useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import dayjs from 'dayjs';
import DashedLine from 'react-native-dashed-line';

export default function ConclusionInfo() {
  const {
    guidanceTemplate,
    currentFlow: { analyze },
    updateAnalyze,
  } = useFlowStore();

  const [selectTemplateGroup, setSelectTemplateGroup] = useState(0);

  return (
    <Row flex={1}>
      <Column flex={1}>
        <BoxItem
          title={'分析结论'}
          icon={require('~/assets/images/guidance.png')}>
          <Box flex={1}>
            <TextInput
              multiline={true}
              placeholder='您可输入，或从右侧分类中选择'
              style={{
                textAlignVertical: 'top',
                borderRadius: ss(4),
                borderColor: '#DFE1DE',
                borderWidth: 1,
                height: ss(170),
                backgroundColor: '#F8F8F8',
                padding: ss(10),
                fontSize: sp(14),
                color: '#999',
              }}
              value={analyze.conclusion}
            />
          </Box>
        </BoxItem>
        <BoxItem
          mt={ss(10)}
          title={'分析记录'}
          icon={require('~/assets/images/guidance.png')}>
          <Box flex={1} pt={ss(10)}>
            {/* {currentFlow.conclusions.map((item, idx) => {
              return (
                <Row key={idx} alignItems={'flex-start'}>
                  <Column alignItems={'center'}>
                    <Box
                      w={ss(10)}
                      h={ss(10)}
                      borderRadius={ss(5)}
                      bgColor={'#5EACA3'}
                    />
                    {idx !== currentFlow.conclusions.length - 1 && (
                      <DashedLine
                        axis='vertical'
                        dashLength={ss(2)}
                        dashGap={ss(2)}
                        dashColor='#5EACA3'
                        style={{ height: ss(70) }}
                      />
                    )}
                  </Column>
                  <Row
                    w='90%'
                    justifyContent={'space-between'}
                    mb={ss(20)}
                    ml={ss(10)}
                    mt={-ss(7)}>
                    <Column>
                      <Text color='#BCBCBC' fontSize={sp(18)}>
                        {dayjs(item.updatedAt).format('YYYY-MM-DD HH:mm')}
                      </Text>
                      <Text color='#333' fontSize={sp(18)} mt={ss(7)}>
                        {item.content}
                      </Text>
                    </Column>
                    <Text color='#BCBCBC' fontSize={sp(18)}>
                      {item.operator.name}
                    </Text>
                  </Row>
                </Row>
              );
            })} */}
          </Box>
        </BoxItem>
      </Column>
      <Column flex={1} ml={ss(10)}>
        <Row flex={1} bgColor='#fff' borderRadius={ss(10)}>
          <Column bgColor={'#EDF7F6'}>
            {guidanceTemplate.map((item, idx) => {
              return (
                <Pressable
                  key={idx}
                  onPress={() => {
                    setSelectTemplateGroup(idx);
                  }}>
                  <Center
                    p={ss(10)}
                    w={ss(80)}
                    h={ss(80)}
                    borderTopLeftRadius={ss(10)}
                    bgColor={
                      selectTemplateGroup === idx ? '#ffffff' : '#EDF7F6'
                    }>
                    <Icon
                      as={<AntDesign name='appstore1' />}
                      size={ss(18, { min: 15 })}
                      color={
                        selectTemplateGroup === idx ? '#5EACA3' : '#99A9BF'
                      }
                    />
                    <Text
                      mt={ss(3)}
                      fontSize={sp(18)}
                      color={
                        selectTemplateGroup === idx ? '#5EACA3' : '#99A9BF'
                      }>
                      {item.key}
                    </Text>
                  </Center>
                </Pressable>
              );
            })}
          </Column>
          <Row flex={1} flexWrap={'wrap'} py={ss(16)} px={ls(20)}>
            {guidanceTemplate[selectTemplateGroup].children.map((item, idx) => {
              return (
                <Pressable
                  key={idx}
                  onPress={() => {
                    updateAnalyze({
                      conclusion:
                        analyze.conclusion.trim().length > 0
                          ? analyze.conclusion + ',' + item
                          : item,
                    });
                  }}>
                  <Box
                    px={ls(20)}
                    py={ss(7)}
                    mr={ls(10)}
                    mb={ss(10)}
                    borderRadius={ss(2)}
                    borderColor={'#D8D8D8'}
                    borderWidth={1}>
                    <Text fontSize={sp(18)} color='#000'>
                      {item}
                    </Text>
                  </Box>
                </Pressable>
              );
            })}
          </Row>
        </Row>
      </Column>
    </Row>
  );
}
