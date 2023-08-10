import {
  Box,
  Column,
  Row,
  Text,
  Pressable,
  Image,
  useToast,
} from 'native-base';
import BoxTitle from '~/app/components/box-title';
import { ss, ls, sp } from '~/app/utils/style';
import LabelBox from './label-box';
import useManagerStore from '~/app/stores/manager';
import { Gender } from '~/app/types';
import { decodePassword, maskString } from '~/app/utils';
import { DialogModal } from '~/app/components/modals';
import { useState } from 'react';
import { toastAlert } from '~/app/utils/toast';

interface InfoBoxParams {
  onPressEdit: () => void;
  onPressCancel: () => void;
}

export default function InfoBox(params: InfoBoxParams) {
  const { currentUser, requestPatchUserPassword } = useManagerStore();
  const [isResetPassDialogOpen, setIsResetPassDialogOpen] = useState(false);
  const toast = useToast();
  return (
    <Column
      flex={1}
      bgColor={'#fff'}
      p={ss(20)}
      borderRadius={ss(10)}
      justifyContent={'space-between'}>
      <Column>
        <BoxTitle title='员工信息' />
        <Box mt={ss(30)} px={ls(20)}>
          <Row alignItems={'center'}>
            <LabelBox title='员工姓名' value={currentUser?.name} />
            <LabelBox
              title='性别'
              value={currentUser?.gender == Gender.MAN ? '男' : '女'}
            />
          </Row>
          <Row alignItems={'center'} mt={ss(40)}>
            <LabelBox title='角色' value={currentUser?.role?.name} />
            <LabelBox title='身份证号' value={currentUser?.idCardNumber} />
          </Row>
          <Row alignItems={'center'} mt={ss(40)}>
            <LabelBox title='联系电话' value={currentUser?.phoneNumber} />
            <LabelBox title='账号' value={currentUser?.username} />
          </Row>
          <Row alignItems={'center'} mt={ss(40)}>
            <LabelBox title='所属门店' value={currentUser?.shop?.name} />

            <LabelBox
              title='密码'
              value={maskString(decodePassword(currentUser?.password))}
              rightElement={
                <Pressable
                  onPress={() => {
                    setIsResetPassDialogOpen(true);
                  }}>
                  <Row alignItems={'center'} ml={ls(40)}>
                    <Image
                      alt=''
                      source={require('~/assets/images/reset-pass.png')}
                      size={ss(16)}
                    />
                    <Text color='#00B49E' fontSize={sp(16)} ml={ls(5)}>
                      重置密码
                    </Text>
                    <DialogModal
                      isOpen={isResetPassDialogOpen}
                      title='确认重置密码为身份证后六位？'
                      onClose={function (): void {
                        setIsResetPassDialogOpen(false);
                      }}
                      onConfirm={function (): void {
                        requestPatchUserPassword()
                          .then(() => {
                            toastAlert(toast, 'success', '重置密码成功');
                          })
                          .catch(() => {
                            toastAlert(toast, 'error', '重置密码失败');
                          })
                          .finally(() => {
                            setIsResetPassDialogOpen(false);
                          });
                      }}
                    />
                  </Row>
                </Pressable>
              }
            />
          </Row>
        </Box>
      </Column>
      <Row justifyContent={'center'} mb={ss(40)}>
        <Pressable
          onPress={() => {
            params.onPressCancel();
          }}>
          <Box
            px={ls(34)}
            py={ss(12)}
            bgColor={'rgba(216, 216, 216, 0.10)'}
            borderRadius={ss(4)}
            borderWidth={1}
            borderColor={'#D8D8D8'}>
            <Text color='#333' fontSize={sp(16)}>
              取消
            </Text>
          </Box>
        </Pressable>
        <Pressable
          ml={ls(74)}
          onPress={() => {
            params.onPressEdit();
          }}>
          <Box
            px={ls(34)}
            py={ss(12)}
            bgColor={'rgba(0, 180, 158, 0.10);'}
            borderRadius={ss(4)}
            borderWidth={1}
            borderColor={'#00B49E'}>
            <Text color='#00B49E' fontSize={sp(16)}>
              编辑
            </Text>
          </Box>
        </Pressable>
      </Row>
    </Column>
  );
}
