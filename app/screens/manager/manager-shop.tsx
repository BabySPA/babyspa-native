import dayjs from 'dayjs';
import {
  Box,
  Column,
  Icon,
  Input,
  Pressable,
  Row,
  Text,
  Image,
  FlatList,
  useSafeArea,
} from 'native-base';
import NavigationBar from '~/app/components/navigation-bar';
import { sp, ss, ls } from '~/app/utils/style';
import { AppStackScreenProps } from '~/app/types';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import useManagerStore, { DefaultShop } from '~/app/stores/manager';
import { debounce } from 'lodash';

export default function ManagerShop({
  navigation,
}: AppStackScreenProps<'ManagerShop'>) {
  const { shops, requestGetShops, setCurrentShop } = useManagerStore();

  useEffect(() => {
    requestGetShops();
  }, []);

  const List = () => {
    const safeAreaProps = useSafeArea({
      safeAreaBottom: true,
      pt: 2,
    });
    return (
      <Column>
        <Row
          bgColor={'#EDF7F6'}
          px={ls(40)}
          h={ss(60)}
          alignItems={'center'}
          borderTopRadius={ss(10)}
          width={'100%'}
          justifyContent={'space-around'}>
          <Row w={ls(150)}>
            <Text fontSize={sp(18)} color={'#333'}>
              门店名称
            </Text>
          </Row>
          <Row w={ls(80)}>
            <Text fontSize={sp(18)} color={'#333'}>
              负责人
            </Text>
          </Row>
          <Row w={ls(200)}>
            <Text fontSize={sp(18)} color={'#333'}>
              所属区域
            </Text>
          </Row>
          <Row w={ls(140)}>
            <Text fontSize={sp(18)} color={'#333'}>
              详细地址
            </Text>
          </Row>
          <Row w={ls(150)}>
            <Text fontSize={sp(18)} color={'#333'}>
              联系电话
            </Text>
          </Row>
          <Row w={ls(140)}>
            <Text fontSize={sp(18)} color={'#333'}>
              营业时间
            </Text>
          </Row>
          <Row w={ls(150)} justifyContent={'center'}>
            <Text fontSize={sp(18)} color={'#333'}>
              操作
            </Text>
          </Row>
        </Row>
        <FlatList
          style={{
            height: '80%',
          }}
          data={shops}
          renderItem={({ item: shop, index: idx }) => {
            return (
              <Row
                background={'#fff'}
                key={idx}
                px={ls(40)}
                h={ss(60)}
                alignItems={'center'}
                width={'100%'}
                borderBottomWidth={idx === shops.length - 1 ? 0 : ss(1)}
                borderBottomColor={'#DFE1DE'}
                borderBottomStyle={'solid'}
                justifyContent={'space-around'}>
                <Row w={ls(150)}>
                  <Text fontSize={sp(18)} color={'#333'}>
                    {shop.name}
                  </Text>
                </Row>
                <Row w={ls(80)}>
                  <Text fontSize={sp(18)} color={'#333'}>
                    {shop.maintainer}
                  </Text>
                </Row>
                <Row w={ls(200)}>
                  <Text fontSize={sp(18)} color={'#333'}>
                    {shop.region}
                  </Text>
                </Row>
                <Row w={ls(140)}>
                  <Text fontSize={sp(18)} color={'#333'}>
                    {shop.address}
                  </Text>
                </Row>
                <Row w={ls(150)}>
                  <Text fontSize={sp(18)} color={'#333'}>
                    {shop.phoneNumber}
                  </Text>
                </Row>
                <Row w={ls(140)}>
                  <Text fontSize={sp(18)} color={'#333'}>
                    {shop.openingTime} - {shop.closingTime}
                  </Text>
                </Row>
                <Row w={ls(150)}>
                  <Row>
                    <Pressable
                      _pressed={{
                        opacity: 0.8,
                      }}
                      hitSlop={ss(20)}
                      onPress={() => {
                        setCurrentShop(shop);
                        navigation.navigate('ShopDetail', { type: 'detail' });
                      }}>
                      <Row alignItems={'center'}>
                        <Image
                          source={require('~/assets/images/list-detail.png')}
                          size={sp(20)}
                          alt=''
                        />
                        <Text fontSize={sp(18)} color='#40C7B6' ml={ls(10)}>
                          查看
                        </Text>
                      </Row>
                    </Pressable>
                    <Pressable
                      _pressed={{
                        opacity: 0.8,
                      }}
                      hitSlop={ss(20)}
                      ml={ls(24)}
                      onPress={() => {
                        setCurrentShop(shop);
                        navigation.navigate('ShopDetail', { type: 'edit' });
                      }}>
                      <Row alignItems={'center'}>
                        <Image
                          source={require('~/assets/images/list-edit.png')}
                          size={sp(20)}
                          alt=''
                        />
                        <Text fontSize={sp(18)} color='#40C7B6' ml={ls(10)}>
                          编辑
                        </Text>
                      </Row>
                    </Pressable>
                  </Row>
                </Row>
              </Row>
            );
          }}
        />
      </Column>
    );
  };
  return (
    <Box flex={1}>
      <NavigationBar
        onBackIntercept={() => false}
        leftElement={
          <Text color='white' fontWeight={600} fontSize={sp(20)}>
            门店管理
          </Text>
        }
        rightElement={
          <Text color={'#fff'} fontSize={sp(20)}>
            {dayjs().format('YYYY-MM-DD')}
          </Text>
        }
      />
      <Column
        safeAreaLeft
        bgColor={'#F6F6FA'}
        flex={1}
        p={ss(10)}
        safeAreaBottom>
        <Filter />
        <Box mt={ss(10)}>
          <List />
        </Box>
      </Column>
    </Box>
  );
}

function Filter() {
  const navigation = useNavigation();
  const { setCurrentShop, requestGetShops } = useManagerStore();
  return (
    <Row
      bgColor='white'
      borderRadius={ss(10)}
      justifyContent={'space-between'}
      alignItems={'center'}
      px={ls(40)}>
      <Row py={ss(20)} alignItems={'center'}>
        <Input
          autoCorrect={false}
          w={ls(240, 340)}
          h={ss(44)}
          p={ss(9)}
          placeholderTextColor={'#6E6F73'}
          borderWidth={ss(1)}
          borderColor={'#D8D8D8'}
          color={'#333333'}
          fontSize={sp(16)}
          borderRadius={ss(4)}
          InputLeftElement={
            <Icon
              as={<MaterialIcons name='search' />}
              size={sp(25)}
              color='#AFB0B4'
              ml={ss(10)}
            />
          }
          placeholder='请输入门店名称搜索'
          onChangeText={debounce((text) => {
            requestGetShops(text);
          }, 1000)}
        />
      </Row>
      <Pressable
        _pressed={{
          opacity: 0.6,
        }}
        hitSlop={ss(20)}
        onPress={() => {
          setCurrentShop(DefaultShop);
          navigation.navigate('ShopDetail', { type: 'edit' });
        }}>
        <Row
          bgColor={'#E1F6EF'}
          borderRadius={ss(4)}
          px={ls(26)}
          py={ss(10)}
          borderColor={'#15BD8F'}
          borderWidth={ss(1)}>
          <Text color={'#0C1B16'} fontSize={sp(14)}>
            新增门店
          </Text>
        </Row>
      </Pressable>
    </Row>
  );
}
