import { AntDesign } from '@expo/vector-icons';
import {
  Box,
  Row,
  Text,
  Center,
  Icon,
  Pressable,
  Menu,
  useToast,
  ScrollView,
  Spinner,
} from 'native-base';
import { Image } from 'expo-image';
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

interface ImageBoxProps {
  images: UpdatingImage[];
  selectedCallback: (filename: string, uri: string) => void;
  takePhotoCallback: (filename: string, uri: string) => void;
  uploadCallback: (filename: string, url: string) => void;
  errorCallback: (err: any) => void;
}

export default function ImageBox({
  images,
  selectedCallback,
  takePhotoCallback,
  uploadCallback,
  errorCallback,
}: ImageBoxProps) {
  const toast = useToast();
  const navigation = useNavigation();

  const { currentFlowCustomer, addlingualImage, updatelingualImage } =
    useFlowStore();
  const { getOssConfig } = useOssStore();

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

  const openMediaLibrary = (
    selectedCallback: (filename: string, uri: string) => void,
    uploadCallback: (filename: string, url: string) => void,
    errorCallback: (err: any) => void,
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
            quality: 0.1,
          })
            .then(async (res) => {
              if (res.assets && res.assets.length > 0) {
                const selectImageFile = res.assets[0];

                const filename =
                  selectImageFile.fileName ??
                  `${Date.now()}.${getBase64ImageFormat(selectImageFile.uri)}`;

                const name = `${currentFlowCustomer.tag}-${
                  currentFlowCustomer.flowId
                }-${dayjs().format('YYYYMMDDHHmmss')}-${filename}`;

                selectedCallback(name, selectImageFile.uri);

                try {
                  const oss = await getOssConfig();
                  const fileUrl = await upload(
                    selectImageFile.uri,
                    filename,
                    oss,
                  );
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
            <Image
              style={{
                width: '100%',
                height: '100%',
              }}
              blurRadius={12}
              source={typeof item === 'string' ? item : item.uri}
              contentFit='cover'
              transition={1000}
            />
            {typeof item !== 'string' && (
              <Center
                w={'100%'}
                h={'100%'}
                position={'absolute'}
                bgColor={'rgba(0,0,0,0.3)'}>
                <Spinner color='emerald.500' />
              </Center>
            )}
          </Center>
        );
      })}
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
                h={ss(100)}>
                <Icon
                  as={<AntDesign name='plus' size={ss(40)} />}
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
          borderTopWidth={1}
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
          borderTopWidth={1}
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
              (error) => {
                // TODO error handler
              },
            );
          }}
          py={ss(16)}>
          <Text textAlign={'center'}>从相册选择</Text>
        </Menu.Item>
      </Menu>
    </Row>
  );
}
