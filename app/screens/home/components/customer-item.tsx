import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import { Column, Row, Text, Flex, Icon, Box } from 'native-base';
import { Image } from 'react-native';
import OperateButton from '~/app/components/operate-button';
import {
  EvaluateTextConfig,
  StatusOperateConfig,
  StatusTextConfig,
} from '~/app/constants';
import useFlowStore from '~/app/stores/flow';
import { Customer } from '~/app/stores/flow/type';
import { CustomerStatus, OperateType } from '~/app/types';
import { getAge } from '~/app/utils';
import { ss, ls, sp } from '~/app/utils/style';

export default function CustomerItem({
  customer,
  type,
}: {
  customer: Customer;
  type: OperateType;
}) {
  const age = getAge(customer.birthday);
  const ageText = `${age?.year}岁${age?.month}月`;
  const navigation = useNavigation();
  const { updateCurrentFlowCustomer } = useFlowStore();
  return (
    <Row
      borderRadius={ss(8)}
      borderStyle={'dashed'}
      borderWidth={1}
      borderColor={'#15BD8F'}
      w={ls(467)}
      minH={ss(148)}
      mb={ss(40)}
      justifyContent={'space-between'}>
      <Row p={ss(20)} maxW={'80%'}>
        <Column justifyContent={'flex-start'} alignItems={'center'}>
          <Image
            style={{ width: ss(60), height: ss(60) }}
            source={
              customer.gender == 1
                ? require('~/assets/images/boy.png')
                : require('~/assets/images/girl.png')
            }
          />
          <Text color='#F7BA2A' fontSize={sp(24)}>
            {customer.tag}
          </Text>
        </Column>

        <Flex ml={ls(20)}>
          <Row alignItems={'center'}>
            <Text
              color='#333'
              fontSize={sp(20)}
              fontWeight={400}
              maxW={ls(200)}
              numberOfLines={1}
              ellipsizeMode='tail'>
              {customer.name}({customer.nickname})
            </Text>
            <Icon
              as={
                <MaterialCommunityIcons
                  name={customer.gender == 1 ? 'gender-male' : 'gender-female'}
                />
              }
              size={ss(26)}
              color={customer.gender == 1 ? '#648B62' : '#F3AF62'}
            />
            <Text
              color={'#99A9BF'}
              fontWeight={400}
              fontSize={sp(18)}
              ml={ls(3)}>
              {ageText}
            </Text>
          </Row>
          <Row alignItems={'center'}>
            <Text mt={ss(10)} color={'#666'} fontSize={sp(18)}>
              理疗师：{customer.operator?.name}
            </Text>
            {type == OperateType.Evaluate && (
              <Text mt={ss(10)} color={'#666'} fontSize={sp(18)} ml={ss(30)}>
                分析师：{customer.analyst?.name}
              </Text>
            )}
          </Row>
          {(type == OperateType.Analyze || type == OperateType.Evaluate) && (
            <Text mt={ss(10)} color={'#666'} fontSize={sp(18)}>
              门店：{customer.shop?.name}
            </Text>
          )}
          <Row alignItems={'center'} mt={ss(10)}>
            <Icon
              as={<Ionicons name={'ios-time-outline'} />}
              size={ss(17)}
              color={'#C87939'}
            />
            <Text
              color={'#C87939'}
              fontWeight={400}
              fontSize={sp(18)}
              ml={ls(10)}>
              {dayjs(customer.updatedAt).format('YYYY-MM-DD HH:mm')}
            </Text>
          </Row>
        </Flex>
      </Row>
      <Flex justifyContent={'space-between'} alignItems={'flex-end'} flex={1}>
        {type === OperateType.Evaluate ? (
          <Box
            bgColor={
              EvaluateTextConfig[customer.flowEvalute ? 'DONE' : 'TODO'].bgColor
            }
            px={ls(12)}
            py={ss(6)}
            _text={{
              fontSize: sp(16),
              color:
                EvaluateTextConfig[customer.flowEvalute ? 'DONE' : 'TODO']
                  .textColor,
            }}
            borderBottomLeftRadius={ss(8)}
            borderTopRightRadius={ss(8)}>
            {EvaluateTextConfig[customer.flowEvalute ? 'DONE' : 'TODO'].text}
          </Box>
        ) : (
          <Box
            bgColor={StatusTextConfig[customer.status].bgColor}
            px={ls(12)}
            py={ss(6)}
            _text={{
              fontSize: sp(16),
              color: StatusTextConfig[customer.status].textColor,
            }}
            borderBottomLeftRadius={ss(8)}
            borderTopRightRadius={ss(8)}>
            {StatusTextConfig[customer.status].text}
          </Box>
        )}

        {type === OperateType.Collection &&
          customer.status == CustomerStatus.ToBeCollected && (
            <OperateButton
              text={StatusOperateConfig[customer.status].operate}
              onPress={() => {
                updateCurrentFlowCustomer(customer);
                navigation.navigate('Flow', {
                  type: CustomerStatus.ToBeCollected,
                });
              }}
            />
          )}

        {type === OperateType.Analyze &&
          customer.status == CustomerStatus.ToBeAnalyzed && (
            <OperateButton
              text={StatusOperateConfig[customer.status].operate}
              onPress={() => {
                updateCurrentFlowCustomer(customer);
                navigation.navigate('Flow', {
                  type: CustomerStatus.ToBeAnalyzed,
                });
              }}
            />
          )}

        {type === OperateType.Evaluate && !customer.flowEvalute && (
          <OperateButton
            text={'评价'}
            onPress={() => {
              updateCurrentFlowCustomer(customer);
              navigation.navigate('FlowInfo', {
                from: 'evaluate',
              });
            }}
          />
        )}
      </Flex>
    </Row>
  );
}
