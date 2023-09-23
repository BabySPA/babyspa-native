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
import { useEffect, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import useManagerStore, { DefaultRole } from '~/app/stores/manager';
import { useNavigation } from '@react-navigation/native';
import { Role, RoleStatus, ShopType } from '~/app/stores/manager/type';
import { debounce } from 'lodash';

export default function ManagerRole({
  navigation,
}: AppStackScreenProps<'ManagerRole'>) {
  const { roles, requestGetRoles, setCurrentRole } = useManagerStore();

  useEffect(() => {
    requestGetRoles();
  }, []);

  const [filterRoles, setFilterRoles] = useState<Role[]>([]);

  const [nameFilter, setNameFilter] = useState('');
  useEffect(() => {
    const filterRegex = new RegExp(nameFilter, 'i');
    setFilterRoles(
      roles.filter((role) => {
        // 使用正则表达式进行模糊匹配
        return filterRegex.test(role.name);
      }),
    );
  }, [roles, nameFilter]);

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
          <Row w={ls(120)}>
            <Text fontSize={sp(18)} color={'#333'}>
              角色名称
            </Text>
          </Row>
          <Row w={ls(230)}>
            <Text fontSize={sp(18)} color={'#333'}>
              角色说明
            </Text>
          </Row>
          <Row w={ls(80)}>
            <Text fontSize={sp(18)} color={'#333'}>
              状态
            </Text>
          </Row>
          <Row w={ls(80)}>
            <Text fontSize={sp(18)} color={'#333'}>
              角色类型
            </Text>
          </Row>
          <Row w={ls(230)}>
            <Text fontSize={sp(18)} color={'#333'}>
              更新时间
            </Text>
          </Row>
          <Row w={ls(150)} justifyContent={'center'}>
            <Text fontSize={sp(18)} color={'#333'}>
              操作
            </Text>
          </Row>
        </Row>
        <FlatList
          mb={safeAreaProps ? ss(64) : 0}
          background={'#fff'}
          data={filterRoles}
          renderItem={({ item: role, index }) => {
            return (
              <Row
                px={ls(40)}
                minH={ss(60)}
                py={ss(10)}
                alignItems={'center'}
                width={'100%'}
                borderBottomWidth={index === filterRoles.length - 1 ? 0 : ss(1)}
                borderBottomColor={'#DFE1DE'}
                borderBottomStyle={'solid'}
                justifyContent={'space-around'}>
                <Row w={ls(120)}>
                  <Text fontSize={sp(18)} color={'#333'}>
                    {role.name}
                  </Text>
                </Row>
                <Row w={ls(230)}>
                  <Text fontSize={sp(18)} color={'#333'}>
                    {role.description}
                  </Text>
                </Row>
                <Row w={ls(80)}>
                  <Text fontSize={sp(18)} color={'#333'}>
                    {role.status == RoleStatus.OPEN ? '启用' : '禁用'}
                  </Text>
                </Row>
                <Row w={ls(80)}>
                  <Text fontSize={sp(18)} color={'#333'}>
                    {role.type == ShopType.CENTER ? '中心' : '门店'}
                  </Text>
                </Row>
                <Row w={ls(230)}>
                  <Text fontSize={sp(18)} color={'#333'}>
                    {dayjs(role.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
                  </Text>
                </Row>
                <Row w={ls(150)}>
                  <Row>
                    <Pressable
                      _pressed={{
                        opacity: 0.6,
                      }}
                      hitSlop={ss(20)}
                      onPress={() => {
                        setCurrentRole(role);
                        navigation.navigate('RoleDetail', { type: 'detail' });
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
                        opacity: 0.6,
                      }}
                      hitSlop={ss(20)}
                      ml={ls(24)}
                      onPress={() => {
                        setCurrentRole(role);
                        navigation.navigate('RoleDetail', { type: 'edit' });
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
          keyExtractor={(item) => item.roleKey}
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
            角色管理
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
        <Box mt={ss(10)} flex={1}>
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
  const { setCurrentRole } = useManagerStore();

  return (
    <Row
      bgColor='white'
      borderRadius={ss(10)}
      justifyContent={'space-between'}
      alignItems={'center'}
      px={ls(40)}>
      <Row py={ss(20)} alignItems={'center'}>
        <Input
          w={ls(240, 340)}
          h={ss(44)}
          p={ss(9)}
          mr={ss(40)}
          borderWidth={ss(1)}
          borderColor={'#D8D8D8'}
          placeholderTextColor={'#6E6F73'}
          color={'#333333'}
          borderRadius={ss(4)}
          fontSize={sp(16)}
          InputLeftElement={
            <Icon
              as={<MaterialIcons name='search' />}
              size={sp(25)}
              color='#AFB0B4'
              ml={ss(10)}
            />
          }
          placeholder='请输入角色名称搜索'
          onChangeText={debounce((text) => {
            onSearchChangeText(text);
          }, 1000)}
        />
      </Row>
      <Pressable
        _pressed={{
          opacity: 0.6,
        }}
        hitSlop={ss(20)}
        onPress={() => {
          setCurrentRole(DefaultRole);
          navigation.navigate('RoleDetail', { type: 'edit' });
        }}>
        <Row
          bgColor={'#E1F6EF'}
          borderRadius={ss(4)}
          px={ls(26)}
          py={ss(10)}
          borderColor={'#15BD8F'}
          borderWidth={ss(1)}>
          <Text color={'#0C1B16'} fontSize={sp(14)}>
            新增角色
          </Text>
        </Row>
      </Pressable>
    </Row>
  );
}
