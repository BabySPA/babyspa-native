import {
  Box,
  Column,
  Flex,
  Icon,
  Input,
  Modal,
  Radio,
  Row,
  ScrollView,
  Text,
} from 'native-base';
import { Pressable, StyleProp, ViewStyle } from 'react-native';
import BoxTitle from './box-title';
import { ss, ls, sp } from '../utils/style';
import { useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import SelectDropdown from 'react-native-select-dropdown';
import DatePicker from './date-picker';
import useFlowStore from '../stores/flow';
import { FormBox } from './form-box';

interface EditCustomerParams {
  style?: StyleProp<ViewStyle>;
}

export default function EditCustomer(params: EditCustomerParams) {
  const [isOpenBirthdayPicker, setIsOpenBirthdayPicker] = useState(false);

  const { operators } = useFlowStore();

  const showDatePicker = () => {
    setIsOpenBirthdayPicker(true);
  };

  const {
    register: { currentCustomer },
    setCurrentRegisterCustomer,
  } = useFlowStore();

  let currentSelectBirthday = currentCustomer.birthday;

  const { style = {} } = params;

  return (
    <ScrollView
      flex={1}
      bgColor={'#fff'}
      style={style}
      p={ss(20)}
      borderRadius={ss(10)}>
      <Flex>
        <BoxTitle title='客户信息' />
        <Column m={ss(30)}>
          <FormBox
            title='姓名'
            required
            form={
              <Input
                w={'70%'}
                h={ss(48, { min: 26 })}
                py={ss(10)}
                px={ls(20)}
                defaultValue={currentCustomer.name}
                placeholderTextColor={'#CCC'}
                color={'#333333'}
                fontSize={sp(16, { min: 12 })}
                placeholder='请输入'
                onChangeText={(text) => {
                  setCurrentRegisterCustomer({ name: text });
                }}
              />
            }
          />
          <FormBox
            title='乳名'
            style={{ marginTop: ss(20) }}
            form={
              <Input
                w={'70%'}
                h={ss(48, { min: 26 })}
                py={ss(10)}
                px={ls(20)}
                defaultValue={currentCustomer.nickname}
                placeholderTextColor={'#CCC'}
                onChangeText={(text) => {
                  setCurrentRegisterCustomer({ nickname: text });
                }}
                color={'#333333'}
                fontSize={sp(16, { min: 12 })}
                placeholder='请输入'
              />
            }
          />
          <FormBox
            title='性别'
            style={{ marginTop: ss(20) }}
            form={
              <Radio.Group
                defaultValue={`${currentCustomer.gender}`}
                name='gender'
                flexDirection={'row'}
                onChange={(event) => {
                  setCurrentRegisterCustomer({ gender: +event });
                }}>
                <Radio colorScheme='green' value='1' size={'sm'}>
                  男
                </Radio>
                <Radio colorScheme='green' value='2' ml={ls(40)} size={'sm'}>
                  女
                </Radio>
              </Radio.Group>
            }
          />
          <FormBox
            title='生日'
            required
            style={{ marginTop: ss(20) }}
            form={
              <Box w={'70%'}>
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
                      {currentCustomer.birthday}
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
            title='电话'
            style={{ marginTop: ss(20) }}
            form={
              <Input
                w={'70%'}
                defaultValue={currentCustomer.phoneNumber}
                h={ss(48, { min: 26 })}
                py={ss(10)}
                px={ls(20)}
                onChangeText={(text) => {
                  setCurrentRegisterCustomer({ phoneNumber: text });
                }}
                placeholderTextColor={'#CCC'}
                color={'#333333'}
                fontSize={sp(16, { min: 12 })}
                placeholder='请输入'
              />
            }
          />
          <FormBox
            title='过敏史'
            style={{ marginTop: ss(20) }}
            form={
              <Input
                defaultValue={currentCustomer.allergy}
                w={'70%'}
                h={ss(48, { min: 26 })}
                py={ss(10)}
                px={ls(20)}
                onChangeText={(text) => {
                  setCurrentRegisterCustomer({ allergy: text });
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
            title='理疗师'
            style={{ marginTop: ss(20) }}
            form={
              <Box w={'70%'}>
                <SelectDropdown
                  data={operators}
                  onSelect={(selectedItem, index) => {
                    console.log(selectedItem, index);

                    setCurrentRegisterCustomer({
                      operator: {
                        id: selectedItem._id,
                        name: selectedItem.name,
                        phoneNumber: selectedItem.phoneNumber,
                      },
                    });
                  }}
                  defaultButtonText={
                    currentCustomer?.operator?.name ?? '请选择理疗师'
                  }
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem.name;
                  }}
                  rowTextForSelection={(item, index) => {
                    return item.name;
                  }}
                  buttonStyle={{
                    width: '100%',
                    height: ss(48, { min: 26 }),
                    backgroundColor: '#fff',
                    borderRadius: ss(4),
                    borderWidth: 1,
                    borderColor: '#D8D8D8',
                  }}
                  buttonTextStyle={{
                    color: '#333333',
                    textAlign: 'left',
                    fontSize: sp(16, { min: 12 }),
                  }}
                  renderDropdownIcon={(isOpened) => {
                    return (
                      <Icon
                        as={
                          <FontAwesome
                            name={isOpened ? 'angle-up' : 'angle-down'}
                          />
                        }
                        size={ss(18, { min: 15 })}
                        color='#999'
                      />
                    );
                  }}
                  dropdownIconPosition={'right'}
                  dropdownStyle={{
                    backgroundColor: '#fff',
                    borderRadius: ss(8),
                  }}
                  rowStyle={{
                    backgroundColor: '#fff',
                    borderBottomColor: '#D8D8D8',
                  }}
                  rowTextStyle={{
                    color: '#333',
                    textAlign: 'center',
                    fontSize: sp(16, { min: 12 }),
                  }}
                  selectedRowStyle={{
                    backgroundColor: '#f8f8f8',
                  }}
                />
              </Box>
            }
          />
        </Column>
      </Flex>
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
            current={currentCustomer.birthday}
            selected={currentCustomer.birthday}
            mode='calendar'
          />
          <Row justifyContent={'flex-end'} mt={ss(12)}>
            <Pressable
              onPress={() => {
                setCurrentRegisterCustomer({ birthday: currentSelectBirthday });
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
    </ScrollView>
  );
}
