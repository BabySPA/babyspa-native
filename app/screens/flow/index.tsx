import {
  Box,
  Text,
  Pressable,
  Row,
  Icon,
  Container,
  Center,
  Modal,
  Spinner,
  Circle,
} from 'native-base';
import { useToast } from 'react-native-toast-notifications';
import { AppStackScreenProps, FlowStatus } from '../../types';
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
import { CollectStatus, AnalyzeStatus } from '~/app/stores/flow/type';
import useAuthStore from '~/app/stores/auth';

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

  const requestPatchFlowToAnalyze = useFlowStore(
    (state) => state.requestPatchFlowToAnalyze,
  );
  const requestPatchFlowToCollection = useFlowStore(
    (state) => state.requestPatchFlowToCollection,
  );
  const requestGetInitializeData = useFlowStore(
    (state) => state.requestGetInitializeData,
  );
  const requestPatchCollectionStatus = useFlowStore(
    (state) => state.requestPatchCollectionStatus,
  );
  const requestPatchAnalyzeStatus = useFlowStore(
    (state) => state.requestPatchAnalyzeStatus,
  );
  const requestStartAnalyze = useFlowStore(
    (state) => state.requestStartAnalyze,
  );
  const getFlowOperatorConfigByUser = useFlowStore(
    (state) => state.getFlowOperatorConfigByUser,
  );
  const currentFlow = useFlowStore((state) => state.currentFlow);
  const updateCurrentArchiveCustomer = useFlowStore(
    (state) => state.updateCurrentArchiveCustomer,
  );
  const { collect, analyze, customer } = currentFlow;

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (
      analyze.status !== AnalyzeStatus.DONE &&
      analyze.status !== AnalyzeStatus.CANCEL &&
      type === FlowStatus.ToBeAnalyzed
    ) {
      // 开始分析
      requestStartAnalyze()
        .then((flow) => {
          if (
            flow.analyze.status === AnalyzeStatus.IN_PROGRESS &&
            flow.analyzeOperator?._id !== user?.id
          ) {
            setOpenLockModal({
              isOpen: true,
              name: flow.analyzeOperator?.name || '',
            });
          }
        })
        .catch(async (err) => {
          toastAlert(toast, 'error', err.message);
          requestGetInitializeData();
          navigation.goBack();
        });
    }
  }, []);

  const requestGetTemplates = useManagerStore(
    (state) => state.requestGetTemplates,
  );
  const age = getAge(customer.birthday);
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
    type === FlowStatus.ToBeAnalyzed && collect.healthInfo.allergy !== '',
  );
  const [closeLoading, setCloseLoading] = useState<boolean>(false);
  const [finishLoading, setFinishLoading] = useState<boolean>(false);

  const [openLockModal, setOpenLockModal] = useState<{
    isOpen: boolean;
    name: string;
  }>({
    isOpen: false,
    name: '',
  });
  useEffect(() => {
    requestGetTemplates();
  }, []);

  const checkCollection = () => {
    if (
      collect.healthInfo.audioFiles.length == 0 &&
      collect.healthInfo.leftHandImages.length == 0 &&
      collect.healthInfo.rightHandImages.length == 0 &&
      collect.healthInfo.lingualImage.length == 0 &&
      collect.healthInfo.otherImages.length == 0
    ) {
      toastAlert(toast, 'error', '尚未输入任何有效采集信息！');
      return false;
    }

    if (!collect.guidance.trim()) {
      toastAlert(toast, 'error', '调理导向不能为空！');
      return false;
    }

    return true;
  };

  const checkAnalyze = () => {
    if (!analyze.conclusion) {
      toastAlert(toast, 'error', '注意事项尚未输入!');
      return false;
    }
    if (analyze.solution.applications.length > 0) {
      if (
        analyze.solution.applications.some(
          (item) => item.count == 0 || item.acupoint == '',
        )
      ) {
        toastAlert(toast, 'error', '请检查贴敷方案是否填写完整!');
        return false;
      }
    }

    if (analyze.solution.massages.length > 0) {
      if (analyze.solution.massages.some((item) => item.count == 0)) {
        toastAlert(toast, 'error', '请检查理疗方案信息是否正确!');
        return false;
      }
    }

    return true;
  };
  return (
    <Box flex={1}>
      <NavigationBar
        onBackIntercept={() => false}
        leftElement={
          <Row alignItems={'center'}>
            <Text color='white' fontWeight={600} fontSize={sp(20)}>
              {customer.name}
            </Text>
            <Icon
              as={
                <MaterialCommunityIcons
                  name={customer.gender == 1 ? 'gender-male' : 'gender-female'}
                />
              }
              size={sp(26)}
              color={'#FFF'}
              ml={ls(12)}
            />
            <Text color={'#FFF'} fontWeight={400} fontSize={sp(20)} ml={ls(12)}>
              {ageText}
            </Text>
            <Text color={'#FFF'} fontWeight={400} fontSize={sp(20)} ml={ls(12)}>
              {customer.phoneNumber}
            </Text>
            <Pressable
              _pressed={{
                opacity: 0.6,
              }}
              hitSlop={ss(20)}
              onPress={() => {
                // 跳转到历史记录
                updateCurrentArchiveCustomer(customer);
                navigation.navigate('CustomerArchive', {
                  defaultSelect: 1,
                });
              }}>
              <Row alignItems={'center'} bgColor={'#fff'} p={ss(8)} ml={ls(12)}>
                <Text color='#03CBB2' fontSize={sp(12)}>
                  历史记录
                </Text>
                <Icon
                  size={sp(12)}
                  as={<AntDesign name='doubleright' />}
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
          <Row alignItems={'center'}>
            <Circle bgColor={'#F56121'} size={sp(24)}>
              <Text color='#fff' fontSize={sp(14)}>
                !
              </Text>
            </Circle>
            <Text color='#F86021' fontSize={sp(18)} ml={ss(20)} maxW={'90%'}>
              过敏原：
              {collect.healthInfo.allergy || '无'}
            </Text>
          </Row>
          <Pressable
            _pressed={{
              opacity: 0.6,
            }}
            hitSlop={ss(20)}
            onPress={() => {
              setShowWarn(false);
            }}>
            <Icon
              as={<AntDesign name='closecircleo' size={sp(30)} />}
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
              borderWidth={ss(1)}>
              {configs.map((item, idx) => {
                return (
                  <Pressable
                    _pressed={{
                      opacity: 0.8,
                    }}
                    hitSlop={ss(20)}
                    key={item.key}
                    borderRightWidth={idx == configs.length - 1 ? 0 : 1}
                    borderRightColor={'#99A9BF'}
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
                      }>
                      <Text
                        fontSize={sp(20)}
                        fontWeight={600}
                        color={
                          selectedConfig.key == item.key
                            ? '#fff'
                            : item.disabled
                            ? '#999'
                            : '#333'
                        }>
                        {item.text}
                      </Text>
                    </Box>
                  </Pressable>
                );
              })}
            </Row>
          </Container>
          {type === FlowStatus.ToBeCollected && !selectedConfig.disabled && (
            <Row>
              <Pressable
                _pressed={{
                  opacity: 0.6,
                }}
                hitSlop={ss(20)}
                onPress={() => {
                  setShowFinishModal(true);
                }}>
                <Row
                  h={ss(44)}
                  px={ls(26)}
                  bgColor={'rgba(243, 96, 30, 0.20)'}
                  borderWidth={ss(1)}
                  borderColor={'#F3601E'}
                  alignItems={'center'}
                  borderRadius={ss(4)}>
                  {closeLoading && (
                    <Spinner mr={ls(5)} size={sp(20)} color='emerald.500' />
                  )}
                  <Text color='#F3601E' fontSize={sp(14)}>
                    结束
                  </Text>
                </Row>
              </Pressable>
              <Pressable
                _pressed={{
                  opacity: 0.6,
                }}
                hitSlop={ss(20)}
                onPress={() => {
                  if (!checkCollection()) {
                    return;
                  }
                  requestPatchFlowToCollection()
                    .then((res) => {
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
                        requestGetInitializeData();
                        navigation.goBack();
                      }, 2000);
                    })
                    .catch((err) => {
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
                  h={ss(44)}
                  px={ls(12)}
                  ml={ls(20)}
                  bgColor={'rgba(3, 203, 178, 0.20)'}
                  borderWidth={ss(1)}
                  borderColor={'#03CBB2'}
                  borderRadius={ss(4)}>
                  <Text color='#0C1B16' fontSize={sp(14)}>
                    提交分析
                  </Text>
                </Center>
              </Pressable>
            </Row>
          )}
          {type === FlowStatus.ToBeAnalyzed && (
            <Row>
              <Pressable
                _pressed={{
                  opacity: 0.6,
                }}
                hitSlop={ss(20)}
                onPress={() => {
                  setShowFinishModal(true);
                }}>
                <Row
                  h={ss(44)}
                  px={ls(26)}
                  bgColor={'rgba(243, 96, 30, 0.20)'}
                  borderWidth={ss(1)}
                  borderColor={'#F3601E'}
                  alignItems={'center'}
                  borderRadius={ss(4)}>
                  {closeLoading && (
                    <Spinner mr={ls(5)} size={sp(20)} color='#F3601E' />
                  )}
                  <Text color='#F3601E' fontSize={sp(14)}>
                    结束
                  </Text>
                </Row>
              </Pressable>
              <Pressable
                _pressed={{
                  opacity: 0.6,
                }}
                hitSlop={ss(20)}
                onPress={() => {
                  if (finishLoading) return;

                  if (!checkAnalyze()) {
                    return;
                  }

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
                        requestGetInitializeData();
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
                  h={ss(44)}
                  px={ls(26)}
                  ml={ls(20)}
                  bgColor={'rgba(3, 203, 178, 0.20)'}
                  borderWidth={ss(1)}
                  borderColor={'#03CBB2'}
                  borderRadius={ss(4)}>
                  {finishLoading && (
                    <Spinner mr={ls(5)} size={sp(20)} color='emerald.500' />
                  )}
                  <Text color='#0C1B16' fontSize={sp(14)}>
                    完成分析
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
      {showResultModal.type !== 'none' && (
        <Modal
          isOpen={true}
          onClose={() =>
            setShowResultModal({ type: 'none', message: '', tip: '' })
          }>
          <Modal.Content>
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
          </Modal.Content>
        </Modal>
      )}
      {showFinishModal && (
        <DialogModal
          isOpen={showFinishModal}
          title='是否确认结束？'
          onClose={function (): void {
            setShowFinishModal(false);
          }}
          onConfirm={function (): void {
            if (closeLoading) return;
            setCloseLoading(true);

            let promiseResult;
            if (selectedConfig.auth == RoleAuthority.FLOW_ANALYZE) {
              promiseResult = requestPatchAnalyzeStatus({
                status: AnalyzeStatus.CANCEL,
              });
            } else {
              promiseResult = requestPatchCollectionStatus({
                status: CollectStatus.CANCEL,
              });
            }
            promiseResult
              .then(async (res) => {
                // 取消成功
                toastAlert(toast, 'success', '取消成功！');
                requestGetInitializeData();
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
      )}
      {openLockModal.isOpen && (
        <Modal isOpen={openLockModal.isOpen} onClose={() => {}}>
          <Modal.Content>
            <Modal.Header>
              <Text fontSize={sp(20)}>温馨提示</Text>
            </Modal.Header>
            <Modal.Body>
              <Center>
                <Text fontSize={sp(20)} color='#333' mt={ss(40)}>
                  当前订单
                  <Text fontSize={sp(20)} color='#F7BA2A' fontWeight={600}>
                    {openLockModal.name}
                  </Text>
                  正在分析，请确认避免重复分析。
                </Text>
                <Row mt={ss(50)} mb={ss(20)}>
                  <Pressable
                    _pressed={{
                      opacity: 0.6,
                    }}
                    hitSlop={ss(20)}
                    onPress={() => {
                      setOpenLockModal({
                        isOpen: false,
                        name: '',
                      });
                    }}>
                    <Center
                      borderRadius={ss(4)}
                      borderWidth={ss(1)}
                      borderColor={'#03CBB2'}
                      px={ls(30)}
                      py={ss(10)}>
                      <Text color='#0C1B16' fontSize={sp(14)}>
                        我知道了
                      </Text>
                    </Center>
                  </Pressable>
                </Row>
              </Center>
            </Modal.Body>
          </Modal.Content>
        </Modal>
      )}
    </Box>
  );
}
