import {
  Box,
  Center,
  Column,
  Container,
  Divider,
  Icon,
  Row,
  ScrollView,
  Text,
} from 'native-base';
import BoxItem from './box-item';
import { Pressable, TextInput } from 'react-native';
import { ls, sp, ss } from '~/app/utils/style';
import useFlowStore from '~/app/stores/flow';
import { useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import useManagerStore from '~/app/stores/manager';
import { FlowOperatorConfigItem, TemplateGroupKeys } from '~/app/constants';
import { TemplateItem } from '~/app/stores/manager/type';
import EmptyBox from '~/app/components/empty-box';

export default function GuidanceInfo({
  selectedConfig,
}: {
  selectedConfig: FlowOperatorConfigItem;
}) {
  const {
    currentFlow: { collect },
    updateCollection,
  } = useFlowStore();

  const [selectTemplateGroup, setSelectTemplateGroup] = useState(0);
  const [selectTemplateLevel2Group, setSelectTemplateLevel2Group] = useState(0);

  const { getTemplateGroups } = useManagerStore();

  return (
    <Row flex={1}>
      <Column flex={1}>
        <BoxItem
          title={'调理导向'}
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
                borderWidth: 1,
                height: ss(221),
                backgroundColor: '#F8F8F8',
                padding: ss(10),
                fontSize: sp(14),
                color: '#999',
              }}
              value={collect.guidance}
              editable={selectedConfig.disabled ? false : true}
              onChangeText={(text) => {
                updateCollection({
                  guidance: text,
                });
              }}
            />
          </Box>
        </BoxItem>
      </Column>
      <Column flex={1} ml={ss(10)}>
        <Row flex={1} bgColor='#fff' borderRadius={ss(10)}>
          <Column bgColor={'#EDF7F6'}>
            {getTemplateGroups(TemplateGroupKeys.guidance)?.groups.map(
              (item, idx) => {
                return (
                  <Pressable
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
                        size={ss(18)}
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
              <ScrollView horizontal maxH={ss(60)}>
                <Row flex={1} px={ls(20)} mt={ss(10)}>
                  {getTemplateGroups(TemplateGroupKeys.guidance)?.groups[
                    selectTemplateGroup
                  ]?.children.map((item: any, idx) => {
                    return (
                      <Pressable
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
                          borderWidth={1}>
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
                      hitSlop={ss(20)}
                      key={idx}
                      onPress={() => {
                        if (!selectedConfig.disabled) {
                          updateCollection({
                            guidance:
                              collect.guidance.trim().length > 0
                                ? collect.guidance + ',' + item
                                : item,
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
                        borderWidth={1}>
                        <Text fontSize={sp(18)} color='#000'>
                          {item}
                        </Text>
                      </Box>
                    </Pressable>
                  );
                })}
              </Row>
            </Column>
          ) : (
            <EmptyBox title='暂未配置模版' />
          )}
        </Row>
      </Column>
    </Row>
  );
}
