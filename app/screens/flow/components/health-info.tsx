import { AntDesign } from '@expo/vector-icons';
import {
  Box,
  Column,
  Row,
  Image,
  Text,
  Divider,
  TextArea,
  Center,
  Icon,
  Pressable,
  Menu,
} from 'native-base';
import { ImageSourcePropType, TextInput } from 'react-native';
import { ss, sp } from '~/app/utils/style';
import ImagePicker, {
  MediaTypeOptions,
  launchCameraAsync,
  launchImageLibraryAsync,
  requestCameraPermissionsAsync,
  requestMediaLibraryPermissionsAsync,
  useCameraPermissions,
  useMediaLibraryPermissions,
} from 'expo-image-picker';

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
  const [mediaPermission] = useMediaLibraryPermissions();
  const [cameraPermission] = useCameraPermissions();

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
          <Menu
            w={ss(200)}
            _text={{ fontSize: sp(18), color: '#000' }}
            trigger={(triggerProps) => {
              return (
                <Pressable {...triggerProps}>
                  <Center
                    borderColor={'#ACACAC'}
                    borderWidth={1}
                    borderStyle={'dashed'}
                    bgColor={'#FFF'}
                    w={ss(100)}
                    h={ss(100)}>
                    <Icon
                      as={<AntDesign name='plus' size={ss(40)} />}
                      color={'#ACACAC'}
                    />
                  </Center>
                </Pressable>
              );
            }}>
            <Menu.Item alignItems={'center'} py={ss(16)}>
              <Text fontWeight={600} justifyContent={'center'}>
                请选择上传方式
              </Text>
            </Menu.Item>
            <Menu.Item
              borderTopColor={'#DFE1DE'}
              borderTopWidth={1}
              justifyContent={'center'}
              alignItems={'center'}
              onPress={() => {
                if (cameraPermission?.status === 'undetermined') {
                  requestCameraPermissionsAsync().then((res) => {
                    console.log('立即拍摄', res.status === 'undetermined');
                    launchCameraAsync({
                      mediaTypes: MediaTypeOptions.Images,
                      allowsEditing: false,
                      quality: 1,
                    }).then((res) => {
                      console.log(res);
                    });
                  });
                } else {
                  launchCameraAsync({
                    mediaTypes: MediaTypeOptions.Images,
                    allowsEditing: false,
                    quality: 1,
                  }).then((res) => {
                    console.log(res);
                  });
                }
              }}
              py={ss(16)}>
              <Text textAlign={'center'}>立即拍摄</Text>
            </Menu.Item>
            <Menu.Item
              borderTopColor={'#DFE1DE'}
              borderTopWidth={1}
              justifyContent={'center'}
              alignItems={'center'}
              onPress={() => {
                console.log('从相册选择', cameraPermission);
                if (mediaPermission?.status !== 'granted') {
                  requestMediaLibraryPermissionsAsync().then((res) => {
                    console.log(res);
                  });
                } else {
                  launchImageLibraryAsync({
                    mediaTypes: MediaTypeOptions.Images,
                    allowsMultipleSelection: true,
                    allowsEditing: false,
                    quality: 1,
                  }).then((res) => {
                    console.log(res);
                  });
                }
              }}
              py={ss(16)}>
              <Text textAlign={'center'}>从相册选择</Text>
            </Menu.Item>
          </Menu>
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
