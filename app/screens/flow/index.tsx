import {
  Box,
  Text,
  Pressable,
  Row,
  Icon,
  Container,
  Center,
  Modal,
  useToast,
  Spinner,
} from 'native-base';
import { AppStackScreenProps, CustomerStatus } from '../../types';
import NavigationBar from '~/app/components/navigation-bar';
import { sp, ss, ls } from '~/app/utils/style';
import { useEffect, useState } from 'react';
import { Image } from 'react-native';
import useFlowStore from '~/app/stores/flow';
import { getAge } from '~/app/utils';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import HealthInfo from './components/health-info';
import Guidance from './components/guidance-info';
import Conclusion from './components/conclusion-info';
import Solution from './components/solution-info';
import { DialogModal } from '~/app/components/modals';
import { toastAlert } from '~/app/utils/toast';
import { FlowOperatorConfigItem, FlowOperatorKey } from '~/app/constants';
import { RoleAuthority } from '~/app/stores/auth/type';
import useManagerStore from '~/app/stores/manager';

interface ResultModal {
  type: 'success' | 'fail' | 'none';
  message: string;
  tip?: string;
}

export default function FlowScreen({
  navigation,
  route: { params },
}: AppStackScreenProps<'Flow'>) {
  const { type } = params;
  const toast = useToast();
  const {
    requestGetFlow,
    currentFlowCustomer,
    requestPatchFlowToCollection,
    getFlowOperatorConfigByUser,
    requestPatchCustomerStatus,
    requestGetInitializeData,
    requestPatchFlowToAnalyze,
    currentFlow: { collect },
    updateCurrentArchiveCustomer,
  } = useFlowStore();

  const { requestGetTemplates } = useManagerStore();
  const age = getAge(currentFlowCustomer.birthday);
  const ageText = `${age?.year}岁${age?.month}月`;

  const { configs, selectIdx } = getFlowOperatorConfigByUser(type);

  const [selectedConfig, setSelectedConfig] = useState<FlowOperatorConfigItem>(
    configs[selectIdx],
  );

  const [showResultModal, setShowResultModal] = useState<ResultModal>({
    type: 'none',
    message: '',
    tip: '',
  });

  const [showFinishModal, setShowFinishModal] = useState<boolean>(false);
  const [showWarn, setShowWarn] = useState<boolean>(
    selectedConfig.auth === RoleAuthority.FLOW_ANALYZE,
  );
  const [closeLoading, setCloseLoading] = useState<boolean>(false);
  const [finishLoading, setFinishLoading] = useState<boolean>(false);

  useEffect(() => {
    requestGetFlow(currentFlowCustomer.flowId);
    requestGetTemplates();
  }, []);

  return (
    <Box flex={1}>
      <NavigationBar
        onBackIntercept={() => false}
        leftElement={
          <Row alignItems={'center'}>
            <Text color='white' fontWeight={600} fontSize={sp(20)}>
              {currentFlowCustomer.name}
            </Text>
            <Icon
              as={
                <MaterialCommunityIcons
                  name={
                    currentFlowCustomer.gender == 1
                      ? 'gender-male'
                      : 'gender-female'
                  }
                />
              }
              size={ss(26)}
              color={'#FFF'}
              ml={ls(12)}
            />
            <Text color={'#FFF'} fontWeight={400} fontSize={sp(20)} ml={ls(12)}>
              {ageText}
            </Text>
            <Text color={'#FFF'} fontWeight={400} fontSize={sp(20)} ml={ls(12)}>
              {currentFlowCustomer.phoneNumber}
            </Text>
            <Pressable
              hitSlop={ss(10)}
              onPress={() => {
                // 跳转到历史记录
                updateCurrentArchiveCustomer(currentFlowCustomer);
                navigation.navigate('CustomerArchive');
              }}>
              <Row alignItems={'center'} bgColor={'#fff'} p={ss(8)} ml={ls(12)}>
                <Text color='#03CBB2'>历史记录</Text>
                <Icon
                  as={<AntDesign name='doubleright' size={ss(20)} />}
                  color={'#03CBB2'}
                />
              </Row>
            </Pressable>
          </Row>
        }
        rightElement={
          <Text color={'#fff'} fontSize={sp(20)}>
            {dayjs().format('YYYY-MM-DD HH:mm')}
          </Text>
        }
      />
      {showWarn && (
        <Row
          py={ss(12)}
          px={ls(20)}
          bgColor={'#F9EDA5'}
          alignItems={'center'}
          justifyContent={'space-between'}>
          <Row>
            <Center
              w={ss(20)}
              h={ss(20)}
              borderRadius={ss(10)}
              bgColor={'#F56121'}
              _text={{
                color: '#fff',
                fontSize: sp(14),
              }}>
              !
            </Center>
            <Text color='#F86021' fontSize={sp(18)} ml={ss(20)}>
              过敏原：
              {collect.healthInfo.allergy || currentFlowCustomer.allergy}
            </Text>
          </Row>
          <Pressable
            hitSlop={ss(10)}
            onPress={() => {
              setShowWarn(false);
            }}>
            <Icon
              as={<AntDesign name='closecircleo' size={ss(30)} />}
              color={'#99A9BF'}
            />
          </Pressable>
        </Row>
      )}
      <Box safeAreaLeft safeAreaBottom bgColor={'#F6F6FA'} flex={1} p={ss(10)}>
        <Row
          bgColor='#fff'
          borderRadius={ss(10)}
          py={ss(16)}
          px={ls(20)}
          alignItems={'center'}
          justifyContent={'space-between'}>
          <Container>
            <Row
              borderRadius={ss(4)}
              borderColor={'#99A9BF'}
              borderWidth={1}
              borderRightWidth={1}>
              {configs.map((item, idx) => {
                return (
                  <Pressable
                    hitSlop={ss(10)}
                    key={item.key}
                    onPress={() => {
                      setSelectedConfig(item);
                    }}>
                    <Box
                      minW={ss(120)}
                      px={ss(20)}
                      py={ss(10)}
                      bgColor={
                        selectedConfig.key == item.key
                          ? '#03CBB2'
                          : item.disabled
                          ? '#F1F1F1'
                          : 'transparent'
                      }
                      borderRightWidth={idx == configs.length - 1 ? 1 : 0}
                      borderRightColor={'#99A9BF'}>
                      <Text
                        fontSize={sp(20)}
                        fontWeight={600}
                        color={
                          selectedConfig.key == item.key ? '#fff' : '#333'
                        }>
                        {item.text}
                      </Text>
                    </Box>
                  </Pressable>
                );
              })}
            </Row>
          </Container>
          {selectedConfig.auth == RoleAuthority.FLOW_COLLECTION &&
            !selectedConfig.disabled && (
              <Row>
                <Pressable
                  hitSlop={ss(10)}
                  onPress={() => {
                    setShowFinishModal(true);
                  }}>
                  <Row
                    h={ss(40)}
                    px={ls(26)}
                    bgColor={'rgba(243, 96, 30, 0.20)'}
                    borderWidth={1}
                    borderColor={'#F3601E'}
                    alignItems={'center'}
                    borderRadius={ss(4)}>
                    {closeLoading && <Spinner mr={ls(5)} color='emerald.500' />}
                    <Text color='#F3601E' fontSize={sp(14)}>
                      结束
                    </Text>
                  </Row>
                </Pressable>
                <Pressable
                  hitSlop={ss(10)}
                  onPress={() => {
                    requestPatchFlowToCollection()
                      .then((res) => {
                        console.log('requestPatchFlowToCollection res', res);
                        setShowResultModal({
                          type: 'success',
                          message: '提交成功，待分析师处理',
                          tip: '',
                        });
                        setTimeout(async () => {
                          setShowResultModal({
                            type: 'none',
                            message: '',
                            tip: '',
                          });
                          await requestGetInitializeData();
                          navigation.goBack();
                        }, 2000);
                      })
                      .catch((err) => {
                        console.log('requestPatchFlowToCollection err', err);
                        setShowResultModal({
                          type: 'fail',
                          message: '提交失败，' + err.message,
                          tip: '',
                        });
                        setTimeout(() => {
                          setShowResultModal({
                            type: 'none',
                            message: '',
                            tip: '',
                          });
                        }, 2000);
                      });
                  }}>
                  <Center
                    w={ls(80)}
                    h={ss(40)}
                    ml={ls(20)}
                    bgColor={'rgba(3, 203, 178, 0.20)'}
                    borderWidth={1}
                    borderColor={'#03CBB2'}
                    borderRadius={ss(4)}>
                    <Text color='#0C1B16' fontSize={sp(14)}>
                      提交分析
                    </Text>
                  </Center>
                </Pressable>
              </Row>
            )}
          {selectedConfig.auth == RoleAuthority.FLOW_ANALYZE && (
            <Row>
              <Pressable
                hitSlop={ss(10)}
                onPress={() => {
                  setShowFinishModal(true);
                }}>
                <Row
                  h={ss(40)}
                  px={ls(26)}
                  bgColor={'rgba(243, 96, 30, 0.20)'}
                  borderWidth={1}
                  borderColor={'#F3601E'}
                  alignItems={'center'}
                  borderRadius={ss(4)}>
                  {closeLoading && <Spinner mr={ls(5)} color='#F3601E' />}
                  <Text color='#F3601E' fontSize={sp(14)}>
                    结束
                  </Text>
                </Row>
              </Pressable>
              <Pressable
                hitSlop={ss(10)}
                onPress={() => {
                  if (finishLoading) return;

                  setFinishLoading(true);

                  requestPatchFlowToAnalyze()
                    .then((res) => {
                      setShowResultModal({
                        type: 'success',
                        message: '分析完成',
                        tip: '温馨提示：半小时内支持对分析结果调整',
                      });
                      setTimeout(async () => {
                        setShowResultModal({
                          type: 'none',
                          message: '',
                          tip: '',
                        });
                        await requestGetInitializeData();
                        // navigation.goBack();
                        navigation.replace('FlowInfo', {
                          from: 'analyze',
                        });
                      }, 2000);
                    })
                    .catch((err) => {})
                    .finally(() => {
                      setFinishLoading(false);
                    });
                }}>
                <Row
                  alignItems={'center'}
                  h={ss(40)}
                  px={ls(26)}
                  ml={ls(20)}
                  bgColor={'rgba(3, 203, 178, 0.20)'}
                  borderWidth={1}
                  borderColor={'#03CBB2'}
                  borderRadius={ss(4)}>
                  {finishLoading && <Spinner mr={ls(5)} color='emerald.500' />}
                  <Text color='#0C1B16' fontSize={sp(14)}>
                    完成
                  </Text>
                </Row>
              </Pressable>
            </Row>
          )}
        </Row>
        <Box borderRadius={ss(10)} flex={1} mt={ss(10)}>
          {selectedConfig.key == FlowOperatorKey.healthInfo && (
            <HealthInfo selectedConfig={selectedConfig} />
          )}
          {selectedConfig.key == FlowOperatorKey.guidance && (
            <Guidance selectedConfig={selectedConfig} />
          )}
          {selectedConfig.key == FlowOperatorKey.conclusions && (
            <Conclusion selectedConfig={selectedConfig} />
          )}
          {selectedConfig.key == FlowOperatorKey.solution && (
            <Solution selectedConfig={selectedConfig} />
          )}
        </Box>
      </Box>
      <Modal
        isOpen={showResultModal.type !== 'none'}
        onClose={() =>
          setShowResultModal({ type: 'none', message: '', tip: '' })
        }>
        <Modal.Content>
          {showResultModal.type !== 'none' && (
            <Center py={ss(60)}>
              <Image
                style={{ width: ss(72), height: ss(72) }}
                source={
                  showResultModal.type === 'success'
                    ? require('~/assets/images/collection-result-success.png')
                    : require('~/assets/images/collection-result-fail.png')
                }
              />
              <Text fontSize={sp(20)} color='#333' mt={ss(27)}>
                {showResultModal.message}
              </Text>
              <Text fontSize={sp(14)} color='#999' mt={ss(14)}>
                {showResultModal.tip}
              </Text>
            </Center>
          )}
        </Modal.Content>
      </Modal>
      <DialogModal
        isOpen={showFinishModal}
        title='是否确认结束？'
        onClose={function (): void {
          setShowFinishModal(false);
        }}
        onConfirm={function (): void {
          if (closeLoading) return;
          setCloseLoading(true);
          requestPatchCustomerStatus({
            status: CustomerStatus.Canceled,
            type: 'flow',
          })
            .then(async (res) => {
              // 取消成功
              toastAlert(toast, 'success', '取消成功！');
              await requestGetInitializeData();
              navigation.goBack();
            })
            .catch((err) => {
              // 取消失败
              toastAlert(toast, 'error', '取消失败！');
            })
            .finally(() => {
              setShowFinishModal(false);
              setCloseLoading(false);
            });
        }}
      />
    </Box>
  );
}
