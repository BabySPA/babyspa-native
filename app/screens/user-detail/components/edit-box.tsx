import {
  Box,
  Column,
  Input,
  Radio,
  Row,
  Text,
  Pressable,
  useToast,
  Spinner,
} from 'native-base';
import { useState } from 'react';
import BoxTitle from '~/app/components/box-title';
import { ss, ls, sp } from '~/app/utils/style';
import { FormBox } from '~/app/components/form-box';
import { toastAlert } from '~/app/utils/toast';
import useManagerStore from '~/app/stores/manager';
import SelectShop, { useSelectShops } from '~/app/components/select-shop';
import { Shop, ShopType } from '~/app/stores/manager/type';
import SelectRole from '~/app/components/select-role';
import { RadioBox } from '~/app/components/radio';

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
  } = useManagerStore();

  const [tempUser, setTempUser] = useState(currentUser);

  const [defaultSelect, selectShops] = useSelectShops(false);

  const checkUser = () => {
    if (tempUser.name.trim() === '') {
      toastAlert(toast, 'error', '请输入员工姓名！');
      return false;
    }
    if (tempUser.phoneNumber.trim() === '') {
      toastAlert(toast, 'error', '请输入联系电话！');
      return false;
    }
    if (tempUser.phoneNumber.trim().length !== 11) {
      toastAlert(toast, 'error', '请输入正确的手机号！');
      return false;
    }
    if (tempUser.idCardNumber.trim() === '') {
      toastAlert(toast, 'error', '请输入身份证号！');
      return false;
    }
    if (tempUser.idCardNumber.trim().length !== 18) {
      toastAlert(toast, 'error', '请输入正确的身份证号！');
      return false;
    }
    if (!tempUser.role?.roleKey) {
      toastAlert(toast, 'error', '请选择角色！');
      return false;
    }
    if (!tempUser.shop?.shopId) {
      toastAlert(toast, 'error', '请选择所属门店！');
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
      <Column>
        <BoxTitle title={'员工信息'} />
        <Box mt={ss(30)} px={ls(20)}>
          <Row alignItems={'center'}>
            <FormBox
              title='员工姓名'
              titleWidth={ls(180)}
              style={{ flex: 1 }}
              required
              form={
                <Input
                  ml={ss(20)}
                  maxW={ls(380)}
                  autoCorrect={false}
                  flex={1}
                  h={ss(48)}
                  py={ss(10)}
                  px={ls(20)}
                  defaultValue={tempUser.name}
                  placeholderTextColor={'#CCC'}
                  color={'#333333'}
                  fontSize={sp(16)}
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
              titleWidth={ls(180)}
              title='性别'
              required
              style={{ flex: 1, marginLeft: ls(20) }}
              form={
                <RadioBox
                  margin={ss(20)}
                  config={[
                    { label: '男', value: 1 },
                    { label: '女', value: 0 },
                  ]}
                  current={tempUser.gender}
                  onChange={({ label, value }) => {
                    setTempUser({
                      ...(tempUser || {}),
                      gender: +value,
                    });
                  }}
                />
              }
            />
          </Row>
          <Row alignItems={'center'} mt={ss(30)}>
            <FormBox
              titleWidth={ls(180)}
              required
              title='所属门店'
              style={{ flex: 1 }}
              form={
                <Box ml={ls(20)}>
                  <SelectShop
                    onSelect={function (
                      selectedItem: Shop,
                      index: number,
                    ): void {
                      setTempUser({
                        ...(tempUser || {}),
                        shop: {
                          originalShopId: tempUser.shop?.shopId,
                          shopId: selectedItem._id as string,
                          name: selectedItem.name,
                          type: selectedItem.type,
                        },
                      });
                    }}
                    defaultButtonText={tempUser.shop?.name}
                    buttonHeight={ss(44)}
                    buttonWidth={ls(380)}
                    shops={selectShops}
                  />
                </Box>
              }
            />
            <FormBox
              titleWidth={ls(180)}
              required
              title={'角色'}
              style={{ flex: 1, marginLeft: ls(20) }}
              form={
                <SelectRole
                  type={tempUser.shop?.type as ShopType}
                  onSelect={function (selectedItem): void {
                    setTempUser({
                      ...(tempUser || {}),
                      role: {
                        roleKey: selectedItem.roleKey,
                        name: selectedItem.name,
                        type: selectedItem.type,
                      },
                    });
                  }}
                  defaultButtonText={currentUser.role?.name}
                  buttonHeight={ss(44)}
                  buttonWidth={ls(380)}
                />
              }
            />
          </Row>
          <Row alignItems={'center'} mt={ss(30)}>
            <FormBox
              titleWidth={ls(180)}
              required
              title='联系电话'
              style={{ flex: 1 }}
              form={
                <Input
                  ml={ss(20)}
                  autoCorrect={false}
                  defaultValue={tempUser.phoneNumber}
                  flex={1}
                  h={ss(48)}
                  py={ss(10)}
                  px={ls(20)}
                  onChangeText={(text) => {
                    setTempUser({
                      ...tempUser,
                      phoneNumber: text,
                      username: text,
                    });
                  }}
                  placeholderTextColor={'#CCC'}
                  color={'#333333'}
                  fontSize={sp(16)}
                  placeholder='请输入'
                />
              }
            />
            <FormBox
              titleWidth={ls(180)}
              required
              title='账号'
              style={{ flex: 1, marginLeft: ls(20) }}
              form={
                <Input
                  autoCorrect={false}
                  defaultValue={tempUser.username}
                  flex={1}
                  h={ss(48)}
                  py={ss(10)}
                  px={ls(20)}
                  isReadOnly
                  placeholderTextColor={'#CCC'}
                  color={'#333333'}
                  fontSize={sp(16)}
                  placeholder='请输入'
                />
              }
            />
          </Row>
          <Row alignItems={'center'} mt={ss(30)}>
            <FormBox
              titleWidth={ls(180)}
              required
              title='身份证号'
              style={{ flex: 1 }}
              form={
                <Input
                  ml={ss(20)}
                  autoCorrect={false}
                  defaultValue={tempUser.idCardNumber}
                  w={ls(380)}
                  h={ss(48)}
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
                  fontSize={sp(16)}
                  placeholder='请输入'
                />
              }
            />
          </Row>
          <Row alignItems={'center'} mt={ss(30)}>
            <FormBox
              titleWidth={ls(180)}
              title='员工简介'
              style={{ alignItems: 'flex-start', flex: 1 }}
              form={
                <>
                  <Input
                    ml={ss(20)}
                    autoCorrect={false}
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
                    fontSize={sp(16)}
                    placeholder='请输入'
                  />
                  <Text
                    color={'#999'}
                    fontSize={sp(14)}
                    style={{
                      position: 'absolute',
                      right: ss(10),
                      bottom: ss(10),
                    }}>
                    {tempUser.description.length}/300
                  </Text>
                </>
              }
            />
          </Row>
        </Box>
      </Column>

      <Row justifyContent={'center'} mb={ss(40)}>
        <Pressable
          hitSlop={ss(20)}
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
          hitSlop={ss(20)}
          ml={ls(74)}
          onPress={() => {
            if (loading) return;

            if (!checkUser()) return;

            setLoading(true);

            setCurrentUser(tempUser);

            if (tempUser._id) {
              // 修改门店信息
              requestPatchUser()
                .then(async (res) => {
                  requestGetUsers();
                  toastAlert(toast, 'success', '修改员工信息成功！');
                  params.onEditFinish();
                })
                .catch((err) => {
                  console.log(err);
                  toastAlert(toast, 'error', '修改员工信息失败！');
                })
                .finally(() => {
                  setLoading(false);
                });
            } else {
              // 新增门店信息
              requestPostUser()
                .then(async (res) => {
                  setCurrentUser(res.data);
                  requestGetUsers();
                  toastAlert(toast, 'success', '新增员工成功！');
                  params.onEditFinish();
                })
                .catch((err) => {
                  toastAlert(toast, 'error', err.message);
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
