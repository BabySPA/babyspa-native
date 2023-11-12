import { Box, Text, Row, Column, Pressable, Image, Icon } from 'native-base';
import { AppStackScreenProps, Gender } from '../../types';
import { useToast } from 'react-native-toast-notifications';
import NavigationBar from '~/app/components/navigation-bar';
import { sp, ss, ls } from '~/app/utils/style';
import dayjs from 'dayjs';
import BoxTitle from '~/app/components/box-title';
import LabelBox from '~/app/components/label-box';
import useAuthStore from '~/app/stores/auth';
import { decodePassword, maskString } from '~/app/utils';
import { useEffect, useState } from 'react';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { ChangePasswordModal, DialogModal } from '~/app/components/modals';
import { toastAlert } from '~/app/utils/toast';
import useManagerStore from '~/app/stores/manager';
import Environment from '~/app/config/environment';
import request from '~/app/api';
import { Linking, Platform } from 'react-native';

export default function Personal({
  navigation,
}: AppStackScreenProps<'Personal'>) {
  const user = useAuthStore((state) => state.user);
  const currentShopWithRole = useAuthStore(
    (state) => state.currentShopWithRole,
  );

  const logout = useAuthStore((state) => state.logout);
  const [showPassword, setShowPassword] = useState(false);
  const [isResetPassDialogOpen, setIsResetPassDialogOpen] = useState(false);

  const requestPatchUserPassword = useManagerStore(
    (state) => state.requestPatchUserPassword,
  );
  const toast = useToast();
  const [showDialog, setShowDialog] = useState(false);

  const [newVersionUrl, setNewVersionUrl] = useState('');

  useEffect(() => {
    request.get(`/client/version`).then(({ data }) => {
      const { version, android, ios } = data;
      console.log(version, android, ios);
      if (version !== Environment.version) {
        // has new version
        setNewVersionUrl(Platform.OS === 'ios' ? ios : android);
      }
    });
  }, []);
  return (
    <Box flex={1}>
      <NavigationBar
        onBackIntercept={() => false}
        leftElement={
          <Text color='white' fontWeight={600} fontSize={sp(20)}>
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
                    <Row alignItems={'center'} ml={ls(18)}>
                      <Pressable
                        _pressed={{
                          opacity: 0.6,
                        }}
                        hitSlop={ss(20)}
                        onPress={() => {
                          setShowPassword(!showPassword);
                        }}>
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
                          size={sp(22)}
                          color={'#00B49E'}
                        />
                      </Pressable>
                      <Pressable
                        _pressed={{
                          opacity: 0.6,
                        }}
                        hitSlop={ss(20)}
                        ml={ls(38)}
                        onPress={() => {
                          setIsResetPassDialogOpen(true);
                        }}>
                        <Row alignItems={'center'}>
                          <Image
                            alt=''
                            source={require('~/assets/images/reset-pass.png')}
                            size={sp(24)}
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
                                    '修改密码成功，正在退出请重新登录...',
                                  );

                                  setTimeout(() => {
                                    logout();
                                  }, 2000);
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
              <Row alignItems={'center'} mt={ss(40)}>
                <LabelBox
                  title='版本'
                  alignItems='center'
                  rightElement={
                    newVersionUrl !== '' ? (
                      <Row alignItems={'center'} ml={ls(18)}>
                        <Pressable
                          _pressed={{
                            opacity: 0.6,
                          }}
                          hitSlop={ss(20)}
                          onPress={() => {
                            Linking.openURL(newVersionUrl);
                          }}>
                          <Row alignItems={'center'}>
                            <Icon
                              as={<MaterialIcons name='get-app' />}
                              size={sp(24)}
                              color='#00B49E'
                            />

                            <Text color='#00B49E' fontSize={sp(16)} ml={ls(5)}>
                              发现新版本，点击下载
                            </Text>
                          </Row>
                        </Pressable>
                      </Row>
                    ) : (
                      <></>
                    )
                  }
                  value={Environment.version}
                />
              </Row>
            </Box>
          </Column>
          <Row justifyContent={'center'} mb={ss(60)}>
            <Pressable
              _pressed={{
                opacity: 0.6,
              }}
              hitSlop={ss(20)}
              onPress={() => {
                setShowDialog(true);
              }}>
              <Row
                alignItems={'center'}
                justifyContent={'center'}
                w={ls(260)}
                h={ss(50)}
                mt={ss(50)}
                borderRadius={ss(30)}
                bg={{
                  linearGradient: {
                    colors: ['#22D59C', '#1AB7BE'],
                    start: [0, 0],
                    end: [1, 1],
                  },
                }}>
                <Text color='#fff' fontSize={sp(18)}>
                  退出登录
                </Text>
              </Row>
            </Pressable>
            {showDialog && (
              <DialogModal
                title='是否确认退出登录？'
                isOpen={showDialog}
                onClose={function (): void {
                  setShowDialog(false);
                }}
                onConfirm={function (): void {
                  logout();
                  setShowDialog(false);
                }}
              />
            )}
          </Row>
        </Column>
      </Row>
    </Box>
  );
}
