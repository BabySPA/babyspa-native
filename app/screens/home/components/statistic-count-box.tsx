import { Row, Column, Text } from 'native-base';
import { StyleProp, ViewStyle } from 'react-native';
import { ss, ls, sp } from '~/app/utils/style';
export default function StatisticsCountBox(params: {
  title: string;
  count: number;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Row
      pl={ls(30)}
      pr={ls(70)}
      py={ss(30)}
      flex={1}
      bgColor={'#fff'}
      borderRadius={ss(8)}
      style={params.style}>
      <Row w={ss(66)} h={ss(66)} bgColor={'#D9D9D9'} borderRadius={ss(5)} />
      <Column ml={ls(30)}>
        <Text color='#666' fontSize={sp(18)}>
          {params.title}
        </Text>
        <Text color='#333' fontSize={sp(24)} mt={ss(2)}>
          {params.count}
        </Text>
      </Column>
    </Row>
  );
}
