import {
  Box,
  Center,
  Flex,
  Text,
  Pressable,
  Row,
  useToast,
  Alert,
  Circle,
} from 'native-base';
import { ls, sp, ss } from '~/app/utils/style';
import { Image } from 'react-native';
import useLayoutConfigWithRole from '~/app/stores/layout';
import useAuthStore from '~/app/stores/auth';
import SelectUser from '~/app/components/select-user';
import { useNavigation } from '@react-navigation/native';
import useGlobalLoading from '~/app/stores/loading';
import { useState } from 'react';
import { Drawer } from 'react-native-drawer-layout';
import MessageDrawer from './message-drawer';
import useMessageStore from '~/app/stores/message';

const Layout = () => {
  const {
    currentSelected,
    getLayoutConfig,
    changeCurrentSelected,
    changeFeatureSelected,
  } = useLayoutConfigWithRole();

  const [open, setOpen] = useState(false);
  const navigation = useNavigation();
  const { user, currentShopWithRole, changeCurrentShopWithRole } =
    useAuthStore();

  const currentSelectedModule = getLayoutConfig()[currentSelected];

  const { unReadCount } = useMessageStore();

  const Fragment = () => {
    return (
      currentSelectedModule.features[
        currentSelectedModule.featureSelected
      ].fragment?.() ?? null
    );
  };

  const NoTabFragment = () => {
    return currentSelectedModule.fragment
      ? currentSelectedModule.fragment()
      : null;
  };

  const { openLoading, closeLoading } = useGlobalLoading();
  const toast = useToast();

  return (
    <Drawer
      drawerPosition={'right'}
      open={open}
      drawerType={'front'}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      drawerStyle={{
        width: ss(375),
      }}
      renderDrawerContent={() => {
        return <MessageDrawer />;
      }}>
      <Flex
        bg={{
          linearGradient: {
            colors: ['#22D59C', '#1AB7BE'],
            start: [0, 0],
            end: [1, 1],
          },
        }}
        flex={1}
        direction='row'>
        <Box>
          <Center pt={ss(30)} px={ss(20)} minH={ss(120)} safeAreaLeft>
            <Image
              source={require('~/assets/images/logo.png')}
              style={{
                width: ss(63),
                height: ss(63),
              }}
            />
            <Text
              fontSize={sp(20)}
              color={'white'}
              mt={ss(5)}
              fontWeight={600}
              textAlign={'center'}>
              掌阅未来
            </Text>
          </Center>
          <Box mt={ss(30, 20)}>
            {getLayoutConfig().map((item, idx) => {
              return (
                <Pressable
                  _pressed={{
                    opacity: idx != currentSelected ? 0.6 : 1,
                  }}
                  hitSlop={ss(20)}
                  key={idx}
                  onPress={() => {
                    idx != currentSelected && changeCurrentSelected(idx);
                  }}>
                  <Center
                    safeAreaLeft
                    px={ss(20)}
                    background={
                      idx == currentSelected ? 'warmGray.50' : 'transparent'
                    }
                    py={ss(16, 10)}>
                    <Image
                      source={
                        idx == currentSelected ? item.selectedImage : item.image
                      }
                      style={{ width: ss(44), height: ss(44) }}
                      resizeMode='contain'
                      alt=''
                    />
                    <Text
                      fontSize={sp(18)}
                      color={
                        idx == currentSelected ? '#64CF97' : 'warmGray.50'
                      }>
                      {item.text}
                    </Text>
                  </Center>
                </Pressable>
              );
            })}
          </Box>

          <Center
            safeAreaLeft
            px={ls(6)}
            w={'100%'}
            position={'absolute'}
            bottom={ss(60, 16)}>
            <Pressable
              _pressed={{
                opacity: 0.6,
              }}
              hitSlop={ss(20)}
              alignItems={'center'}
              onPress={() => {
                // 跳转到个人中心
                navigation.navigate('Personal');
              }}>
              <Center
                borderRadius={ss(23, 22)}
                borderWidth={ss(3)}
                borderColor={'#fff'}
                w={ss(46, 44)}
                h={ss(46, 44)}
                bgColor={'#F7CE51'}>
                <Text fontSize={sp(16, 16)} color='#fff'>
                  {user?.name?.[0]}
                </Text>
              </Center>
              <Row flexWrap={'wrap'} justifyContent={'center'} mt={ss(4, 2)}>
                <Text fontSize={sp(14, 15)} color='#fff'>
                  {user?.name}
                </Text>
                <Text fontSize={sp(14, 15)} color='#fff'>
                  -
                </Text>
                <Text fontSize={sp(14, 15)} color='#fff'>
                  {currentShopWithRole?.role.name}
                </Text>
              </Row>
            </Pressable>
            <SelectUser
              textStyle={{
                fontSize: sp(14, 15),
              }}
              onSelect={async function (selectedItem: any) {
                openLoading();
                changeCurrentShopWithRole(selectedItem)
                  .then(() => {})
                  .finally(() => {
                    setTimeout(() => {
                      toast.show({
                        placement: 'top',
                        duration: 1000,
                        render: () => {
                          return (
                            <Alert w='100%' bgColor={'rgba(244,244,244,1)'}>
                              <Box>
                                <Text color={'#333'}>
                                  已切换至
                                  <Text color={'#00B49E'}>
                                    {selectedItem.shop.name}
                                  </Text>
                                </Text>
                              </Box>
                            </Alert>
                          );
                        },
                      });
                      closeLoading();
                    }, 600);
                  });
              }}
            />
          </Center>
        </Box>
        <Flex direction='column' flex={1} safeAreaTop>
          <Flex
            direction='row'
            justifyContent={'center'}
            py={ss(22, 18)}
            alignItems={'center'}>
            {!currentSelectedModule?.noTab &&
              currentSelectedModule?.features.map((item, idx) => {
                return (
                  <Pressable
                    _pressed={{
                      opacity:
                        idx != currentSelectedModule.featureSelected ? 0.6 : 1,
                    }}
                    hitSlop={ss(20)}
                    key={idx}
                    paddingRight={'8%'}
                    onPress={() => {
                      currentSelectedModule.featureSelected !== idx &&
                        changeFeatureSelected(idx);
                    }}>
                    <Center>
                      <Text color={'white'} fontSize={sp(20)} fontWeight={600}>
                        {item.text}
                      </Text>
                      <Box
                        w={ss(40)}
                        h={ss(4)}
                        bgColor={'white'}
                        mt={ss(5)}
                        opacity={
                          currentSelectedModule.featureSelected == idx ? 1 : 0
                        }
                      />
                    </Center>
                  </Pressable>
                );
              })}
            <Pressable
              _pressed={{
                opacity: 0.8,
              }}
              onPress={() => {
                setOpen(true);
              }}
              hitSlop={ss(20)}
              position={'absolute'}
              right={ss(20, 50)}>
              <Image
                source={require('~/assets/images/msg-notice.png')}
                style={{ width: sp(32), height: sp(32) }}
              />
              {unReadCount > 0 && (
                <Circle
                  size={sp(6)}
                  bgColor={'#E24A3D'}
                  position={'absolute'}
                  top={0}
                  right={ss(3)}
                />
              )}
            </Pressable>
          </Flex>
          <Flex bgColor={'#E6EEF1'} flex={1} borderTopLeftRadius={ss(10)}>
            {currentSelectedModule.noTab ? <NoTabFragment /> : <Fragment />}
          </Flex>
        </Flex>
      </Flex>
    </Drawer>
  );
};

export default Layout;
