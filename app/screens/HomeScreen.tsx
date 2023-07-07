import {
  AspectRatio,
  Box,
  Button,
  Center,
  Flex,
  Text,
  Image,
} from 'native-base';
import { AppStackScreenProps } from '../../types';
import { ls, sp, ss } from '../utils/style';

const tabs = [
  {
    image: require('../../assets/images/tab_md.png'),
    text: '门店',
  },
  {
    image: require('../../assets/images/tab_kh.png'),
    text: '客户',
  },
  {
    image: require('../../assets/images/tab_gl.png'),
    text: '管理',
  },
  {
    image: require('../../assets/images/tab_tj.png'),
    text: '统计',
  },
];

export default function HomeScreen({
  navigation,
}: AppStackScreenProps<'Home'>) {
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
      direction="row"
    >
      <Flex padding={ss(26)}>
        <Flex
          safeAreaLeft
          flexDirection={'column'}
          alignItems={'center'}
          justifyContent={'center'}
        >
          <Image
            source={require('../../assets/images/logo.png')}
            size={ss(60, { min: 45 })}
            alt=""
          />
          <Text alignSelf="center" fontSize={ls(20)}>
            茗淳儿推
          </Text>
        </Flex>
        <Box mt={10}>
          {tabs.map((item, idx) => {
            return (
              <Box
                safeAreaLeft
                key={idx}
                background={idx == 1 ? 'warmGray.50' : 'transparent'}
              >
                <Text
                  fontSize={ls(18)}
                  color={idx == 1 ? '#64CF97' : 'warmGray.50'}
                >
                  {item.text}
                </Text>
              </Box>
            );
          })}
        </Box>
      </Flex>
      <Flex>
        <Box
          alignSelf="center"
          _text={{
            fontSize: 'md',
            fontWeight: 'medium',
            color: 'warmGray.50',
            letterSpacing: 'lg',
          }}
          bg={['red.400', 'blue.400']}
        >
          This is a Box
        </Box>
      </Flex>
    </Flex>
  );
}
