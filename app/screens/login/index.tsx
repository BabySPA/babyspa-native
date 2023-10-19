import {
  Box,
  Center,
  Icon,
  Input,
  Text,
  Row,
  Pressable,
  Spinner,
  FlatList,
} from 'native-base';
import { useToast } from 'react-native-toast-notifications';
import { AuthStackScreenProps } from '../../types';
import { useState } from 'react';
import useAuthStore from '../../stores/auth';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { ImageBackground, Image, Linking } from 'react-native';
import { ls, ss, sp } from '~/app/utils/style';
import { ShopsWithRole } from '~/app/stores/auth/type';
import { toastAlert } from '~/app/utils/toast';

export default function LoginScreen({
  navigation,
}: AuthStackScreenProps<'Login'>) {
  const login = useAuthStore((state) => state.login);
  const selectLoginShop = useAuthStore((state) => state.selectLoginShop);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectAgreement, setSelectAgreement] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [chooseShops, setChooseShops] = useState<ShopsWithRole[]>([]); // 选择门店
  const [selectShopIdx, setSelectShopIdx] = useState(0); // 选择门店
  const toast = useToast();

  const [loginUser, setLoginUser] = useState({
    user: {},
    accessToken: '',
  });

  const onClickLogin = async () => {
    if (username && password && selectAgreement) {
      setLoading(true);
      login(username, password)
        .then(({ shouldChooseShops, accessToken, user }) => {
          if (shouldChooseShops) {
            // 选择门店
            setLoading(false);
            setChooseShops(user.shopsWithRole);
            setLoginUser({
              user,
              accessToken,
            });
          } else {
            setLoading(false);
            toastAlert(toast, 'success', '登录成功');
          }
        })
        .catch(() => {
          setLoading(false);
          toastAlert(toast, 'error', '登录失败，请查看用户名/密码是否正确');
        });
    }
  };

  const selectShop = () => {
    setLoading(true);
    const currentShopWithRole = chooseShops[selectShopIdx];

    setTimeout(() => {
      setLoading(false);
      toastAlert(toast, 'success', '登录成功');
      selectLoginShop({
        ...loginUser,
        currentShopWithRole: currentShopWithRole,
      });
    }, 300);
  };

  const ChooseShop = () => {
    return (
      <Center flex={1}>
        <Text color='#000' fontSize={sp(32)} fontWeight={500} mb={ss(10)}>
          请选择登录门店
        </Text>
        <FlatList
          maxH={ss(220)}
          data={chooseShops}
          keyExtractor={(item, index) => {
            return item.shop._id as string;
          }}
          renderItem={({ item, index }) => {
            return (
              <Pressable
                _pressed={{
                  opacity: 0.6,
                }}
                onPress={() => {
                  setSelectShopIdx(index);
                }}
                w={ls(360)}
                h={ss(80)}
                alignItems={'center'}
                justifyContent={'center'}
                borderRadius={ss(4)}
                borderWidth={ss(1)}
                mt={ss(20)}
                borderColor={selectShopIdx == index ? '#00B49E' : '#D8D8D8'}>
                <Text
                  color={selectShopIdx == index ? '#00B49E' : '#999'}
                  fontSize={sp(24)}>
                  {item.shop.name}
                </Text>
                {selectShopIdx === index && (
                  <Image
                    style={{
                      position: 'absolute',
                      bottom: ss(0),
                      right: 0,
                      width: ss(20),
                      height: ss(20),
                    }}
                    source={require('~/assets/images/border-select.png')}
                  />
                )}
              </Pressable>
            );
          }}
        />
        <Pressable
          _pressed={{
            opacity: 0.8,
          }}
          hitSlop={ss(20)}
          onPress={() => {
            selectShop();
          }}>
          <Row
            alignItems={'center'}
            justifyContent={'center'}
            w={ls(360)}
            h={ss(60)}
            mt={ss(50)}
            borderRadius={ss(30)}
            bg={{
              linearGradient: {
                colors: ['#65CBEA', '#65DB63'],
                start: [0, 0],
                end: [1, 1],
              },
            }}>
            {loading && <Spinner color='#00B49E' mr={ls(8)} size={sp(22)} />}
            <Text color='#fff' fontSize={sp(22)}>
              确定
            </Text>
          </Row>
        </Pressable>
      </Center>
    );
  };

  return (
    <ImageBackground
      source={require('~/assets/images/login-bg.png')}
      style={{ width: '100%', height: '100%' }}>
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
          {chooseShops.length > 0 ? (
            <ChooseShop />
          ) : (
            <Center flex={1}>
              <Text color='#000' fontSize={sp(32)} fontWeight={500}>
                欢迎登录掌阅未来
              </Text>

              <Input
                value={username}
                onChangeText={setUsername}
                borderRadius={ss(40)}
                w={ls(360)}
                py={0}
                h={ss(60)}
                mt={ss(60)}
                placeholder='请输入用户名'
                inputMode='numeric'
                fontSize={sp(20)}
                color={'#999'}
                borderWidth={ss(1)}
                borderColor={'#D8D8D8'}
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
                autoCorrect={false}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChangeText={setPassword}
                borderRadius={ss(40)}
                w={ls(360)}
                h={ss(60)}
                mt={ss(30)}
                borderWidth={ss(1)}
                borderColor={'#D8D8D8'}
                placeholder='请输入密码'
                inputMode='numeric'
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
                  <Pressable
                    _pressed={{
                      opacity: 0.8,
                    }}
                    hitSlop={ss(20)}
                    mr={ls(20)}
                    onPress={() => {
                      setShowPassword(!showPassword);
                    }}>
                    <Icon
                      as={
                        <Ionicons
                          name={
                            showPassword
                              ? 'md-eye-outline'
                              : 'md-eye-off-outline'
                          }
                        />
                      }
                      size={sp(22)}
                      color={'#999999'}
                    />
                  </Pressable>
                }
              />
              <Pressable
                _pressed={{
                  opacity: 0.6,
                }}
                onPress={() => {
                  onClickLogin();
                }}>
                <Row
                  alignItems={'center'}
                  justifyContent={'center'}
                  w={ls(360)}
                  h={ss(60)}
                  mt={ss(50, 40)}
                  borderRadius={ss(30)}
                  opacity={username && password && selectAgreement ? 1 : 0.5}
                  bg={{
                    linearGradient: {
                      colors: ['#65CBEA', '#65DB63'],
                      start: [0, 0],
                      end: [1, 1],
                    },
                  }}>
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
                  hitSlop={ss(10)}
                  onPress={() => {
                    setSelectAgreement(!selectAgreement);
                  }}>
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
                <Pressable
                  flexDirection={'row'}
                  onPress={() => {
                    Linking.openURL('https://mcbabyspa.com/privacy');
                    setSelectAgreement(true);
                  }}>
                  <Text color='#28F' fontSize={sp(14)}>
                    《用户协议》
                  </Text>
                  <Text color='#999' fontSize={sp(14)}>
                    、
                  </Text>
                  <Text color='#28F' fontSize={sp(14)}>
                    《隐私政策》
                  </Text>
                </Pressable>
              </Row>
            </Center>
          )}
        </Row>
      </Center>
    </ImageBackground>
  );
}
