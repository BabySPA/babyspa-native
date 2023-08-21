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
  useToast,
  Spinner,
} from 'native-base';
import { useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import useFlowStore from '~/app/stores/flow';
import BoxTitle from '~/app/components/box-title';
import { ss, ls, sp } from '~/app/utils/style';
import { FormBox } from '~/app/components/form-box';
import { toastAlert } from '~/app/utils/toast';
import useManagerStore from '~/app/stores/manager';

interface EditBoxParams {
  onEditFinish: () => void;
}

export default function EditBox(params: EditBoxParams) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const {
    currentShop,
    requestPostShop,
    requestGetShops,
    requestPatchShop,
    setCurrentShop,
  } = useManagerStore();

  const [tempShop, setTempShop] = useState(currentShop);

  return (
    <Column
      flex={1}
      bgColor={'#fff'}
      p={ss(20)}
      borderRadius={ss(10)}
      justifyContent={'space-between'}>
      <Column>
        <BoxTitle title={'门店信息'} />
        <Box mt={ss(30)} px={ls(20)}>
          <Row alignItems={'center'}>
            <FormBox
              title='门店名称'
              style={{ flex: 1, marginLeft: ls(20) }}
              required
              form={
                <Input
                  autoCorrect={false}
                  flex={1}
                  h={ss(48, { min: 26 })}
                  py={ss(10)}
                  px={ls(20)}
                  defaultValue={tempShop.name}
                  placeholderTextColor={'#CCC'}
                  color={'#333333'}
                  fontSize={sp(16, { min: 12 })}
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
              style={{ flex: 1, marginLeft: ls(20) }}
              form={
                <Input
                  autoCorrect={false}
                  flex={1}
                  h={ss(48, { min: 26 })}
                  py={ss(10)}
                  px={ls(20)}
                  defaultValue={tempShop.maintainer}
                  placeholderTextColor={'#CCC'}
                  color={'#333333'}
                  fontSize={sp(16, { min: 12 })}
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
          <Row alignItems={'center'} mt={ss(40)}>
            <FormBox
              required
              title='联系电话'
              style={{ flex: 1, marginLeft: ls(20) }}
              form={
                <Input
                  autoCorrect={false}
                  flex={1}
                  h={ss(48, { min: 26 })}
                  py={ss(10)}
                  px={ls(20)}
                  defaultValue={tempShop.phoneNumber}
                  placeholderTextColor={'#CCC'}
                  color={'#333333'}
                  fontSize={sp(16, { min: 12 })}
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
              style={{ flex: 1, marginLeft: ls(20) }}
              required
              form={
                <Box flex={1}>
                  <Pressable onPress={() => {}}>
                    <Row
                      borderRadius={ss(10)}
                      justifyContent={'space-between'}
                      alignItems={'center'}
                      borderWidth={1}
                      borderColor={'#D8D8D8'}
                      py={ss(10)}
                      px={ss(20)}>
                      <Text color={'#333'} fontSize={sp(16, { min: 12 })}>
                        {tempShop.region || '请选择'}
                      </Text>
                      <Icon
                        as={<FontAwesome name='angle-down' />}
                        size={ss(18, { min: 15 })}
                        color='#999'
                      />
                    </Row>
                  </Pressable>
                </Box>
              }
            />
          </Row>
          <Row alignItems={'center'} mt={ss(40)}>
            <FormBox
              required
              title='营业时间'
              style={{ flex: 1, marginLeft: ls(20) }}
              form={
                <Box flex={1}>
                  <Pressable onPress={() => {}}>
                    <Row
                      borderRadius={ss(10)}
                      justifyContent={'space-between'}
                      alignItems={'center'}
                      borderWidth={1}
                      borderColor={'#D8D8D8'}
                      py={ss(10)}
                      px={ss(20)}>
                      <Text color={'#333'} fontSize={sp(16, { min: 12 })}>
                        {tempShop.region || '请选择'}
                      </Text>
                      <Icon
                        as={<FontAwesome name='angle-down' />}
                        size={ss(18, { min: 15 })}
                        color='#999'
                      />
                    </Row>
                  </Pressable>
                </Box>
              }
            />
            <FormBox
              required
              title='详细地址'
              style={{ flex: 1, marginLeft: ls(20) }}
              form={
                <Input
                  autoCorrect={false}
                  defaultValue={tempShop.address}
                  flex={1}
                  h={ss(48, { min: 26 })}
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
                  fontSize={sp(16, { min: 12 })}
                  placeholder='请输入'
                />
              }
            />
          </Row>
          <Row alignItems={'center'} mt={ss(40)}>
            <FormBox
              title='门店介绍'
              style={{ alignItems: 'flex-start', flex: 1 }}
              form={
                <Input
                  autoCorrect={false}
                  defaultValue={tempShop.description}
                  flex={1}
                  h={ss(128)}
                  py={ss(10)}
                  px={ls(20)}
                  onChangeText={(text) => {
                    setTempShop({
                      ...tempShop,
                      description: text,
                    });
                  }}
                  multiline
                  placeholderTextColor={'#CCC'}
                  color={'#333333'}
                  fontSize={sp(16, { min: 12 })}
                  placeholder='请输入'
                />
              }
            />
          </Row>
        </Box>
      </Column>

      <Row justifyContent={'center'} mb={ss(40)}>
        <Pressable
          onPress={() => {
            params.onEditFinish();
          }}>
          <Box
            px={ls(34)}
            py={ss(12)}
            bgColor={'rgba(216, 216, 216, 0.10)'}
            borderRadius={ss(4)}
            borderWidth={1}
            borderColor={'#D8D8D8'}>
            <Text color='#333' fontSize={sp(16)}>
              取消
            </Text>
          </Box>
        </Pressable>

        <Pressable
          ml={ls(74)}
          onPress={() => {
            if (loading) return;

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
            borderWidth={1}
            alignItems={'center'}
            borderColor={'#00B49E'}>
            {loading && <Spinner mr={ls(5)} color='emerald.500' />}
            <Text color='#00B49E' fontSize={sp(16)}>
              保存
            </Text>
          </Row>
        </Pressable>
      </Row>
    </Column>
  );
}
