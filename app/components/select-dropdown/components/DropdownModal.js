import { Modal } from 'react-native';

const DropdownModal = ({ visible, onRequestClose, children }) => {
  return (
    <Modal
      statusBarTranslucent={true}
      onRequestClose={onRequestClose}
      supportedOrientations={['landscape']}
      animationType='none'
      transparent={true}
      visible={visible}>
      {children}
    </Modal>
  );
};

export default DropdownModal;
