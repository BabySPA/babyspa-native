import {
  Box,
  CheckIcon,
  Column,
  Flex,
  FormControl,
  IFlexProps,
  Icon,
  Input,
  Radio,
  Row,
  ScrollView,
  Select,
  Text,
} from 'native-base';
import { Pressable, StyleProp, View, ViewStyle } from 'react-native';
import BoxTitle from './box-title';
import { ss, ls, sp } from '../utils/style';
import { useCallback, useState } from 'react';
import Dot from './dot';
import { CustomProps } from 'native-base/lib/typescript/components/types';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { Button } from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';
import { CalendarDate } from 'react-native-paper-dates/lib/typescript/Date/Calendar';
import dayjs from 'dayjs';
import DateTimePicker from '@react-native-community/datetimepicker';
import SelectDropdown from 'react-native-select-dropdown';

interface EditCustomerParams {
  style?: StyleProp<ViewStyle>;
}

interface FormBoxParams {
  title: string;
  form: JSX.Element;
  required?: boolean;
  style?: StyleProp<ViewStyle>;
}

function FormBox(props: FormBoxParams) {
  const { required, form, title, style } = props;
  return (
    <Row style={style} h={ls(48)} alignItems={'center'}>
      <Row alignItems={'center'} mr={ls(30)}>
        <Box opacity={required ? 1 : 0}>
          <Dot />
        </Box>
        <Text fontSize={sp(20, { min: 12 })}>{title}</Text>
      </Row>
      {form}
    </Row>
  );
}

export default function EditCustomer(params: EditCustomerParams) {
  const [birthday, setBirthday] = useState<Date>(new Date());
  const [openBirthdayPicker, setOpenBirthdayPicker] = useState(false);

  const onConfirmBirthdayPicker = (event: any, selectedDate: Date) => {
    setOpenBirthdayPicker(false);
    setBirthday(selectedDate);
  };

  const { style = {} } = params;

  return (
    <ScrollView flex={1} bgColor={'#fff'} style={style} p={ss(20)}>
      <Flex>
        <BoxTitle title="客户信息" />
        <Column mt={ss(30)}>
          <FormBox
            title="姓名"
            required
            form={
              <Input
                w={'70%'}
                h={ss(48, { min: 26 })}
                py={ss(10)}
                px={ls(20)}
                placeholderTextColor={'#CCC'}
                color={'#333333'}
                fontSize={sp(16, { min: 12 })}
                placeholder="请输入"
              />
            }
          />
          <FormBox
            title="乳名"
            style={{ marginTop: ss(20) }}
            form={
              <Input
                w={'70%'}
                h={ss(48, { min: 26 })}
                py={ss(10)}
                px={ls(20)}
                placeholderTextColor={'#CCC'}
                color={'#333333'}
                fontSize={sp(16, { min: 12 })}
                placeholder="请输入"
              />
            }
          />
          <FormBox
            title="性别"
            style={{ marginTop: ss(20) }}
            form={
              <Radio.Group
                defaultValue="1"
                name="gender"
                flexDirection={'row'}
                onChange={(event) => {
                  console.log(event);
                }}
              >
                <Radio colorScheme="green" value="1">
                  男
                </Radio>
                <Radio colorScheme="green" value="2" ml={ls(40)}>
                  女
                </Radio>
              </Radio.Group>
            }
          />
          <FormBox
            title="生日"
            required
            style={{ marginTop: ss(20) }}
            form={
              <Box w={'70%'}>
                <Pressable
                  onPress={() => {
                    setOpenBirthdayPicker(true);
                  }}
                >
                  <Input
                    placeholder="请输入"
                    isReadOnly={true}
                    h={ss(48, { min: 26 })}
                    py={ss(10)}
                    px={ls(20)}
                    placeholderTextColor={'#CCC'}
                    color={'#333333'}
                    fontSize={sp(16, { min: 12 })}
                    value={dayjs(birthday).format('YYYY-MM-DD')}
                    rightElement={
                      <Icon
                        as={<FontAwesome name="angle-down" />}
                        size={ss(18, { min: 15 })}
                        color="#999"
                      />
                    }
                  />
                  {openBirthdayPicker && (
                    <DateTimePicker
                      value={birthday}
                      mode={'date'}
                      onChange={onConfirmBirthdayPicker}
                    />
                  )}
                </Pressable>
              </Box>
            }
          />
          <FormBox
            required
            title="电话"
            style={{ marginTop: ss(20) }}
            form={
              <Input
                w={'70%'}
                h={ss(48, { min: 26 })}
                py={ss(10)}
                px={ls(20)}
                placeholderTextColor={'#CCC'}
                color={'#333333'}
                fontSize={sp(16, { min: 12 })}
                placeholder="请输入"
              />
            }
          />
          <FormBox
            title="过敏史"
            style={{ marginTop: ss(20) }}
            form={
              <Input
                w={'70%'}
                h={ss(48, { min: 26 })}
                py={ss(10)}
                px={ls(20)}
                placeholderTextColor={'#CCC'}
                color={'#333333'}
                fontSize={sp(16, { min: 12 })}
                placeholder="请输入"
              />
            }
          />
          <FormBox
            title="理疗师"
            style={{ marginTop: ss(20) }}
            form={
              <Box w={'70%'}>
                <SelectDropdown
                  data={[
                    'Egypt',
                    'Canada',
                    'Australia',
                    'Ireland',
                    'Brazil',
                    'England',
                    'Dubai',
                    'France',
                    'Germany',
                    'Saudi Arabia',
                    'Argentina',
                    'India',
                  ]}
                  onSelect={(selectedItem, index) => {
                    console.log(selectedItem, index);
                  }}
                  defaultButtonText={'Select country'}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem;
                  }}
                  rowTextForSelection={(item, index) => {
                    return item;
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
                        color="#999"
                      />
                    );
                  }}
                  dropdownIconPosition={'right'}
                  dropdownStyle={{
                    backgroundColor: '#fff',
                    borderRadius: ss(8),
                  }}
                  rowStyle={{
                    height: ss(50, { min: 30 }),
                    backgroundColor: '#fff',
                    borderBottomColor: '#D8D8D8',
                  }}
                  rowTextStyle={{
                    color: '#333',
                    textAlign: 'center',
                  }}
                  selectedRowStyle={{
                    backgroundColor: '#f8f8f8',
                  }}
                  search
                  searchInputStyle={{
                    height: ss(50, { min: 30 }),
                    backgroundColor: '#00B49E',
                    borderBottomWidth: 1,
                    borderBottomColor: '#FFF',
                  }}
                  searchPlaceHolder={'Search here'}
                  searchPlaceHolderColor={'#F8F8F8'}
                  searchInputTxtStyle={{
                    fontSize: sp(20, { min: 12 }),
                  }}
                  renderSearchInputLeftIcon={() => {
                    return (
                      <FontAwesome
                        name={'search'}
                        color={'#FFF'}
                        size={ss(18, { min: 15 })}
                      />
                    );
                  }}
                />
              </Box>
            }
          />
        </Column>
      </Flex>
    </ScrollView>
  );
}
