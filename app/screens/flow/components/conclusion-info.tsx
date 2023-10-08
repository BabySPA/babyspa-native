import { Box, Center, Column, Icon, Row, Text, Pressable } from 'native-base';
import BoxItem from './box-item';
import { Image, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { ls, sp, ss } from '~/app/utils/style';
import useFlowStore from '~/app/stores/flow';
import { useEffect, useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import useManagerStore from '~/app/stores/manager';
import { FlowOperatorConfigItem, TemplateGroupKeys } from '~/app/constants';
import DashedLine from 'react-native-dashed-line';
import dayjs from 'dayjs';
import { FlowItemResponse } from '~/app/stores/flow/type';
import { TemplateItem } from '~/app/stores/manager/type';

export default function ConclusionInfo({
  selectedConfig,
}: {
  selectedConfig: FlowOperatorConfigItem;
}) {
  const { currentFlow, updateAnalyze, requestCustomerArchiveHistory } =
    useFlowStore();

  const [analyzeHistory, setAnalyzeHistory] = useState<FlowItemResponse[]>([]);

  useEffect(() => {
    if (currentFlow.register.customerId)
      requestCustomerArchiveHistory(currentFlow.register.customerId).then(
        (res) => {
          setAnalyzeHistory(res);
        },
      );
  }, [currentFlow.register.customerId]);
  const { templates, getTemplateGroups } = useManagerStore();

  const [selectTemplateGroup, setSelectTemplateGroup] = useState(0);

  return (
    <KeyboardAvoidingView
      style={{ height: '100%' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Row flex={1}>
        <Column flex={1}>
          <BoxItem
            title={'分析结论'}
            icon={require('~/assets/images/guidance.png')}>
            <Box flex={1}>
              <TextInput
                autoCorrect={false}
                multiline={true}
                textAlignVertical='top'
                placeholder='您可输入，或从右侧分类中选择'
                style={{
                  textAlignVertical: 'top',
                  borderRadius: ss(4),
                  borderColor: '#DFE1DE',
                  borderWidth: ss(1),
                  height: ss(170),
                  backgroundColor: '#F8F8F8',
                  padding: ss(10),
                  fontSize: sp(14),
                  color: '#999',
                }}
                value={currentFlow.analyze.conclusion}
                onChangeText={(text) => {
                  updateAnalyze({ conclusion: text });
                }}
                returnKeyType='done'
              />
            </Box>
          </BoxItem>
          <BoxItem
            mt={ss(10)}
            title={'分析记录'}
            icon={require('~/assets/images/analyze-record.png')}>
            <Box flex={1} pt={ss(10)}>
              {analyzeHistory.length > 0 ? (
                analyzeHistory.map((item, idx) => {
                  return (
                    <Row key={idx} alignItems={'flex-start'}>
                      <Column alignItems={'center'}>
                        <Box
                          w={ss(10)}
                          h={ss(10)}
                          borderRadius={ss(5)}
                          bgColor={'#5EACA3'}
                        />
                        {analyzeHistory.length - 1 !== idx && (
                          <DashedLine
                            axis='vertical'
                            dashLength={ss(2)}
                            dashGap={ss(2)}
                            dashThickness={ss(1.5)}
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
                            {item.analyze?.conclusion}
                          </Text>
                        </Column>
                        <Text color='#BCBCBC' fontSize={sp(18)}>
                          {item.analyzeOperator?.name}
                        </Text>
                      </Row>
                    </Row>
                  );
                })
              ) : (
                <Column pt={ss(-10)} alignItems={'center'}>
                  <Image
                    source={require('~/assets/images/empty-box.png')}
                    style={{ height: ss(150) }}
                    resizeMode='contain'
                  />
                  <Text color='#909499' fontSize={sp(14)}>
                    暂无分析记录
                  </Text>
                </Column>
              )}
            </Box>
          </BoxItem>
        </Column>
        <Column flex={1} ml={ss(10)}>
          <Row flex={1} bgColor='#fff' borderRadius={ss(10)}>
            <Column bgColor={'#EDF7F6'}>
              {getTemplateGroups(TemplateGroupKeys.conclusion)?.groups.map(
                (item, idx) => {
                  return (
                    <Pressable
                      _pressed={{
                        opacity: 0.6,
                      }}
                      hitSlop={ss(20)}
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
                          size={sp(18)}
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
                          {item.name}
                        </Text>
                      </Center>
                    </Pressable>
                  );
                },
              )}
            </Column>
            <Row flex={1} flexWrap={'wrap'} py={ss(16)} px={ls(20)}>
              {(
                (
                  getTemplateGroups(TemplateGroupKeys.conclusion)?.groups[
                    selectTemplateGroup
                  ] as TemplateItem
                )?.children as string[]
              )?.map((item, idx) => {
                return (
                  <Pressable
                    _pressed={{
                      opacity: 0.8,
                    }}
                    hitSlop={ss(20)}
                    key={idx}
                    onPress={() => {
                      updateAnalyze({
                        conclusion:
                          currentFlow.analyze.conclusion.trim().length > 0
                            ? currentFlow.analyze.conclusion + ',' + item
                            : item,
                      });
                    }}>
                    <Box
                      px={ls(20)}
                      py={ss(7)}
                      mr={ls(10)}
                      mb={ss(10)}
                      borderRadius={2}
                      borderColor={'#D8D8D8'}
                      borderWidth={ss(1)}>
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
    </KeyboardAvoidingView>
  );
}
