import { Box, Divider, Row, ScrollView, Text } from 'native-base';
import { ImageSourcePropType, Image } from 'react-native';
import { ss, sp } from '~/app/utils/style';

export default function BoxItem({
  mt,
  title,
  icon,
  children,
  flex,
  autoScroll = true,
}: {
  mt?: number;
  flex?: number;
  title: string;
  icon: ImageSourcePropType;
  children: React.ReactNode;
  autoScroll?: boolean;
}) {
  return (
    <Box
      flex={flex ?? 1}
      bgColor='#fff'
      borderRadius={ss(10)}
      mt={mt ?? 0}
      px={ss(20)}
      py={ss(18)}
    >
      <TitleBar title={title} icon={icon} />
      {autoScroll ? <ScrollView>{children}</ScrollView> : children}
    </Box>
  );
}

function TitleBar({
  title,
  icon,
}: {
  title: string;
  icon: ImageSourcePropType;
}) {
  return (
    <Box>
      <Row alignItems={'center'}>
        <Image style={{ width: ss(24), height: ss(24) }} source={icon} />
        <Text ml={ss(10)} fontSize={sp(20)} color='#333' fontWeight={600}>
          {title}
        </Text>
      </Row>
      <Divider color={'#DFE1DE'} my={ss(14)} />
    </Box>
  );
}
