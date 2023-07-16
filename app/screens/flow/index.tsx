import {
  AspectRatio,
  Box,
  Button,
  Center,
  Flex,
  Text,
  Pressable,
  StatusBar,
  Icon,
} from 'native-base';
import { AppStackScreenProps } from '../../types';
import NavigationBar from '~/app/components/navigation-bar';
import { sp, ss, ls } from '~/app/utils/style';

export default function FlowScreen({
  navigation,
  route,
}: AppStackScreenProps<'Flow'>) {
  const { status } = route.params;
  return (
    <Box flex={1}>
      <NavigationBar
        onBackIntercept={() => true}
        leftElement={
          <Text color='white' fontWeight={600} fontSize={sp(20)}>
            张子萱
          </Text>
        }
        rightElement={
          <Pressable
            onPress={() => {
              console.log('登记');
            }}>
            <Box
              bgColor={'white'}
              borderRadius={ss(4)}
              _text={{ color: '#03CBB2', fontSize: sp(14) }}
              px={ls(26)}
              py={ss(10)}>
              时间
            </Box>
          </Pressable>
        }
      />
      <Box safeAreaLeft bgColor={'#F6F6FA'} flex={1}></Box>
    </Box>
  );
}
