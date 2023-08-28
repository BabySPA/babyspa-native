import { Image } from 'expo-image';
import { Modal, Pressable } from 'native-base';
import { ss } from '../utils/style';
import { useState } from 'react';

export default function PreviewImage({
  source,
  style,
}: {
  source: string;
  style?: any;
}) {
  const [showImageModal, setShowImageModal] = useState(false);
  return (
    <>
      <Pressable
        onPress={() => {
          setShowImageModal(true);
        }}>
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
        <Image
          style={{
            width: '70%',
            height: '70%',
            ...style,
          }}
          source={source}
          contentFit='cover'
          transition={1000}
        />
      </Modal>
    </>
  );
}
