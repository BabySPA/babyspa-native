import { Center, Spinner, Text } from 'native-base';
import { ls, sp, ss } from '../utils/style';

export default function LoadingBox() {
  return (
    <Center flex={1} bgColor='white' borderRadius={ss(10)} py={ss(205)}>
      <Spinner color='#1AB7BE' size={sp(40)} />
      <Text fontSize={sp(18)} color='#1E262F' mt={ss(46)} opacity={0.4}>
        加载数据中...
      </Text>
    </Center>
  );
}
