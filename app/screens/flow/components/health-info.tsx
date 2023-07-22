import { AntDesign } from '@expo/vector-icons';
import {
  Box,
  Column,
  Row,
  Text,
  Divider,
  Center,
  Icon,
  Pressable,
  Menu,
  useToast,
  ScrollView,
  Spinner,
  Modal,
} from 'native-base';
import { Image } from 'expo-image';
import { ImageSourcePropType, TextInput } from 'react-native';
import { ss, sp, ls } from '~/app/utils/style';
import { requestCameraPermissionsAsync } from 'expo-image-picker';
import { toastAlert } from '~/app/utils/toast';
import { useNavigation } from '@react-navigation/native';
import DashedLine from 'react-native-dashed-line';
import { useState } from 'react';
import { Audio } from 'expo-av';
import { getBase64ImageFormat } from '~/app/utils';
import useFlowStore from '~/app/stores/flow';
import ImageBox from './image-box';

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

const ArrowBox = () => {
  return (
    <Box flex={1} justifyContent='center' alignItems='center'>
      {/* 画框框 */}
      <Box position='relative'>
        <Box
          bg={{
            linearGradient: {
              colors: ['#22D59C', '#1AB7BE'],
              start: [0, 0],
              end: [1, 1],
            },
          }}
          borderRadius={8}
          py={ss(27)}
          px={ls(38)}>
          <Image
            source={require('~/assets/images/record-loading.png')}
            style={{ height: ss(18), width: ls(72) }}
          />
        </Box>
        {/* 画箭头 */}
        <Box
          position='absolute'
          top='100%' // 位于底部
          left='50%'
          ml={-ls(10)} // 居中箭头
          width={0}
          height={0}
          borderTopWidth={ss(15)} // 使用 borderTopWidth 改变箭头方向
          borderLeftWidth={ls(10)}
          borderRightWidth={ls(10)}
          borderStyle='solid'
          backgroundColor='transparent'
          borderTopColor='#22D59C' // 箭头颜色为渐变色的起始色
          borderBottomColor='transparent'
          borderLeftColor='transparent'
          borderRightColor='transparent'
        />
      </Box>
    </Box>
  );
};

function BoxItem({
  mt,
  title,
  icon,
  children,
  autoScroll = true,
}: {
  mt?: number;
  title: string;
  icon: ImageSourcePropType;
  children: React.ReactNode;
  autoScroll?: boolean;
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
      {autoScroll ? <ScrollView>{children}</ScrollView> : children}
    </Box>
  );
}

export default function HealthInfo() {
  const navigation = useNavigation();
  const [recording, setRecording] = useState<Audio.Recording>();

  const {
    addlingualImage,
    updatelingualImage,
    addLeftHandImage,
    updateLeftHandImage,
    addRightHandImage,
    updateRightHandImage,
    updateHealthInfo,
    currentFlow,
  } = useFlowStore();

  const { healthInfo } = currentFlow;
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

  const [record, setRecord] = useState(false);

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
                height: ss(221),
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
          autoScroll={false}>
          <Row>
            <Box flex={1}>
              <Text fontSize={sp(12)} fontWeight={600} color='#333'>
                录音
              </Text>
              <ScrollView></ScrollView>
              <Pressable
                onLongPress={() => {
                  console.log('正在长按');
                  setRecord(true);
                }}
                onBlur={() => {
                  console.log('onBlur');
                }}
                onTouchEnd={() => {
                  console.log('onTouchEnd');
                }}>
                <Center
                  m={ss(10)}
                  borderRadius={ss(6)}
                  px={ls(20)}
                  py={ss(13)}
                  bg={{
                    linearGradient: {
                      colors: ['#22D59C', '#1AB7BE'],
                      start: [0, 0],
                      end: [1, 1],
                    },
                  }}>
                  <Text color='white' fontSize={sp(16)}>
                    按住录音
                  </Text>
                </Center>
              </Pressable>
              <Modal
                isOpen={record}
                onClose={() => {
                  setRecord(false);
                }}>
                <Box position={'absolute'} left={'7%'} bottom={ss(150)}>
                  <ArrowBox />
                  <Text color={'white'} mt={ss(30)}>
                    松开保存，上划取消
                  </Text>
                </Box>
              </Modal>
            </Box>
            <DashedLine
              axis='vertical'
              dashLength={ss(12)}
              dashGap={ss(12)}
              dashColor='#DFE1DE'
              style={{ marginHorizontal: ls(15) }}
            />
            <Box flex={1}>
              <Text fontSize={sp(12)} fontWeight={600} color='#333'>
                其他
              </Text>

              <Pressable>
                <Center
                  borderColor={'#ACACAC'}
                  borderWidth={1}
                  borderStyle={'dashed'}
                  bgColor={'#FFF'}
                  mt={ss(10)}
                  w={ss(100)}
                  h={ss(100)}>
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
          icon={require('~/assets/images/tongue.png')}>
          <ImageBox
            images={healthInfo.lingualImage}
            selectedCallback={function (filename: string, uri: string): void {
              addlingualImage({
                name: filename,
                uri: uri,
              });
            }}
            takePhotoCallback={function (filename: string, uri: string): void {
              throw new Error('Function not implemented.');
            }}
            uploadCallback={function (filename: string, url: string): void {
              updatelingualImage(filename, url);
            }}
            errorCallback={function (err: any): void {
              throw new Error('Function not implemented.');
            }}
          />
        </BoxItem>
        <BoxItem
          title={'手部图片'}
          icon={require('~/assets/images/hand.png')}
          mt={ss(10)}>
          <Row>
            <Box flex={1}>
              <Row>
                <Text
                  mr={ls(10)}
                  fontSize={sp(12)}
                  fontWeight={600}
                  color='#333'>
                  左手
                </Text>
                <ImageBox
                  images={healthInfo.leftHandImages}
                  selectedCallback={function (
                    filename: string,
                    uri: string,
                  ): void {
                    addLeftHandImage({
                      name: filename,
                      uri: uri,
                    });
                  }}
                  takePhotoCallback={function (
                    filename: string,
                    uri: string,
                  ): void {
                    throw new Error('Function not implemented.');
                  }}
                  uploadCallback={function (
                    filename: string,
                    url: string,
                  ): void {
                    updateLeftHandImage(filename, url);
                  }}
                  errorCallback={function (err: any): void {
                    throw new Error('Function not implemented.');
                  }}
                />
              </Row>
            </Box>
            <DashedLine
              axis='vertical'
              dashLength={ss(12)}
              dashGap={ss(12)}
              dashColor='#DFE1DE'
              style={{ marginHorizontal: ls(15) }}
            />
            <Box flex={1}>
              <Row>
                <Text
                  mr={ls(10)}
                  fontSize={sp(12)}
                  fontWeight={600}
                  color='#333'>
                  右手
                </Text>
                <ImageBox
                  images={healthInfo.rightHandImages}
                  selectedCallback={function (
                    filename: string,
                    uri: string,
                  ): void {
                    addRightHandImage({
                      name: filename,
                      uri: uri,
                    });
                  }}
                  takePhotoCallback={function (
                    filename: string,
                    uri: string,
                  ): void {
                    throw new Error('Function not implemented.');
                  }}
                  uploadCallback={function (
                    filename: string,
                    url: string,
                  ): void {
                    updateRightHandImage(filename, url);
                  }}
                  errorCallback={function (err: any): void {
                    throw new Error('Function not implemented.');
                  }}
                />
              </Row>
            </Box>
          </Row>
        </BoxItem>
      </Column>
    </Row>
  );
}
