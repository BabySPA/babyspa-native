import {
  Box,
  Column,
  Input,
  Radio,
  Row,
  Text,
  Pressable,
  Spinner,
  ScrollView,
  Icon,
} from 'native-base';
import { useToast } from 'react-native-toast-notifications';
import { Image } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import BoxTitle from '~/app/components/box-title';
import { ss, ls, sp } from '~/app/utils/style';
import { FormBox } from '~/app/components/form-box';
import { toastAlert } from '~/app/utils/toast';
import useManagerStore from '~/app/stores/manager';
import {
  generateAuthorityConfig,
  generateAuthorityTreeConfig,
} from '~/app/utils';
import { RadioBox } from '~/app/components/radio';
import { FontAwesome } from '@expo/vector-icons';

interface EditBoxParams {
  onEditFinish: () => void;
}

export default function EditBox(params: EditBoxParams) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const currentRole = useManagerStore((state) => state.currentRole);
  const requestPostRole = useManagerStore((state) => state.requestPostRole);
  const requestGetRoles = useManagerStore((state) => state.requestGetRoles);
  const requestPatchRole = useManagerStore((state) => state.requestPatchRole);
  const setCurrentRole = useManagerStore((state) => state.setCurrentRole);

  const [configAuthTree, setConfigAuthTree] = useState(
    generateAuthorityTreeConfig(currentRole.authorities),
  );

  const [tempRole, setTempRole] = useState(currentRole);

  const inputRef = useRef(null);

  useEffect(() => {
    // @ts-ignore
    inputRef.current?.setNativeProps({
      text: tempRole.description,
    });
  }, []);

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
                titleWidth={ls(100)}
                style={{ flex: 1 }}
                form={
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
                }
              />
              <FormBox
                title='状态'
                required
                style={{ flex: 1 }}
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
                titleWidth={ss(100)}
                title='角色名称'
                style={{ flex: 1 }}
                required
                form={
                  <Input
                    autoCorrect={false}
                    flex={1}
                    h={ss(48)}
                    py={ss(10)}
                    px={ls(20)}
                    borderWidth={ss(1)}
                    borderColor={'#D8D8D8'}
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
                titleWidth={ss(100)}
                style={{ flex: 1, alignItems: 'flex-start' }}
                form={
                  <>
                    <Input
                      ref={inputRef}
                      autoCorrect={false}
                      flex={1}
                      multiline
                      textAlignVertical='top'
                      w={ls(380)}
                      h={ss(107)}
                      py={ss(10)}
                      borderWidth={ss(1)}
                      borderColor={'#D8D8D8'}
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
                titleWidth={ss(100)}
                title='功能权限'
                style={{ alignItems: 'flex-start', flex: 1 }}
                form={
                  <Box>
                    {configAuthTree?.length > 0 &&
                      configAuthTree.map((node, nodeIdx) => {
                        return (
                          <Box key={node.text} mb={ss(10)}>
                            <Pressable
                              _pressed={{
                                opacity: 0.6,
                              }}
                              hitSlop={ss(5)}
                              onPress={() => {
                                configAuthTree[nodeIdx].hasAuth = !node.hasAuth;

                                configAuthTree[nodeIdx].features.forEach(
                                  (fi: any) => {
                                    fi.hasAuth = node.hasAuth;
                                  },
                                );

                                setConfigAuthTree(
                                  JSON.parse(JSON.stringify(configAuthTree)),
                                );
                              }}>
                              <Row alignItems={'center'}>
                                <Image
                                  source={
                                    node.hasAuth
                                      ? require('~/assets/images/checkbox-y.png')
                                      : require('~/assets/images/checkbox-n.png')
                                  }
                                  style={{ width: ss(24), height: ss(24) }}
                                />
                                <Text
                                  color='#333'
                                  fontSize={sp(20)}
                                  ml={ls(10)}>
                                  {node.text}
                                </Text>
                                <Pressable
                                  _pressed={{
                                    opacity: 0.6,
                                  }}
                                  hitSlop={ss(5)}
                                  onPress={() => {
                                    configAuthTree[nodeIdx].isOpen =
                                      !node.isOpen;
                                    setConfigAuthTree(
                                      JSON.parse(
                                        JSON.stringify(configAuthTree),
                                      ),
                                    );
                                  }}>
                                  <Icon
                                    ml={ss(16)}
                                    as={
                                      <FontAwesome
                                        name={
                                          node.isOpen
                                            ? 'angle-down'
                                            : 'angle-right'
                                        }
                                      />
                                    }
                                    size={sp(20)}
                                    color='#BCBCBC'
                                  />
                                </Pressable>
                              </Row>
                            </Pressable>
                            {node.isOpen && (
                              <Box>
                                {node.features.map((feature, featureIdx) => {
                                  return (
                                    <Pressable
                                      _pressed={{
                                        opacity: 0.6,
                                      }}
                                      hitSlop={ss(5)}
                                      key={feature.text}
                                      onPress={() => {
                                        configAuthTree[nodeIdx].features[
                                          featureIdx
                                        ].hasAuth = !feature.hasAuth;
                                        setConfigAuthTree(
                                          JSON.parse(
                                            JSON.stringify(configAuthTree),
                                          ),
                                        );
                                      }}>
                                      <Row ml={ls(20)} mt={ss(10)}>
                                        <Image
                                          source={
                                            feature.hasAuth
                                              ? require('~/assets/images/checkbox-y.png')
                                              : require('~/assets/images/checkbox-n.png')
                                          }
                                          style={{
                                            width: ss(24),
                                            height: ss(24),
                                          }}
                                        />
                                        <Text
                                          color='#333'
                                          fontSize={sp(20)}
                                          ml={ls(10)}>
                                          {feature.text}
                                        </Text>
                                      </Row>
                                    </Pressable>
                                  );
                                })}
                              </Box>
                            )}
                          </Box>
                        );
                      })}
                  </Box>
                }
              />
            </Row>
          </Box>
        </Column>
      </ScrollView>

      <Row justifyContent={'center'} mb={ss(40)} mt={ss(20)}>
        <Pressable
          _pressed={{
            opacity: 0.8,
          }}
          hitSlop={ss(5)}
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
          hitSlop={ss(5)}
          ml={ls(74)}
          onPress={() => {
            if (loading) return;
            if (!checkRole()) return;
            setLoading(true);

            setCurrentRole({
              ...tempRole,
              authorities: generateAuthorityConfig(configAuthTree),
            });

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
            borderRadius={ss(4)}
            borderWidth={ss(1)}
            alignItems={'center'}
            borderColor={'#00B49E'}>
            {loading && (
              <Spinner mr={ls(5)} color='emerald.500' size={sp(20)} />
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
