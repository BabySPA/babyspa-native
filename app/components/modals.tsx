import { AntDesign, FontAwesome } from '@expo/vector-icons';
import {
  Center,
  Modal,
  Text,
  Row,
  Pressable,
  Input,
  Column,
  Icon,
  Box,
  ScrollView,
  useToast,
} from 'native-base';
import { sp, ss, ls } from '~/app/utils/style';
import { Template } from '../stores/manager/type';
import { useEffect, useRef, useState } from 'react';
import { decodePassword } from '../utils';
import { toastAlert } from '../utils/toast';
import useManagerStore from '../stores/manager';
import SelectRole from './select-role';
import SelectDropdown from './select-dropdown';

interface DialogParams {
  isOpen: boolean;
  headerText?: string;
  title?: string;
  onClose: () => void;
  onConfirm: () => void;
}

interface TemplateModalParams {
  template: Template | undefined;
  defaultText: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (text: string) => void;
}
export function DialogModal({
  isOpen,
  headerText,
  title,
  onClose,
  onConfirm,
}: DialogParams) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
      }}>
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>{headerText || '温馨提示'}</Modal.Header>
        <Modal.Body>
          <Center>
            <Text fontSize={sp(20)} color='#333' mt={ss(40)}>
              {title || '是否确认结束？'}
            </Text>
            <Row mt={ss(50)} mb={ss(20)}>
              <Pressable
                hitSlop={ss(10)}
                onPress={() => {
                  onClose();
                }}>
                <Center
                  borderRadius={4}
                  borderWidth={1}
                  borderColor={'#03CBB2'}
                  px={ls(30)}
                  py={ss(10)}>
                  <Text color='#00B49E' fontSize={sp(14)}>
                    否
                  </Text>
                </Center>
              </Pressable>
              <Pressable
                hitSlop={ss(10)}
                onPress={() => {
                  onConfirm();
                }}>
                <Center
                  ml={ls(20)}
                  borderRadius={4}
                  borderWidth={1}
                  borderColor={'#03CBB2'}
                  bgColor={'rgba(3, 203, 178, 0.20)'}
                  px={ls(30)}
                  py={ss(10)}>
                  <Text color='#00B49E' fontSize={sp(14)}>
                    是
                  </Text>
                </Center>
              </Pressable>
            </Row>
          </Center>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
}

