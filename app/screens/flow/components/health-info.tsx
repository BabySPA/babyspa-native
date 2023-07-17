import { Box, Column, Row, Image, Text, Divider, TextArea } from 'native-base';
import { ImageSourcePropType, TextInput } from 'react-native';
import { ss, sp } from '~/app/utils/style';

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
        <Image size={ss(24)} source={icon} alt='' />
        <Text ml={ss(10)} fontSize={sp(20)} color='#333' fontWeight={600}>
          {title}
        </Text>
      </Row>
      <Divider color={'#DFE1DE'} my={ss(14)} />
    </Box>
  );
}

function BoxItem({
  mt,
  title,
  icon,
  children,
}: {
  mt?: number;
  title: string;
  icon: ImageSourcePropType;
  children: React.ReactNode;
}) {
  return (
    <Box
      flex={1}
      bgColor='#fff'
      borderRadius={ss(10)}
      mt={mt ?? 0}
      px={ss(20)}
      py={ss(18)}>
      <TitleBar title={title} icon={icon} />
      {children}
    </Box>
  );
}

export default function HealthInfo() {
  return (
    <Row flex={1}>
      <Column flex={1}>
        <BoxItem title={'过敏史'} icon={require('~/assets/images/notice.png')}>
          <Box flex={1}>
            <TextInput
              multiline={true}
              placeholder='请输入过敏史'
              style={{
                borderRadius: ss(4),
                borderColor: '#DFE1DE',
                borderWidth: 1,
                height: '100%',
                backgroundColor: '#F8F8F8',
                padding: ss(10),
                fontSize: sp(14),
                color: '#999',
              }}
            />
          </Box>
        </BoxItem>
        <BoxItem
          title={'备注'}
          icon={require('~/assets/images/notice.png')}
          mt={ss(10)}>
          <Box>ss</Box>
        </BoxItem>
      </Column>
      <Column flex={1} ml={ss(10)}>
        <BoxItem
          title={'舌部图片'}
          icon={require('~/assets/images/tongue.png')}>
          <Box>ss</Box>
        </BoxItem>
        <BoxItem
          title={'手部图片'}
          icon={require('~/assets/images/hand.png')}
          mt={ss(10)}>
          <Box>ss</Box>
        </BoxItem>
      </Column>
    </Row>
  );
}
