import { AntDesign } from '@expo/vector-icons';
import {
  Box,
  Row,
  Text,
  Center,
  Icon,
  Pressable,
  Menu,
  Spinner,
} from 'native-base';
import { useToast } from 'react-native-toast-notifications';
import { DeviceEventEmitter } from 'react-native';
import { ss, sp, ls } from '~/app/utils/style';
import {
  MediaTypeOptions,
  launchImageLibraryAsync,
  requestCameraPermissionsAsync,
  requestMediaLibraryPermissionsAsync,
} from 'expo-image-picker';
import { toastAlert } from '~/app/utils/toast';
import { useNavigation } from '@react-navigation/native';
import { getBase64ImageFormat } from '~/app/utils';
import useFlowStore from '~/app/stores/flow';
import { UpdatingImage } from '~/app/stores/flow/type';
import dayjs from 'dayjs';
import useOssStore from '~/app/stores/oss';
import { upload } from '~/app/api/upload';
import { throttle } from 'lodash';
import PreviewImage from '~/app/components/preview-image';
import { SaveFormat, manipulateAsync } from 'expo-image-manipulator';

interface ImageBoxProps {
  type: 'lingual' | 'lefthand' | 'righthand' | 'other';
  edit: boolean;
  images: UpdatingImage[];
  previewImages?: UpdatingImage[];
  selectedCallback: (filename: string, uri: string) => void;
  takePhotoCallback: (filename: string, uri: string) => void;
  uploadCallback: (filename: string, url: string) => void;
  errorCallback: (err: any) => void;
  removedCallback: (idx: number) => void;
}