export function TemplateModal({
  template,
  defaultText,
  isOpen,
  onClose,
  onConfirm,
}: TemplateModalParams) {
  const [selectTemplateItemsIdx, setSelectTemplateItemsIdx] = useState(0);
  const [templateText, setTemplateText] = useState('');
  const { requestGetTemplates, templates } = useManagerStore();

  useEffect(() => {
    setTemplateText(defaultText);
  }, [defaultText]);
  useEffect(() => {
    if (isOpen && templates.length === 0) {
      // 打开模版弹窗时，如果没有模版数据，则请求模版数据
      requestGetTemplates();
    }
  }, [isOpen, templates]);

  useEffect(() => {
    if (templateText.length > 300) {
      setTemplateText(templateText.slice(0, 300));
    }
  }, [templateText]);

  const inputRef = useRef(null);
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
      }}>
      <Column bgColor={'white'} borderRadius={ss(10)}>
        <Row
          px={ls(30)}
          py={ss(20)}
          alignItems={'center'}
          justifyContent={'space-between'}>
          <Text fontSize={sp(20)} color={'#000'}>
            {template?.name}
          </Text>
          <Pressable
            hitSlop={ss(10)}
            onPress={() => {
              onClose();
            }}>
            <Icon
              as={<AntDesign name={'close'} />}
              size={ss(24)}
              color='#999'
            />
          </Pressable>
        </Row>
        <Row>
          <Column h={ss(350)}>
            <Input
              ref={inputRef}
              multiline
              placeholder='请输入或选择内容'
              placeholderTextColor={'#ccc'}
              fontSize={sp(16)}
              color='#333'
              maxLength={300}
              w={ls(340)}
              h={'100%'}
              borderColor={'#E4E4E4'}
              textAlignVertical='top'
              ml={ls(30)}
              autoCorrect={false}
              defaultValue={templateText}
              onChangeText={(text) => {
                setTemplateText(text);
              }}
            />
            <Text
              color={'#999'}
              fontSize={sp(14)}
              style={{ position: 'absolute', right: ss(10), bottom: ss(10) }}>
              {templateText.length}/300
            </Text>
          </Column>
          <Column w={ls(470)} h={ss(350)}>
            <Row flex={1} bgColor='#fff' borderRadius={ss(10)}>
              <ScrollView bgColor={'#EDF7F6'} maxW={ls(130)}>
                {template?.groups.map((item, idx) => {
                  return (
                    <Pressable
                      hitSlop={ss(10)}
                      key={idx}
                      onPress={() => {
                        setSelectTemplateItemsIdx(idx);
                      }}>
                      <Center
                        p={ss(10)}
                        h={ss(80)}
                        bgColor={
                          selectTemplateItemsIdx === idx ? '#ffffff' : '#EDF7F6'
                        }>
                        <Text
                          mt={ss(3)}
                          color={
                            selectTemplateItemsIdx === idx
                              ? '#5EACA3'
                              : '#99A9BF'
                          }
                          fontSize={sp(18)}>
                          {item.name}
                        </Text>
                      </Center>
                    </Pressable>
                  );
                })}
              </ScrollView>
              <ScrollView>
                <Row flex={1} flexWrap={'wrap'} py={ss(16)} px={ls(20)}>
                  {template?.groups[selectTemplateItemsIdx].children.map(
                    (item, idx) => {
                      return (
                        <Pressable
                          hitSlop={ss(10)}
                          key={idx}
                          onPress={() => {
                            const text = templateText.trim();

                            // @ts-ignore
                            inputRef.current.value =
                              text.length > 0
                                ? templateText + ',' + item
                                : item;
                            setTemplateText(
                              text.length > 0
                                ? templateText + ',' + item
                                : item,
                            );
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
                    },
                  )}
                </Row>
              </ScrollView>
            </Row>
          </Column>
        </Row>

        <Row justifyContent={'center'} mt={ss(38)} mb={ss(22)}>
          <Pressable
            hitSlop={ss(10)}
            onPress={() => {
              onClose();
            }}
            borderRadius={4}
            borderWidth={1}
            w={ls(100)}
            h={ss(46)}
            justifyContent={'center'}
            alignItems={'center'}
            borderColor='#D8D8D8'>
            <Text color='#333' fontSize={sp(16)}>
              取消
            </Text>
          </Pressable>
          <Pressable
            hitSlop={ss(10)}
            onPress={() => {
              onConfirm(templateText);
            }}
            borderRadius={4}
            borderWidth={1}
            borderColor='#00B49E'
            w={ls(100)}
            h={ss(46)}
            justifyContent={'center'}
            alignItems={'center'}
            ml={ls(40)}
            bgColor={'rgba(0, 180, 158, 0.10)'}>
            <Text color='#00B49E' fontSize={sp(16)}>
              保存
            </Text>
          </Pressable>
        </Row>
      </Column>
    </Modal>
  );
}

interface GrowthCurveModalParams {
  isOpen: boolean;
  defaultHeight: number;
  defaultWeight: number;
  onClose: () => void;
  onConfirm: ({ height, weight }: { height: number; weight: number }) => void;
}
export function GrowthCurveModal({
  isOpen,
  defaultHeight,
  defaultWeight,
  onClose,
  onConfirm,
}: GrowthCurveModalParams) {
  const [height, setHeight] = useState(defaultHeight);
  const [weight, setWeight] = useState(defaultWeight);
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
      }}>
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>{'生长记录'}</Modal.Header>
        <Modal.Body>
          <Center>
            <Row alignItems={'center'} mt={ss(30)} px={ls(60)}>
              <Text fontSize={sp(20)} color='#333'>
                身高(CM)
              </Text>
              <Input
                px={ls(20)}
                py={ss(10)}
                placeholder='请输入'
                fontSize={sp(18)}
                color='#333'
                ml={ls(20)}
                defaultValue={`${defaultHeight}`}
                inputMode='numeric'
                onChangeText={(h) => {
                  setHeight(+h);
                }}
              />
            </Row>
            <Row alignItems={'center'} mt={ss(30)} px={ls(60)}>
              <Text fontSize={sp(20)} color='#333'>
                体重(KG)
              </Text>
              <Input
                px={ls(20)}
                py={ss(10)}
                placeholder='请输入'
                fontSize={sp(18)}
                color='#333'
                ml={ls(20)}
                defaultValue={`${defaultWeight}`}
                inputMode='numeric'
                onChangeText={(w) => {
                  setWeight(+w);
                }}
              />
            </Row>
            <Row mt={ss(80)} mb={ss(20)}>
              <Pressable
                hitSlop={ss(10)}
                onPress={() => {
                  onClose();
                }}>
                <Center
                  borderRadius={4}
                  borderWidth={1}
                  borderColor={'#03CBB2'}
                  px={ls(30)}
                  py={ss(10)}>
                  <Text color='#00B49E' fontSize={sp(14)}>
                    取消
                  </Text>
                </Center>
              </Pressable>
              <Pressable
                hitSlop={ss(10)}
                onPress={() => {
                  onConfirm({
                    height: height,
                    weight: weight,
                  });
                }}>
                <Center
                  ml={ls(20)}
                  borderRadius={4}
                  borderWidth={1}
                  borderColor={'#03CBB2'}
                  bgColor={'rgba(3, 203, 178, 0.20)'}
                  px={ls(30)}
                  py={ss(10)}>
                  <Text color='#00B49E' fontSize={sp(14)}>
                    确认
                  </Text>
                </Center>
              </Pressable>
            </Row>
          </Center>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
}

