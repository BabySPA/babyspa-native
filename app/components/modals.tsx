import { Center, Modal, Text, Row, Pressable } from 'native-base';
import { sp, ss, ls } from '~/app/utils/style';

interface DialogParams {
  isOpen: boolean;
  headerText?: string;
  title?: string;
  onClose: () => void;
  onConfirm: () => void;
}
export function DialogModal({
  isOpen,
  headerText,
  title,
  onClose,
  onConfirm,
}: DialogParams) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
      }}>
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>{headerText || '温馨提示'}</Modal.Header>
        <Modal.Body>
          <Center>
            <Text fontSize={sp(20)} color='#333' mt={ss(40)}>
              {title || '是否确认结束？'}
            </Text>
            <Row mt={ss(50)} mb={ss(20)}>
              <Pressable
                onPress={() => {
                  onClose();
                }}>
                <Center
                  borderRadius={ss(4)}
                  borderWidth={1}
                  borderColor={'#03CBB2'}
                  px={ls(30)}
                  py={ss(10)}>
                  <Text color='#0C1B16' fontSize={sp(14)}>
                    否
                  </Text>
                </Center>
              </Pressable>
              <Pressable
                onPress={() => {
                  onConfirm();
                }}>
                <Center
                  ml={ls(20)}
                  borderRadius={ss(4)}
                  borderWidth={1}
                  borderColor={'#03CBB2'}
                  bgColor={'rgba(3, 203, 178, 0.20)'}
                  px={ls(30)}
                  py={ss(10)}>
                  <Text color='#0C1B16' fontSize={sp(14)}>
                    是
                  </Text>
                </Center>
              </Pressable>
            </Row>
          </Center>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
}
