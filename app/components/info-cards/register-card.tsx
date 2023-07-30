import { Column, Divider, Icon, Row, Text } from 'native-base';
import { StyleProp, ViewStyle, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useFlowStore from '~/app/stores/flow';
import BoxTitle from '~/app/components/box-title';
import { ss, ls, sp } from '~/app/utils/style';
import { getAge } from '~/app/utils';
import dayjs from 'dayjs';

interface RegisterCardParams {
  style?: StyleProp<ViewStyle>;
}

export default function RegisterCard(params: RegisterCardParams) {
  const { currentFlowCustomer } = useFlowStore();
  const age = getAge(currentFlowCustomer.birthday);
  const { style = {} } = params;

  return (
    <Column bgColor={'#fff'} p={ss(20)} borderRadius={ss(10)} style={style}>
      <BoxTitle title='登记信息' />
      <Divider color={'#DFE1DE'} my={ss(14)} />
      <Row px={ls(20)}>
        <Image
          style={{ width: ss(72), height: ss(72) }}
          source={
            currentFlowCustomer.gender == 1
              ? require('~/assets/images/boy.png')
              : require('~/assets/images/girl.png')
          }
        />
        <Column ml={ss(20)}>
          <Row alignItems={'center'}>
            <Text fontSize={ss(24)} color={'#333'}>
              {currentFlowCustomer.name}({currentFlowCustomer.nickname})
            </Text>
            <Icon
              ml={ss(20)}
              as={
                <MaterialCommunityIcons
                  name={
                    currentFlowCustomer.gender == 1
                      ? 'gender-male'
                      : 'gender-female'
                  }
                />
              }
              size={sp(26)}
              color={currentFlowCustomer.gender == 1 ? '#648B62' : '#F3AF62'}
            />
            <Text fontSize={sp(20)} color={'#666'} ml={ss(20)}>
              {age?.year}岁{age?.month}月
            </Text>
            <Text fontSize={sp(20)} color={'#03CBB2'} ml={ss(20)}>
              {currentFlowCustomer.phoneNumber}
            </Text>
          </Row>

          <Row alignItems={'center'} mt={ss(16)}>
            <Text fontSize={sp(18)} color='#999'>
              登记时间：
              <Text color='#333'>
                {dayjs(currentFlowCustomer.updatedAt).format(
                  'YYYY-MM-DD HH:mm',
                )}
              </Text>
            </Text>
            <Text fontSize={sp(18)} color='#999' ml={ls(30)}>
              门店：
              <Text color='#333'>{currentFlowCustomer.shop?.name}</Text>
            </Text>
          </Row>

          <Row alignItems={'center'} mt={ss(16)}>
            <Text fontSize={sp(18)} color='#999'>
              登记号码：
              <Text color='#333'>{currentFlowCustomer.tag}</Text>
            </Text>
            <Text fontSize={sp(18)} color='#999' ml={ls(40)}>
              预约调理师：
              <Text color='#333'>{currentFlowCustomer?.operator?.name}</Text>
            </Text>
          </Row>
        </Column>
      </Row>
    </Column>
  );
}
