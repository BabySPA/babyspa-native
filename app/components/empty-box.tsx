import { Center, Text } from 'native-base';
import { Image } from 'react-native';
import { ls, sp, ss } from '../utils/style';

export default function EmptyBox(params: { title?: string }) {
  return (
    <Center flex={1} bgColor='white' borderRadius={ss(10)} py={ss(145)}>
      <Image
        style={{ width: ls(360), height: ss(211) }}
        source={require('~/assets/images/no-data.png')}
        resizeMode='contain'
      />
      <Text fontSize={sp(18)} color='#1E262F' mt={ss(46)} opacity={0.4}>
        {params.title ?? '暂无数据'}
      </Text>
    </Center>
  );
}
