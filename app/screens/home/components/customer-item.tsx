import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import { Pressable, Column, Row, Text, Flex, Icon, Box } from 'native-base';
import { Image } from 'react-native';
import OperateButton from '~/app/components/operate-button';
import {
  CustomerStatus,
  OperateType,
  StatusOperateConfig,
  StatusTextConfig,
} from '~/app/constants';
import { Customer } from '~/app/stores/flow';
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
  return (
    <Row
      borderRadius={ss(8)}
      borderStyle={'dashed'}
      borderWidth={1}
      borderColor={'#15BD8F'}
      w={ls(467)}
      h={ss(148)}
      mb={ss(40)}
      justifyContent={'space-between'}>
      <Row p={ss(20)}>
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
            <Text color='#333' fontSize={sp(20)} fontWeight={400}>
              {customer.name}({customer.nickname} {customer.gender})
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
          <Text mt={ss(10)} color={'#666'} fontSize={sp(18)}>
            理疗师：{customer.operator.name}
          </Text>
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
      <Flex justifyContent={'space-between'} alignItems={'flex-end'}>
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

        <OperateButton
          text={StatusOperateConfig[customer.status].operate}
          onPress={() => {
            console.log('operate', customer.status);
            if (customer.status === CustomerStatus.ToBeAnalyzed) {
              navigation.navigate('Flow', {
                status: CustomerStatus.ToBeAnalyzed,
              });
            } else if (customer.status === CustomerStatus.ToBeCollected) {
              navigation.navigate('Flow', {
                status: CustomerStatus.ToBeCollected,
              });
            }
          }}
        />
      </Flex>
    </Row>
  );
}
