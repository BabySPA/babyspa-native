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
import BoxTitle from '~/app/components/box-title';
import { ss, ls, sp } from '~/app/utils/style';
import { FormBox } from '~/app/components/form-box';
import { toastAlert } from '~/app/utils/toast';
import useManagerStore from '~/app/stores/manager';
import SelectShop from '~/app/components/select-shop';
import { Shop } from '~/app/stores/manager/type';

interface EditBoxParams {
  onEditFinish: () => void;
}

export default function EditBox(params: EditBoxParams) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const {
    currentUser,
    requestPostUser,
    requestGetUsers,
    requestPatchUser,
    setCurrentUser,
    shops,
  } = useManagerStore();

  const [tempUser, setTempUser] = useState(currentUser);

  return (
    <Column
      flex={1}
      bgColor={'#fff'}
      p={ss(20)}
      borderRadius={ss(10)}
      justifyContent={'space-between'}>
      <Column>
        <BoxTitle title={'员工信息'} />
        <Box mt={ss(30)} px={ls(20)}>
          <Row alignItems={'center'}>
            <FormBox
              title='员工姓名'
              style={{ flex: 1 }}
              required
              form={
                <Input
                  flex={1}
                  h={ss(48, { min: 26 })}
                  py={ss(10)}
                  px={ls(20)}
                  defaultValue={tempUser.name}
                  placeholderTextColor={'#CCC'}
                  color={'#333333'}
                  fontSize={sp(16, { min: 12 })}
                  placeholder='请输入'
                  onChangeText={(text) => {
                    setTempUser({
                      ...(tempUser || {}),
                      name: text,
                    });
                  }}
                />
              }
            />
            <FormBox
              title='性别'
              required
              style={{ flex: 1 }}
              form={
                <Radio.Group
                  value={`${tempUser.gender}`}
                  name='gender'
                  flexDirection={'row'}
                  onChange={(event) => {
                    setTempUser({
                      ...(tempUser || {}),
                      gender: +event,
                    });
                  }}>
                  <Radio colorScheme='green' value='1' size={'sm'}>
                    男
                  </Radio>
                  <Radio colorScheme='green' value='0' ml={ls(40)} size={'sm'}>
                    女
                  </Radio>
                </Radio.Group>
              }
            />
          </Row>
          <Row alignItems={'center'} mt={ss(40)}>
            <FormBox
              required
              title='所属门店'
              style={{ flex: 1 }}
              form={
                <SelectShop
                  onSelect={function (selectedItem: Shop, index: number): void {
                    setTempUser({
                      ...(tempUser || {}),
                      shop: {
                        shopId: selectedItem._id as string,
                        name: selectedItem.name,
                      },
                    });
                  }}
                  defaultButtonText={shops[0]?.name || '请选择门店'}
                  buttonHeight={ss(40)}
                  buttonWidth={ls(380)}
                />
              }
            />
            <FormBox
              required
              title='角色'
              style={{ flex: 1 }}
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
                        {tempUser.role?.name || '请选择'}
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
              title='联系电话'
              style={{ flex: 1 }}
              form={
                <Input
                  defaultValue={tempUser.phoneNumber}
                  flex={1}
                  h={ss(48, { min: 26 })}
                  py={ss(10)}
                  px={ls(20)}
                  onChangeText={(text) => {
                    setTempUser({
                      ...tempUser,
                      phoneNumber: text,
                    });
                  }}
                  placeholderTextColor={'#CCC'}
                  color={'#333333'}
                  fontSize={sp(16, { min: 12 })}
                  placeholder='请输入'
                />
              }
            />
            <FormBox
              required
              title='账号'
              style={{ flex: 1 }}
              form={
                <Input
                  defaultValue={tempUser.username}
                  flex={1}
                  h={ss(48, { min: 26 })}
                  py={ss(10)}
                  px={ls(20)}
                  onChangeText={(text) => {
                    setTempUser({
                      ...tempUser,
                      username: text,
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
              required
              title='身份证号'
              style={{ flex: 1 }}
              form={
                <Input
                  defaultValue={tempUser.idCardNumber}
                  w={ls(380)}
                  h={ss(48, { min: 26 })}
                  py={ss(10)}
                  px={ls(20)}
                  onChangeText={(text) => {
                    setTempUser({
                      ...tempUser,
                      idCardNumber: text,
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
              required
              title='员工简介'
              style={{ alignItems: 'flex-start', flex: 1 }}
              form={
                <Input
                  defaultValue={tempUser.description}
                  flex={1}
                  h={ss(128)}
                  py={ss(10)}
                  px={ls(20)}
                  onChangeText={(text) => {
                    setTempUser({
                      ...tempUser,
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

            setCurrentUser(tempUser);

            if (tempUser._id) {
              // 修改门店信息
              requestPatchUser()
                .then(async (res) => {
                  toastAlert(toast, 'success', '修改员工信息成功！');
                  params.onEditFinish();
                })
                .catch((err) => {
                  toastAlert(toast, 'error', '修改员工信息失败！');
                })
                .finally(() => {
                  setLoading(false);
                });
            } else {
              // 新增门店信息
              requestPostUser()
                .then(async (res) => {
                  // await requestGetShops();
                  toastAlert(toast, 'success', '新增员工成功！');
                  params.onEditFinish();
                })
                .catch((err) => {
                  toastAlert(toast, 'error', '新增员工失败！');
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
