import { Center, Text } from 'native-base';
import { Image } from 'react-native';
import { ls, sp, ss } from '../utils/style';

export default function EmptyBox() {
  return (
    <Center flex={1} bgColor='white' borderRadius={ss(10)} py={ss(155)}>
      <Image
        style={{ width: ls(360), height: ss(211) }}
        source={require('~/assets/images/no-data.png')}
      />
      <Text fontSize={sp(22)} color='#1E262F' mt={ss(66)} opacity={0.4}>
        暂无数据
      </Text>
    </Center>
  );
}
