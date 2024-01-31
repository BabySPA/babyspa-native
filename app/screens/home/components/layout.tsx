import { Box, Center, Flex, Text, Pressable, Row, Circle } from 'native-base';
import { useToast } from 'react-native-toast-notifications';
import { ls, sp, ss } from '~/app/utils/style';
import { Image } from 'react-native';
import useLayoutConfigWithRole from '~/app/stores/layout';
import useAuthStore from '~/app/stores/auth';
import SelectUser from '~/app/components/select-user';
import { useNavigation } from '@react-navigation/native';
import useGlobalLoading from '~/app/stores/loading';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MessageDrawer from './message-drawer';
import useMessageStore from '~/app/stores/message';
import { memo, useEffect, useState } from 'react';
import Environment from '~/app/config/environment';
import { useMount, useSetState } from 'ahooks';
import { ILayoutConfig } from '~/app/stores/layout/type';

import Register from '../../home/fragments/register';
import Collection from '../../home/fragments/collection';
import Analyze from '../../home/fragments/analyze';
import Evaluate from '../../home/fragments/evaluate';
import FollowUpVisit from '../../home/fragments/follow-up-visit';
import Archive from '../../home/fragments/archive';
import ShopCenter from '../../home/fragments/shop-center';
import StatisticsVisit from '../../home/fragments/statistics-visit';
import StatisticsShop from '../../home/fragments/statistics-shop';
import StatisticsMassage from '../../home/fragments/statistics-massage';
import StatisticsAnalyze from '../../home/fragments/statistics-analyze';
import { RoleAuthority } from '~/app/stores/auth/type';

// const Drawer = createDrawerNavigator();

// function DrawerLayout() {
//   return (
//     <Drawer.Navigator
//       drawerContent={() => <MessageDrawer />}
//       screenOptions={{ drawerPosition: 'right', headerShown: false }}>
//       <Drawer.Screen name='content' component={Layout} />
//     </Drawer.Navigator>
//   );
// }
// export default DrawerLayout;

const MessageNotify = memo(() => {
  const unReadCount = useMessageStore((state) => state.unReadCount);
  const requestMessages = useMessageStore((state) => state.requestMessages);
  const navigation = useNavigation();
  return (
    <Pressable
      _pressed={{
        opacity: 0.8,
      }}
      onPress={() => {
        requestMessages();
        // @ts-ignore
        navigation.openDrawer();
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
  );
});

const Layout = memo(() => {
  const {
    featureSelected,
    currentSelected,
    getLayoutConfig,
    changeCurrentSelected,
    changeFeatureSelected,
  } = useLayoutConfigWithRole();

  const navigation = useNavigation();

  const user = useAuthStore((state) => state.user);
  const currentShopWithRole = useAuthStore(
    (state) => state.currentShopWithRole,
  );
  const changeCurrentShopWithRole = useAuthStore(
    (state) => state.changeCurrentShopWithRole,
  );

  const [currentSelectedModule, setCurrentSelectedModule] =
    useState<ILayoutConfig>({
      image: require('~/assets/images/logo.png'),
      selectedImage: require('~/assets/images/logo.png'),
      text: 'inital',
      noTab: false,
      features: [],
    });

  const [currentAuth, setCurrentAuth] = useState<RoleAuthority>();

  useEffect(() => {
    setCurrentAuth(currentSelectedModule.features[featureSelected]?.auth);
  }, [currentSelectedModule, featureSelected]);

  useEffect(() => {
    setCurrentSelectedModule(getLayoutConfig()[currentSelected]);
  }, [currentSelected]);

  const renderContent = () => {
    if (currentSelectedModule.noTab) {
      return <ShopCenter />;
    } else {
      const auth = currentAuth;
      switch (auth) {
        case RoleAuthority.FLOW_REGISTER:
          return <Register />;
        case RoleAuthority.FLOW_COLLECTION:
          return <Collection />;
        case RoleAuthority.FLOW_ANALYZE:
          return <Analyze />;
        case RoleAuthority.FLOW_EVALUATE:
          return <Evaluate />;
        case RoleAuthority.CUSTOMER_ARCHIVE:
          return <Archive />;
        case RoleAuthority.CUSTOMER_FOLLOWUP:
          return <FollowUpVisit />;
        case RoleAuthority.STATISTIC_ANALYZE:
          return <StatisticsAnalyze />;
        case RoleAuthority.STATISTIC_FOLLOWUP:
          return <StatisticsVisit />;
        case RoleAuthority.STATISTIC_MASSAGE:
          return <StatisticsMassage />;
        case RoleAuthority.STATISTIC_SHOP:
          return <StatisticsShop />;
      }
    }
  };

  const { openLoading, closeLoading } = useGlobalLoading();
  const toast = useToast();

  return (
    <>
      {currentSelectedModule.text !== 'inital' && (
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
                手策
              </Text>
              <Text color={'#fff'} fontSize={sp(10)}>
                v{Environment.version}
              </Text>
            </Center>
            <Box mt={ss(30, 20)}>
              {getLayoutConfig().map((item, idx) => {
                return (
                  <Pressable
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
                          idx == currentSelected
                            ? item.selectedImage
                            : item.image
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
                      toast.show(`正在切换至${selectedItem.shop.name}`, {
                        duration: 3000,
                      });
                      setTimeout(() => {
                        closeLoading();
                      }, 1500);
                    });
                }}
              />
            </Center>
          </Box>
          <Flex direction='column' flex={1} safeAreaTop>
            <Flex
              direction='row'
              justifyContent={'center'}
              py={ss(22)}
              alignItems={'center'}>
              {!currentSelectedModule?.noTab &&
                currentSelectedModule?.features.map((item, idx) => {
                  return (
                    <Pressable
                      hitSlop={ss(20)}
                      key={idx}
                      paddingRight={'8%'}
                      onPress={() => {
                        if (featureSelected !== idx) {
                          changeFeatureSelected(idx);
                        }
                      }}>
                      <Center>
                        <Text
                          color={'white'}
                          fontSize={sp(20)}
                          fontWeight={600}>
                          {item.text}
                        </Text>
                        <Box
                          w={ss(40)}
                          h={ss(4)}
                          bgColor={'white'}
                          mt={ss(5)}
                          opacity={featureSelected == idx ? 1 : 0}
                        />
                      </Center>
                    </Pressable>
                  );
                })}
              {/* <MessageNotify /> */}
            </Flex>
            <Flex bgColor={'#E6EEF1'} flex={1} borderTopLeftRadius={ss(10)}>
              {renderContent()}
            </Flex>
          </Flex>
        </Flex>
      )}
    </>
  );
});

export default Layout;
