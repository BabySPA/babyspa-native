import {
  Box,
  Center,
  Column,
  Flex,
  Icon,
  Input,
  Radio,
  Row,
  ScrollView,
  Text,
  Pressable,
} from 'native-base';
import { StyleProp, ViewStyle } from 'react-native';
import { useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import useFlowStore from '~/app/stores/flow';
import BoxTitle from '~/app/components/box-title';
import { ss, ls, sp } from '~/app/utils/style';
import { FormBox } from '~/app/components/form-box';
import SelectOperator from '~/app/components/select-operator';
import DatePickerModal from '~/app/components/date-picker-modal';
import { TemplateModal } from '~/app/components/modals';
import useManagerStore from '~/app/stores/manager';
import { TemplateGroupKeys } from '~/app/constants';
import { RadioBox } from '~/app/components/radio';
import { getAge } from '~/app/utils';

interface EditCustomerParams {
  style?: StyleProp<ViewStyle>;
}

export default function EditCustomer(params: EditCustomerParams) {
  const [isOpenBirthdayPicker, setIsOpenBirthdayPicker] = useState(false);
  const [isOpenTemplatePicker, setIsOpenTemplatePicker] = useState(false);

  const { operators } = useFlowStore();

  const { templates, getTemplateGroups } = useManagerStore();

  const showDatePicker = () => {
    setIsOpenBirthdayPicker(true);
  };

  const { currentFlow, updateCurrentFlow } = useFlowStore();

  const { style = {} } = params;

  const age = getAge(currentFlow.customer.birthday);
  return (
    <ScrollView
      flex={1}
      bgColor={'#fff'}
      style={style}
      p={ss(20)}
      borderRadius={ss(4)}>
      <Flex>
        <BoxTitle title='客户信息' />
        <Column m={ss(30)}>
          <FormBox
            title='姓名'
            required
            form={
              <Input
                autoCorrect={false}
                w={'70%'}
                h={ss(48)}
                py={ss(10)}
                px={ls(20)}
                defaultValue={currentFlow.customer.name}
                placeholderTextColor={'#CCC'}
                color={'#333333'}
                fontSize={sp(16)}
                borderWidth={ss(1)}
                borderColor={'#D8D8D8'}
                placeholder='请输入'
                onChangeText={(text) => {
                  updateCurrentFlow({
                    ...currentFlow,
                    customer: {
                      ...currentFlow.customer,
                      name: text,
                    },
                  });
                }}
              />
            }
          />
          <FormBox
            title='乳名'
            style={{ marginTop: ss(20) }}
            form={
              <Input
                autoCorrect={false}
                w={'70%'}
                h={ss(48)}
                py={ss(10)}
                px={ls(20)}
                borderWidth={ss(1)}
                borderColor={'#D8D8D8'}
                defaultValue={currentFlow.customer.nickname}
                placeholderTextColor={'#CCC'}
                onChangeText={(text) => {
                  updateCurrentFlow({
                    ...currentFlow,
                    customer: {
                      ...currentFlow.customer,
                      nickname: text,
                    },
                  });
                }}
                color={'#333333'}
                fontSize={sp(16)}
                placeholder='请输入'
              />
            }
          />
          <FormBox
            required
            title='性别'
            style={{ marginTop: ss(20) }}
            form={
              <RadioBox
                margin={ss(20)}
                config={[
                  { label: '男', value: 1 },
                  { label: '女', value: 0 },
                ]}
                current={currentFlow.customer.gender}
                onChange={({ label, value }) => {
                  updateCurrentFlow({
                    ...currentFlow,
                    customer: {
                      ...currentFlow.customer,
                      gender: +value,
                    },
                  });
                }}
              />
            }
          />
          <FormBox
            title='生日'
            required
            style={{ marginTop: ss(20) }}
            form={
              <Box w={'70%'}>
                <Pressable
                  _pressed={{
                    opacity: 0.6,
                  }}
                  hitSlop={ss(20)}
                  onPress={() => {
                    showDatePicker();
                  }}>
                  <Row
                    borderRadius={ss(4)}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                    borderWidth={ss(1)}
                    borderColor={'#D8D8D8'}
                    py={ss(10)}
                    pl={ss(20)}
                    pr={ss(8)}>
                    <Text color={'#333'} fontSize={sp(16)}>
                      {currentFlow.customer.birthday || '请选择'}
                    </Text>
                    <Icon
                      as={<FontAwesome name='angle-down' />}
                      size={ss(18)}
                      color='#999'
                    />
                  </Row>
                </Pressable>
              </Box>
            }
          />
          <FormBox
            title='年龄'
            style={{ marginTop: ss(20) }}
            form={
              <Row w={'70%'} alignItems={'center'}>
                <Center
                  borderRadius={ss(4)}
                  borderWidth={ss(1)}
                  h={ss(48)}
                  w={ls(72)}
                  borderColor={'#D8D8D8'}>
                  <Text fontSize={sp(20)} color={'#333'}>
                    {age?.year}
                  </Text>
                </Center>
                <Text fontSize={sp(20)} color={'#333'} ml={ls(10)}>
                  岁
                </Text>
                <Center
                  ml={ls(20)}
                  borderRadius={ss(4)}
                  borderWidth={ss(1)}
                  h={ss(48)}
                  w={ls(72)}
                  borderColor={'#D8D8D8'}>
                  <Text fontSize={sp(20)} color={'#333'}>
                    {age?.month}
                  </Text>
                </Center>
                <Text fontSize={sp(20)} color={'#333'} ml={ls(10)}>
                  月
                </Text>
              </Row>
            }
          />
          <FormBox
            required
            title='电话'
            style={{ marginTop: ss(20) }}
            form={
              <Input
                autoCorrect={false}
                borderRadius={ss(4)}
                w={'70%'}
                defaultValue={currentFlow.customer.phoneNumber}
                h={ss(48)}
                py={ss(10)}
                px={ls(20)}
                borderWidth={ss(1)}
                borderColor={'#D8D8D8'}
                onChangeText={(text) => {
                  updateCurrentFlow({
                    ...currentFlow,
                    customer: {
                      ...currentFlow.customer,
                      phoneNumber: text,
                    },
                  });
                }}
                placeholderTextColor={'#CCC'}
                color={'#333333'}
                fontSize={sp(16)}
                placeholder='请输入'
                inputMode='numeric'
              />
            }
          />
          <FormBox
            title='过敏原'
            style={{ marginTop: ss(20), alignItems: 'center' }}
            form={
              <Box w={'70%'}>
                <Pressable
                  _pressed={{
                    opacity: 0.6,
                  }}
                  hitSlop={ss(20)}
                  onPress={() => {
                    setIsOpenTemplatePicker(true);
                  }}>
                  <Row
                    borderRadius={ss(4)}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                    borderWidth={ss(1)}
                    borderColor={'#D8D8D8'}
                    py={ss(10)}
                    pl={ss(20)}
                    pr={ss(8)}>
                    <Text
                      color={'#333'}
                      fontSize={sp(16)}
                      numberOfLines={1}
                      ellipsizeMode='tail'
                      maxW={ls(240)}>
                      {currentFlow.customer.allergy ||
                        currentFlow.collect.healthInfo.allergy ||
                        '请选择或输入'}
                    </Text>
                    <Icon
                      as={<FontAwesome name='angle-down' />}
                      size={ss(18)}
                      color='#999'
                    />
                  </Row>

                  <TemplateModal
                    defaultText={
                      currentFlow.customer.allergy ||
                      currentFlow.collect.healthInfo.allergy ||
                      ''
                    }
                    template={getTemplateGroups(TemplateGroupKeys.allergy)}
                    isOpen={isOpenTemplatePicker}
                    onClose={function (): void {
                      setIsOpenTemplatePicker(false);
                    }}
                    onConfirm={function (text): void {
                      updateCurrentFlow({
                        ...currentFlow,
                        customer: {
                          ...currentFlow.customer,
                          allergy: text,
                        },
                        collect: {
                          ...currentFlow.collect,
                          healthInfo: {
                            ...currentFlow.collect.healthInfo,
                            allergy: text,
                          },
                        },
                      });
                      setIsOpenTemplatePicker(false);
                    }}
                  />
                </Pressable>
              </Box>
            }
          />
          <FormBox
            title='理疗师'
            style={{ marginTop: ss(20) }}
            form={
              <Box w={'70%'}>
                <SelectOperator
                  operators={operators}
                  onSelect={(selectedItem, index) => {
                    updateCurrentFlow({
                      ...currentFlow,
                      collectionOperator: {
                        ...currentFlow.collectionOperator,
                        _id: selectedItem._id,
                        name: selectedItem.name,
                      },
                    });
                  }}
                  defaultButtonText={
                    currentFlow?.collectionOperator?.name ?? '请选择理疗师'
                  }
                />
              </Box>
            }
          />
        </Column>
      </Flex>
      <DatePickerModal
        isOpen={isOpenBirthdayPicker}
        onClose={() => {
          setIsOpenBirthdayPicker(false);
        }}
        onSelectedChange={(date: string) => {
          updateCurrentFlow({
            ...currentFlow,
            customer: {
              ...currentFlow.customer,
              birthday: date,
            },
          });
        }}
        current={currentFlow.customer.birthday}
        selected={currentFlow.customer.birthday}
      />
    </ScrollView>
  );
}
