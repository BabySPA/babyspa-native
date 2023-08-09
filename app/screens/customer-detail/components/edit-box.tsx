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
import DatePicker from '~/app/components/date-picker';
import { toastAlert } from '~/app/utils/toast';
import { CustomerStatus } from '~/app/types';
import SelectOperator from '~/app/components/select-operator';

interface EditBoxParams {
  onEditFinish: () => void;
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
    requestInitializeData,
  } = useFlowStore();

  const [tempCustomer, setTempCustomer] = useState(currentRegisterCustomer);

  const showDatePicker = () => {
    setIsOpenBirthdayPicker(true);
  };

  let currentSelectBirthday = tempCustomer.birthday;

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
                <Radio.Group
                  value={`${tempCustomer.gender}`}
                  name='gender'
                  flexDirection={'row'}
                  onChange={(event) => {
                    setTempCustomer({
                      ...tempCustomer,
                      gender: +event,
                    });
                  }}>
                  <Radio colorScheme='green' value='1' size={'sm'}>
                    <Text fontSize={sp(20)} color='#333'>
                      男
                    </Text>
                  </Radio>
                  <Radio colorScheme='green' value='0' ml={ls(30)} size={'sm'}>
                    <Text fontSize={sp(20)} color='#333'>
                      女
                    </Text>
                  </Radio>
                </Radio.Group>
              }
            />
            <FormBox
              title='生日'
              style={{ flex: 1 }}
              required
              form={
                <Box w={ls(380)}>
                  <Pressable
                    onPress={() => {
                      showDatePicker();
                    }}>
                    <Row
                      borderRadius={ss(10)}
                      justifyContent={'space-between'}
                      alignItems={'center'}
                      borderWidth={1}
                      borderColor={'#D8D8D8'}
                      py={ss(10)}
                      px={ss(20)}>
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
            <FormBox
              required
              title='过敏原'
              style={{ flex: 1 }}
              form={
                <Input
                  defaultValue={tempCustomer.allergy}
                  w={ls(380)}
                  h={ss(48, { min: 26 })}
                  py={ss(10)}
                  px={ls(20)}
                  onChangeText={(text) => {
                    setTempCustomer({
                      ...tempCustomer,
                      allergy: text,
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

            updateCurrentRegisterCustomer(tempCustomer);

            if (tempCustomer.status === CustomerStatus.Canceled) {
              requestPostCustomerInfo()
                .then(async (res) => {
                  await requestInitializeData();
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
                  await requestInitializeData();
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
