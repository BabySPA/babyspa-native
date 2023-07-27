import {
  Box,
  Center,
  Icon,
  Input,
  Text,
  useToast,
  Row,
  Pressable,
  Spinner,
} from 'native-base';
import { AuthStackScreenProps } from '../../types';
import { useState } from 'react';
import useAuthStore from '../../stores/auth';
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { ImageBackground, Image } from 'react-native';
import { ls, ss, sp } from '~/app/utils/style';

export default function LoginScreen({
  navigation,
}: AuthStackScreenProps<'Login'>) {
  const { login } = useAuthStore();
  const [username, setUsername] = useState('17666117715');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [selectAgreement, setSelectAgreement] = useState(false);
  const toast = useToast();

  const onClickLogin = async () => {
    if (username && password && selectAgreement) {
      setLoading(true);
      login(username, password)
        .then(() => {
          toast.show({
            variant: 'left-accent',
            placement: 'top',
            title: '登录成功',
            bg: 'success.500',
          });
        })
        .catch((error) => {
          toast.show({
            variant: 'left-accent',
            placement: 'top',
            title: '登录失败',
            description: '请查看用户名/密码是否正确',
            bg: 'danger.500',
          });
        })
        .finally(() => setLoading(false));
    }
  };

  return (
    <ImageBackground
      source={require('~/assets/images/login-bg.png')}
      style={{ width: '100%', height: '100%' }}
    >
      <Center safeArea flex={1}>
        <Row w={ls(956)} h={ss(584)} borderRadius={ss(20)} bgColor={'#fff'}>
          <Center w={ls(478)} bgColor={'#B6ECF0'} borderRadius={ss(20)}>
            <Image
              source={require('~/assets/images/login-left.png')}
              style={{ width: ls(413), height: ss(280) }}
              resizeMode='contain'
            />
            <Text fontSize={sp(14)} color={'#2B3033'} mt={ss(18)}>
              ZHANG YUE WEI LAI
            </Text>
            <Text fontSize={sp(10)} color={'#A3A7AA'}>
              MingChun Infant physical therapy
            </Text>
          </Center>
          <Center flex={1}>
            <Text color='#000' fontSize={sp(32)} fontWeight={500}>
              欢迎登录掌阅未来
            </Text>
            <Input
              value={username}
              onChangeText={setUsername}
              borderRadius={ss(40)}
              w={ls(360)}
              h={ss(60)}
              mt={ss(60)}
              placeholder='请输入用户名'
              fontSize={sp(20)}
              color={'#999'}
              InputLeftElement={
                <Icon
                  as={<MaterialIcons name='person' />}
                  size={sp(22)}
                  ml={ls(20)}
                  color={'#999999'}
                />
              }
            />
            <Input
              type='password'
              value={password}
              onChangeText={setPassword}
              borderRadius={ss(40)}
              w={ls(360)}
              h={ss(60)}
              mt={ss(30)}
              placeholder='请输入密码'
              fontSize={sp(20)}
              color={'#999'}
              InputLeftElement={
                <Icon
                  as={<MaterialIcons name='lock' />}
                  size={sp(22)}
                  ml={ls(20)}
                  color={'#999999'}
                />
              }
              InputRightElement={
                <Icon
                  as={<AntDesign name='eye' />}
                  size={sp(22)}
                  mr={ls(20)}
                  color={'#999999'}
                />
              }
            />
            <Pressable
              onPress={() => {
                onClickLogin();
              }}
            >
              <Row
                alignItems={'center'}
                justifyContent={'center'}
                w={ls(360)}
                h={ss(60)}
                mt={ss(50)}
                borderRadius={ss(30)}
                opacity={username && password && selectAgreement ? 1 : 0.5}
                bg={{
                  linearGradient: {
                    colors: ['#65CBEA', '#65DB63'],
                    start: [0, 0],
                    end: [1, 1],
                  },
                }}
              >
                {loading && (
                  <Spinner color='#00B49E' mr={ls(8)} size={sp(22)} />
                )}
                <Text color='#fff' fontSize={sp(22)}>
                  登录
                </Text>
              </Row>
            </Pressable>

            <Row mt={ss(20)} alignItems={'center'}>
              <Pressable
                onPress={() => {
                  setSelectAgreement(!selectAgreement);
                }}
              >
                <Row alignItems={'center'}>
                  <Icon
                    as={
                      <Ionicons
                        name={
                          selectAgreement
                            ? 'radio-button-on'
                            : 'radio-button-off'
                        }
                      />
                    }
                    size={sp(22)}
                    color={selectAgreement ? '#00B49E' : '#DBDBDB'}
                  />
                  <Text color='#999' fontSize={sp(14)} ml={ls(8)}>
                    阅读并同意
                  </Text>
                </Row>
              </Pressable>
              <Text color='#28F' fontSize={sp(14)}>
                《用户协议》
              </Text>
              <Text color='#999' fontSize={sp(14)}>
                、
              </Text>
              <Text color='#28F' fontSize={sp(14)}>
                《用户协议》
              </Text>
            </Row>
          </Center>
        </Row>
      </Center>
    </ImageBackground>
  );
}

{
  /* <Center h={'full'}>
  <Box safeArea p='2' py='8' w='90%' maxW='290'>
    <Heading
      size='lg'
      fontWeight='600'
      color='coolGray.800'
      _dark={{
        color: 'warmGray.50',
      }}>
      Welcome
    </Heading>
    <Heading
      mt='1'
      _dark={{
        color: 'warmGray.200',
      }}
      color='coolGray.600'
      fontWeight='medium'
      size='xs'>
      登录以继续
    </Heading>

   
  </Box>
</Center>; */
}
