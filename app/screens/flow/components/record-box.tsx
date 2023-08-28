import dayjs from 'dayjs';
import { Audio } from 'expo-av';
import { Box, Center, Modal, ScrollView, Text, useToast } from 'native-base';
import { useRef, useState } from 'react';
import { Image, PanResponder, Vibration } from 'react-native';
import { upload } from '~/app/api/upload';
import SoundList from '~/app/components/sound-list';
import useFlowStore from '~/app/stores/flow';
import useOssStore from '~/app/stores/oss';
import { ss, ls, sp } from '~/app/utils/style';
import { toastAlert } from '~/app/utils/toast';

export default function RecordBox({ edit }: { edit: boolean }) {
  const [isDone, setIsDone] = useState(true);
  const longPressTimer = useRef(null);
  const toast = useToast();
  const [showRecordBox, setShowRecordBox] = useState(false);
  const [recorder, setRecorder] = useState<Audio.Recording>();
  const {
    currentFlowCustomer,
    addAudioFile,
    updateAudioFile,
    removeAudioFile,
    currentFlow: {
      collect: {
        healthInfo: { audioFiles },
      },
    },
  } = useFlowStore();
  const { getOssConfig } = useOssStore();
  const [isTouchNow, setIsTouchNow] = useState(false);

  const startRecording = async () => {
    try {
      Vibration.vibrate(200);

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      setShowRecordBox(true);

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );
      setRecorder(recording);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = (): Promise<{ uri: string; duration: number }> => {
    return new Promise(async (resolve, reject) => {
      if (recorder) {
        await recorder.stopAndUnloadAsync();
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
        });
        const uri = recorder.getURI();

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
      setIsTouchNow(true);
      if (isDone) {
        // 开始触摸时，设置一个计时器，判断是否长按
        // @ts-ignore
        longPressTimer.current = setTimeout(async () => {
          try {
            const permission = await Audio.requestPermissionsAsync();
            if (permission.status === 'granted') {
              await startRecording();
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
          } finally {
            setIsTouchNow(false);
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
          const { uri, duration } = await stopRecording();

          if (duration < 1000) {
            toastAlert(toast, 'error', '录音时间太短');
            return;
          }
          const recordType = uri.split('.').pop();
          const name = `${currentFlowCustomer.tag}-${
            currentFlowCustomer.flowId
          }-${dayjs().format('YYYYMMDDHHmmss')}.${recordType}`;

          addAudioFile({
            duration,
            name,
            uri,
          });

          const oss = await getOssConfig();
          const fileUrl = await upload(uri, name, oss);

          updateAudioFile(name, fileUrl);
        } catch (error) {
          console.log('stopRecording error ==>', error);
        }
      }
    },
  });

  return (
    <>
      <Center flex={1}>
        <ScrollView scrollEnabled={!showRecordBox}>
          {audioFiles.length > 0 ? (
            <SoundList
              audioFiles={audioFiles}
              edit={edit}
              removedCallback={function (idx: number): void {
                removeAudioFile(idx);
              }}
            />
          ) : (
            <Center flex={1}>
              <Image
                source={require('~/assets/images/empty-record.png')}
                style={{
                  marginTop: ss(30),
                  width: ls(180),
                  height: ss(80),
                }}
                resizeMode='contain'
              />
              <Text my={ss(16)} fontSize={sp(10)} color='#1E262F' opacity={0.4}>
                您可以录下咳嗽等声音哦
              </Text>
            </Center>
          )}
        </ScrollView>
      </Center>
      {edit && (
        <Center
          {...panResponder.panHandlers}
          borderRadius={ss(6)}
          px={ls(20)}
          py={ss(10)}
          mt={ss(20)}
          bg={{
            linearGradient: {
              colors: ['#22D59C', '#1AB7BE'],
              start: [0, 0],
              end: [1, 1],
            },
          }}
          opacity={isTouchNow ? 0.5 : 1}>
          <Text color='white' fontSize={sp(12)}>
            按住录音
          </Text>
        </Center>
      )}
      <Modal
        isOpen={showRecordBox}
        onClose={() => {
          setShowRecordBox(false);
        }}>
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