export default function ImageBox({
  type,
  edit,
  images,
  previewImages,
  selectedCallback,
  takePhotoCallback,
  uploadCallback,
  errorCallback,
  removedCallback,
}: ImageBoxProps) {
  const toast = useToast();
  const navigation = useNavigation();

  const currentFlow = useFlowStore((state) => state.currentFlow);
  const { getOssConfig } = useOssStore();

  const openCamera = () => {
    // 如果用户授予权限，则打开相机
    // 否则请求权限
    requestCameraPermissionsAsync()
      .then((res) => {
        if (res.status !== 'granted') {
          toastAlert(toast, 'error', '请授予相机权限');
        } else {
          navigation.navigate('Camera', {
            type,
          });

          DeviceEventEmitter.addListener(
            'event.take.photo',
            throttle(async ({ photo, type }) => {
              const filename = `${Date.now()}.${getBase64ImageFormat(
                photo.uri,
              )}`;
              const name = `${currentFlow.tag}-${
                currentFlow._id
              }-${dayjs().format('YYYYMMDDHHmmss')}-${filename}`;

              takePhotoCallback(name, photo.uri);

              DeviceEventEmitter.removeAllListeners('event.take.photo');

              try {
                const oss = await getOssConfig();
                const fileUrl = await upload(photo.uri, filename, oss);
                uploadCallback(name, fileUrl);
              } catch (err) {
                errorCallback(err);
              }
            }, 3000),
          );
        }
      })
      .catch((err) => {
        errorCallback(err);
      });
  };

  const openMediaLibrary = (
    selectedCallback: (filename: string, uri: string) => void,
    uploadCallback: (filename: string, url: string) => void,
  ) => {
    requestMediaLibraryPermissionsAsync()
      .then((res) => {
        if (res.status !== 'granted') {
          toastAlert(toast, 'error', '请授予相册权限');
        } else {
          launchImageLibraryAsync({
            mediaTypes: MediaTypeOptions.Images,
            allowsMultipleSelection: false,
            allowsEditing: false,
          })
            .then(async (res) => {
              if (res.assets && res.assets.length > 0) {
                const selectImageFile = res.assets[0];

                // let ratio = 1;

                // if (selectImageFile.width > 2000) {
                //   ratio = selectImageFile.width / 2000;
                // }

                // const resize = {
                //   width: selectImageFile.width / ratio,
                //   height: selectImageFile.height / ratio,
                // };

                // let actions = [];

                // if (
                //   typeof resize.width === 'number' &&
                //   typeof resize.height === 'number'
                // ) {
                //   actions.push({ resize: resize });
                // }

                const manipResult = await manipulateAsync(
                  selectImageFile.uri,
                  [], // 空的resize选项，不调整宽高
                  { compress: 0.7, format: SaveFormat.PNG }, // 使用 compress 选项压缩图像（0.1 表示 10% 的质量）
                );
                const filename = `${Date.now()}.${getBase64ImageFormat(
                  manipResult.uri,
                )}`;

                const name = `${currentFlow.tag}-${
                  currentFlow._id
                }-${dayjs().format('YYYYMMDDHHmmss')}-${filename}`;

                selectedCallback(name, manipResult.uri);

                try {
                  const oss = await getOssConfig();
                  const fileUrl = await upload(manipResult.uri, filename, oss);
                  uploadCallback(name, fileUrl);
                } catch (err) {
                  errorCallback(err);
                }
              }
            })
            .catch((err) => {
              errorCallback(err);
            });
        }
      })
      .catch((err) => {
        errorCallback(err);
      });
  };

  return (
    <Row flexWrap={'wrap'}>
      {images.map((item, index) => {
        return (
          <Center key={index} w={ss(100)} h={ss(100)} mr={ss(10)} mb={ss(10)}>
            <PreviewImage
              current={index}
              source={typeof item === 'string' ? item : item.uri}
              images={(previewImages || images).map((item) => ({
                url: typeof item === 'string' ? item : item.uri,
              }))}
            />
            {typeof item !== 'string' && (
              <Center
                w={'100%'}
                h={'100%'}
                position={'absolute'}
                bgColor={'rgba(0,0,0,0.3)'}>
                <Spinner color='emerald.500' size={sp(20)} />
              </Center>
            )}
            {edit && (
              <Pressable
                _pressed={{
                  opacity: 0.6,
                }}
                hitSlop={ss(20)}
                onPress={() => {
                  removedCallback(index);
                }}
                w={ss(16)}
                h={ss(16)}
                position={'absolute'}
                justifyContent={'center'}
                alignItems={'center'}
                bgColor={'rgba(0,0,0,0.5)'}
                top={0}
                right={0}>
                <Icon
                  as={<AntDesign name={'close'} />}
                  color='#fff'
                  size={sp(12)}
                />
              </Pressable>
            )}
          </Center>
        );
      })}
      {edit && images.length < 3 && (
        <Menu
          w={ls(280)}
          _text={{ fontSize: sp(18), color: '#000' }}
          trigger={(triggerProps) => {
            return (
              <Pressable
                _pressed={{
                  opacity: 0.6,
                }}
                hitSlop={ss(20)}
                {...triggerProps}>
                <Center
                  borderColor={'#ACACAC'}
                  borderWidth={ss(1.5)}
                  borderStyle={'dashed'}
                  bgColor={'#FFF'}
                  w={ss(100)}
                  h={ss(100)}>
                  <Icon
                    as={<AntDesign name='plus' size={sp(40)} />}
                    color={'#ACACAC'}
                  />
                </Center>
              </Pressable>
            );
          }}>
          <Box alignItems={'center'} py={ss(16)}>
            <Text fontWeight={600} justifyContent={'center'}>
              请选择上传方式
            </Text>
          </Box>
          <Menu.Item
            borderTopColor={'#DFE1DE'}
            borderTopWidth={ss(1)}
            justifyContent={'center'}
            alignItems={'center'}
            onPress={() => {
              openCamera();
            }}
            py={ss(16)}>
            <Text textAlign={'center'}>立即拍摄</Text>
          </Menu.Item>
          <Menu.Item
            borderTopColor={'#DFE1DE'}
            borderTopWidth={ss(1)}
            justifyContent={'center'}
            alignItems={'center'}
            onPress={() => {
              openMediaLibrary(
                (name, uri) => {
                  selectedCallback(name, uri);
                },
                (name, url) => {
                  uploadCallback(name, url);
                },
              );
            }}
            py={ss(16)}>
            <Text textAlign={'center'}>从相册选择</Text>
          </Menu.Item>
        </Menu>
      )}
    </Row>
  );
}
