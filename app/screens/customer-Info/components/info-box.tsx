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
  Pressable,
} from 'native-base';
import { Image, StyleProp, ViewStyle } from 'react-native';
import { useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import SelectDropdown from 'react-native-select-dropdown';
import useFlowStore from '~/app/stores/flow';
import BoxTitle from '~/app/components/box-title';
import { ss, ls, sp } from '~/app/utils/style';
import { FormBox } from '~/app/components/form-box';
import DatePicker from '~/app/components/date-picker';
import dayjs from 'dayjs';
import { Gender } from '~/app/types';
import { getAge } from '~/app/utils';
import LabelBox from './label-box';

interface InfoBoxParams {
  onPressEdit: () => void;
}

export default function InfoBox(params: InfoBoxParams) {
  const { currentRegisterCustomer } = useFlowStore();
  const age = getAge(currentRegisterCustomer.birthday ?? '');
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
            <LabelBox title='姓名' value={currentRegisterCustomer.name} />
            <LabelBox title='乳名' value={currentRegisterCustomer.nickname} />
          </Row>
          <Row alignItems={'center'} mt={ss(40)}>
            <LabelBox
              title='性别'
              value={currentRegisterCustomer.gender == Gender.MAN ? '男' : '女'}
            />
            <LabelBox
              title='生日'
              value={dayjs(currentRegisterCustomer.birthday).format(
                'YYYY年MM月DD日',
              )}
            />
          </Row>
          <Row alignItems={'center'} mt={ss(40)}>
            <LabelBox title='年龄' value={`${age?.year}岁${age?.month}月`} />
            <LabelBox
              title='电话'
              value={currentRegisterCustomer.phoneNumber}
            />
          </Row>
          <Row alignItems={'center'} mt={ss(40)}>
            <LabelBox title='过敏原' value={currentRegisterCustomer.allergy} />
            <LabelBox
              title='调理师'
              value={currentRegisterCustomer.operator?.name}
            />
          </Row>
          <Row alignItems={'center'} mt={ss(40)}>
            <LabelBox
              title='登记时间'
              value={dayjs(currentRegisterCustomer.updatedAt).format(
                'YYYY-MM-DD HH:mm:ss',
              )}
            />
            <LabelBox title='登记号码' value={currentRegisterCustomer.tag} />
          </Row>
        </Box>
      </Column>
      <Image
        source={require('~/assets/images/register-success.png')}
        style={{
          width: ss(120),
          height: ss(120),
          position: 'absolute',
          top: ss(30),
          right: ls(100),
        }}
      />
      <Row justifyContent={'center'} mb={ss(40)}>
        <Pressable>
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
            params.onPressEdit();
          }}>
          <Box
            px={ls(34)}
            py={ss(12)}
            bgColor={'rgba(0, 180, 158, 0.10);'}
            borderRadius={ss(4)}
            borderWidth={1}
            borderColor={'#00B49E'}>
            <Text color='#00B49E' fontSize={sp(16)}>
              修改
            </Text>
          </Box>
        </Pressable>
      </Row>
    </Column>
  );
}
