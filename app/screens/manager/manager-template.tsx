import {
  Box,
  Text,
  Column,
  Row,
  ScrollView,
  Divider,
  Pressable,
  Icon,
  HStack,
  Avatar,
} from 'native-base';
import NavigationBar from '~/app/components/navigation-bar';
import { AppStackScreenProps } from '~/app/types';
import { ls, sp, ss } from '~/app/utils/style';
import dayjs from 'dayjs';
import useManagerStore from '~/app/stores/manager';
import BoxTitle from '~/app/components/box-title';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { SwipeListView } from 'react-native-swipe-list-view';

export default function ManagerTemplate({
  navigation,
}: AppStackScreenProps<'ManagerTemplate'>) {
  const {
    templates,
    currentSelectTemplateIdx,
    currentSelectItemTemplateIdx,
    setCurrentSelectItemTemplateIdx,
  } = useManagerStore();
  const [currentSelectTemplate, setCurrentSelectTemplate] = useState(
    templates[currentSelectTemplateIdx].template,
  );

  useEffect(() => {
    setCurrentSelectTemplate(templates[currentSelectTemplateIdx].template);
  }, [currentSelectTemplateIdx]);

  return (
    <Box flex={1}>
      <NavigationBar
        onBackIntercept={() => false}
        leftElement={
          <Text color='white' fontWeight={600} fontSize={sp(20, { min: 14 })}>
            模板管理
          </Text>
        }
        rightElement={
          <Text color={'#fff'} fontSize={sp(20)}>
            {dayjs().format('YYYY-MM-DD')}
          </Text>
        }
      />
      <Column
        safeAreaLeft
        bgColor={'#F6F6FA'}
        flex={1}
        p={ss(10)}
        h={'100%'}
        safeAreaBottom>
        <Box mt={ss(10)} flex={1}>
          <Box>
            <Tabs />
          </Box>
          <Row mt={ss(10)} flex={1}>
            <Column w={ss(400)} bgColor={'#fff'} borderRadius={ss(10)}>
              <Box p={ss(20)}>
                <BoxTitle
                  title='模版列表'
                  rightElement={
                    <Pressable
                      onPress={() => {
                        // TODO 新增模版
                      }}>
                      <Row
                        bgColor={'#E1F6EF'}
                        borderRadius={ss(4)}
                        px={ls(12)}
                        py={ss(10)}
                        borderColor={'#15BD8F'}
                        borderWidth={1}>
                        <Text color={'#0C1B16'} fontSize={sp(14, { min: 12 })}>
                          新增模版
                        </Text>
                      </Row>
                    </Pressable>
                  }
                />
              </Box>
              <Box bg='white' safeArea flex={1}>
                <SwipeListView
                  data={currentSelectTemplate}
                  renderItem={({ item, index }) => {
                    return (
                      <Box>
                        <Pressable
                          onPress={() => {
                            setCurrentSelectItemTemplateIdx(index);
                          }}
                          alignItems='flex-start'
                          bg={
                            currentSelectItemTemplateIdx === index
                              ? '#1AB7BE'
                              : '#fff'
                          }
                          justifyContent='center'
                          borderBottomColor='trueGray.200'
                          borderBottomWidth={1}
                          px={ls(20)}
                          py={ss(16)}>
                          <Text
                            fontSize={sp(20)}
                            color={
                              currentSelectItemTemplateIdx === index
                                ? '#fff'
                                : '#333'
                            }>
                            {item.name}
                          </Text>
                        </Pressable>
                      </Box>
                    );
                  }}
                  renderHiddenItem={(data, rowMap) => (
                    <Row flex={1}>
                      <Box flex={1} />
                      <Pressable
                        w={ls(72)}
                        bg='red.500'
                        justifyContent='center'
                        onPress={() => {}}
                        alignItems='center'
                        _pressed={{
                          opacity: 0.5,
                        }}>
                        <Text fontSize={sp(14)} color={'#fff'}>
                          删除
                        </Text>
                      </Pressable>
                    </Row>
                  )}
                  disableRightSwipe
                  rightOpenValue={-ls(72)}
                  previewOpenValue={-40}
                  previewOpenDelay={3000}
                  onRowDidOpen={(rowKey) => {
                    console.log(rowKey);
                  }}
                />
              </Box>
            </Column>
            <Column
              flex={1}
              ml={ls(10)}
              bgColor={'#fff'}
              borderRadius={ss(10)}
              p={ss(20)}>
              <BoxTitle title='模版详情' />
            </Column>
          </Row>
        </Box>
      </Column>
    </Box>
  );
}

function Tabs() {
  const { templates, currentSelectTemplateIdx, setCurrentSelectTemplateIdx } =
    useManagerStore();
  return (
    <ScrollView horizontal={true} bgColor={'#fff'} borderRadius={ss(10)}>
      <Row h={ss(80)}>
        {templates.map((item, index) => {
          return (
            <Pressable
              key={index}
              onPress={() => {
                setCurrentSelectTemplateIdx(index);
              }}>
              <Column
                flex={1}
                alignItems={'center'}
                justifyContent={'center'}
                px={ls(20)}
                ml={index != 0 ? ls(40) : 0}>
                <Text
                  fontSize={sp(20)}
                  fontWeight={600}
                  color={
                    currentSelectTemplateIdx === index ? '#03CBB2' : '#333'
                  }>
                  {item.name}
                </Text>
                <Divider
                  bgColor={'#03CBB2'}
                  mt={ss(14)}
                  w={'70%'}
                  opacity={currentSelectTemplateIdx === index ? 1 : 0}
                />
              </Column>
            </Pressable>
          );
        })}
      </Row>
    </ScrollView>
  );
}
