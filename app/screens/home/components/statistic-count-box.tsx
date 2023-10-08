import { Row, Column, Text, Image } from 'native-base';
import { ImageSourcePropType, StyleProp, ViewStyle } from 'react-native';
import { ss, ls, sp } from '~/app/utils/style';

export default function StatisticsCountBox(params: {
  image: ImageSourcePropType;
  title: string;
  count: number;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Row
      px={ls(24)}
      minW={ls(236)}
      py={ss(20)}
      flex={1}
      bgColor={'#fff'}
      borderRadius={ss(8)}
      style={params.style}>
      <Image size={sp(66)} borderRadius={ss(5)} alt='' source={params.image} />
      <Column ml={ls(24)}>
        <Text color='#666' fontSize={sp(18)}>
          {params.title}
        </Text>
        <Text color='#333' fontSize={sp(24)} mt={ss(2)} fontWeight={600}>
          {params.count}
        </Text>
      </Column>
    </Row>
  );
}