interface ChangePasswordParams {
  password: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newPassword: string) => void;
}
export function ChangePasswordModal({
  password,
  isOpen,
  onClose,
  onConfirm,
}: ChangePasswordParams) {
  const [originalPassword, setOriginalPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const toast = useToast();
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
      }}>
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>{'修改密码'}</Modal.Header>
        <Modal.Body>
          <Center>
            <Row alignItems={'center'} mt={ss(30)} px={ls(60)}>
              <Text fontSize={sp(20)} color='#333' w={ls(65)}>
                原密码
              </Text>
              <Input
                px={ls(20)}
                py={ss(10)}
                placeholder='请输入原密码'
                keyboardType='email-address'
                fontSize={sp(18)}
                color='#333'
                ml={ls(20)}
                inputMode='numeric'
                onChangeText={(text) => {
                  setOriginalPassword(text);
                }}
              />
            </Row>
            <Row alignItems={'center'} mt={ss(30)} px={ls(60)}>
              <Text fontSize={sp(20)} color='#333' w={ls(65)}>
                新密码
              </Text>
              <Input
                px={ls(20)}
                py={ss(10)}
                placeholder='密码由超过6位数字和字母组成'
                fontSize={sp(18)}
                color='#333'
                ml={ls(20)}
                inputMode='numeric'
                onChangeText={(text) => {
                  setNewPassword(text);
                }}
              />
            </Row>
            <Row alignItems={'center'} mt={ss(30)} px={ls(60)}>
              <Text fontSize={sp(20)} color='#333' w={ls(65)}>
                确认新密码
              </Text>
              <Input
                px={ls(20)}
                py={ss(10)}
                placeholder='请再次输入新密码确认'
                fontSize={sp(18)}
                color='#333'
                ml={ls(20)}
                inputMode='numeric'
                onChangeText={(text) => {
                  setConfirmPassword(text);
                }}
              />
            </Row>
            <Row mt={ss(80)} mb={ss(20)}>
              <Pressable
                hitSlop={ss(10)}
                onPress={() => {
                  onClose();
                }}>
                <Center
                  borderRadius={4}
                  borderWidth={1}
                  borderColor={'#03CBB2'}
                  px={ls(30)}
                  py={ss(10)}>
                  <Text color='#00B49E' fontSize={sp(14)}>
                    取消
                  </Text>
                </Center>
              </Pressable>
              <Pressable
                hitSlop={ss(10)}
                onPress={() => {
                  if (decodePassword(password) !== originalPassword) {
                    toastAlert(toast, 'error', '原密码错误');
                    return;
                  }
                  if (newPassword !== confirmPassword) {
                    toastAlert(toast, 'error', '两次密码不一致');
                    return;
                  }
                  if (newPassword.length < 6) {
                    toastAlert(toast, 'error', '新密码长度不能小于6位');
                    return;
                  }
                  onConfirm(newPassword);
                }}>
                <Center
                  ml={ls(20)}
                  borderRadius={4}
                  borderWidth={1}
                  borderColor={'#03CBB2'}
                  bgColor={'rgba(3, 203, 178, 0.20)'}
                  px={ls(30)}
                  py={ss(10)}>
                  <Text color='#00B49E' fontSize={sp(14)}>
                    保存
                  </Text>
                </Center>
              </Pressable>
            </Row>
          </Center>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
}

