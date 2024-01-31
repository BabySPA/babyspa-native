import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { Column, Row, Text, Flex, Icon } from 'native-base';
import { memo, useMemo } from 'react';
import { Image, View } from 'react-native';
import { Customer } from '~/app/stores/flow/type';
import { getAge } from '~/app/utils';
import { ss, ls, sp } from '~/app/utils/style';

function CustomerArchiveItem({ customer: _cust }: { customer: Customer }) {
  const customer = useMemo(() => {
    // 计算或处理data的逻辑
    return _cust;
  }, [_cust]); // 依赖项为data
  const age = getAge(customer.birthday);
  const ageText = `${age?.year}岁${age?.month}月`;

  return (
    <View
      style={{
        borderRadius: ss(8),
        borderWidth: ss(1),
        borderColor: '#15BD8F',
        width: ls(375),
        minHeight: ss(128),
        marginBottom: ss(20),
        padding: ss(16),
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
      }}>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ height: '100%', alignItems: 'center' }}>
          <Image
            style={{ width: ss(80, 70), height: ss(80, 70) }}
            source={
              customer.gender == 1
                ? require('~/assets/images/boy.png')
                : require('~/assets/images/girl.png')
            }
          />
        </View>

        <View style={{ marginLeft: ls(12, 10) }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              style={{
                color: '#333',
                fontSize: sp(20),
                fontWeight: '400',
                maxWidth: ls(150, 200),
                marginRight: ls(5),
              }}>
              {customer.name}
              {customer.nickname && <Text>({customer.nickname})</Text>}
            </Text>
            <MaterialCommunityIcons
              name={customer.gender == 1 ? 'gender-male' : 'gender-female'}
              size={sp(26)}
              color={customer.gender == 1 ? '#648B62' : '#F3AF62'}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: ls(190),
              marginTop: ss(5),
              paddingRight: ls(5),
            }}>
            <Text
              style={{
                color: '#666',
                fontWeight: '400',
                fontSize: sp(18, 20),
                marginLeft: ls(3),
              }}>
              {ageText}
            </Text>
            <Text
              style={{
                color: '#666',
                fontWeight: '400',
                fontSize: sp(18, 20),
                marginLeft: ls(4, 4),
              }}>
              {customer.phoneNumber}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: ss(5),
            }}>
            <Ionicons
              name={'ios-time-outline'}
              size={sp(18, 20)}
              color={'#C87939'}
            />
            <Text
              style={{
                color: '#C87939',
                fontWeight: '400',
                fontSize: sp(18, 20),
                marginLeft: ls(4, 4),
              }}>
              {dayjs(customer.updatedAt).format('YYYY-MM-DD HH:mm')}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default CustomerArchiveItem;
