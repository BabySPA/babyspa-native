import { Image } from 'expo-image';
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
  return (
    <>
      <Pressable
        hitSlop={ss(10)}
        onPress={() => {
          setShowImageModal(true);
        }}
      >
        <Image
          style={{
            width: ss(100),
            height: ss(100),
            ...style,
          }}
          source={source}
          contentFit='cover'
          transition={1000}
        />
      </Pressable>
      <Modal isOpen={showImageModal} onClose={() => setShowImageModal(false)}>
        <ImageViewer
          index={current}
          imageUrls={images}
          saveToLocalByLongPress={false}
          style={{
            width: ss(800),
            height: ss(600),
          }}
        />
      </Modal>
    </>
  );
}
