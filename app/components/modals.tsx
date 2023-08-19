import { AntDesign } from '@expo/vector-icons';
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
} from 'native-base';
import { sp, ss, ls } from '~/app/utils/style';
import { Template } from '../stores/manager/type';
import { useRef, useState } from 'react';
import { TextInput } from 'react-native';

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
                onPress={() => {
                  onClose();
                }}>
                <Center
                  borderRadius={ss(4)}
                  borderWidth={1}
                  borderColor={'#03CBB2'}
                  px={ls(30)}
                  py={ss(10)}>
                  <Text color='#0C1B16' fontSize={sp(14)}>
                    否
                  </Text>
                </Center>
              </Pressable>
              <Pressable
                onPress={() => {
                  onConfirm();
                }}>
                <Center
                  ml={ls(20)}
                  borderRadius={ss(4)}
                  borderWidth={1}
                  borderColor={'#03CBB2'}
                  bgColor={'rgba(3, 203, 178, 0.20)'}
                  px={ls(30)}
                  py={ss(10)}>
                  <Text color='#0C1B16' fontSize={sp(14)}>
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
  const textInputRef = useRef<TextInput>(null);
  let templateText = defaultText;
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
          <Input
            ref={textInputRef}
            multiline
            placeholder='请输入或选择内容'
            placeholderTextColor={'#ccc'}
            fontSize={sp(16)}
            color='#333'
            borderColor={'#E4E4E4'}
            textAlignVertical='top'
            w={ls(340)}
            h={ss(350)}
            ml={ls(30)}
            autoCorrect={false}
            defaultValue={templateText}
            onChangeText={(text) => {
              templateText = text;
            }}
          />
          <Column w={ls(470)} h={ss(350)}>
            <Row flex={1} bgColor='#fff' borderRadius={ss(10)}>
              <Column bgColor={'#EDF7F6'}>
                {template?.groups.map((item, idx) => {
                  return (
                    <Pressable
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
              </Column>
              <Row flex={1} flexWrap={'wrap'} py={ss(16)} px={ls(20)}>
                {template?.groups[selectTemplateItemsIdx].children.map(
                  (item, idx) => {
                    return (
                      <Pressable
                        key={idx}
                        onPress={() => {
                          const text = templateText.trim();
                          templateText =
                            text.length > 0 ? text + ',' + item : item;
                          console.log(templateText);
                          textInputRef.current?.setNativeProps({
                            text: templateText,
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
                  },
                )}
              </Row>
            </Row>
          </Column>
        </Row>

        <Row justifyContent={'center'} mt={ss(38)} mb={ss(22)}>
          <Pressable
            onPress={() => {
              onClose();
            }}
            borderRadius={ss(4)}
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
            onPress={() => {
              onConfirm(templateText);
            }}
            borderRadius={ss(4)}
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
