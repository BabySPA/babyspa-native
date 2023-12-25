import {
  Box,
  Center,
  Column,
  Divider,
  Icon,
  Row,
  ScrollView,
  Text,
  Pressable,
} from 'native-base';
import BoxItem from './box-item';
import { TextInput, Image } from 'react-native';
import { ls, sp, ss } from '~/app/utils/style';
import useFlowStore from '~/app/stores/flow';
import { useEffect, useRef, useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import useManagerStore from '~/app/stores/manager';
import { FlowOperatorConfigItem, TemplateGroupKeys } from '~/app/constants';
import { TemplateItem } from '~/app/stores/manager/type';
import EmptyBox from '~/app/components/empty-box';
import { TemplateModal } from '~/app/components/modals';
import { FlowItemResponse } from '~/app/stores/flow/type';
import DashedLine from 'react-native-dashed-line';
import dayjs from 'dayjs';

export default function GuidanceInfo({
  selectedConfig,
}: {
  selectedConfig: FlowOperatorConfigItem;
}) {
  const collect = useFlowStore((state) => state.currentFlow.collect);

  // 原分析结论，现注意事项
  const conclusion = useFlowStore(
    (state) => state.currentFlow.analyze.conclusion,
  );
  const updateAnalyze = useFlowStore((state) => state.updateAnalyze);
  const customerId = useFlowStore(
    (state) => state.currentFlow.register.customerId,
  );

  const updateCollection = useFlowStore((state) => state.updateCollection);
  const [isOpenTemplatePicker, setIsOpenTemplatePicker] = useState(false);

  const [selectTemplateGroup, setSelectTemplateGroup] = useState(0);
  const [selectTemplateLevel2Group, setSelectTemplateLevel2Group] = useState(0);

  const getTemplateGroups = useManagerStore((state) => state.getTemplateGroups);

  const requestCustomerArchiveHistory = useFlowStore(
    (state) => state.requestCustomerArchiveHistory,
  );

  const [analyzeHistory, setAnalyzeHistory] = useState<FlowItemResponse[]>([]);

  useEffect(() => {
    if (customerId && selectedConfig.disabled)
      requestCustomerArchiveHistory(customerId).then((res) => {
        setAnalyzeHistory(res);
      });
  }, []);

  const inputRef = useRef(null);

  useEffect(() => {
    // @ts-ignore
    inputRef.current?.setNativeProps({
      text: collect.guidance,
    });
  }, [collect.guidance]);

  return (
    <Row flex={1}>
      <Column flex={1}>
        <BoxItem
          title={'调理导向'}
          icon={require('~/assets/images/guidance.png')}
          detail={selectedConfig.disabled ? collect.guidance : ''}>
          <Box flex={1}>
            <TextInput
              ref={inputRef}
              autoCorrect={false}
              multiline={true}
              textAlignVertical='top'
              placeholder='您可输入，或从右侧分类中选择'
              style={{
                textAlignVertical: 'top',
                borderRadius: ss(4),
                borderColor: '#DFE1DE',
                borderWidth: ss(1),
                height: ss(221),
                maxHeight: ss(221),
                backgroundColor: '#F8F8F8',
                padding: ss(10),
                fontSize: sp(20),
                color: '#000',
              }}
              editable={selectedConfig.disabled ? false : true}
              onChangeText={(text) => {
                updateCollection({
                  guidance: text,
                });
              }}
            />
          </Box>
        </BoxItem>
        {selectedConfig.disabled && (
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
        )}
      </Column>
      {selectedConfig.disabled ? (
        <Column flex={1} ml={ss(10)}>
          <BoxItem
            autoScroll={false}
            flex={1}
            title={'注意事项'}
            icon={require('~/assets/images/guidance.png')}>
            <Box h={'80%'}>
              <Pressable
                onPress={() => {
                  setIsOpenTemplatePicker(true);
                }}
                style={{
                  borderRadius: ss(4),
                  borderColor: '#DFE1DE',
                  borderWidth: ss(1),
                  height: '100%',
                  padding: ss(10),
                }}>
                <Text
                  fontSize={sp(20)}
                  color='#333'
                  style={{ textAlignVertical: 'top' }}>
                  {conclusion || '请输入或选择注意事项'}
                </Text>
                <Text
                  fontSize={sp(14)}
                  color={'#999'}
                  style={{
                    position: 'absolute',
                    right: ss(10),
                    bottom: ss(10),
                  }}>
                  {conclusion.length}/300
                </Text>
              </Pressable>
              {isOpenTemplatePicker && (
                <TemplateModal
                  defaultText={conclusion || ''}
                  template={getTemplateGroups(TemplateGroupKeys.conclusion)}
                  isOpen={isOpenTemplatePicker}
                  onClose={function (): void {
                    setIsOpenTemplatePicker(false);
                  }}
                  onConfirm={function (text): void {
                    updateAnalyze({ conclusion: text });
                    setIsOpenTemplatePicker(false);
                  }}
                />
              )}
            </Box>
          </BoxItem>
        </Column>
      ) : (
        <Column flex={1} ml={ss(10)}>
          <Row flex={1} bgColor='#fff' borderRadius={ss(10)}>
            <Column bgColor={'#EDF7F6'}>
              {getTemplateGroups(TemplateGroupKeys.guidance)?.groups.map(
                (item, idx) => {
                  return (
                    <Pressable
                      _pressed={{
                        opacity: 0.8,
                      }}
                      hitSlop={ss(20)}
                      key={idx}
                      onPress={() => {
                        setSelectTemplateGroup(idx);
                      }}>
                      <Center
                        p={ss(10)}
                        minW={ss(80)}
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
                          color={
                            selectTemplateGroup === idx ? '#5EACA3' : '#99A9BF'
                          }
                          fontSize={sp(18)}>
                          {item.name}
                        </Text>
                      </Center>
                    </Pressable>
                  );
                },
              )}
            </Column>
            {(
              getTemplateGroups(TemplateGroupKeys.guidance)?.groups[
                selectTemplateGroup
              ] as TemplateItem
            )?.children.length > 0 ? (
              <Column flex={1}>
                <ScrollView horizontal maxH={ss(60, 85)}>
                  <Row flex={1} px={ls(20)} mt={ss(10)}>
                    {getTemplateGroups(TemplateGroupKeys.guidance)?.groups[
                      selectTemplateGroup
                    ]?.children.map((item: any, idx) => {
                      return (
                        <Pressable
                          _pressed={{
                            opacity: 0.6,
                          }}
                          hitSlop={ss(20)}
                          key={idx}
                          onPress={() => {
                            setSelectTemplateLevel2Group(idx);
                          }}>
                          <Box
                            px={ls(20)}
                            py={ss(7)}
                            mr={ls(10)}
                            mb={ss(10)}
                            borderRadius={2}
                            borderColor={
                              selectTemplateLevel2Group === idx
                                ? '#5EACA3'
                                : '#D8D8D8'
                            }
                            borderWidth={ss(1)}>
                            <Text
                              fontSize={sp(18)}
                              color={
                                selectTemplateLevel2Group === idx
                                  ? '#3AAEA3'
                                  : '#000'
                              }>
                              {item.name}
                            </Text>
                          </Box>
                        </Pressable>
                      );
                    })}
                  </Row>
                </ScrollView>
                <Divider my={ss(5)} color={'#DFE1DE'} h={ss(0.5)} />
                <ScrollView>
                  <Row flex={1} flexWrap={'wrap'} py={ss(16)} px={ls(20)}>
                    {(
                      (
                        getTemplateGroups(TemplateGroupKeys.guidance)?.groups[
                          selectTemplateGroup
                        ]?.children[selectTemplateLevel2Group] as TemplateItem
                      )?.children as string[]
                    ).map((item, idx) => {
                      return (
                        <Pressable
                          _pressed={{
                            opacity: 0.6,
                          }}
                          hitSlop={ss(20)}
                          key={idx}
                          onPress={() => {
                            if (!selectedConfig.disabled) {
                              const text =
                                collect.guidance.trim().length > 0
                                  ? collect.guidance + ',' + item
                                  : item;
                              updateCollection({
                                guidance: text,
                              });
                              // @ts-ignore
                              inputRef.current?.setNativeProps({
                                text: text,
                              });
                            }
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
                </ScrollView>
              </Column>
            ) : (
              <EmptyBox title='暂未配置模版' />
            )}
          </Row>
        </Column>
      )}
    </Row>
  );
}
