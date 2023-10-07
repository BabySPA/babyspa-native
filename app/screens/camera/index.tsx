import { Camera, CameraType } from 'expo-camera';
import { DeviceEventEmitter } from 'react-native';
import { AppStackScreenProps } from '~/app/types';
import {
  Button,
  Box,
  Center,
  Circle,
  Image,
  Text,
  Pressable,
} from 'native-base';
import { manipulateAsync } from 'expo-image-manipulator';
import { sp, ss } from '~/app/utils/style';

const config = {
  lingual: {
    bg: require('~/assets/images/lingual.png'),
    tip: '当前拍摄舌部照片，请将舌头对准以下位置',
    width: ss(348),
    height: ss(400),
    mt: ss(102),
  },
  lefthand: {
    bg: require('~/assets/images/lefthand.png'),
    tip: '当前拍摄左手照片，请将左手对准以下位置',
    width: ss(660),
    height: ss(660),
    mt: ss(60),
  },
  righthand: {
    bg: require('~/assets/images/righthand.png'),
    tip: '当前拍摄右手照片，请将右手对准以下位置',
    width: ss(660),
    height: ss(660),
    mt: ss(60),
  },
  other: null,
};

export default function CameraScreen({
  navigation,
  route: {
    params: { type },
  },
}: AppStackScreenProps<'Camera'>) {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  let cameraRef: Camera | null = null;

  let flag = true;
  // useEffect(() => {
  //   ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
  //   return () => {
  //     ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
  //   };
  // }, []);

  if (!permission) {
    // Camera permissions are still loading
    return <Box />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <Center>
        <Text style={{ textAlign: 'center' }}>
          需要授予相机权限才能使用此功能
        </Text>
        <Button onPress={requestPermission}>授予权限</Button>
      </Center>
    );
  }

  const takePhoto = async () => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync({ skipProcessing: true });
      const manipResult = await manipulateAsync(
        photo.uri,
        [], // 空的resize选项，不调整宽高
        { compress: 0.8 }, // 使用 compress 选项压缩图像（0.1 表示 10% 的质量）
      );
      if (flag) {
        flag = false;
        DeviceEventEmitter.emit('event.take.photo', {
          photo: manipResult,
          type,
        });
      }
    }
    navigation.goBack();
  };

  return (
    <Box flex={1}>
      <Camera
        style={{ flex: 1 }}
        type={CameraType.back}
        ref={(ref) => (cameraRef = ref)}>
        {config[type] && (
          <Center height={'80%'}>
            <Text color={'#fff'} fontSize={sp(16)}>
              {config[type]?.tip}
            </Text>
            <Image
              mt={config[type]?.mt}
              source={config[type]?.bg}
              width={config[type]?.width}
              height={config[type]?.height}
              alt=''
            />
          </Center>
        )}
        <Pressable
          _pressed={{
            opacity: 0.8,
          }}
          hitSlop={ss(20)}
          onPress={takePhoto}
          alignItems={'center'}
          flex={1}
          mb={ss(60)}
          justifyContent={'flex-end'}>
          <Circle bgColor={'#fff'} size={sp(60)} opacity={0.8}>
            <Circle
              size={sp(50)}
              bgColor={'#fff'}
              borderWidth={ss(3)}
              borderColor={'#333'}
            />
          </Circle>
        </Pressable>
      </Camera>
    </Box>
  );
}
