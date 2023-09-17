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
  const { currentFlow } = useFlowStore();
  const age = getAge(currentFlow.customer.birthday);
  const { style = {} } = params;

  return (
    <Column bgColor={'#fff'} p={ss(20)} borderRadius={ss(10)} style={style}>
      <BoxTitle title='登记信息' />
      <Divider color={'#DFE1DE'} my={ss(14)} />
      <Row px={ls(20)}>
        <Image
          style={{ width: ss(72), height: ss(72) }}
          source={
            currentFlow.customer.gender == 1
              ? require('~/assets/images/boy.png')
              : require('~/assets/images/girl.png')
          }
        />
        <Column ml={ss(20)}>
          <Row alignItems={'center'}>
            <Text
              fontSize={ss(22)}
              color={'#333'}
              maxW={ls(220)}
              ellipsizeMode='tail'
              numberOfLines={1}
            >
              {currentFlow.customer.name}
              {currentFlow.customer.nickname && (
                <Text>({currentFlow.customer.nickname})</Text>
              )}
            </Text>
            <Icon
              ml={ss(12)}
              as={
                <MaterialCommunityIcons
                  name={
                    currentFlow.customer.gender == 1
                      ? 'gender-male'
                      : 'gender-female'
                  }
                />
              }
              size={ss(26)}
              color={currentFlow.customer.gender == 1 ? '#648B62' : '#F3AF62'}
            />
            <Text fontSize={sp(20)} color={'#666'} ml={ss(12)}>
              {age?.year}岁{age?.month}月
            </Text>
          </Row>
          <Row mt={ss(16)}>
            <Text fontSize={sp(18)} color='#999'>
              联系方式：
              <Text color='#333'>{currentFlow.customer.phoneNumber}</Text>
            </Text>
          </Row>
          <Row alignItems={'center'} mt={ss(16)}>
            <Text fontSize={sp(18)} color='#999'>
              登记时间：
              <Text color='#333'>
                {dayjs(currentFlow.customer.updatedAt).format(
                  'YYYY-MM-DD HH:mm',
                )}
              </Text>
            </Text>
          </Row>
          <Text fontSize={sp(18)} color='#999' mt={ss(16)}>
            门店：
            <Text color='#333'>{currentFlow.shop?.name}</Text>
          </Text>
          <Row alignItems={'center'} mt={ss(16)}>
            <Text fontSize={sp(18)} color='#999'>
              登记号码：
              <Text color='#333'>{currentFlow.tag}</Text>
            </Text>
            <Text fontSize={sp(18)} color='#999' ml={ls(40)}>
              预约理疗师：
              <Text color='#333'>{currentFlow.collectionOperator?.name}</Text>
            </Text>
          </Row>
        </Column>
      </Row>
    </Column>
  );
}
