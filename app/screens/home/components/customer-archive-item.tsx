import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { Column, Row, Text, Flex, Icon } from 'native-base';
import { memo } from 'react';
import { Image } from 'react-native';
import { Customer } from '~/app/stores/flow/type';
import { getAge } from '~/app/utils';
import { ss, ls, sp } from '~/app/utils/style';

function CustomerArchiveItem({ customer }: { customer: Customer }) {
  const age = getAge(customer.birthday);
  const ageText = `${age?.year}岁${age?.month}月`;

  return (
    <Row
      borderRadius={ss(8)}
      borderStyle={'dashed'}
      borderWidth={ss(1)}
      borderColor={'#15BD8F'}
      w={'100%'}
      minH={ss(128)}
      mb={ss(20)}
      p={ss(20)}
      justifyContent={'space-between'}
      alignItems={'center'}>
      <Row w={'100%'}>
        <Column height={'100%'} alignItems={'center'}>
          <Image
            style={{ width: ss(80, 70), height: ss(80, 70) }}
            source={
              customer.gender == 1
                ? require('~/assets/images/boy.png')
                : require('~/assets/images/girl.png')
            }
          />
        </Column>

        <Flex ml={ls(12, 10)}>
          <Row alignItems={'center'}>
            <Text
              color='#333'
              fontSize={sp(20)}
              fontWeight={400}
              maxW={ls(150, 200)}
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
              size={sp(26)}
              color={customer.gender == 1 ? '#648B62' : '#F3AF62'}
            />
          </Row>
          <Row alignItems={'center'} w={ls(190)} mt={ss(5)} pr={ls(5)}>
            <Text
              color={'#666'}
              fontWeight={400}
              fontSize={sp(18, 20)}
              ml={ls(3)}>
              {ageText}
            </Text>

            <Text
              color={'#666'}
              fontWeight={400}
              fontSize={sp(18, 20)}
              ml={ls(4, 4)}>
              {customer.phoneNumber}
            </Text>
          </Row>
          <Row alignItems={'center'} mt={ss(5)}>
            <Icon
              as={<Ionicons name={'ios-time-outline'} />}
              size={sp(18, 20)}
              color={'#C87939'}
            />
            <Text
              color={'#C87939'}
              fontWeight={400}
              fontSize={sp(18, 20)}
              ml={ls(4, 4)}>
              {dayjs(customer.updatedAt).format('YYYY-MM-DD HH:mm')}
            </Text>
          </Row>
        </Flex>
      </Row>
    </Row>
  );
}

export default memo(CustomerArchiveItem);
