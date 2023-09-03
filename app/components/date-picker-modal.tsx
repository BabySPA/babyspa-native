import dayjs from 'dayjs';
import { Modal, Row, Flex, Pressable, Box, useToast } from 'native-base';
import DatePicker from '~/app/components/date-picker';
import { ss, ls, sp } from '~/app/utils/style';
import { toastAlert } from '../utils/toast';

interface DatePickerModalParams {
  isOpen: boolean;
  onClose: () => void;
  onSelectedChange: (date: string) => void;
  current: string | undefined;
  selected: string | undefined;
}
export default function DatePickerModal({
  isOpen,
  onClose,
  onSelectedChange,
  current,
  selected,
}: DatePickerModalParams) {
  const toast = useToast();
  let currentSelectBirthday = current;
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
      }}>
      <Flex w={'35%'} backgroundColor='white' borderRadius={5} p={ss(8)}>
        <DatePicker
          options={{
            textHeaderFontSize: sp(16, { min: 12 }),
            mainColor: '#00B49E',
          }}
          onSelectedChange={(date) => {
            currentSelectBirthday = date;
          }}
          current={current}
          selected={selected}
          mode='calendar'
        />
        <Row justifyContent={'flex-end'} mt={ss(12)}>
          <Pressable
            hitSlop={ss(10)}
            onPress={() => {
              if (dayjs(currentSelectBirthday).isAfter(dayjs())) {
                toastAlert(toast, 'error', '不能大于当前日期');
                return;
              }
              onSelectedChange(currentSelectBirthday ?? '');
              onClose();
            }}>
            <Box
              bgColor={'#00B49E'}
              px={ls(26)}
              py={ss(12)}
              borderRadius={ss(8)}
              _text={{ fontSize: ss(16), color: 'white' }}>
              确定
            </Box>
          </Pressable>
          <Pressable
            hitSlop={ss(10)}
            onPress={() => {
              onClose();
            }}>
            <Box
              bgColor={'#D8D8D8'}
              px={ls(26)}
              py={ss(12)}
              ml={ls(10)}
              borderRadius={ss(8)}
              _text={{ fontSize: ss(16, { min: 12 }), color: 'white' }}>
              取消
            </Box>
          </Pressable>
        </Row>
      </Flex>
    </Modal>
  );
}
