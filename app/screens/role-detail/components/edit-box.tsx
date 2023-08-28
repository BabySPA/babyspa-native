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
import { generateAuthorityTreeConfig } from '~/app/utils';
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
    setConfigAuthTree,
  } = useManagerStore();

  useEffect(() => {
    setConfigAuthTree(generateAuthorityTreeConfig(currentRole.authorities));
  }, []);

  const [tempRole, setTempRole] = useState(currentRole);

  return (
    <Column
      flex={1}
      bgColor={'#fff'}
      p={ss(20)}
      borderRadius={ss(10)}
      justifyContent={'space-between'}>
      <Column>
        <BoxTitle title={'角色信息'} />
        <Box mt={ss(30)} px={ls(20)} maxH={ss(500)}>
          <Row alignItems={'center'}>
            <FormBox
              title='角色姓名'
              style={{ flex: 1 }}
              required
              form={
                <Input
                  autoCorrect={false}
                  flex={1}
                  h={ss(48, { min: 26 })}
                  py={ss(10)}
                  px={ls(20)}
                  defaultValue={tempRole.name}
                  placeholderTextColor={'#CCC'}
                  color={'#333333'}
                  fontSize={sp(16, { min: 12 })}
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
          <Row mt={ss(40)}>
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
            <FormBox
              title='类型'
              required
              style={{ flex: 1, marginLeft: ls(20) }}
              form={
                <RadioBox
                  margin={ss(20)}
                  config={[
                    { label: '门店角色', value: 1 },
                    { label: '中心角色', value: 0 },
                  ]}
                  current={tempRole.status}
                  onChange={({ label, value }) => {
                    setTempRole({
                      ...(tempRole || {}),
                      type: +value,
                    });
                  }}
                />
              }
            />
          </Row>
          <Row alignItems={'center'} mt={ss(40)}>
            <FormBox
              required
              title='角色说明'
              style={{ flex: 1, alignItems: 'flex-start' }}
              form={
                <Input
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
                  fontSize={sp(16, { min: 12 })}
                  placeholder='请输入'
                />
              }
            />
          </Row>
          <Row alignItems={'center'} mt={ss(40)}>
            <FormBox
              required
              title='功能权限'
              style={{ alignItems: 'flex-start', flex: 1 }}
              form={
                <ScrollView maxH={ss(280)}>
                  <CT />
                </ScrollView>
              }
            />
          </Row>
        </Box>
      </Column>

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
            borderRadius={ss(4)}
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

            setLoading(true);

            setCurrentRole(tempRole);

            if (tempRole._id) {
              // 修改门店信息
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
              // 新增门店信息
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
