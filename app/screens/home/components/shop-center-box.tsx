import { Column, Image, Pressable, Row, Text } from 'native-base';
import { ImageSourcePropType } from 'react-native';
import { ss, ls, sp } from '~/app/utils/style';

export default function ShopCenterBox({
  title,
  content,
  image,
  onPress,
}: {
  title: string;
  content: string;
  image: ImageSourcePropType;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress}>
      <Row
        bgColor={'#fff'}
        minH={ss(128)}
        w={ls(340)}
        borderRadius={ss(8)}
        mr={ls(10)}
        mb={ss(10)}
        px={ss(30)}
        py={ss(24)}
        justifyContent={'space-between'}>
        <Column>
          <Text fontSize={sp(24)} color='#333'>
            {title}
          </Text>
          <Text fontSize={sp(18)} color='#666' mt={ss(14)}>
            {content}
          </Text>
        </Column>
        <Image size={ss(80)} source={image} alt='' />
      </Row>
    </Pressable>
  );
}