interface NewTemplateModalParams {
  isOpen: boolean;
  defaultName: string;
  type: 'group' | 'item';
  title: string;
  onClose: () => void;
  onConfirm: (text: string) => void;
}
export function NewTemplateModalModal({
  isOpen,
  defaultName,
  type,
  title,
  onClose,
  onConfirm,
}: NewTemplateModalParams) {
  const [name, setName] = useState(defaultName);
  const inputRef = useRef(null);
  useEffect(() => {
    if (!isOpen) {
      // @ts-ignore
      inputRef.current?.clear?.();
    }
  }, [isOpen]);
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
      }}>
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>{title}</Modal.Header>
        <Modal.Body>
          <Center>
            <Row alignItems={'flex-start'} mt={ss(30)} px={ls(60)}>
              <Text fontSize={sp(20)} color='#333'>
                {type == 'group' ? '模版组' : '模版项'}
              </Text>
              <Input
                ref={inputRef}
                px={ls(20)}
                py={ss(10)}
                placeholder='请输入'
                fontSize={sp(18)}
                color='#333'
                ml={ls(20)}
                multiline
                w={ls(240)}
                height={ss(110)}
                defaultValue={defaultName}
                inputMode='text'
                onChangeText={(text) => {
                  setName(text);
                }}
              />
            </Row>

            <Row mt={ss(80)} mb={ss(20)}>
              <Pressable
                hitSlop={ss(10)}
                onPress={() => {
                  onClose();
                }}>
                <Center
                  borderRadius={4}
                  borderWidth={1}
                  borderColor={'#03CBB2'}
                  px={ls(30)}
                  py={ss(10)}>
                  <Text color='#00B49E' fontSize={sp(14)}>
                    取消
                  </Text>
                </Center>
              </Pressable>
              <Pressable
                opacity={name.length > 0 ? 1 : 0.5}
                hitSlop={ss(10)}
                onPress={() => {
                  if (name) onConfirm(name);
                }}>
                <Center
                  ml={ls(20)}
                  borderRadius={4}
                  borderWidth={1}
                  borderColor={'#03CBB2'}
                  bgColor={'rgba(3, 203, 178, 0.20)'}
                  px={ls(30)}
                  py={ss(10)}>
                  <Text color='#00B49E' fontSize={sp(14)}>
                    确认
                  </Text>
                </Center>
              </Pressable>
            </Row>
          </Center>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
}

interface NewTemplateGroupModalParams {
  isOpen: boolean;
  defaultName: string;
  title: string;
  onClose: () => void;
  onConfirm: (text: string) => void;
}
export function NewTemplateGroupModal({
  isOpen,
  defaultName,
  title,
  onClose,
  onConfirm,
}: NewTemplateGroupModalParams) {
  const [name, setName] = useState(defaultName);
  const inputRef = useRef(null);
  useEffect(() => {
    if (!isOpen) {
      // @ts-ignore
      inputRef.current?.clear?.();
    }
  }, [isOpen]);
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
      }}>
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>{title}</Modal.Header>
        <Modal.Body>
          <Center>
            <Row alignItems={'center'} mt={ss(30)} px={ls(60)}>
              <Text fontSize={sp(20)} color='#333'>
                分组名称
              </Text>
              <Input
                ref={inputRef}
                px={ls(20)}
                py={ss(10)}
                placeholder='请输入'
                fontSize={sp(18)}
                color='#333'
                ml={ls(20)}
                w={ls(240)}
                defaultValue={defaultName}
                inputMode='text'
                onChangeText={(text) => {
                  setName(text);
                }}
              />
            </Row>

            <Row mt={ss(80)} mb={ss(20)}>
              <Pressable
                hitSlop={ss(10)}
                onPress={() => {
                  onClose();
                }}>
                <Center
                  borderRadius={4}
                  borderWidth={1}
                  borderColor={'#03CBB2'}
                  px={ls(30)}
                  py={ss(10)}>
                  <Text color='#00B49E' fontSize={sp(14)}>
                    取消
                  </Text>
                </Center>
              </Pressable>
              <Pressable
                hitSlop={ss(10)}
                onPress={() => {
                  onConfirm(name);
                }}>
                <Center
                  ml={ls(20)}
                  borderRadius={4}
                  borderWidth={1}
                  borderColor={'#03CBB2'}
                  bgColor={'rgba(3, 203, 178, 0.20)'}
                  px={ls(30)}
                  py={ss(10)}>
                  <Text color='#00B49E' fontSize={sp(14)}>
                    确认
                  </Text>
                </Center>
              </Pressable>
            </Row>
          </Center>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
}

