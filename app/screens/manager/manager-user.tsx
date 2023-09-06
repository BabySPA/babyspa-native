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
} from 'native-base';
import NavigationBar from '~/app/components/navigation-bar';
import { sp, ss, ls } from '~/app/utils/style';
import { AppStackScreenProps, Gender } from '~/app/types';
import { useEffect, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import useManagerStore, { DefaultUser } from '~/app/stores/manager';
import { Shop, ShopType, User } from '~/app/stores/manager/type';
import { useNavigation } from '@react-navigation/native';
import { debounce, throttle } from 'lodash';
import useAuthStore from '~/app/stores/auth';
import SelectShop, { useSelectShops } from '~/app/components/select-shop';

export default function ManagerUser({
  navigation,
}: AppStackScreenProps<'ManagerUser'>) {
  const { users, setCurrentUser } = useManagerStore();

  const [filterUsers, setFilterUsers] = useState<User[]>([]);
  const [nameFilter, setNameFilter] = useState('');
  useEffect(() => {
    const filterRegex = new RegExp(nameFilter, 'i');
    setFilterUsers(
      users.filter((user) => {
        // 使用正则表达式进行模糊匹配
        return filterRegex.test(user.name);
      }),
    );
  }, [users, nameFilter]);

  const List = () => {
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
              员工姓名
            </Text>
          </Row>
          <Row w={ls(90)}>
            <Text fontSize={sp(18)} color={'#333'}>
              性别
            </Text>
          </Row>
          <Row w={ls(140)}>
            <Text fontSize={sp(18)} color={'#333'}>
              角色
            </Text>
          </Row>
          <Row w={ls(140)}>
            <Text fontSize={sp(18)} color={'#333'}>
              账号
            </Text>
          </Row>
          <Row w={ls(140)}>
            <Text fontSize={sp(18)} color={'#333'}>
              联系电话
            </Text>
          </Row>
          <Row w={ls(140)}>
            <Text fontSize={sp(18)} color={'#333'}>
              身份证号
            </Text>
          </Row>
          <Row w={ls(150)} justifyContent={'center'}>
            <Text fontSize={sp(18)} color={'#333'}>
              操作
            </Text>
          </Row>
        </Row>
        {filterUsers.map((user, idx) => {
          return (
            <Row
              key={idx}
              px={ls(40)}
              h={ss(60)}
              alignItems={'center'}
              borderTopRadius={ss(10)}
              width={'100%'}
              borderBottomWidth={1}
              borderBottomColor={'#DFE1DE'}
              borderBottomStyle={'solid'}
              justifyContent={'space-around'}>
              <Row w={ls(150)}>
                <Text fontSize={sp(18)} color={'#333'}>
                  {user.name}
                </Text>
              </Row>
              <Row w={ls(90)}>
                <Text fontSize={sp(18)} color={'#333'}>
                  {user.gender == Gender.MAN ? '男' : '女'}
                </Text>
              </Row>
              <Row w={ls(140)}>
                <Text fontSize={sp(18)} color={'#333'}>
                  {user.role?.name}
                </Text>
              </Row>
              <Row w={ls(140)}>
                <Text fontSize={sp(18)} color={'#333'}>
                  {user.username}
                </Text>
              </Row>
              <Row w={ls(140)}>
                <Text fontSize={sp(18)} color={'#333'}>
                  {user.phoneNumber}
                </Text>
              </Row>
              <Row w={ls(140)}>
                <Text fontSize={sp(18)} color={'#333'}>
                  {user.idCardNumber}
                </Text>
              </Row>
              <Row w={ls(150)}>
                <Row>
                  <Pressable
                    hitSlop={ss(10)}
                    onPress={() => {
                      setCurrentUser(user);
                      navigation.navigate('UserDetail', { type: 'detail' });
                    }}>
                    <Row alignItems={'center'}>
                      <Image
                        source={require('~/assets/images/list-detail.png')}
                        size={ss(20)}
                        alt=''
                      />
                      <Text fontSize={sp(18)} color='#40C7B6' ml={ls(10)}>
                        查看
                      </Text>
                    </Row>
                  </Pressable>
                  <Pressable
                    hitSlop={ss(10)}
                    ml={ls(24)}
                    onPress={() => {
                      setCurrentUser(user);
                      navigation.navigate('UserDetail', { type: 'edit' });
                    }}>
                    <Row alignItems={'center'}>
                      <Image
                        source={require('~/assets/images/list-edit.png')}
                        size={ss(20)}
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
        })}
      </Column>
    );
  };

  return (
    <Box flex={1}>
      <NavigationBar
        onBackIntercept={() => false}
        leftElement={
          <Text color='white' fontWeight={600} fontSize={sp(20, { min: 14 })}>
            员工管理
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
        <Filter
          onSearchChangeText={(text) => {
            setNameFilter(text);
          }}
        />
        <Box mt={ss(10)}>
          <List />
        </Box>
      </Column>
    </Box>
  );
}

function Filter({
  onSearchChangeText,
}: {
  onSearchChangeText: (text: string) => void;
}) {
  const navigation = useNavigation();
  const { setCurrentUser, requestGetUsers, userFilter, setUserFilter } =
    useManagerStore();

  const [defaultShop, selectShops] = useSelectShops(false);

  useEffect(() => {
    setUserFilter({
      ...userFilter,
      shop: {
        id: defaultShop?._id as string,
        name: defaultShop?.name as string,
      },
    }).then(() => {
      requestGetUsers();
    });
  }, [defaultShop]);

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
          w={ls(240)}
          minH={ss(40, { max: 18 })}
          p={ss(8)}
          mr={ss(40)}
          placeholderTextColor={'#6E6F73'}
          color={'#333333'}
          fontSize={ss(16)}
          borderRadius={4}
          InputLeftElement={
            <Icon
              as={<MaterialIcons name='search' />}
              size={ss(25)}
              color='#AFB0B4'
              ml={ss(10)}
            />
          }
          placeholder='请输入员工名称搜索'
          onChangeText={debounce((text) => {
            onSearchChangeText(text);
          }, 1000)}
        />
        <SelectShop
          onSelect={throttle(function (selectedItem: any, index: number): void {
            setUserFilter({
              ...userFilter,
              shop: {
                id: selectedItem._id as string,
                name: selectedItem.name,
              },
            }).then(() => {
              requestGetUsers();
            });
          }, 1000)}
          defaultButtonText={userFilter.shop.name}
          buttonHeight={ss(40)}
          buttonWidth={ls(140)}
          shops={selectShops}
        />
      </Row>
      <Pressable
        hitSlop={ss(10)}
        onPress={() => {
          setCurrentUser(DefaultUser);
          navigation.navigate('UserDetail', { type: 'edit' });
        }}>
        <Row
          bgColor={'#E1F6EF'}
          borderRadius={4}
          px={ls(26)}
          py={ss(10)}
          borderColor={'#15BD8F'}
          borderWidth={1}>
          <Text color={'#0C1B16'} fontSize={sp(14, { min: 12 })}>
            新增员工
          </Text>
        </Row>
      </Pressable>
    </Row>
  );
}
