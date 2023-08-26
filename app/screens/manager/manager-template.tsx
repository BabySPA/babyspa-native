import {
  Box,
  Text,
  Column,
  Row,
  ScrollView,
  Divider,
  Pressable,
  Icon,
  Input,
} from 'native-base';
import NavigationBar from '~/app/components/navigation-bar';
import { AppStackScreenProps } from '~/app/types';
import { ls, sp, ss } from '~/app/utils/style';
import dayjs from 'dayjs';
import useManagerStore from '~/app/stores/manager';
import BoxTitle from '~/app/components/box-title';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { DialogModal } from '~/app/components/modals';

export default function ManagerTemplate({
  navigation,
}: AppStackScreenProps<'ManagerTemplate'>) {
  const {
    currentSelectTemplateGroupIdx,
    requestGetTemplates,
    setCurrentSelectTemplateGroupIdx,
    getCurrentSelectTemplateGroups,
    getCurrentSelectTemplateGroupItems,
  } = useManagerStore();

  useEffect(() => {
    requestGetTemplates();
  }, []);

  const [canEdit, setCanEdit] = useState(false);
  const [showDeleteItemModal, setShowDeleteItemModal] = useState(false);
  const [showDeleteTemplateModal, setShowDeleteTemplateModal] = useState(false);

  const swiperlistRef = useRef(null);

  const closeRow = (rowMap: any, rowKey: any) => {
    rowMap[rowKey]?.closeRow();
  };

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

              <Input
                autoCorrect={false}
                h={ss(50)}
                p={ss(10)}
                mx={ls(20)}
                placeholderTextColor={'#C0CCDA'}
                color={'#333333'}
                fontSize={ss(16)}
                borderColor={'#C0CCDA'}
                InputLeftElement={
                  <Icon
                    as={<MaterialIcons name='search' />}
                    size={ss(25)}
                    color='#C0CCDA'
                    ml={ss(10)}
                  />
                }
                placeholder='搜索模版名称'
              />

              <Box bg='white' flex={1} mt={ss(20)}>
                <SwipeListView
                  ref={swiperlistRef}
                  data={getCurrentSelectTemplateGroups()}
                  keyExtractor={(item, index) => item.name}
                  renderItem={({ item, index }) => {
                    return (
                      <Box>
                        <Pressable
                          onLongPress={() => {
                            setCurrentSelectTemplateGroupIdx(index);
                          }}
                          alignItems='flex-start'
                          bg={
                            currentSelectTemplateGroupIdx === index
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
                              currentSelectTemplateGroupIdx === index
                                ? '#fff'
                                : '#333'
                            }>
                            {item.name}
                          </Text>
                        </Pressable>
                      </Box>
                    );
                  }}
                  renderHiddenItem={(rowData, rowMap) => (
                    <Row flex={1}>
                      <Box flex={1} />
                      <Pressable
                        w={ls(72)}
                        bg='red.500'
                        justifyContent='center'
                        onPress={() => {
                          // setShowDeleteTemplateModal(true);
                          // @ts-ignore
                          closeRow(rowMap, rowData.item.name);
                        }}
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
                  rightOpenValue={-ls(72)}
                  previewOpenValue={-40}
                  previewOpenDelay={3000}
                />
              </Box>

              <Text textAlign={'center'} fontSize={sp(14)} color={'#999'}>
                长按组名或模版支持编辑，左滑支持删除
              </Text>
            </Column>
            <Column
              flex={1}
              ml={ls(10)}
              bgColor={'#fff'}
              borderRadius={ss(10)}
              p={ss(20)}>
              <BoxTitle title='模版详情' />
              <Row mt={ss(28)}>
                {getCurrentSelectTemplateGroupItems().map(
                  (item: any, index: any) => {
                    return (
                      <Pressable
                        key={index}
                        onLongPress={() => {
                          setCanEdit(true);
                        }}
                        mr={ls(10)}
                        mb={ss(10)}
                        borderWidth={1}
                        borderRadius={2}
                        borderColor={'#D8D8D8'}
                        px={ls(20)}
                        py={ss(7)}>
                        <Row alignItems={'center'}>
                          <Text>{item}</Text>
                          {canEdit && (
                            <Pressable
                              onPress={() => {
                                // 删除
                                setShowDeleteItemModal(true);
                              }}>
                              <Icon
                                ml={ls(10)}
                                as={
                                  <Ionicons name='ios-close-circle-outline' />
                                }
                                size={ss(20)}
                                color='#FB6459'
                              />
                              <DialogModal
                                isOpen={showDeleteItemModal}
                                onClose={function (): void {
                                  setShowDeleteItemModal(false);
                                }}
                                title='是否确认删除模版？'
                                onConfirm={function (): void {
                                  setShowDeleteItemModal(false);

                                  // requestPatchCustomerStatus({
                                  //   status: CustomerStatus.Canceled,
                                  //   type: 'register',
                                  // })
                                  //   .then(async (res) => {
                                  //     // 取消成功
                                  //     toastAlert(toast, 'success', '取消成功！');
                                  //     await requestGetInitializeData();
                                  //   })
                                  //   .catch((err) => {
                                  //     // 取消失败
                                  //     toastAlert(toast, 'error', '取消失败！');
                                  //   })
                                  //   .finally(() => {
                                  //     setLoading(false);
                                  //   });
                                }}
                              />
                            </Pressable>
                          )}
                        </Row>
                      </Pressable>
                    );
                  },
                )}
              </Row>
            </Column>
          </Row>
        </Box>
      </Column>

      <DialogModal
        isOpen={showDeleteTemplateModal}
        onClose={function (): void {
          setShowDeleteTemplateModal(false);
        }}
        title='是否确认删除整个模版组？'
        onConfirm={function (): void {
          setShowDeleteTemplateModal(false);

          // requestPatchCustomerStatus({
          //   status: CustomerStatus.Canceled,
          //   type: 'register',
          // })
          //   .then(async (res) => {
          //     // 取消成功
          //     toastAlert(toast, 'success', '取消成功！');
          //     await requestGetInitializeData();
          //   })
          //   .catch((err) => {
          //     // 取消失败
          //     toastAlert(toast, 'error', '取消失败！');
          //   })
          //   .finally(() => {
          //     setLoading(false);
          //   });
        }}
      />
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
