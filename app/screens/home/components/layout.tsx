import {
  Box,
  Center,
  Flex,
  Text,
  Pressable,
  Icon,
  Row,
  Modal,
  Spinner,
  useToast,
  Alert,
} from 'native-base';
import { ls, sp, ss } from '~/app/utils/style';
import { Image } from 'react-native';
import useLayoutConfigWithRole from '~/app/stores/layout';
import useAuthStore from '~/app/stores/auth';
import SelectUser from '~/app/components/select-user';
import { useNavigation } from '@react-navigation/native';
import useGlobalLoading from '~/app/stores/loading';

export default function Layout() {
  const {
    currentSelected,
    getLayoutConfig,
    changeCurrentSelected,
    changeFeatureSelected,
  } = useLayoutConfigWithRole();

  const navigation = useNavigation();
  const { logout, user, currentShopWithRole, changeCurrentShopWithRole } =
    useAuthStore();

  const currentSelectedModule = getLayoutConfig()[currentSelected];

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
    <Flex
      bg={{
        linearGradient: {
          colors: ['#22D59C', '#1AB7BE'],
          start: [0, 0],
          end: [1, 1],
        },
      }}
      flex={1}
      direction='row'
    >
      <Box>
        <Center
          pt={ss(30)}
          px={ss(20)}
          minW={ss(120)}
          minH={ss(120)}
          safeAreaLeft
        >
          <Image
            source={require('~/assets/images/logo.png')}
            style={{
              width: ss(63),
              height: ss(63),
            }}
          />
          <Text
            fontSize={ls(20)}
            color={'white'}
            mt={ss(5)}
            fontWeight={600}
            textAlign={'center'}
          >
            掌阅未来
          </Text>
        </Center>
        <Box mt={ss(30)}>
          {getLayoutConfig().map((item, idx) => {
            return (
              <Pressable
                hitSlop={ss(10)}
                key={idx}
                onPress={() => {
                  changeCurrentSelected(idx);
                }}
              >
                <Center
                  safeAreaLeft
                  background={
                    idx == currentSelected ? 'warmGray.50' : 'transparent'
                  }
                  py={ss(16)}
                >
                  <Image
                    source={
                      idx == currentSelected ? item.selectedImage : item.image
                    }
                    style={{ width: ss(44), height: ss(44) }}
                    resizeMode='contain'
                    alt=''
                  />
                  <Text
                    fontSize={ls(18)}
                    color={idx == currentSelected ? '#64CF97' : 'warmGray.50'}
                  >
                    {item.text}
                  </Text>
                </Center>
              </Pressable>
            );
          })}
        </Box>

        <Center
          px={ls(6)}
          maxW={ls(130)}
          w={'100%'}
          position={'absolute'}
          bottom={ss(60)}
        >
          <Pressable
            hitSlop={ss(10)}
            alignItems={'center'}
            onPress={() => {
              // 跳转到个人中心
              navigation.navigate('Personal');
            }}
          >
            <Center
              borderRadius={ss(23)}
              borderWidth={ss(3)}
              borderColor={'#fff'}
              w={ss(46)}
              h={ss(46)}
              bgColor={'#F7CE51'}
            >
              <Text fontSize={sp(16)} color='#fff'>
                {user?.name?.[0]}
              </Text>
            </Center>
            <Row flexWrap={'wrap'} justifyContent={'center'} mt={ss(4)}>
              <Text fontSize={sp(14)} color='#fff'>
                {user?.name}
              </Text>
              <Text fontSize={sp(14)} color='#fff'>
                -
              </Text>
              <Text fontSize={sp(14)} color='#fff'>
                {currentShopWithRole?.role.name}
              </Text>
            </Row>
          </Pressable>
          <SelectUser
            style={{ marginTop: ss(4) }}
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
      <Flex direction='column' flex={1}>
        <Flex
          direction='row'
          justifyContent={'center'}
          py={ss(22)}
          alignItems={'center'}
        >
          {!currentSelectedModule?.noTab &&
            currentSelectedModule?.features.map((item, idx) => {
              return (
                <Pressable
                  hitSlop={ss(10)}
                  key={idx}
                  paddingRight={'8%'}
                  onPress={() => {
                    changeFeatureSelected(idx);
                  }}
                >
                  <Center>
                    <Text color={'white'} fontSize={ls(20)} fontWeight={600}>
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
        </Flex>
        <Flex bgColor={'#E6EEF1'} flex={1} borderTopLeftRadius={ss(10)}>
          {currentSelectedModule.noTab ? <NoTabFragment /> : <Fragment />}
        </Flex>
      </Flex>
    </Flex>
  );
}
