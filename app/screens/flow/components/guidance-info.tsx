import { Box, Center, Column, Container, Icon, Row, Text } from 'native-base';
import BoxItem from './box-item';
import { Pressable, TextInput } from 'react-native';
import { ls, sp, ss } from '~/app/utils/style';
import useFlowStore from '~/app/stores/flow';
import { useState } from 'react';
import { AntDesign } from '@expo/vector-icons';

export default function GuidanceInfo() {
  const { guidanceTemplate, currentFlow, updateCurrentFlow } = useFlowStore();

  const [selectTemplateGroup, setSelectTemplateGroup] = useState(0);

  return (
    <Row flex={1}>
      <Column flex={1}>
        <BoxItem
          title={'调理导向'}
          icon={require('~/assets/images/guidance.png')}>
          <Box flex={1}>
            <TextInput
              multiline={true}
              placeholder='您可输入，或从右侧分类中选择'
              style={{
                borderRadius: ss(4),
                borderColor: '#DFE1DE',
                borderWidth: 1,
                height: ss(221),
                backgroundColor: '#F8F8F8',
                padding: ss(10),
                fontSize: sp(14),
                color: '#999',
              }}
              value={currentFlow.guidance}
            />
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
                  onPress={() => {
                    updateCurrentFlow({
                      guidance:
                        currentFlow.guidance.trim().length > 0
                          ? currentFlow.guidance + ',' + item
                          : item,
                    });
                  }}>
                  <Box
                    key={idx}
                    px={ls(20)}
                    py={ss(7)}
                    mr={ls(10)}
                    mb={ss(10)}
                    borderRadius={ss(2)}
                    borderColor={'#D8D8D8'}
                    borderWidth={1}>
                    <Text>{item}</Text>
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
