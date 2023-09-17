import {
  Box,
  Column,
  Row,
  Text,
  Pressable,
  Image,
  useToast,
  Spinner,
  Icon,
} from 'native-base';
import BoxTitle from '~/app/components/box-title';
import { ss, ls, sp } from '~/app/utils/style';
import LabelBox from '~/app/components/label-box';
import useManagerStore from '~/app/stores/manager';
import { Gender } from '~/app/types';
import { decodePassword, maskString } from '~/app/utils';
import { DialogModal } from '~/app/components/modals';
import { useState } from 'react';
import { toastAlert } from '~/app/utils/toast';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

interface InfoBoxParams {
  onPressEdit: () => void;
  onPressCancel: () => void;
}

export default function InfoBox(params: InfoBoxParams) {
  const {
    currentUser,
    requestPatchUserPassword,
    requestGetUsers,
    requestDeleteUser,
    updateCurrentUser,
  } = useManagerStore();
  const [isResetPassDialogOpen, setIsResetPassDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const toast = useToast();
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  return (
    <Column
      flex={1}
      bgColor={'#fff'}
      p={ss(20)}
      borderRadius={ss(10)}
      justifyContent={'space-between'}
    >
      <Column>
        <BoxTitle
          title='员工信息'
          rightElement={
            <Pressable
              hitSlop={ss(10)}
              onPress={() => {
                setIsDeleteDialogOpen(true);
              }}
              bgColor={'rgba(243, 96, 30, 0.20)'}
              borderRadius={4}
              borderWidth={1}
              borderColor={'#f3601E'}
              px={ls(26)}
              py={ss(10)}
            >
              <Row>
                {deleteLoading && <Spinner mr={ls(5)} color='#999' />}
                <Text color='#F3601E' fontSize={sp(14)}>
                  删除
                </Text>
              </Row>
            </Pressable>
          }
        />
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
              value={
                showPassword
                  ? decodePassword(currentUser?.password as string)
                  : maskString(decodePassword(currentUser?.password as string))
              }
              rightElement={
                <Pressable
                  hitSlop={ss(10)}
                  onPress={() => {
                    setIsResetPassDialogOpen(true);
                  }}
                >
                  <Row alignItems={'center'} ml={ls(40)}>
                    <Pressable
                      hitSlop={ss(10)}
                      mr={ls(20)}
                      onPress={() => {
                        setShowPassword(!showPassword);
                      }}
                    >
                      <Icon
                        as={
                          <Ionicons
                            name={
                              showPassword
                                ? 'md-eye-outline'
                                : 'md-eye-off-outline'
                            }
                          />
                        }
                        size={ss(22)}
                        color={'#00B49E'}
                      />
                    </Pressable>

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
                        requestPatchUserPassword(currentUser._id as string)
                          .then(({ data }) => {
                            toastAlert(toast, 'success', '重置密码成功');
                            updateCurrentUser({
                              password: data.password,
                            });
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
          hitSlop={ss(10)}
          ml={ls(74)}
          onPress={() => {
            params.onPressEdit();
          }}
        >
          <Box
            px={ls(34)}
            py={ss(12)}
            bgColor={'rgba(0, 180, 158, 0.10);'}
            borderRadius={4}
            borderWidth={1}
            borderColor={'#00B49E'}
          >
            <Text color='#00B49E' fontSize={sp(16)}>
              编辑
            </Text>
          </Box>
        </Pressable>
      </Row>
      <DialogModal
        isOpen={isDeleteDialogOpen}
        onClose={function (): void {
          setIsDeleteDialogOpen(false);
        }}
        title='是否确认删除门店员工？'
        onConfirm={function (): void {
          setIsDeleteDialogOpen(false);
          if (deleteLoading) return;
          setDeleteLoading(true);

          requestDeleteUser()
            .then(async (res) => {
              // 取消成功
              requestGetUsers();
              toastAlert(toast, 'success', '删除员工成功！');
              navigation.goBack();
            })
            .catch((err) => {
              // 取消失败
              toastAlert(toast, 'error', '删除员工失败！');
            })
            .finally(() => {
              setDeleteLoading(false);
            });
        }}
      />
    </Column>
  );
}
