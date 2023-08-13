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
import useManagerStore, {
  DefaultRole,
  DefaultUser,
} from '~/app/stores/manager';
import SelectShop from '~/app/components/select-shop';
import { useNavigation } from '@react-navigation/native';
import { RoleStatus } from '~/app/stores/manager/type';

export default function ManagerRole({
  navigation,
}: AppStackScreenProps<'ManagerRole'>) {
  const { roles, requestGetRoles, setCurrentRole } = useManagerStore();

  useEffect(() => {
    requestGetRoles();
  }, []);

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
          <Row w={ls(100)}>
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
          <Row w={ls(200)}>
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
        {roles.map((role, idx) => {
          return (
            <Row
              key={idx}
              px={ls(40)}
              minH={ss(60)}
              py={ss(10)}
              alignItems={'center'}
              borderTopRadius={ss(10)}
              width={'100%'}
              borderBottomWidth={1}
              borderBottomColor={'#DFE1DE'}
              borderBottomStyle={'solid'}
              justifyContent={'space-around'}>
              <Row w={ls(100)}>
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
              <Row w={ls(200)}>
                <Text fontSize={sp(18)} color={'#333'}>
                  {dayjs(role.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
                </Text>
              </Row>
              <Row w={ls(150)}>
                <Row>
                  <Pressable
                    onPress={() => {
                      setCurrentRole(role);
                      navigation.navigate('RoleDetail', { type: 'detail' });
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
                    ml={ls(24)}
                    onPress={() => {
                      setCurrentRole(role);
                      navigation.navigate('RoleDetail', { type: 'edit' });
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
  const {
    setCurrentRole,
    // userFilter,
    // setUserFilter,
  } = useManagerStore();

  return (
    <Row
      bgColor='white'
      borderRadius={ss(10)}
      justifyContent={'space-between'}
      alignItems={'center'}
      px={ls(40)}>
      <Row py={ss(20)} alignItems={'center'}>
        <Input
          w={ls(240)}
          minH={ss(40, { max: 18 })}
          p={ss(8)}
          mr={ss(40)}
          placeholderTextColor={'#6E6F73'}
          color={'#333333'}
          fontSize={ss(16)}
          InputLeftElement={
            <Icon
              as={<MaterialIcons name='search' />}
              size={ss(25)}
              color='#AFB0B4'
              ml={ss(10)}
            />
          }
          placeholder='请输入角色名称搜索'
          onChangeText={(text) => {}}
        />
      </Row>
      <Pressable
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
          borderWidth={1}>
          <Text color={'#0C1B16'} fontSize={sp(14, { min: 12 })}>
            新增角色
          </Text>
        </Row>
      </Pressable>
    </Row>
  );
}
