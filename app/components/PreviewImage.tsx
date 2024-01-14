import { StatusBar, Text, View, ImageResizeMode } from 'react-native';
import { Box, Center, Icon, Pressable, Row } from 'native-base';
import { ls, sp, ss } from '../utils/style';
import { useState } from 'react';
import { ImageGallery, ImageObject } from '../components/image-gallery';
import { CachedImage } from '~/app/components/cache-image';
import { AntDesign } from '@expo/vector-icons';

export default function PreviewImage({
  source,
  images,
  style,
}: {
  source: string;
  images: { url: string }[];
  current: number;
  style?: any;
}) {
  const [showImageModal, setShowImageModal] = useState(false);
  const loadImages = images.map((item) => {
    return {
      url: `${item.url}?x-oss-process=image/resize,p_70`,
      thumbUrl: `${item.url}?x-oss-process=image/resize,p_20`,
    };
  });

  const renderHeaderComponent = (image: ImageObject, currentIndex: number) => {
    return (
      <Row safeAreaLeft>
        <Row alignItems={'center'} height={ss(52)}>
          <Pressable
            _pressed={{
              opacity: 0.6,
            }}
            hitSlop={ss(20)}
            onPress={() => {
              setShowImageModal(false);
            }}>
            <Icon
              as={<AntDesign name='close' />}
              size={sp(20)}
              color={'#FFF'}
              mr={ls(10)}
            />
          </Pressable>
        </Row>
      </Row>
    );
  };

  const renderCustomThumb = (
    image: ImageObject,
    index: number,
    isSelected: boolean,
  ) => {
    return (
      <CachedImage
        resizeMode={'cover'}
        style={
          isSelected
            ? [
                { borderColor: 'green' },
                {
                  borderWidth: ss(4),
                  width: ss(60),
                  height: ss(60),
                  borderRadius: ss(4),
                },
              ]
            : [
                {
                  borderColor: 'transparent',
                  borderWidth: ss(4),
                  width: ss(60),
                  height: ss(60),
                  borderRadius: ss(4),
                },
              ]
        }
        source={image.thumbUrl ? image.thumbUrl : image.url}
      />
    );
  };

  const renderCustomImage = (image: ImageObject) => {
    return (
      <View
        style={{
          alignItems: 'center',
          borderRadius: ss(11),
          height: '100%',
          justifyContent: 'center',
          paddingHorizontal: ls(24),
          width: '100%',
        }}>
        <CachedImage
          resizeMode='contain'
          source={image.url}
          style={{
            borderWidth: ss(3),
            height: '100%',
            overflow: 'hidden',
            width: '100%',
          }}
          thumbnailSource={image.thumbUrl}
        />
      </View>
    );
  };
  return (
    <>
      {typeof source === 'string' ? (
        <Pressable
          _pressed={{
            opacity: 0.6,
          }}
          hitSlop={ss(20)}
          onPress={() => {
            setShowImageModal(true);
          }}>
          <CachedImage
            resizeMode='cover'
            source={`${source}?x-oss-process=image/resize,p_20`}
            thumbnailSource={`${source}?x-oss-process=image/resize,p_20`}
            style={{
              width: ss(100),
              height: ss(100),
              ...style,
            }}
          />
        </Pressable>
      ) : (
        <Center
          w={ss(100)}
          h={ss(100)}
          borderWidth={1}
          borderColor={'#ddd'}
          backgroundColor={'#ccc'}>
          <Text>图片有问题请理疗师重新上传</Text>
        </Center>
      )}
      <ImageGallery
        close={() => {
          setShowImageModal(false);
        }}
        renderCustomImage={renderCustomImage}
        renderHeaderComponent={renderHeaderComponent}
        renderCustomThumb={renderCustomThumb}
        isOpen={showImageModal}
        images={loadImages}
      />
    </>
  );
}
