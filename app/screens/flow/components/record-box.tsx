import dayjs from 'dayjs';
import { Audio } from 'expo-av';
import { Box, Center, Modal, Pressable, Text } from 'native-base';
import { useRef, useState } from 'react';
import { Image, PanResponder } from 'react-native';
import { upload } from '~/app/api/upload';
import useFlowStore from '~/app/stores/flow';
import useOssStore from '~/app/stores/oss';
import { ss, ls, sp } from '~/app/utils/style';

export default function RecordBox({}) {
  const [isLongPress, setIsLongPress] = useState(false);
  const [isDone, setIsDone] = useState(true);
  const longPressTimer = useRef(null);

  const [showRecordBox, setShowRecordBox] = useState(false);
  const [recorder, setRecorder] = useState<Audio.Recording>();
  const { currentFlowCustomer, addAudioFile, updateAudioFile } = useFlowStore();
  const { getOssConfig } = useOssStore();

  const startRecording = async () => {
    try {
      console.log('Requesting permissions..');

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );
      setRecorder(recording);
      console.log('Recording started', recording);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = (): Promise<{ uri: string; duration: number }> => {
    return new Promise(async (resolve, reject) => {
      console.log('Stopping recording..', recorder);
      if (recorder) {
        await recorder.stopAndUnloadAsync();
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
        });
        const uri = recorder.getURI();
        console.log('Recording stopped and stored at', uri);

        if (uri) {
          const sound = new Audio.Sound();
          await sound.loadAsync({ uri });
          const audioStatus: any = await sound.getStatusAsync();
          // 获取音频时长
          const duration = audioStatus.durationMillis;
          setRecorder(undefined);

          resolve({
            uri,
            duration,
          });
        }
      } else {
        setRecorder(undefined);
        reject('recording is undefined');
      }
    });
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      if (isDone) {
        // 开始触摸时，设置一个计时器，判断是否长按
        // @ts-ignore
        longPressTimer.current = setTimeout(async () => {
          try {
            const permission = await Audio.requestPermissionsAsync();
            if (permission.status === 'granted') {
              await startRecording();
              setShowRecordBox(true);
            } else {
              console.log('permission ==>', permission);
              // @ts-ignore
              clearTimeout(longPressTimer.current);
              setShowRecordBox(false);
            }
          } catch (error) {
            // @ts-ignore
            clearTimeout(longPressTimer.current);
            setShowRecordBox(false);
          }
        }, 500); // 500毫秒为长按的时间阈值，可以根据需要调整
      }
    },
    onPanResponderMove: async (_, gestureState) => {
      if (isDone) {
        const { dy } = gestureState;
        if (showRecordBox && dy < -200) {
          try {
            setShowRecordBox(false);
            console.log(recorder);
            await stopRecording();
          } catch (error) {
            console.log('stopRecording error ==>', error);
          }
        }
      }
    },
    onPanResponderRelease: async () => {
      if (isDone) {
        // 手指松开时，清除计时器和长按状态
        try {
          // @ts-ignore
          clearTimeout(longPressTimer.current);
          setShowRecordBox(false);
          const { uri } = await stopRecording();
          const recordType = uri.split('.').pop();
          const name = `${currentFlowCustomer.tag}-${
            currentFlowCustomer.flowId
          }-${dayjs().format('YYYYMMDDHHmmss')}.${recordType}`;

          addAudioFile({
            name,
            uri,
          });

          console.log();

          //   const oss = await getOssConfig();
          //   const fileUrl = await upload(uri, filename, oss);
          //   uploadCallback(name, fileUrl);
        } catch (error) {
          console.log('stopRecording error ==>', error);
        }
      }
    },
  });

  return (
    <>
      <Center flex={1}>
        <Image
          source={require('~/assets/images/empty-record.png')}
          style={{
            width: ls(180),
            height: ss(80),
          }}
          resizeMode='contain'
        />
        <Text my={ss(15)} fontSize={sp(10)} color='#1E262F' opacity={0.4}>
          您可以录下咳嗽等声音哦
        </Text>
      </Center>
      <Center
        {...panResponder.panHandlers}
        borderRadius={ss(6)}
        px={ls(20)}
        py={ss(10)}
        bg={{
          linearGradient: {
            colors: ['#22D59C', '#1AB7BE'],
            start: [0, 0],
            end: [1, 1],
          },
        }}>
        <Text color='white' fontSize={sp(12)}>
          按住录音
        </Text>
      </Center>
      <Modal isOpen={showRecordBox}>
        <Box position={'absolute'} left={'7%'} bottom={ss(150)}>
          <ArrowBox />
          <Text color={'white'} mt={ss(30)}>
            松开保存，上划取消
          </Text>
        </Box>
      </Modal>
    </>
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
