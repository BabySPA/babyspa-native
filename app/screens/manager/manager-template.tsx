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
  useToast,
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
import { DialogModal, NewTemplateModalModal } from '~/app/components/modals';
import { toastAlert } from '~/app/utils/toast';
import { debounce } from 'lodash';
import { TemplateItem } from '~/app/stores/manager/type';
import { PanResponder } from 'react-native';

export default function ManagerTemplate({
  navigation,
}: AppStackScreenProps<'ManagerTemplate'>) {
  const {
    templates,
    currentSelectTemplateGroupIdx,
    currentSelectTemplateIdx,
    requestGetTemplates,
    requestPatchTemplateGroup,
    requestDeleteTemplateGroup,
    setCurrentSelectTemplateGroupIdx,
    getCurrentSelectTemplateGroupItems,
  } = useManagerStore();

  useEffect(() => {
    requestGetTemplates();
  }, []);

  const [groupFilter, setGroupFilter] = useState<string>('');

  useEffect(() => {
    const filterRegex = new RegExp(groupFilter, 'i');
    const filteredGroups = templates[currentSelectTemplateIdx]?.groups?.filter(
      (group) => {
        // 使用正则表达式进行模糊匹配
        return filterRegex.test(group.name);
      },
    );
    setGroups(filteredGroups);
  }, [templates, currentSelectTemplateIdx, groupFilter]);

  const [canEdit, setCanEdit] = useState(false);
  const [groups, setGroups] = useState<TemplateItem[]>([]);
  const [showDeleteItemModal, setShowDeleteItemModal] = useState({
    isOpen: false,
    item: '',
  });
  const [showDeleteTemplateModal, setShowDeleteTemplateModal] = useState({
    isOpen: false,
    groupName: '',
  });
  const [showEditTemplateModal, setShowEditTemplateModal] = useState({
    isOpen: false,
    isEdit: false,
    type: 'group',
    title: '',
    defaultName: '',
  });

  const toast = useToast();
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      canEdit && setCanEdit(false);
    },
  });
  const swiperlistRef = useRef(null);
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
                      hitSlop={ss(10)}
                      onPress={() => {
                        setShowEditTemplateModal({
                          isOpen: true,
                          isEdit: false,
                          type: 'group',
                          title: '新增模版组',
                          defaultName: '',
                        });
                      }}>
                      <Row
                        bgColor={'#E1F6EF'}
                        borderRadius={4}
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
                onChangeText={debounce((text) => {
                  setGroupFilter(text);
                }, 1000)}
              />

              <Box bg='white' flex={1} mt={ss(20)}>
                <SwipeListView
                  ref={swiperlistRef}
                  data={groups}
                  keyExtractor={(item, index) => item.name}
                  renderItem={({ item, index }) => {
                    return (
                      <Box>
                        <Pressable
                          hitSlop={ss(10)}
                          onPress={() => {
                            setCurrentSelectTemplateGroupIdx(index);
                          }}
                          onLongPress={() => {
                            setShowEditTemplateModal({
                              isOpen: true,
                              isEdit: true,
                              type: 'group',
                              title: '编辑模版组',
                              defaultName: item.name,
                            });
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
                        hitSlop={ss(10)}
                        w={ls(72)}
                        bg='red.500'
                        justifyContent='center'
                        onPress={() => {
                          setShowDeleteTemplateModal({
                            isOpen: true,
                            groupName: rowData.item.name,
                          });
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

              <Text
                textAlign={'center'}
                fontSize={sp(14)}
                color={'#999'}
                mb={ss(20)}>
                长按组名或模版项支持编辑，左滑支持删除
              </Text>
            </Column>
            <Column
              {...panResponder.panHandlers}
              flex={1}
              ml={ls(10)}
              bgColor={'#fff'}
              borderRadius={ss(10)}
              p={ss(20)}>
              <BoxTitle title='模版详情' />

              <Row mt={ss(28)} flexWrap={'wrap'}>
                {getCurrentSelectTemplateGroupItems().map(
                  (item: any, index: any) => {
                    return (
                      <Pressable
                        hitSlop={ss(10)}
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
                          <Text maxWidth={ss(300)}>{item}</Text>
                          {canEdit && (
                            <Pressable
                              hitSlop={ss(10)}
                              onPress={() => {
                                // 删除
                                setShowDeleteItemModal({
                                  isOpen: true,
                                  item: item,
                                });
                              }}>
                              <Icon
                                ml={ls(10)}
                                as={
                                  <Ionicons name='ios-close-circle-outline' />
                                }
                                size={ss(20)}
                                color='#FB6459'
                              />
                            </Pressable>
                          )}
                        </Row>
                      </Pressable>
                    );
                  },
                )}
                <Pressable
                  hitSlop={ss(10)}
                  onPress={() => {
                    setShowEditTemplateModal({
                      isOpen: true,
                      isEdit: false,
                      title: '新增模版',
                      type: 'item',
                      defaultName: '',
                    });
                  }}
                  mr={ls(10)}
                  mb={ss(10)}
                  borderWidth={1}
                  borderRadius={2}
                  borderColor={'#D8D8D8'}
                  px={ls(20)}
                  py={ss(7)}>
                  <Text color='#BCBCBC'>+ 自定义添加</Text>
                </Pressable>
              </Row>
            </Column>
          </Row>
        </Box>
      </Column>
      <DialogModal
        isOpen={showDeleteTemplateModal.isOpen}
        onClose={function (): void {
          setShowDeleteTemplateModal({
            isOpen: false,
            groupName: '',
          });
        }}
        title={`是否确认删除${showDeleteTemplateModal.groupName}整个模版组？`}
        onConfirm={function (): void {
          requestDeleteTemplateGroup(showDeleteTemplateModal.groupName)
            .then((res) => {
              toastAlert(
                toast,
                'success',
                `删除模版组${showDeleteTemplateModal.groupName}成功！`,
              );
              requestGetTemplates();
            })
            .catch((err) => {
              toastAlert(
                toast,
                'error',
                `删除模版组${showDeleteTemplateModal.groupName}失败！`,
              );
            })
            .finally(() => {
              setShowDeleteTemplateModal({
                isOpen: false,
                groupName: '',
              });
            });
        }}
      />
      <NewTemplateModalModal
        title={showEditTemplateModal.title}
        isOpen={showEditTemplateModal.isOpen}
        defaultName={showEditTemplateModal.defaultName}
        type={showEditTemplateModal.type === 'group' ? 'group' : 'item'}
        onClose={function (): void {
          setShowEditTemplateModal({
            isOpen: false,
            isEdit: false,
            type: 'group',
            title: '',
            defaultName: '',
          });
        }}
        onConfirm={function (text: string): void {
          const group: any = {};

          if (showEditTemplateModal.type === 'group') {
            group.name = text;
            group.children = showEditTemplateModal.isEdit
              ? getCurrentSelectTemplateGroupItems()
              : [];
            if (showEditTemplateModal.isEdit) {
              group.originalName = showEditTemplateModal.defaultName;
            }
          } else {
            group.name = groups[currentSelectTemplateGroupIdx].name;
            group.children = getCurrentSelectTemplateGroupItems().concat(text);
          }

          requestPatchTemplateGroup(group)
            .then((res) => {
              toastAlert(
                toast,
                'success',
                showEditTemplateModal.isEdit ? '编辑成功！' : '新增成功！',
              );
              requestGetTemplates();
            })
            .catch((err) => {
              toastAlert(
                toast,
                'error',
                showEditTemplateModal.isEdit ? '编辑失败！' : '新增失败！',
              );
            })
            .finally(() => {
              setShowEditTemplateModal({
                isOpen: false,
                isEdit: false,
                type: 'group',
                title: '',
                defaultName: '',
              });
            });
        }}
      />
      <DialogModal
        isOpen={showDeleteItemModal.isOpen}
        onClose={function (): void {
          setShowDeleteItemModal({
            isOpen: false,
            item: '',
          });
        }}
        title='是否确认删除模版项？'
        onConfirm={function (): void {
          const currentGroup = groups[currentSelectTemplateGroupIdx];
          const group: any = {
            name: currentGroup.name,
            children: getCurrentSelectTemplateGroupItems().filter(
              (child) => child !== showDeleteItemModal.item,
            ),
          };

          requestPatchTemplateGroup(group)
            .then((res) => {
              toastAlert(toast, 'success', '删除模板项成功！');
              requestGetTemplates();
            })
            .catch((err) => {
              toastAlert(toast, 'error', '删除模板项失败！');
            })
            .finally(() => {
              setShowDeleteItemModal({
                isOpen: false,
                item: '',
              });
            });
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
              hitSlop={ss(10)}
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