interface NewLevel3TemplateGroupModalParams {
  isOpen: boolean;
  defaultName: string;
  defaultGroup: string;
  groups: string[];
  title: string;
  onClose: () => void;
  onConfirm: (param: { group: string; name: string }) => void;
}
export function NewLevel3TemplateGroupModal({
  isOpen,
  defaultGroup,
  defaultName,
  groups,
  title,
  onClose,
  onConfirm,
}: NewLevel3TemplateGroupModalParams) {
  const [name, setName] = useState(defaultName);
  const inputRef = useRef(null);
  useEffect(() => {
    if (!isOpen) {
      // @ts-ignore
      inputRef.current?.clear?.();
    }
  }, [isOpen]);

  const [selectGroup, setSelectGroup] = useState(defaultGroup);
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
      }}>
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>{title}</Modal.Header>
        <Modal.Body>
          <Center>
            <Row alignItems={'center'} mt={ss(30)} px={ls(60)}>
              <Text fontSize={sp(20)} color='#333'>
                模版名称
              </Text>
              <Input
                ref={inputRef}
                px={ls(20)}
                py={ss(10)}
                placeholder='请输入'
                fontSize={sp(18)}
                color='#333'
                ml={ls(20)}
                w={ls(240)}
                defaultValue={defaultName}
                inputMode='text'
                onChangeText={(text) => {
                  setName(text);
                }}
              />
            </Row>
            <Row alignItems={'center'} mt={ss(30)} px={ls(60)}>
              <Text fontSize={sp(20)} color='#333' mr={ls(20)}>
                所属分组
              </Text>
              <SelectDropdown
                data={groups}
                onSelect={(selectedItem, index) => {
                  setSelectGroup(selectedItem);
                }}
                defaultValue={defaultGroup}
                defaultButtonText={defaultGroup || '请选择分组'}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem;
                }}
                rowTextForSelection={(item, index) => {
                  return item;
                }}
                buttonStyle={{
                  width: ss(240),
                  height: ss(48),
                  backgroundColor: '#fff',
                  borderRadius: ss(4),
                  borderWidth: 1,
                  borderColor: '#D8D8D8',
                }}
                buttonTextStyle={{
                  color: '#333333',
                  textAlign: 'left',
                  fontSize: sp(16),
                }}
                renderDropdownIcon={(isOpened) => {
                  return (
                    <Icon
                      as={
                        <FontAwesome
                          name={isOpened ? 'angle-up' : 'angle-down'}
                        />
                      }
                      size={ss(18)}
                      color='#999'
                    />
                  );
                }}
                dropdownIconPosition={'right'}
                dropdownStyle={{
                  backgroundColor: '#fff',
                  borderRadius: ss(8),
                }}
                rowStyle={{
                  backgroundColor: '#fff',
                  borderBottomColor: '#D8D8D8',
                }}
                rowTextStyle={{
                  color: '#333',
                  textAlign: 'center',
                  fontSize: sp(16),
                }}
                selectedRowStyle={{
                  backgroundColor: '#CBEDE2',
                }}
              />
            </Row>

            <Row mt={ss(80)} mb={ss(20)}>
              <Pressable
                hitSlop={ss(10)}
                onPress={() => {
                  onClose();
                }}>
                <Center
                  borderRadius={4}
                  borderWidth={1}
                  borderColor={'#03CBB2'}
                  px={ls(30)}
                  py={ss(10)}>
                  <Text color='#00B49E' fontSize={sp(14)}>
                    取消
                  </Text>
                </Center>
              </Pressable>
              <Pressable
                opacity={name.length > 0 && selectGroup.length > 0 ? 1 : 0.5}
                hitSlop={ss(10)}
                onPress={() => {
                  onConfirm({
                    group: selectGroup,
                    name: name,
                  });
                }}>
                <Center
                  ml={ls(20)}
                  borderRadius={4}
                  borderWidth={1}
                  borderColor={'#03CBB2'}
                  bgColor={'rgba(3, 203, 178, 0.20)'}
                  px={ls(30)}
                  py={ss(10)}>
                  <Text color='#00B49E' fontSize={sp(14)}>
                    确认
                  </Text>
                </Center>
              </Pressable>
            </Row>
          </Center>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
}

