import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import dayjs from 'dayjs'
import { Column, Row, Text, Flex, Icon } from 'native-base';
import { Image } from 'react-native';
import { Customer } from '~/app/stores/flow/type';
import { getAge } from '~/app/utils';
import { ss, ls, sp } from '~/app/utils/style';

export default function CustomerArchiveItem({
  customer,
}: {
  customer: Customer;
}) {
  const age = getAge(customer.birthday);
  const ageText = `${age?.year}岁${age?.month}月`;

  return (
    <Row
      borderRadius={ss(8)}
      borderStyle={'dashed'}
      borderWidth={1}
      borderColor={'#15BD8F'}
      w={ls(312)}
      minH={ss(128)}
      mb={ss(20)}
      justifyContent={'space-between'}>
      <Row p={ss(20)} maxW={'80%'}>
        <Column justifyContent={'flex-start'} alignItems={'center'}>
          <Image
            style={{ width: ss(80), height: ss(80) }}
            source={
              customer.gender == 1
                ? require('~/assets/images/boy.png')
                : require('~/assets/images/girl.png')
            }
          />
        </Column>

        <Flex ml={ls(12)}>
          <Row alignItems={'center'}>
            <Text
              color='#333'
              fontSize={sp(20)}
              fontWeight={400}
              maxW={ls(150)}
              ellipsizeMode='tail'
              numberOfLines={1}>
              {customer.name}
              {customer.nickname && <Text>({customer.nickname})</Text>}
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
          </Row>
          <Row
            alignItems={'center'}
            justifyContent={'space-between'}
            mt={ss(5)}>
            <Text color={'#666'} fontWeight={400} fontSize={sp(18)} ml={ls(3)}>
              {ageText}
            </Text>

            <Text color={'#666'} fontWeight={400} fontSize={sp(18)}>
              {customer.phoneNumber}
            </Text>
          </Row>
          <Row alignItems={'center'} mt={ss(5)}>
            <Icon
              as={<Ionicons name={'ios-time-outline'} />}
              size={ss(17)}
              color={'#C87939'}
            />
            <Text
              color={'#C87939'}
              fontWeight={400}
              fontSize={sp(18)}
              ml={ls(5)}>
              {dayjs(customer.updatedAt).format('YYYY-MM-DD HH:mm')}
            </Text>
          </Row>
        </Flex>
      </Row>
    </Row>
  );
}
