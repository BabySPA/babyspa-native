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
  Circle,
} from 'native-base';
import NavigationBar from '~/app/components/navigation-bar';
import { AppStackScreenProps } from '~/app/types';
import { ls, sp, ss } from '~/app/utils/style';
import dayjs from 'dayjs';
import useManagerStore from '~/app/stores/manager';
import BoxTitle from '~/app/components/box-title';
import { SwipeListView } from 'react-native-swipe-list-view';
import {
  AntDesign,
  FontAwesome,
  Ionicons,
  MaterialIcons,
  SimpleLineIcons,
} from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
  DialogModal,
  NewLevel3TemplateGroupModal,
  NewTemplateExtraModal,
  NewTemplateGroupModal,
  NewTemplateModalModal,
} from '~/app/components/modals';
import { toastAlert } from '~/app/utils/toast';
import { debounce } from 'lodash';
import { ExtraItem, TemplateItem } from '~/app/stores/manager/type';
import TextChild from './components/TextChild';

export default function ManagerTemplate({
  navigation,
}: AppStackScreenProps<'ManagerTemplate'>) {
  const templates = useManagerStore((state) => state.templates);
  const currentSelectTemplateIdx = useManagerStore(
    (state) => state.currentSelectTemplateIdx,
  );
  const requestGetTemplates = useManagerStore(
    (state) => state.requestGetTemplates,
  );
  const requestPatchTemplateGroup = useManagerStore(
    (state) => state.requestPatchTemplateGroup,
  );
  const requestDeleteTemplateGroup = useManagerStore(
    (state) => state.requestDeleteTemplateGroup,
  );

  const [currentLevel3SelectFolderIdx, setCurrentLevel3SelectFolderIdx] =
    useState<{ folder: number; item: number }>({ folder: -1, item: 0 });

  const [
    currentLevel2SelectTemplateGroupIndex,
    setCurrentLevel2SelectTemplateGroupIndex,
  ] = useState(0);

  useEffect(() => {
    requestGetTemplates();
  }, []);

  const [groupFilter, setGroupFilter] = useState<string>('');

  useEffect(() => {
    setCurrentLevel2SelectTemplateGroupIndex(0);
    setCurrentLevel3SelectFolderIdx({
      folder: -1,
      item: 0,
    });
  }, [currentSelectTemplateIdx]);

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
    level: 2,
  });
  const [showDeleteTemplateModal, setShowDeleteTemplateModal] = useState<{
    isOpen: boolean;
    groupName: string;
    level: number;
    groupIdx?: number;
  }>({
    isOpen: false,
    groupName: '',
    level: 2,
    groupIdx: -1,
  });
  const [showDeleteTemplateExtraModal, setShowDeleteTemplateExtraModal] =
    useState({
      isOpen: false,
      content: '',
      index: -1,
    });
  const [showEditTemplateModal, setShowEditTemplateModal] = useState({
    isOpen: false,
    isEdit: false,
    type: 'group',
    title: '',
    defaultName: '',
    level: 2,
  });

  const [showExtraModal, setShowExtraModal] = useState({
    isOpen: false,
    isEdit: false,
    title: '',
    des1: '',
    des2: '',
    defaultName: '',
    defaultContent: '',
    index: -1,
  });

  const [showEditTemplateGroupModal, setShowEditTemplateGroupModal] = useState({
    isOpen: false,
    isEdit: false,
    title: '',
    defaultName: '',
  });

  const [showLevel3EditTemplateModal, setShowLevel3EditTemplateModal] =
    useState<{
      isOpen: boolean;
      isEdit: boolean;
      title: string;
      groups: string[];
      defaultGroup: string;
      defaultName: string;
    }>({
      isOpen: false,
      isEdit: false,
      groups: [],
      title: '',
      defaultGroup: '',
      defaultName: '',
    });

  const getCurrentLevel2SelectTemplateGroupItems = () => {
    return (
      templates[currentSelectTemplateIdx]?.groups?.[
        currentLevel2SelectTemplateGroupIndex
      ]?.children || []
    );
  };

  const [level3Children, setLevel3Children] = useState<ExtraItem[] | string[]>(
    [],
  );

  useEffect(() => {
    if (
      templates[currentSelectTemplateIdx]?.groups?.[
        currentLevel3SelectFolderIdx.folder
      ]?.children[currentLevel3SelectFolderIdx.item]
    ) {
      const item = templates[currentSelectTemplateIdx]?.groups?.[
        currentLevel3SelectFolderIdx.folder
      ]?.children[currentLevel3SelectFolderIdx.item] as TemplateItem;

      setLevel3Children(item.children as string[] | ExtraItem[]);
    } else {
      setLevel3Children([]);
    }
  }, [currentLevel3SelectFolderIdx, templates]);

  const toast = useToast();

  const swiperlistRef = useRef(null);

  const getGroupLevel = () => {
    if (!groups) return 2;

    return templates[currentSelectTemplateIdx]?.key === 'application' ||
      templates[currentSelectTemplateIdx]?.key === 'massage' ||
      templates[currentSelectTemplateIdx]?.key === 'guidance'
      ? 3
      : 2;
  };

  const ExtraChild = ({ item, index }: { item: any; index: number }) => {
    const { extra } = item;
    return (
      <Column
        width={'100%'}
        mb={ss(8)}
        p={ss(20)}
        borderRadius={ss(4)}
        borderStyle={'dashed'}
        borderColor={'#7AB6AF'}
        borderWidth={ss(1)}
        bgColor={'#FAFAFA'}>
        <Row alignItems={'center'} justifyContent={'space-between'}>
          <Row alignItems={'center'}>
            <Circle size={sp(30)} bgColor={'#5EACA3'}>
              <Text fontSize={sp(18)} color='#fff'>
                {index}
              </Text>
            </Circle>
            <Text color='#3CAEA4' fontSize={sp(20)} ml={ls(10)}>
              {extra.title}
            </Text>
          </Row>
          <Row>
            <Pressable
              hitSlop={ss(20)}
              onPress={() => {
                setShowExtraModal({
                  isOpen: true,
                  isEdit: true,
                  title:
                    templates[currentSelectTemplateIdx].key == 'application'
                      ? '编辑贴敷模板详情'
                      : '编辑推拿模板详情',
                  des1:
                    templates[currentSelectTemplateIdx].key == 'application'
                      ? '贴敷名称'
                      : '推拿名称',
                  des2:
                    templates[currentSelectTemplateIdx].key == 'application'
                      ? '穴位'
                      : '备注',
                  defaultName: extra.title,
                  defaultContent: extra.content,
                  index: index - 1,
                });
              }}>
              <Icon
                as={<FontAwesome name='edit' />}
                size={sp(20)}
                color='#99A9BF'
              />
            </Pressable>
            <Pressable
              hitSlop={ss(20)}
              ml={ss(20)}
              onPress={() => {
                setShowDeleteTemplateExtraModal({
                  isOpen: true,
                  content: extra.title,
                  index: index - 1,
                });
              }}>
              <Icon
                as={<AntDesign name='delete' />}
                size={sp(20)}
                color='#99A9BF'
              />
            </Pressable>
          </Row>
        </Row>
        <Row mt={ss(20)}>
          <Row>
            <Text fontSize={sp(16)} color={'#999'}>
              {templates[currentSelectTemplateIdx].key == 'application-acupoint'
                ? '穴位：'
                : '备注：'}
            </Text>
            <Text fontSize={sp(16)} color={'#333'} maxW={'90%'}>
              {extra.content}
            </Text>
          </Row>
        </Row>
      </Column>
    );
  };

  const Level2 = () => {
    return (
      <Row mt={ss(10)} flex={1}>
        <Column w={ss(400)} bgColor={'#fff'} borderRadius={ss(10)}>
          <Box p={ss(20)}>
            <BoxTitle
              title='模版列表'
              rightElement={
                <Pressable
                  _pressed={{
                    opacity: 0.6,
                  }}
                  hitSlop={ss(20)}
                  onPress={() => {
                    setShowEditTemplateModal({
                      isOpen: true,
                      isEdit: false,
                      type: 'group',
                      title: '新增模版组',
                      defaultName: '',
                      level: 2,
                    });
                  }}>
                  <Row
                    bgColor={'#E1F6EF'}
                    borderRadius={ss(4)}
                    px={ls(12)}
                    py={ss(10)}
                    borderColor={'#15BD8F'}
                    borderWidth={ss(1)}>
                    <Text color={'#0C1B16'} fontSize={sp(14)}>
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
            borderWidth={ss(1)}
            borderColor={'#D8D8D8'}
            placeholderTextColor={'#C0CCDA'}
            color={'#333333'}
            fontSize={sp(16)}
            InputLeftElement={
              <Icon
                as={<MaterialIcons name='search' />}
                size={sp(25)}
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
                      hitSlop={ss(20)}
                      onPress={() => {
                        setCurrentLevel2SelectTemplateGroupIndex(index);
                      }}
                      onLongPress={() => {
                        setCurrentLevel2SelectTemplateGroupIndex(index);
                        setShowEditTemplateModal({
                          isOpen: true,
                          isEdit: true,
                          type: 'group',
                          title: '编辑模版组',
                          defaultName: item.name,
                          level: 2,
                        });
                      }}
                      alignItems='flex-start'
                      bg={
                        currentLevel2SelectTemplateGroupIndex === index
                          ? '#1AB7BE'
                          : '#fff'
                      }
                      justifyContent='center'
                      borderBottomColor='trueGray.200'
                      borderBottomWidth={ss(1)}
                      px={ls(20)}
                      py={ss(16)}>
                      <Text
                        fontSize={sp(20)}
                        color={
                          currentLevel2SelectTemplateGroupIndex === index
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
                    hitSlop={ss(20)}
                    w={ls(72)}
                    bg='red.500'
                    justifyContent='center'
                    onPress={() => {
                      setShowDeleteTemplateModal({
                        isOpen: true,
                        groupName: rowData.item.name,
                        level: 2,
                      });
                    }}
                    alignItems='center'>
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

          <Row bgColor={'#fff'} pb={ss(20)} justifyContent='center'>
            <Text textAlign={'center'} fontSize={sp(14)} color={'#333'}>
              长按组名或模版项支持编辑，左滑支持删除
            </Text>
          </Row>
        </Column>
        <Column
          flex={1}
          ml={ls(10)}
          bgColor={'#fff'}
          borderRadius={ss(10)}
          p={ss(20)}>
          <BoxTitle title='模版详情' />

          <ScrollView>
            <Pressable
              onPress={() => {
                if (canEdit) setCanEdit(false);
              }}>
              <Row mt={ss(28)} flexWrap={'wrap'}>
                {getCurrentLevel2SelectTemplateGroupItems().map(
                  (item: any, index: any) => {
                    return (
                      <TextChild
                        item={item}
                        key={index}
                        level={2}
                        onDeleteItem={function (
                          item: any,
                          level: number,
                        ): void {
                          // 删除
                          setShowDeleteItemModal({
                            isOpen: true,
                            item: item,
                            level: level,
                          });
                        }}
                        canEdit={canEdit}
                        onLongPress={function (): void {
                          setCanEdit(true);
                        }}
                      />
                    );
                  },
                )}
                <Pressable
                  hitSlop={ss(20)}
                  onPress={() => {
                    setShowEditTemplateModal({
                      isOpen: true,
                      isEdit: false,
                      title: '新增模版',
                      type: 'item',
                      defaultName: '',
                      level: 2,
                    });
                  }}
                  mr={ls(10)}
                  mb={ss(10)}
                  borderWidth={ss(1)}
                  borderRadius={2}
                  borderColor={'#D8D8D8'}
                  px={ls(20)}
                  py={ss(7)}>
                  <Text color='#BCBCBC' fontSize={sp(18)}>
                    + 自定义添加
                  </Text>
                </Pressable>
              </Row>
            </Pressable>
          </ScrollView>
        </Column>
      </Row>
    );
  };

  const Level3 = () => {
    return (
      <Row mt={ss(10)} flex={1}>
        <Column w={ss(400)} bgColor={'#fff'} borderRadius={ss(10)}>
          <Box p={ss(20)}>
            <BoxTitle
              title='模版列表'
              rightElement={
                <Pressable
                  _pressed={{
                    opacity: 0.6,
                  }}
                  hitSlop={ss(20)}
                  onPress={() => {
                    setShowLevel3EditTemplateModal({
                      isOpen: true,
                      isEdit: false,
                      title: '新增模版',
                      groups:
                        templates[currentSelectTemplateIdx]?.groups.map(
                          (item) => item.name,
                        ) || [],
                      defaultGroup: '',
                      defaultName: '',
                    });
                  }}>
                  <Row
                    bgColor={'#E1F6EF'}
                    borderRadius={ss(4)}
                    px={ls(12)}
                    py={ss(10)}
                    borderColor={'#15BD8F'}
                    borderWidth={ss(1)}>
                    <Text color={'#0C1B16'} fontSize={sp(14)}>
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
            borderWidth={ss(1)}
            borderColor={'#D8D8D8'}
            color={'#333333'}
            fontSize={sp(16)}
            InputLeftElement={
              <Icon
                as={<MaterialIcons name='search' />}
                size={sp(25)}
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
            <Pressable
              hitSlop={ss(20)}
              onPress={() => {
                // toggle
                setShowEditTemplateGroupModal({
                  isOpen: true,
                  isEdit: false,
                  title: '新增分组',
                  defaultName: '',
                });
              }}
              alignItems='center'
              justifyContent={'space-between'}
              bg={'#FFF'}
              borderBottomColor='trueGray.200'
              borderBottomWidth={ss(1)}
              flexDirection={'row'}
              px={ls(20)}
              py={ss(16)}>
              <Row alignItems={'center'}>
                <Icon
                  ml={ls(10)}
                  as={<AntDesign name='addfolder' />}
                  size={sp(24)}
                  color='#E36C36'
                />
                <Text fontSize={sp(20)} ml={ls(10)} color={'#E36C36'}>
                  新增分组
                </Text>
              </Row>
            </Pressable>
            <ScrollView>
              {groups.map((group, groupIdx) => {
                return (
                  <Box key={groupIdx}>
                    <Pressable
                      onLongPress={() => {
                        // toggle
                        setCurrentLevel3SelectFolderIdx({
                          folder: groupIdx,
                          item:
                            currentLevel3SelectFolderIdx.folder === groupIdx
                              ? currentLevel3SelectFolderIdx.item
                              : 0,
                        });
                        setShowEditTemplateGroupModal({
                          isOpen: true,
                          isEdit: true,
                          title: '编辑分组',
                          defaultName: group.name,
                        });
                      }}
                      hitSlop={ss(20)}
                      onPress={() => {
                        // toggle
                        setCurrentLevel3SelectFolderIdx({
                          folder:
                            currentLevel3SelectFolderIdx.folder === groupIdx
                              ? -1
                              : groupIdx,
                          item: 0,
                        });
                      }}
                      alignItems='center'
                      justifyContent={'space-between'}
                      bg={
                        currentLevel3SelectFolderIdx.folder === groupIdx
                          ? '#F8FBFA'
                          : '#fff'
                      }
                      borderBottomColor='trueGray.200'
                      borderBottomWidth={ss(1)}
                      flexDirection={'row'}
                      px={ls(20)}
                      py={ss(16)}>
                      <Row alignItems={'center'}>
                        <Icon
                          ml={ls(10)}
                          as={<AntDesign name='folder1' />}
                          size={sp(24)}
                          color='#B4B4B4'
                        />
                        <Text fontSize={sp(20)} ml={ls(10)} color={'#333'}>
                          {group.name}
                        </Text>
                      </Row>

                      <Icon
                        as={
                          <SimpleLineIcons
                            name={
                              currentLevel3SelectFolderIdx.folder === groupIdx
                                ? 'arrow-down'
                                : 'arrow-right'
                            }
                          />
                        }
                        size={sp(16)}
                        color={'#BCBCBC'}
                      />
                    </Pressable>
                    {currentLevel3SelectFolderIdx.folder == groupIdx && (
                      <SwipeListView
                        ref={swiperlistRef}
                        data={group.children as TemplateItem[]}
                        keyExtractor={(groupItem, index) => groupItem.name}
                        renderItem={({ item: groupItem, index: groupIdx }) => {
                          return (
                            <Box>
                              <Pressable
                                hitSlop={ss(20)}
                                onPress={() => {
                                  setCurrentLevel3SelectFolderIdx({
                                    folder: currentLevel3SelectFolderIdx.folder,
                                    item: groupIdx,
                                  });
                                }}
                                onLongPress={() => {
                                  setCurrentLevel3SelectFolderIdx({
                                    folder: currentLevel3SelectFolderIdx.folder,
                                    item: groupIdx,
                                  });
                                  setShowLevel3EditTemplateModal({
                                    isOpen: true,
                                    isEdit: true,
                                    title: '编辑模版',
                                    groups:
                                      templates[
                                        currentSelectTemplateIdx
                                      ]?.groups.map((item) => item.name) || [],
                                    defaultGroup: group.name,
                                    defaultName: groupItem.name,
                                  });
                                }}
                                alignItems='flex-start'
                                bg={
                                  currentLevel3SelectFolderIdx.item === groupIdx
                                    ? '#1AB7BE'
                                    : '#fff'
                                }
                                justifyContent='center'
                                borderBottomColor='trueGray.200'
                                borderBottomWidth={ss(1)}
                                px={ls(20)}
                                py={ss(16)}>
                                <Text
                                  ml={ls(46)}
                                  fontSize={sp(20)}
                                  color={
                                    currentLevel3SelectFolderIdx.item ===
                                    groupIdx
                                      ? '#fff'
                                      : '#333'
                                  }>
                                  {groupItem.name}
                                </Text>
                              </Pressable>
                            </Box>
                          );
                        }}
                        renderHiddenItem={(rowData, rowMap) => (
                          <Row flex={1}>
                            <Box flex={1} />
                            <Pressable
                              _pressed={{
                                opacity: 0.6,
                              }}
                              hitSlop={ss(20)}
                              w={ls(72)}
                              bg='red.500'
                              justifyContent='center'
                              onPress={() => {
                                setShowDeleteTemplateModal({
                                  isOpen: true,
                                  groupName: rowData.item.name,
                                  groupIdx: groupIdx,
                                  level: 3,
                                });
                              }}
                              alignItems='center'>
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
                    )}
                  </Box>
                );
              })}
            </ScrollView>
          </Box>

          <Row bgColor={'#fff'} pb={ss(20)} justifyContent='center'>
            <Text textAlign={'center'} fontSize={sp(14)} color={'#333'}>
              长按组名或模版项支持编辑，左滑支持删除
            </Text>
          </Row>
        </Column>
        <Column
          flex={1}
          ml={ls(10)}
          bgColor={'#fff'}
          borderRadius={ss(10)}
          p={ss(20)}>
          <BoxTitle
            title='模版详情'
            rightElement={
              <>
                {(templates[currentSelectTemplateIdx].key == 'application' ||
                  templates[currentSelectTemplateIdx].key == 'massage') && (
                  <Pressable
                    _pressed={{
                      opacity: 0.8,
                    }}
                    hitSlop={ss(20)}
                    onPress={() => {
                      setShowExtraModal({
                        isOpen: true,
                        isEdit: false,
                        title:
                          templates[currentSelectTemplateIdx].key ==
                          'application'
                            ? '新增贴敷模板详情'
                            : '新增推拿模板详情',
                        des1:
                          templates[currentSelectTemplateIdx].key ==
                          'application'
                            ? '贴敷名称'
                            : '推拿名称',
                        des2:
                          templates[currentSelectTemplateIdx].key ==
                          'application'
                            ? '穴位'
                            : '备注',
                        defaultName: '',
                        defaultContent: '',
                        index: -1,
                      });
                    }}>
                    <Row
                      bgColor={'#E1F6EF'}
                      borderRadius={ss(4)}
                      px={ls(12)}
                      py={ss(10)}
                      borderColor={'#15BD8F'}
                      borderWidth={ss(1)}>
                      <Text color={'#0C1B16'} fontSize={sp(14)}>
                        添加详情
                      </Text>
                    </Row>
                  </Pressable>
                )}
              </>
            }
          />

          <ScrollView>
            <Row mt={ss(28)} flexWrap={'wrap'}>
              {level3Children?.map((item: any, index: any) => {
                return typeof item === 'string' ? (
                  <TextChild
                    key={index}
                    item={item}
                    level={3}
                    onDeleteItem={function (item: any, level: number): void {
                      // 删除
                      setShowDeleteItemModal({
                        isOpen: true,
                        item: item,
                        level: level,
                      });
                    }}
                    canEdit={canEdit}
                    onLongPress={function (): void {
                      setCanEdit(true);
                    }}
                  />
                ) : (
                  <ExtraChild key={index} item={item} index={index + 1} />
                );
              })}
              {templates[currentSelectTemplateIdx].key !== 'application' &&
                templates[currentSelectTemplateIdx].key !== 'massage' && (
                  <Pressable
                    _pressed={{
                      opacity: 0.6,
                    }}
                    hitSlop={ss(20)}
                    onPress={() => {
                      setShowEditTemplateModal({
                        isOpen: true,
                        isEdit: false,
                        title: '新增模版',
                        type: 'item',
                        defaultName: '',
                        level: 3,
                      });
                    }}
                    mr={ls(10)}
                    mb={ss(10)}
                    borderWidth={ss(1)}
                    borderRadius={2}
                    borderColor={'#D8D8D8'}
                    px={ls(20)}
                    py={ss(7)}>
                    <Text color='#BCBCBC' fontSize={sp(18)}>
                      + 自定义添加
                    </Text>
                  </Pressable>
                )}
            </Row>
          </ScrollView>
        </Column>
      </Row>
    );
  };

  return (
    <Box flex={1}>
      <NavigationBar
        onBackIntercept={() => false}
        leftElement={
          <Text color='white' fontWeight={600} fontSize={sp(20)}>
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
            <Tabs
              onChangeTab={() => {
                if (canEdit) setCanEdit(false);
              }}
            />
          </Box>
          {getGroupLevel() == 2 ? <Level2 /> : <Level3 />}
        </Box>
      </Column>
      {showDeleteTemplateModal.isOpen && (
        <DialogModal
          isOpen={showDeleteTemplateModal.isOpen}
          onClose={function (): void {
            setShowDeleteTemplateModal({
              ...showDeleteTemplateModal,
              isOpen: false,
            });
          }}
          title={`是否确认删除${showDeleteTemplateModal.groupName}整个模版组？`}
          onConfirm={function (): void {
            console.log('showDeleteTemplateModal', showDeleteTemplateModal);
            if (showDeleteTemplateModal.level === 2) {
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
                    ...showDeleteTemplateModal,
                    isOpen: false,
                  });
                });
            } else {
              requestDeleteTemplateGroup(showDeleteTemplateModal.groupName, {
                groupIdx: showDeleteTemplateModal.groupIdx,
              })
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
                    ...showDeleteTemplateModal,
                    isOpen: false,
                  });
                });
            }
          }}
        />
      )}
      {showDeleteTemplateExtraModal.isOpen && (
        <DialogModal
          isOpen={showDeleteTemplateExtraModal.isOpen}
          onClose={function (): void {
            setShowDeleteTemplateExtraModal({
              ...showDeleteTemplateExtraModal,
              isOpen: false,
            });
          }}
          title={`是否确认删除${showDeleteTemplateExtraModal.content}？`}
          onConfirm={function (): void {
            const group: any = {};
            let folderIdx =
              currentLevel3SelectFolderIdx.folder === -1
                ? 0
                : currentLevel3SelectFolderIdx.folder;

            let itemIdx = currentLevel3SelectFolderIdx.item;

            group.name =
              templates[currentSelectTemplateIdx]?.groups?.[folderIdx].name;

            group.children = JSON.parse(
              JSON.stringify(
                templates[currentSelectTemplateIdx]?.groups?.[folderIdx]
                  ?.children,
              ),
            );

            group.children[itemIdx].children.splice(
              showDeleteTemplateExtraModal.index,
              1,
            );

            requestPatchTemplateGroup(group)
              .then((res) => {
                toastAlert(
                  toast,
                  'success',
                  `删除模版${showDeleteTemplateExtraModal.content}成功！`,
                );
                requestGetTemplates();
              })
              .catch((err) => {
                toastAlert(
                  toast,
                  'error',
                  `删除模版组${showDeleteTemplateExtraModal.content}失败！`,
                );
              })
              .finally(() => {
                setShowDeleteTemplateExtraModal({
                  ...showDeleteTemplateExtraModal,
                  isOpen: false,
                });
              });
          }}
        />
      )}
      {showEditTemplateGroupModal.isOpen && (
        <NewTemplateGroupModal
          isOpen={showEditTemplateGroupModal.isOpen}
          defaultName={showEditTemplateGroupModal.defaultName}
          title={showEditTemplateGroupModal.title}
          onClose={function (): void {
            setShowEditTemplateGroupModal({
              ...showEditTemplateGroupModal,
              isOpen: false,
            });
          }}
          onConfirm={function (text: string): void {
            // 新增分组
            const group: any = {};
            if (showEditTemplateGroupModal.isEdit) {
              group.originalName = showEditTemplateGroupModal.defaultName;
              group.name = text;
              group.children =
                templates[currentSelectTemplateIdx]?.groups?.[
                  currentLevel3SelectFolderIdx.folder
                ]?.children;
            } else {
              group.name = text;
              group.children = [];
            }

            requestPatchTemplateGroup(group)
              .then((res) => {
                toastAlert(
                  toast,
                  'success',
                  showEditTemplateGroupModal.isEdit
                    ? '编辑分组成功！'
                    : '新增分组成功！',
                );
                requestGetTemplates();
              })
              .catch((err) => {
                toastAlert(
                  toast,
                  'error',
                  showEditTemplateGroupModal.isEdit
                    ? '编辑分组失败！'
                    : '新增分组失败！',
                );
              })
              .finally(() => {
                setShowEditTemplateGroupModal({
                  ...showEditTemplateGroupModal,
                  isOpen: false,
                });
              });
          }}
          onDeleteGroup={function (text: string): void {
            setShowEditTemplateGroupModal({
              ...showEditTemplateGroupModal,
              isOpen: false,
            });
            setShowDeleteTemplateModal({
              isOpen: true,
              groupName: text,
              level: 2,
            });
          }}
        />
      )}
      {showLevel3EditTemplateModal.isOpen && (
        <NewLevel3TemplateGroupModal
          isOpen={showLevel3EditTemplateModal.isOpen}
          defaultName={showLevel3EditTemplateModal.defaultName}
          defaultGroup={showLevel3EditTemplateModal.defaultGroup}
          groups={showLevel3EditTemplateModal.groups}
          title={showLevel3EditTemplateModal.title}
          onClose={function (): void {
            setShowLevel3EditTemplateModal({
              ...showLevel3EditTemplateModal,
              isOpen: false,
            });
          }}
          onConfirm={function (res: { name: string; group: string }): void {
            const group: any = {};
            group.name = res.name;
            group.children = showLevel3EditTemplateModal.isEdit
              ? getCurrentLevel2SelectTemplateGroupItems()
              : [];
            if (showLevel3EditTemplateModal.isEdit) {
              group.originalName = showEditTemplateModal.defaultName;
              group.name = res.group;
              const idx = templates[currentSelectTemplateIdx]?.groups.findIndex(
                (item) => item.name == res.group,
              );

              const children = JSON.parse(
                JSON.stringify(
                  (templates[currentSelectTemplateIdx]?.groups[idx]
                    .children as any[]) || [],
                ),
              );

              const tidx = children.findIndex(
                (item: any) =>
                  item.name == showLevel3EditTemplateModal.defaultName,
              );

              children[tidx].name = res.name;

              group.children = children || [];
            } else {
              group.name = res.group;
              const idx = templates[currentSelectTemplateIdx]?.groups.findIndex(
                (item) => item.name == res.group,
              );

              const children =
                (templates[currentSelectTemplateIdx]?.groups[idx]
                  .children as any[]) || [];

              group.children = children.concat({
                name: res.name,
                children: [],
              });
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
                setShowLevel3EditTemplateModal({
                  ...showLevel3EditTemplateModal,
                  isOpen: false,
                });
              });
          }}
        />
      )}
      {showEditTemplateModal.isOpen && (
        <NewTemplateModalModal
          title={showEditTemplateModal.title}
          isOpen={showEditTemplateModal.isOpen}
          defaultName={showEditTemplateModal.defaultName}
          type={showEditTemplateModal.type === 'group' ? 'group' : 'item'}
          onClose={function (): void {
            setShowEditTemplateModal({
              ...showEditTemplateModal,
              isOpen: false,
            });
          }}
          onConfirm={function (text: string): void {
            const group: any = {};
            if (showEditTemplateModal.level === 3) {
              let folderIdx =
                currentLevel3SelectFolderIdx.folder === -1
                  ? 0
                  : currentLevel3SelectFolderIdx.folder;

              let itemIdx = currentLevel3SelectFolderIdx.item;

              const item = templates[currentSelectTemplateIdx]?.groups?.[
                folderIdx
              ]?.children[itemIdx] as TemplateItem;

              if (!item) {
                toastAlert(toast, 'error', '请先选择模版组！');
                return;
              }

              group.name =
                templates[currentSelectTemplateIdx]?.groups?.[folderIdx].name;

              group.children = JSON.parse(
                JSON.stringify(
                  templates[currentSelectTemplateIdx]?.groups?.[folderIdx]
                    ?.children,
                ),
              );

              group.children[itemIdx].children.push(text);
            } else {
              if (showEditTemplateModal.type === 'group') {
                group.name = text;
                group.children = showEditTemplateModal.isEdit
                  ? getCurrentLevel2SelectTemplateGroupItems()
                  : [];
                if (showEditTemplateModal.isEdit) {
                  group.originalName = showEditTemplateModal.defaultName;
                }
              } else {
                group.name = groups[currentLevel2SelectTemplateGroupIndex].name;
                group.children =
                  getCurrentLevel2SelectTemplateGroupItems().concat(text);
              }
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
                  ...showEditTemplateModal,
                  isOpen: false,
                });
              });
          }}
        />
      )}
      {showExtraModal.isOpen && (
        <NewTemplateExtraModal
          isOpen={showExtraModal.isOpen}
          defaultName={showExtraModal.defaultName}
          defaultContent={showExtraModal.defaultContent}
          title={showExtraModal.title}
          des1={showExtraModal.des1}
          des2={showExtraModal.des2}
          onClose={function (): void {
            setShowExtraModal({
              ...showExtraModal,
              isOpen: false,
            });
          }}
          onConfirm={function ({
            title,
            content,
          }: {
            title: string;
            content: string;
          }): void {
            let group: any = {};
            if (showExtraModal.isEdit) {
              let folderIdx =
                currentLevel3SelectFolderIdx.folder === -1
                  ? 0
                  : currentLevel3SelectFolderIdx.folder;

              let itemIdx = currentLevel3SelectFolderIdx.item;

              const item = templates[currentSelectTemplateIdx]?.groups?.[
                folderIdx
              ]?.children[itemIdx] as TemplateItem;

              group.name =
                templates[currentSelectTemplateIdx]?.groups?.[folderIdx].name;

              group.children = JSON.parse(
                JSON.stringify(
                  templates[currentSelectTemplateIdx]?.groups?.[folderIdx]
                    ?.children,
                ),
              );

              group.children[itemIdx].children.splice(showExtraModal.index, 1, {
                extra: { title, content },
              });
            } else {
              let folderIdx =
                currentLevel3SelectFolderIdx.folder === -1
                  ? 0
                  : currentLevel3SelectFolderIdx.folder;

              let itemIdx = currentLevel3SelectFolderIdx.item;

              const item = templates[currentSelectTemplateIdx]?.groups?.[
                folderIdx
              ]?.children[itemIdx] as TemplateItem;

              if (!item) {
                toastAlert(toast, 'error', '请先选择模版组！');
                return;
              }

              group.name =
                templates[currentSelectTemplateIdx]?.groups?.[folderIdx].name;

              group.children = JSON.parse(
                JSON.stringify(
                  templates[currentSelectTemplateIdx]?.groups?.[folderIdx]
                    ?.children,
                ),
              );

              group.children[itemIdx].children.push({
                extra: { title, content },
              });
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
                setShowExtraModal({
                  ...showExtraModal,
                  isOpen: false,
                });
              });
          }}
        />
      )}
      {showDeleteItemModal.isOpen && (
        <DialogModal
          isOpen={showDeleteItemModal.isOpen}
          onClose={function (): void {
            setShowDeleteItemModal({
              ...showDeleteItemModal,
              isOpen: false,
            });
          }}
          title='是否确认删除模版项？'
          onConfirm={function (): void {
            let group: any;
            if (showDeleteItemModal.level === 2) {
              const currentGroup =
                groups[currentLevel2SelectTemplateGroupIndex];
              group = {
                name: currentGroup.name,
                children: getCurrentLevel2SelectTemplateGroupItems().filter(
                  (child) => child !== showDeleteItemModal.item,
                ),
              };
            } else {
              group = {
                name: groups[currentLevel3SelectFolderIdx.folder].name,
                children: groups[
                  currentLevel3SelectFolderIdx.folder
                ].children.map((item, index) => {
                  let _item = item as TemplateItem;
                  if (currentLevel3SelectFolderIdx.item === index) {
                    return {
                      ..._item,
                      children: _item.children.filter(
                        (child) => child !== showDeleteItemModal.item,
                      ),
                    };
                  } else {
                    return _item;
                  }
                }),
              };
            }
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
                  ...showDeleteItemModal,
                  isOpen: false,
                });
              });
          }}
        />
      )}
    </Box>
  );
}

function Tabs({ onChangeTab }: { onChangeTab(): void }) {
  const templates = useManagerStore((state) => state.templates);
  const currentSelectTemplateIdx = useManagerStore(
    (state) => state.currentSelectTemplateIdx,
  );
  const setCurrentSelectTemplateIdx = useManagerStore(
    (state) => state.setCurrentSelectTemplateIdx,
  );
  return (
    <ScrollView horizontal={true} bgColor={'#fff'} borderRadius={ss(10)}>
      <Row h={ss(80)}>
        {templates.map((item, index) => {
          return (
            <Pressable
              hitSlop={ss(20)}
              key={index}
              onPress={() => {
                if (currentSelectTemplateIdx === index) {
                  return;
                }
                setCurrentSelectTemplateIdx(index);
                onChangeTab();
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