interface NewTemplateExtraModalParams {
  isOpen: boolean;
  defaultName: string;
  defaultContent: string;
  title: string;
  des1: string;
  des2: string;
  onClose: () => void;
  onConfirm: (params: { title: string; content: string }) => void;
}
export function NewTemplateExtraModal({
  isOpen,
  defaultName,
  defaultContent,
  title,
  des1,
  des2,
  onClose,
  onConfirm,
}: NewTemplateExtraModalParams) {
  const [name, setName] = useState(defaultName);
  const [content, setContent] = useState(defaultContent);
  const inputRef1 = useRef(null);
  const inputRef2 = useRef(null);
  useEffect(() => {
    if (!isOpen) {
      // @ts-ignore
      inputRef1.current?.clear?.();
      // @ts-ignore
      inputRef2.current?.clear?.();
    }
  }, [isOpen]);
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
      }}>
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>{title}</Modal.Header>
        <Modal.Body>
          <Center>
            <Row alignItems={'center'} mt={ss(30)} px={ls(60)}>
              <Text fontSize={sp(20)} color='#333'>
                {des1}
              </Text>
              <Input
                ref={inputRef1}
                px={ls(20)}
                py={ss(10)}
                placeholder='请输入'
                fontSize={sp(18)}
                color='#333'
                ml={ls(20)}
                w={ls(240)}
                defaultValue={defaultName}
                inputMode='text'
                onChangeText={(text) => {
                  setName(text);
                }}
              />
            </Row>
            <Row alignItems={'flex-start'} mt={ss(30)} px={ls(60)}>
              <Text fontSize={sp(20)} color='#333'>
                {des2}
              </Text>
              <Input
                ref={inputRef2}
                px={ls(20)}
                py={ss(10)}
                placeholder='请输入'
                multiline
                fontSize={sp(18)}
                color='#333'
                ml={ls(20)}
                w={ls(240)}
                h={ss(145)}
                defaultValue={defaultContent}
                inputMode='text'
                onChangeText={(text) => {
                  setContent(text);
                }}
              />
            </Row>

            <Row mt={ss(80)} mb={ss(20)}>
              <Pressable
                hitSlop={ss(10)}
                onPress={() => {
                  onClose();
                }}>
                <Center
                  borderRadius={4}
                  borderWidth={1}
                  borderColor={'#03CBB2'}
                  px={ls(30)}
                  py={ss(10)}>
                  <Text color='#00B49E' fontSize={sp(14)}>
                    取消
                  </Text>
                </Center>
              </Pressable>
              <Pressable
                hitSlop={ss(10)}
                onPress={() => {
                  onConfirm({
                    title: name || defaultName,
                    content: content || defaultContent,
                  });
                }}>
                <Center
                  ml={ls(20)}
                  borderRadius={4}
                  borderWidth={1}
                  borderColor={'#03CBB2'}
                  bgColor={'rgba(3, 203, 178, 0.20)'}
                  px={ls(30)}
                  py={ss(10)}>
                  <Text color='#00B49E' fontSize={sp(14)}>
                    确认
                  </Text>
                </Center>
              </Pressable>
            </Row>
          </Center>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
}
