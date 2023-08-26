import {
  Box,
  Text,
  Row,
  Column,
  Pressable,
  Image,
  Icon,
  useToast,
} from 'native-base';
import { AppStackScreenProps, Gender } from '../../types';
import NavigationBar from '~/app/components/navigation-bar';
import { sp, ss, ls } from '~/app/utils/style';
import dayjs from 'dayjs';
import BoxTitle from '~/app/components/box-title';
import LabelBox from '~/app/components/label-box';
import useAuthStore from '~/app/stores/auth';
import { decodePassword, maskString } from '~/app/utils';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { ChangePasswordModal } from '~/app/components/modals';
import { toastAlert } from '~/app/utils/toast';
import useManagerStore from '~/app/stores/manager';

export default function Personal({
  navigation,
}: AppStackScreenProps<'Personal'>) {
  const { user, currentShopWithRole, logout } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isResetPassDialogOpen, setIsResetPassDialogOpen] = useState(false);

  const { requestPatchUserPassword } = useManagerStore();
  const toast = useToast();
  return (
    <Box flex={1}>
      <NavigationBar
        onBackIntercept={() => false}
        leftElement={
          <Text color='white' fontWeight={600} fontSize={sp(20, { min: 14 })}>
            个人中心
          </Text>
        }
        rightElement={
          <Text color={'#fff'} fontSize={sp(20)}>
            {dayjs().format('YYYY-MM-DD')}
          </Text>
        }
      />
      <Row safeAreaLeft bgColor={'#F6F6FA'} flex={1} p={ss(20)} safeAreaBottom>
        <Column
          flex={1}
          bgColor={'#fff'}
          p={ss(20)}
          borderRadius={ss(10)}
          justifyContent={'space-between'}>
          <Column>
            <BoxTitle title='员工信息' rightElement={null} />
            <Box mt={ss(30)} px={ls(20)}>
              <Row alignItems={'center'}>
                <LabelBox title='员工姓名' value={user?.name} />
                <LabelBox
                  title='性别'
                  value={user?.gender == Gender.MAN ? '男' : '女'}
                />
              </Row>
              <Row alignItems={'center'} mt={ss(40)}>
                <LabelBox title='角色' value={currentShopWithRole?.role.name} />
                <LabelBox title='身份证号' value={user?.idCardNumber} />
              </Row>
              <Row alignItems={'center'} mt={ss(40)}>
                <LabelBox title='联系电话' value={user?.phoneNumber} />
                <LabelBox title='账号' value={user?.username} />
              </Row>
              <Row alignItems={'center'} mt={ss(40)}>
                <LabelBox
                  title='所属门店'
                  value={currentShopWithRole?.shop?.name}
                />

                <LabelBox
                  title='密码'
                  value={
                    showPassword
                      ? decodePassword(user?.password as string)
                      : maskString(decodePassword(user?.password as string))
                  }
                  alignItems='center'
                  rightElement={
                    <Row alignItems={'center'} ml={ls(26)}>
                      <Pressable
                        mr={ls(20)}
                        onPress={() => {
                          setShowPassword(!showPassword);
                        }}>
                        <Icon
                          as={
                            <Ionicons
                              name={
                                showPassword ? 'md-eye' : 'md-eye-off-sharp'
                              }
                            />
                          }
                          size={sp(22)}
                          color={'#00B49E'}
                        />
                      </Pressable>
                      <Pressable
                        onPress={() => {
                          setIsResetPassDialogOpen(true);
                        }}>
                        <Row alignItems={'center'}>
                          <Image
                            alt=''
                            source={require('~/assets/images/reset-pass.png')}
                            size={ss(16)}
                          />
                          <Text color='#00B49E' fontSize={sp(16)} ml={ls(5)}>
                            修改密码
                          </Text>
                          <ChangePasswordModal
                            password={user?.password as string}
                            isOpen={isResetPassDialogOpen}
                            onClose={function (): void {
                              setIsResetPassDialogOpen(false);
                            }}
                            onConfirm={function (text: string): void {
                              requestPatchUserPassword(user?.id || '', text)
                                .then(() => {
                                  toastAlert(
                                    toast,
                                    'success',
                                    '修改密码成功，正在退出请重新登录',
                                  );

                                  logout();
                                })
                                .catch(() => {
                                  toastAlert(toast, 'error', '修改密码失败');
                                })
                                .finally(() => {
                                  setIsResetPassDialogOpen(false);
                                });
                            }}
                          />
                        </Row>
                      </Pressable>
                    </Row>
                  }
                />
              </Row>
            </Box>
          </Column>
        </Column>
      </Row>
    </Box>
  );
}