import { Box, Center, Flex, Text, Pressable } from 'native-base';
import { ls, ss } from '~/app/utils/style';
import { Image } from 'react-native';
import useLayoutConfigWithRole from '~/app/stores/layout';
import useAuthStore from '~/app/stores/auth';

export default function Layout() {
  const {
    currentSelected,
    layoutConfig,
    changeCurrentSelected,
    changeFeatureSelected,
  } = useLayoutConfigWithRole();

  const { logout } = useAuthStore();

  const Fragment = () => {
    return layoutConfig[currentSelected].features[
      layoutConfig[currentSelected].featureSelected
    ].fragment();
  };

  return (
    <Flex
      safeAreaTop
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
        <Center
          pt={ss(30)}
          px={ss(10)}
          minW={ss(120)}
          minH={ss(120)}
          safeAreaLeft>
          <Pressable
            onPress={() => {
              logout();
            }}>
            <Image
              source={require('~/assets/images/logo.png')}
              style={{
                width: ss(60, { min: 45 }),
                height: ss(60, { min: 45 }),
              }}
            />
          </Pressable>
          <Text
            fontSize={ls(20)}
            color={'white'}
            mt={ss(5)}
            fontWeight={600}
            textAlign={'center'}>
            掌阅未来
          </Text>
        </Center>
        <Box mt={ss(10)}>
          {layoutConfig.map((item, idx) => {
            return (
              <Pressable
                key={idx}
                onPress={() => {
                  changeCurrentSelected(idx);
                }}>
                <Center
                  safeAreaLeft
                  background={
                    idx == currentSelected ? 'warmGray.50' : 'transparent'
                  }
                  px={ls(10)}
                  py={ss(16)}>
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
                    color={idx == currentSelected ? '#64CF97' : 'warmGray.50'}>
                    {item.text}
                  </Text>
                </Center>
              </Pressable>
            );
          })}
        </Box>
      </Box>
      <Flex direction='column' flex={1}>
        <Flex direction='row' justifyContent={'center'}>
          {layoutConfig[currentSelected].features.map((item, idx) => {
            return (
              <Pressable
                key={idx}
                p={ss(16)}
                paddingRight={'8%'}
                onPress={() => {
                  changeFeatureSelected(idx);
                }}>
                <Center>
                  <Text color={'white'} fontSize={ls(20)} fontWeight={600}>
                    {item.text}
                  </Text>
                  {layoutConfig[currentSelected].featureSelected == idx && (
                    <Box w={ss(40)} h={ss(4)} bgColor={'white'} mt={ss(5)} />
                  )}
                </Center>
              </Pressable>
            );
          })}
        </Flex>
        <Flex bgColor={'#E6EEF1'} flex={1} borderTopLeftRadius={ss(10)}>
          <Fragment />
        </Flex>
      </Flex>
    </Flex>
  );
}
