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
  ScrollView,
} from 'native-base';
import { useEffect, useState } from 'react';
import BoxTitle from '~/app/components/box-title';
import { ss, ls, sp } from '~/app/utils/style';
import { FormBox } from '~/app/components/form-box';
import { toastAlert } from '~/app/utils/toast';
import useManagerStore from '~/app/stores/manager';
import CT from './checkbox-tree';
import {
  generateAuthorityConfig,
  generateAuthorityTreeConfig,
} from '~/app/utils';
import { RadioBox } from '~/app/components/radio';

interface EditBoxParams {
  onEditFinish: () => void;
}

export default function EditBox(params: EditBoxParams) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const {
    currentRole,
    requestPostRole,
    requestGetRoles,
    requestPatchRole,
    setCurrentRole,
    configAuthTree,
    setConfigAuthTree,
  } = useManagerStore();

  useEffect(() => {
    setConfigAuthTree(generateAuthorityTreeConfig(currentRole.authorities));
  }, []);

  const [tempRole, setTempRole] = useState(currentRole);

  const checkRole = () => {
    if (!tempRole.name) {
      toastAlert(toast, 'error', '请输入角色名称！');
      return false;
    }

    if (!tempRole.description) {
      toastAlert(toast, 'error', '请输入角色说明！');
      return false;
    }

    const authorities = generateAuthorityConfig(configAuthTree);

    if (!authorities.length) {
      toastAlert(toast, 'error', '请选择功能权限！');
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
          <BoxTitle title={'角色信息'} />
          <Box mt={ss(30)} px={ls(20)}>
            <Row alignItems={'center'}>
              <FormBox
                title='角色类型'
                required
                style={{ flex: 1 }}
                form={
                  <Box ml={ls(20)}>
                    <RadioBox
                      margin={ss(20)}
                      config={[
                        { label: '门店角色', value: 1 },
                        { label: '中心角色', value: 0 },
                      ]}
                      current={tempRole.type}
                      onChange={({ label, value }) => {
                        setTempRole({
                          ...(tempRole || {}),
                          type: +value,
                        });
                      }}
                    />
                  </Box>
                }
              />
              <FormBox
                title='状态'
                required
                style={{ flex: 1, marginLeft: ls(20) }}
                form={
                  <RadioBox
                    margin={ss(20)}
                    config={[
                      { label: '启用', value: 1 },
                      { label: '禁用', value: 0 },
                    ]}
                    current={tempRole.status}
                    onChange={({ label, value }) => {
                      setTempRole({
                        ...(tempRole || {}),
                        status: +value,
                      });
                    }}
                  />
                }
              />
            </Row>
            <Row mt={ss(30)}>
              <FormBox
                titleWidth={ss(180)}
                title='角色名称'
                style={{ flex: 1 }}
                required
                form={
                  <Input
                    ml={ls(20)}
                    autoCorrect={false}
                    flex={1}
                    h={ss(48, { min: 26 })}
                    py={ss(10)}
                    px={ls(20)}
                    defaultValue={tempRole.name}
                    placeholderTextColor={'#CCC'}
                    color={'#333333'}
                    fontSize={sp(16)}
                    placeholder='请输入'
                    onChangeText={(text) => {
                      setTempRole({
                        ...(tempRole || {}),
                        name: text,
                      });
                    }}
                  />
                }
              />
            </Row>
            <Row alignItems={'center'} mt={ss(30)}>
              <FormBox
                required
                title='角色说明'
                titleWidth={ss(180)}
                style={{ flex: 1, alignItems: 'flex-start' }}
                form={
                  <>
                    <Input
                      ml={ls(20)}
                      autoCorrect={false}
                      defaultValue={tempRole.description}
                      flex={1}
                      multiline
                      w={ls(380)}
                      h={ss(107)}
                      py={ss(10)}
                      px={ls(20)}
                      onChangeText={(text) => {
                        setTempRole({
                          ...tempRole,
                          description: text,
                        });
                      }}
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
                      {tempRole.description.length}/300
                    </Text>
                  </>
                }
              />
            </Row>
            <Row alignItems={'center'} mt={ss(30)}>
              <FormBox
                required
                titleWidth={ss(180)}
                title='功能权限'
                style={{ alignItems: 'flex-start', flex: 1 }}
                form={
                  <Box ml={ls(20)}>
                    <CT />
                  </Box>
                }
              />
            </Row>
          </Box>
        </Column>
      </ScrollView>

      <Row justifyContent={'center'} mb={ss(40)}>
        <Pressable
          hitSlop={ss(10)}
          onPress={() => {
            params.onEditFinish();
          }}>
          <Box
            px={ls(34)}
            py={ss(12)}
            bgColor={'rgba(216, 216, 216, 0.10)'}
            borderRadius={4}
            borderWidth={1}
            borderColor={'#D8D8D8'}>
            <Text color='#333' fontSize={sp(16)}>
              取消
            </Text>
          </Box>
        </Pressable>

        <Pressable
          hitSlop={ss(10)}
          ml={ls(74)}
          onPress={() => {
            if (loading) return;
            if (!checkRole()) return;
            setLoading(true);

            setCurrentRole(tempRole);

            if (tempRole._id) {
              requestPatchRole()
                .then(async (res) => {
                  setCurrentRole(res.data);
                  requestGetRoles();
                  toastAlert(toast, 'success', '修改角色信息成功！');
                  params.onEditFinish();
                })
                .catch((err) => {
                  toastAlert(toast, 'error', '修改角色信息失败！');
                })
                .finally(() => {
                  setLoading(false);
                });
            } else {
              requestPostRole()
                .then(async (res) => {
                  setCurrentRole(res.data);
                  requestGetRoles();
                  toastAlert(toast, 'success', '新增角色成功！');
                  params.onEditFinish();
                })
                .catch((err) => {
                  console.log(err);
                  toastAlert(toast, 'error', '新增角色失败！');
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
            borderRadius={4}
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
