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
  ScrollView,
} from 'native-base';
import { useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import useFlowStore from '~/app/stores/flow';
import BoxTitle from '~/app/components/box-title';
import { ss, ls, sp } from '~/app/utils/style';
import { FormBox } from '~/app/components/form-box';
import DatePicker from '~/app/components/date-picker';
import { toastAlert } from '~/app/utils/toast';
import { CustomerStatus } from '~/app/types';
import SelectOperator from '~/app/components/select-operator';
import { TemplateModal } from '~/app/components/modals';
import useManagerStore from '~/app/stores/manager';
import { TemplateGroupKeys } from '~/app/constants';
import { RadioBox } from '~/app/components/radio';

interface EditBoxParams {
  onEditFinish: () => void;
  type: 'archive-edit' | 'archive-new' | 'edit';
}

export default function EditBox(params: EditBoxParams) {
  const [isOpenBirthdayPicker, setIsOpenBirthdayPicker] = useState(false);

  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const {
    currentRegisterCustomer,
    updateCurrentRegisterCustomer,
    operators,
    requestPostCustomerInfo,
    requestPatchCustomerInfo,
    requestGetInitializeData,
    requestPostCreateCustomer,
    requestCustomersArchive,
    requestPatchCustomerArchive,
    currentArchiveCustomer,
    updateCurrentArchiveCustomer,
  } = useFlowStore();

  const [tempCustomer, setTempCustomer] = useState(
    params.type === 'edit' ? currentRegisterCustomer : currentArchiveCustomer,
  );

  const showDatePicker = () => {
    setIsOpenBirthdayPicker(true);
  };

  let currentSelectBirthday = tempCustomer.birthday;
  const [isOpenTemplatePicker, setIsOpenTemplatePicker] = useState(false);

  const { templates, getTemplateGroups } = useManagerStore();

  return (
    <Column
      flex={1}
      bgColor={'#fff'}
      p={ss(20)}
      borderRadius={ss(10)}
      justifyContent={'space-between'}>
      <Column>
        <BoxTitle title='客户信息' />
        <Box mt={ss(30)} px={ls(50)}>
          <Row alignItems={'center'}>
            <FormBox
              title='姓名'
              style={{ flex: 1 }}
              required
              form={
                <Input
                  autoCorrect={false}
                  w={ls(380)}
                  h={ss(48, { min: 26 })}
                  py={ss(10)}
                  px={ls(20)}
                  defaultValue={tempCustomer.name}
                  placeholderTextColor={'#CCC'}
                  color={'#333333'}
                  fontSize={sp(16, { min: 12 })}
                  placeholder='请输入'
                  onChangeText={(text) => {
                    setTempCustomer({
                      ...tempCustomer,
                      name: text,
                    });
                  }}
                />
              }
            />
            <FormBox
              title='乳名'
              style={{ flex: 1 }}
              form={
                <Input
                  autoCorrect={false}
                  w={ls(380)}
                  h={ss(48, { min: 26 })}
                  py={ss(10)}
                  px={ls(20)}
                  defaultValue={tempCustomer.nickname}
                  placeholderTextColor={'#CCC'}
                  color={'#333333'}
                  fontSize={sp(16, { min: 12 })}
                  placeholder='请输入'
                  onChangeText={(text) => {
                    setTempCustomer({
                      ...tempCustomer,
                      nickname: text,
                    });
                  }}
                />
              }
            />
          </Row>
          <Row alignItems={'center'} mt={ss(40)}>
            <FormBox
              required
              title='性别'
              style={{ flex: 1 }}
              form={
                <RadioBox
                  margin={ss(20)}
                  config={[
                    { label: '男', value: 1 },
                    { label: '女', value: 0 },
                  ]}
                  current={tempCustomer.gender}
                  onChange={({ label, value }) => {
                    setTempCustomer({
                      ...tempCustomer,
                      gender: +value,
                    });
                  }}
                />
              }
            />
            <FormBox
              title='生日'
              style={{ flex: 1 }}
              required
              form={
                <Box w={ls(380)}>
                  <Pressable
                    hitSlop={ss(10)}
                    onPress={() => {
                      showDatePicker();
                    }}>
                    <Row
                      borderRadius={ss(4)}
                      justifyContent={'space-between'}
                      alignItems={'center'}
                      borderWidth={1}
                      borderColor={'#D8D8D8'}
                      py={ss(10)}
                      pr={ss(10)}
                      pl={ss(20)}>
                      <Text color={'#333'} fontSize={sp(16, { min: 12 })}>
                        {tempCustomer.birthday}
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
              title='电话'
              style={{ flex: 1 }}
              form={
                <Input
                  autoCorrect={false}
                  w={ls(380)}
                  defaultValue={tempCustomer.phoneNumber}
                  h={ss(48, { min: 26 })}
                  py={ss(10)}
                  px={ls(20)}
                  onChangeText={(text) => {
                    setTempCustomer({
                      ...tempCustomer,
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
            {params.type == 'edit' && (
              <FormBox
                title='过敏原'
                style={{ flex: 1 }}
                form={
                  <Box w={'70%'}>
                    <Pressable
                      hitSlop={ss(10)}
                      onPress={() => {
                        setIsOpenTemplatePicker(true);
                      }}>
                      <Row
                        borderRadius={ss(4)}
                        justifyContent={'space-between'}
                        alignItems={'center'}
                        borderWidth={1}
                        borderColor={'#D8D8D8'}
                        py={ss(10)}
                        pl={ss(20)}
                        pr={ss(8)}>
                        <Text
                          color={'#333'}
                          fontSize={sp(16, { min: 12 })}
                          maxW={ls(240)}>
                          {currentRegisterCustomer.allergy || '请选择或输入'}
                        </Text>
                        <Icon
                          as={<FontAwesome name='angle-down' />}
                          size={ss(18, { min: 15 })}
                          color='#999'
                        />
                      </Row>

                      <TemplateModal
                        defaultText={tempCustomer.allergy || ''}
                        template={getTemplateGroups(TemplateGroupKeys.allergy)}
                        isOpen={isOpenTemplatePicker}
                        onClose={function (): void {
                          setIsOpenTemplatePicker(false);
                        }}
                        onConfirm={function (text): void {
                          updateCurrentRegisterCustomer({ allergy: text });
                          setIsOpenTemplatePicker(false);
                        }}
                      />
                    </Pressable>
                  </Box>
                }
              />
            )}
          </Row>
          {params.type == 'edit' && (
            <Row alignItems={'center'} mt={ss(40)}>
              <FormBox
                required
                title='理疗师'
                form={
                  <Box w={ls(380)}>
                    <SelectOperator
                      operators={operators}
                      onSelect={(selectedItem, index) => {
                        setTempCustomer({
                          ...tempCustomer,
                          operator: {
                            id: selectedItem._id,
                            name: selectedItem.name,
                            phoneNumber: selectedItem.phoneNumber,
                          },
                        });
                      }}
                      defaultButtonText={
                        tempCustomer?.operator?.name ?? '请选择理疗师'
                      }
                    />
                  </Box>
                }
              />
            </Row>
          )}
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

            if (params.type !== 'edit') {
              if (currentArchiveCustomer.id) {
                // 编辑客户信息
                requestPatchCustomerArchive({
                  id: currentArchiveCustomer.id,
                  name: tempCustomer.name,
                  nickname: tempCustomer.nickname,
                  phoneNumber: tempCustomer.phoneNumber,
                  gender: tempCustomer.gender,
                  birthday: tempCustomer.birthday,
                })
                  .then(async (res) => {
                    updateCurrentArchiveCustomer({
                      name: tempCustomer.name,
                      nickname: tempCustomer.nickname,
                      phoneNumber: tempCustomer.phoneNumber,
                      gender: tempCustomer.gender,
                      birthday: tempCustomer.birthday,
                    });
                    await requestCustomersArchive();
                    toastAlert(toast, 'success', '修改客户成功！');
                    params.onEditFinish();
                  })
                  .catch(() => {
                    toastAlert(toast, 'error', '修改客户失败！');
                  })
                  .finally(() => {
                    setLoading(false);
                  });
              } else {
                // 新增客户
                requestPostCreateCustomer({
                  name: tempCustomer.name,
                  nickname: tempCustomer.nickname,
                  phoneNumber: tempCustomer.phoneNumber,
                  gender: tempCustomer.gender,
                  birthday: tempCustomer.birthday,
                })
                  .then(async (res) => {
                    await requestCustomersArchive();
                    toastAlert(toast, 'success', '新增客户成功！');
                    params.onEditFinish();
                  })
                  .catch((err) => {
                    toastAlert(toast, 'error', '新增客户失败！');
                  })
                  .finally(() => {
                    setLoading(false);
                  });
              }
            } else {
              updateCurrentRegisterCustomer(tempCustomer);

              if (tempCustomer.status === CustomerStatus.Canceled) {
                requestPostCustomerInfo()
                  .then(async (res) => {
                    await requestGetInitializeData();
                    toastAlert(toast, 'success', '再次登记客户信息成功！');
                    params.onEditFinish();
                  })
                  .catch((err) => {
                    toastAlert(toast, 'error', '再次登记客户信息失败！');
                  })
                  .finally(() => {
                    setLoading(false);
                  });
              } else {
                requestPatchCustomerInfo()
                  .then(async (res) => {
                    await requestGetInitializeData();
                    toastAlert(toast, 'success', '修改客户信息成功！');
                    params.onEditFinish();
                  })
                  .catch((err) => {
                    toastAlert(toast, 'error', '修改客户信息失败！');
                  })
                  .finally(() => {
                    setLoading(false);
                  });
              }
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

      <Modal
        isOpen={isOpenBirthdayPicker}
        onClose={() => {
          setIsOpenBirthdayPicker(false);
        }}>
        <Flex w={'35%'} backgroundColor='white' borderRadius={5} p={ss(8)}>
          <DatePicker
            options={{
              textHeaderFontSize: sp(16, { min: 12 }),
              mainColor: '#00B49E',
            }}
            onSelectedChange={(date) => {
              currentSelectBirthday = date;
            }}
            current={tempCustomer.birthday}
            selected={tempCustomer.birthday}
            mode='calendar'
          />
          <Row justifyContent={'flex-end'} mt={ss(12)}>
            <Pressable
              hitSlop={ss(10)}
              onPress={() => {
                setTempCustomer({
                  ...tempCustomer,
                  birthday: currentSelectBirthday,
                });
                setIsOpenBirthdayPicker(false);
              }}>
              <Box
                bgColor={'#00B49E'}
                px={ls(26)}
                py={ss(12)}
                borderRadius={ss(8)}
                _text={{ fontSize: ss(16, { min: 12 }), color: 'white' }}>
                确定
              </Box>
            </Pressable>
            <Pressable
              hitSlop={ss(10)}
              onPress={() => {
                setIsOpenBirthdayPicker(false);
              }}>
              <Box
                bgColor={'#D8D8D8'}
                px={ls(26)}
                py={ss(12)}
                ml={ls(10)}
                borderRadius={ss(8)}
                _text={{ fontSize: ss(16, { min: 12 }), color: 'white' }}>
                取消
              </Box>
            </Pressable>
          </Row>
        </Flex>
      </Modal>
    </Column>
  );
}
