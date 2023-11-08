import { Image } from 'react-native';
import { Modal, Pressable } from 'native-base';
import { ss } from '../utils/style';
import { useState } from 'react';
import ImageViewer from './zoom-image-viewer';

export default function PreviewImage({
  source,
  images,
  current,
  style,
}: {
  source: string;
  images: { url: string }[];
  current: number;
  style?: any;
}) {
  const [showImageModal, setShowImageModal] = useState(false);
  const loadImages = images.map((item) => {
    Image.prefetch(`${item.url}?x-oss-process=image/resize,p_70`);
    return {
      url: `${item.url}?x-oss-process=image/resize,p_70`,
    };
  });
  return (
    <>
      <Pressable
        _pressed={{
          opacity: 0.6,
        }}
        hitSlop={ss(20)}
        onPress={() => {
          setShowImageModal(true);
        }}>
        <Image
          style={{
            width: ss(100),
            height: ss(100),
            ...style,
          }}
          source={{ uri: `${source}?x-oss-process=image/resize,h_100,m_lfit` }}
          resizeMode='cover'
        />
      </Pressable>
      {showImageModal && (
        <Modal isOpen={showImageModal} onClose={() => setShowImageModal(false)}>
          <ImageViewer
            index={current}
            imageUrls={loadImages}
            saveToLocalByLongPress={false}
            style={{
              width: ss(800),
              height: ss(600),
            }}
            renderImage={(props) => {
              return <Image {...props} />;
            }}
          />
        </Modal>
      )}
    </>
  );
}
