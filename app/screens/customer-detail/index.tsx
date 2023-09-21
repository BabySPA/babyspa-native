import { Box, Text, Pressable, Row, useToast, Spinner } from 'native-base';
import { AppStackScreenProps, FlowStatus } from '../../types';
import NavigationBar from '~/app/components/navigation-bar';
import { sp, ss, ls } from '~/app/utils/style';
import { useEffect, useState } from 'react';
import useFlowStore from '~/app/stores/flow';
import { toastAlert } from '~/app/utils/toast';
import EditBox from './components/edit-box';
import InfoBox from './components/info-box';
import { DialogModal } from '~/app/components/modals';
import Register from '../home/fragments/register';
import { RegisterStatus } from '~/app/stores/flow/type';

export default function CustomerDetail({
  navigation,
  route: { params },
}: AppStackScreenProps<'CustomerDetail'>) {
  const {
    requestGetOperators,
    requestPatchRegisterStatus,
    currentFlow,
    requestGetInitializeData,
  } = useFlowStore();

  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    requestGetOperators();
  }, [requestGetOperators]);

  return (
    <Box flex={1}>
      <NavigationBar
        onBackIntercept={() => false}
        leftElement={
          <Text color='white' fontWeight={600} fontSize={sp(20)}>
            客户详情
          </Text>
        }
        rightElement={
          !edit && currentFlow.register.status === RegisterStatus.DONE ? (
            <Pressable
              _pressed={{
                opacity: 0.6,
              }}
              hitSlop={ss(20)}
              onPress={() => {
                setShowModal(true);
              }}>
              <Row
                bgColor={'white'}
                borderRadius={ss(4)}
                px={ls(26)}
                py={ss(10)}>
                {loading && (
                  <Spinner mr={ls(5)} size={ss(20)} color='emerald.500' />
                )}
                <Text
                  color={'#03CBB2'}
                  opacity={loading ? 0.6 : 1}
                  fontSize={sp(14)}>
                  取消登记
                </Text>
              </Row>
            </Pressable>
          ) : null
        }
      />
      <Row safeAreaLeft bgColor={'#F6F6FA'} flex={1} p={ss(20)} safeAreaBottom>
        {edit ? (
          <EditBox
            onEditFinish={function (): void {
              setEdit(false);
            }}
          />
        ) : (
          <InfoBox
            onPressCancel={() => {
              navigation.goBack();
            }}
            onPressEdit={() => {
              setEdit(true);
            }}
          />
        )}
      </Row>
      <DialogModal
        isOpen={showModal}
        onClose={function (): void {
          setShowModal(false);
        }}
        title='是否确认取消登记？'
        onConfirm={function (): void {
          setShowModal(false);
          if (loading) return;
          setLoading(true);
          requestPatchRegisterStatus({
            status: RegisterStatus.CANCEL,
          })
            .then(async (res) => {
              // 取消成功
              toastAlert(toast, 'success', '取消成功！');
              await requestGetInitializeData();
            })
            .catch((err) => {
              // 取消失败
              toastAlert(toast, 'error', '取消失败！');
            })
            .finally(() => {
              setLoading(false);
            });
        }}
      />
    </Box>
  );
}
