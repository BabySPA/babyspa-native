import {
  Box,
  Column,
  Flex,
  Icon,
  Input,
  Modal,
  Radio,
  Row,
  Text,
  Pressable,
  Spinner,
  ScrollView,
} from 'native-base';
import { useToast } from 'react-native-toast-notifications';

import { useEffect, useRef, useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import BoxTitle from '~/app/components/box-title';
import { ss, ls, sp } from '~/app/utils/style';
import { FormBox } from '~/app/components/form-box';
import { toastAlert } from '~/app/utils/toast';
import useManagerStore from '~/app/stores/manager';
import { showAreaPicker, showTimePicker } from '~/app/utils/picker';
interface EditBoxParams {
  onEditFinish: () => void;
}

export default function EditBox(params: EditBoxParams) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const currentShop = useManagerStore((state) => state.currentShop);
  const requestPostShop = useManagerStore((state) => state.requestPostShop);
  const requestGetShops = useManagerStore((state) => state.requestGetShops);
  const requestPatchShop = useManagerStore((state) => state.requestPatchShop);
  const setCurrentShop = useManagerStore((state) => state.setCurrentShop);

  const [tempShop, setTempShop] = useState(currentShop);

  const inputRef = useRef(null);
  useEffect(() => {
    // @ts-ignore
    inputRef.current?.setNativeProps({
      text: currentShop.description,
    });
  }, []);

  const checkShop = () => {
    if (tempShop.name.trim() === '') {
      toastAlert(toast, 'error', '请输入门店名称！');
      return false;
    }

    if (!tempShop.maintainer.trim()) {
      toastAlert(toast, 'error', '请输入负责人！');
      return false;
    }
    if (!tempShop.phoneNumber.trim()) {
      toastAlert(toast, 'error', '请输入联系电话！');
      return false;
    }
    if (!/^1[3456789]\d{9}$/.test(tempShop.phoneNumber.trim())) {
      toastAlert(toast, 'error', '请输入正确的联系电话！');
      return false;
    }
    if (!tempShop.region.trim()) {
      toastAlert(toast, 'error', '请选择所属区域！');
      return false;
    }
    if (!tempShop.address.trim()) {
      toastAlert(toast, 'error', '请输入详细地址！');
      return false;
    }
    if (!tempShop.openingTime.trim() || !tempShop.closingTime.trim()) {
      toastAlert(toast, 'error', '请选择营业时间！');
      return false;
    }
    return true;
  };

  return (
    <Column
      flex={1}
      bgColor={'#fff'}
      p={ss(20)}
      borderRadius={ss(10)}
      justifyContent={'space-between'}>
      <ScrollView>
        <Column>
          <BoxTitle title={'门店信息'} />
          <Box mt={ss(30)} px={ls(20)}>
            <Row alignItems={'center'}>
              <FormBox
                title='门店名称'
                titleWidth={ls(100)}
                style={{ flex: 1 }}
                required
                form={
                  <Input
                    autoCorrect={false}
                    flex={1}
                    ml={ls(20)}
                    h={ss(48)}
                    py={ss(10)}
                    px={ls(20)}
                    defaultValue={tempShop.name}
                    placeholderTextColor={'#CCC'}
                    color={'#333333'}
                    fontSize={sp(16)}
                    placeholder='请输入'
                    onChangeText={(text) => {
                      setTempShop({
                        ...(tempShop || {}),
                        name: text,
                      });
                    }}
                  />
                }
              />
              <FormBox
                title='负责人'
                required
                titleWidth={ls(100)}
                style={{ flex: 1 }}
                form={
                  <Input
                    autoCorrect={false}
                    flex={1}
                    h={ss(48)}
                    py={ss(10)}
                    ml={ls(20)}
                    px={ls(20)}
                    defaultValue={tempShop.maintainer}
                    placeholderTextColor={'#CCC'}
                    color={'#333333'}
                    fontSize={sp(16)}
                    placeholder='请输入'
                    onChangeText={(text) => {
                      setTempShop({
                        ...tempShop,
                        maintainer: text,
                      });
                    }}
                  />
                }
              />
            </Row>
            <Row alignItems={'center'} mt={ss(30)}>
              <FormBox
                required
                title='联系电话'
                titleWidth={ls(100)}
                style={{ flex: 1 }}
                form={
                  <Input
                    autoCorrect={false}
                    flex={1}
                    ml={ls(20)}
                    h={ss(48)}
                    py={ss(10)}
                    px={ls(20)}
                    defaultValue={tempShop.phoneNumber}
                    placeholderTextColor={'#CCC'}
                    color={'#333333'}
                    fontSize={sp(16)}
                    placeholder='请输入'
                    onChangeText={(text) => {
                      setTempShop({
                        ...tempShop,
                        phoneNumber: text,
                      });
                    }}
                  />
                }
              />
              <FormBox
                title='所属区域'
                titleWidth={ls(100)}
                style={{ flex: 1 }}
                required
                form={
                  <Box flex={1} ml={ls(20)}>
                    <Pressable
                      _pressed={{
                        opacity: 0.8,
                      }}
                      hitSlop={ss(20)}
                      onPress={() => {
                        showAreaPicker(tempShop.region.split('-'), (val) => {
                          setTempShop({
                            ...tempShop,
                            region: val.join('-'),
                          });
                        });
                      }}>
                      <Row
                        borderRadius={ss(4)}
                        justifyContent={'space-between'}
                        alignItems={'center'}
                        borderWidth={ss(1)}
                        borderColor={'#D8D8D8'}
                        py={ss(10)}
                        px={ss(20)}>
                        <Text color={'#333'} fontSize={sp(16)}>
                          {tempShop.region || '请选择'}
                        </Text>
                        <Icon
                          as={<FontAwesome name='angle-down' />}
                          size={ss(18)}
                          color='#999'
                        />
                      </Row>
                    </Pressable>
                  </Box>
                }
              />
            </Row>
            <Row alignItems={'center'} mt={ss(30)}>
              <FormBox
                required
                title='营业时间'
                titleWidth={ls(100)}
                style={{ flex: 1 }}
                form={
                  <Row flex={1} alignItems={'center'} ml={ls(20)}>
                    <Pressable
                      _pressed={{
                        opacity: 0.8,
                      }}
                      hitSlop={ss(20)}
                      onPress={() => {
                        showTimePicker(
                          tempShop.openingTime.split(':'),
                          (val) => {
                            setTempShop({
                              ...tempShop,
                              openingTime: val.join(':'),
                            });
                          },
                        );
                      }}>
                      <Row
                        borderRadius={ss(4)}
                        justifyContent={'space-between'}
                        alignItems={'center'}
                        borderWidth={ss(1)}
                        borderColor={'#D8D8D8'}
                        py={ss(10)}
                        px={ss(10)}>
                        <Text color={'#333'} fontSize={sp(16)}>
                          {tempShop.openingTime || '请选择'}
                        </Text>
                        <Icon
                          as={<FontAwesome name='angle-down' />}
                          size={ss(18)}
                          color='#999'
                        />
                      </Row>
                    </Pressable>
                    <Text mx={ls(12)} fontSize={sp(14)}>
                      至
                    </Text>
                    <Pressable
                      _pressed={{
                        opacity: 0.8,
                      }}
                      hitSlop={ss(20)}
                      onPress={() => {
                        showTimePicker(
                          tempShop.closingTime.split(':'),
                          (val) => {
                            setTempShop({
                              ...tempShop,
                              closingTime: val.join(':'),
                            });
                          },
                        );
                      }}>
                      <Row
                        borderRadius={ss(4)}
                        justifyContent={'space-between'}
                        alignItems={'center'}
                        borderWidth={ss(1)}
                        borderColor={'#D8D8D8'}
                        py={ss(10)}
                        px={ss(10)}>
                        <Text color={'#333'} fontSize={sp(16)}>
                          {tempShop.closingTime || '请选择'}
                        </Text>
                        <Icon
                          as={<FontAwesome name='angle-down' />}
                          size={ss(18)}
                          color='#999'
                        />
                      </Row>
                    </Pressable>
                  </Row>
                }
              />
              <FormBox
                required
                title='详细地址'
                titleWidth={ls(100)}
                style={{ flex: 1 }}
                form={
                  <Input
                    ml={ls(20)}
                    autoCorrect={false}
                    defaultValue={tempShop.address}
                    flex={1}
                    h={ss(48)}
                    py={ss(10)}
                    px={ls(20)}
                    onChangeText={(text) => {
                      setTempShop({
                        ...tempShop,
                        address: text,
                      });
                    }}
                    placeholderTextColor={'#CCC'}
                    color={'#333333'}
                    fontSize={sp(16)}
                    placeholder='请输入'
                  />
                }
              />
            </Row>
            <Row alignItems={'center'} mt={ss(30)} ml={ls(20)}>
              <FormBox
                title='门店介绍'
                titleWidth={ls(100)}
                style={{ alignItems: 'flex-start', flex: 1 }}
                form={
                  <Input
                    ref={inputRef}
                    autoCorrect={false}
                    flex={1}
                    h={ss(128, 100)}
                    py={ss(10)}
                    px={ls(20)}
                    onChangeText={(text) => {
                      setTempShop({
                        ...tempShop,
                        description: text,
                      });
                    }}
                    textAlignVertical={'top'}
                    multiline
                    placeholderTextColor={'#CCC'}
                    color={'#333333'}
                    fontSize={sp(16)}
                    placeholder='请输入'
                  />
                }
              />
            </Row>
          </Box>
        </Column>
      </ScrollView>

      <Row justifyContent={'center'} mb={ss(40, 20)} mt={ss(10)}>
        <Pressable
          _pressed={{
            opacity: 0.8,
          }}
          hitSlop={ss(20)}
          onPress={() => {
            params.onEditFinish();
          }}>
          <Box
            px={ls(34)}
            py={ss(12)}
            bgColor={'rgba(216, 216, 216, 0.10)'}
            borderRadius={ss(4)}
            borderWidth={ss(1)}
            borderColor={'#D8D8D8'}>
            <Text color='#333' fontSize={sp(16)}>
              取消
            </Text>
          </Box>
        </Pressable>

        <Pressable
          _pressed={{
            opacity: 0.8,
          }}
          hitSlop={ss(20)}
          ml={ls(74)}
          onPress={() => {
            if (loading) return;

            if (!checkShop()) return;
            setLoading(true);

            setCurrentShop(tempShop);
            if (tempShop._id) {
              // 修改门店信息
              requestPatchShop()
                .then(async (res) => {
                  await requestGetShops();
                  toastAlert(toast, 'success', '修改门店信息成功！');
                  params.onEditFinish();
                })
                .catch((err) => {
                  toastAlert(toast, 'error', '修改门店信息失败！');
                })
                .finally(() => {
                  setLoading(false);
                });
            } else {
              // 新增门店信息
              requestPostShop()
                .then(async (res) => {
                  await requestGetShops();
                  toastAlert(toast, 'success', '新增门店成功！');
                  params.onEditFinish();
                })
                .catch((err) => {
                  toastAlert(toast, 'error', '新增门店失败！');
                })
                .finally(() => {
                  setLoading(false);
                });
            }
          }}>
          <Row
            px={ls(34)}
            py={ss(12)}
            bgColor={'rgba(0, 180, 158, 0.10);'}
            borderRadius={ss(4)}
            borderWidth={ss(1)}
            alignItems={'center'}
            borderColor={'#00B49E'}>
            {loading && (
              <Spinner mr={ls(5)} color='emerald.500' size={ss(20)} />
            )}
            <Text color='#00B49E' fontSize={sp(16)}>
              保存
            </Text>
          </Row>
        </Pressable>
      </Row>
    </Column>
  );
}
