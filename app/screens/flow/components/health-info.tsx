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
  useToast,
} from 'native-base';
import { ImageSourcePropType, TextInput, View } from 'react-native';
import { ss, sp, ls } from '~/app/utils/style';
import ImagePicker, {
  MediaTypeOptions,
  launchCameraAsync,
  launchImageLibraryAsync,
  requestCameraPermissionsAsync,
  requestMediaLibraryPermissionsAsync,
  useCameraPermissions,
  useMediaLibraryPermissions,
} from 'expo-image-picker';
import { toastAlert } from '~/app/utils/toast';
import { useNavigation } from '@react-navigation/native';
import DashedLine from 'react-native-dashed-line';
import { useState } from 'react';
import { AVPlaybackStatus, Audio } from 'expo-av';
import { getBase64ImageFormat } from '~/app/utils';
import useFlowStore from '~/app/stores/flow';

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
      py={ss(18)}
    >
      <TitleBar title={title} icon={icon} />
      {children}
    </Box>
  );
}

export default function HealthInfo() {
  const toast = useToast();
  const navigation = useNavigation();
  const [recording, setRecording] = useState<Audio.Recording>();

  const { uploadFile } = useFlowStore();

  async function startRecording() {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    console.log('Stopping recording..');
    setRecording(undefined);
    if (recording) {
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
      const uri = recording.getURI();
      console.log('Recording stopped and stored at', uri);

      if (uri) {
        const sound = new Audio.Sound();
        await sound.loadAsync({ uri });
        const audioStatus: any = await sound.getStatusAsync();
        // 获取音频时长
        const durationSeconds = audioStatus.durationMillis / 1000;
        console.log('durationSeconds ==>', durationSeconds);
        // const { sound } = await Audio.Sound.createAsync(
        //   { uri },
        //   { shouldPlay: true },
        // );
        // await sound.playAsync();
        //       const durationMillis = await sound.getDurationAsync();
      }

      setRecording(undefined);
    }
  }

  const openCamera = () => {
    // 如果用户授予权限，则打开相机
    // 否则请求权限
    requestCameraPermissionsAsync()
      .then((res) => {
        if (res.status !== 'granted') {
          toastAlert(toast, 'error', '请授予相机权限');
        } else {
          console.log('准备打开相机');
          navigation.navigate('Camera');
        }
      })
      .catch((err) => {
        console.log('requestCameraPermissionsAsync err ==>', err);
      });
  };

  const openMediaLibrary = () => {
    requestMediaLibraryPermissionsAsync()
      .then((res) => {
        console.log('requestMediaLibraryPermissionsAsync ==>', res);
        if (res.status !== 'granted') {
          toastAlert(toast, 'error', '请授予相册权限');
        } else {
          launchImageLibraryAsync({
            mediaTypes: MediaTypeOptions.Images,
            allowsMultipleSelection: false,
            allowsEditing: false,
            quality: 0.1,
          }).then((res) => {
            if (res.assets && res.assets.length > 0) {
              const selectImageFile = res.assets[0];

              const fileUrl = uploadFile(
                selectImageFile.uri,
                selectImageFile.fileName ??
                  `${Date.now()}.${getBase64ImageFormat(selectImageFile.uri)}`,
              );
            }
          });
        }
      })
      .catch((err) => {
        console.log('requestMediaLibraryPermissionsAsync err ==>', err);
      });
  };

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
          mt={ss(10)}
        >
          <Row>
            <Box flex={1}>
              <Text>录音</Text>
              <Pressable
                onPress={() => {
                  startRecording();
                }}
              >
                <Image
                  source={require('~/assets/images/record_start.png')}
                  size={ss(50)}
                  alt=''
                />
              </Pressable>
              <Pressable
                onPress={() => {
                  stopRecording();
                }}
              >
                <Image
                  source={require('~/assets/images/record_ok.png')}
                  size={ss(50)}
                  alt=''
                />
              </Pressable>
            </Box>
            <DashedLine
              axis='vertical'
              dashLength={ss(12)}
              dashGap={ss(12)}
              dashColor='#DFE1DE'
              style={{ marginHorizontal: ls(15) }}
            />
            <Box flex={1}>
              <Pressable>
                <Center
                  borderColor={'#ACACAC'}
                  borderWidth={1}
                  borderStyle={'dashed'}
                  bgColor={'#FFF'}
                  w={ss(100)}
                  h={ss(100)}
                >
                  <Icon
                    as={<AntDesign name='plus' size={ss(40)} />}
                    color={'#ACACAC'}
                  />
                </Center>
              </Pressable>
            </Box>
          </Row>
        </BoxItem>
      </Column>
      <Column flex={1} ml={ss(10)}>
        <BoxItem
          title={'舌部图片'}
          icon={require('~/assets/images/tongue.png')}
        >
          <Menu
            w={ls(280)}
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
                    h={ss(100)}
                  >
                    <Icon
                      as={<AntDesign name='plus' size={ss(40)} />}
                      color={'#ACACAC'}
                    />
                  </Center>
                </Pressable>
              );
            }}
          >
            <Box alignItems={'center'} py={ss(16)}>
              <Text fontWeight={600} justifyContent={'center'}>
                请选择上传方式
              </Text>
            </Box>
            <Menu.Item
              borderTopColor={'#DFE1DE'}
              borderTopWidth={1}
              justifyContent={'center'}
              alignItems={'center'}
              onPress={() => {
                openCamera();
              }}
              py={ss(16)}
            >
              <Text textAlign={'center'}>立即拍摄</Text>
            </Menu.Item>
            <Menu.Item
              borderTopColor={'#DFE1DE'}
              borderTopWidth={1}
              justifyContent={'center'}
              alignItems={'center'}
              onPress={() => {
                openMediaLibrary();
              }}
              py={ss(16)}
            >
              <Text textAlign={'center'}>从相册选择</Text>
            </Menu.Item>
          </Menu>
        </BoxItem>
        <BoxItem
          title={'手部图片'}
          icon={require('~/assets/images/hand.png')}
          mt={ss(10)}
        >
          <Menu
            w={ls(280)}
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
                    h={ss(100)}
                  >
                    <Icon
                      as={<AntDesign name='plus' size={ss(40)} />}
                      color={'#ACACAC'}
                    />
                  </Center>
                </Pressable>
              );
            }}
          >
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
                openCamera();
              }}
              py={ss(16)}
            >
              <Text textAlign={'center'}>立即拍摄</Text>
            </Menu.Item>
            <Menu.Item
              borderTopColor={'#DFE1DE'}
              borderTopWidth={1}
              justifyContent={'center'}
              alignItems={'center'}
              onPress={() => {
                openMediaLibrary();
              }}
              py={ss(16)}
            >
              <Text textAlign={'center'}>从相册选择</Text>
            </Menu.Item>
          </Menu>
        </BoxItem>
      </Column>
    </Row>
  );
}
