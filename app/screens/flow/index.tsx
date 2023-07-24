import {
  Box,
  Text,
  Pressable,
  Row,
  Icon,
  Container,
  Center,
  Modal,
  Button,
} from 'native-base';
import { AppStackScreenProps } from '../../types';
import NavigationBar from '~/app/components/navigation-bar';
import { sp, ss, ls } from '~/app/utils/style';
import { useEffect, useState } from 'react';
import { Image } from 'react-native';
import useFlowStore from '~/app/stores/flow';
import { getAge, getFlowOperatorConfigByUser } from '~/app/utils';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import HealthInfo from './components/health-info';
import Guidance from './components/guidance-info';
import Conclusion from './components/conclusion-info';
import Solution from './components/solution-info';

interface ResultModal {
  type: 'success' | 'fail' | 'none';
  message: string;
  tip?: string;
}

export default function FlowScreen({
  navigation,
}: AppStackScreenProps<'Flow'>) {
  const { requestGetFlow, currentFlowCustomer, requestPatchFlowToCollection } =
    useFlowStore();

  const age = getAge(currentFlowCustomer.birthday);
  const ageText = `${age?.year}岁${age?.month}月`;

  const FlowOperators = getFlowOperatorConfigByUser();

  const [showResultModal, setShowResultModal] = useState<ResultModal>({
    type: 'none',
    message: '',
  });

  const [showFinishModal, setShowFinishModal] = useState<boolean>(false);

  useEffect(() => {
    requestGetFlow(currentFlowCustomer.flowId);
  }, [requestGetFlow]);

  const [operatorIdx, setOperatorIdx] = useState(0);

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
            <Pressable>
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
              borderStyle={'solid'}>
              {FlowOperators.map((item, idx) => {
                return (
                  <Pressable
                    key={item.key}
                    onPress={() => {
                      setOperatorIdx(idx);
                    }}>
                    <Box
                      minW={ss(120)}
                      px={ss(20)}
                      py={ss(10)}
                      bgColor={operatorIdx == idx ? '#03CBB2' : '#F1F1F1'}
                      borderRightWidth={idx == FlowOperators.length - 1 ? 0 : 1}
                      borderRightColor={'#99A9BF'}>
                      <Text
                        fontSize={sp(20)}
                        fontWeight={600}
                        color={operatorIdx == idx ? '#fff' : '#333'}>
                        {item.text}
                      </Text>
                    </Box>
                  </Pressable>
                );
              })}
            </Row>
          </Container>
          {(operatorIdx === 0 || operatorIdx === 1) && (
            <Row>
              <Pressable
                onPress={() => {
                  setShowFinishModal(true);
                }}>
                <Center
                  w={ls(80)}
                  h={ss(40)}
                  bgColor={'rgba(243, 96, 30, 0.20)'}
                  borderWidth={1}
                  borderColor={'#F3601E'}
                  borderRadius={ss(4)}>
                  <Text color='#F3601E' fontSize={sp(14)}>
                    结束
                  </Text>
                </Center>
              </Pressable>
              <Pressable
                onPress={() => {
                  requestPatchFlowToCollection()
                    .then((res) => {
                      console.log('requestPatchFlowToCollection res', res);
                      setShowResultModal({
                        type: 'success',
                        message: '提交成功，待分析师处理',
                      });
                    })
                    .catch((err) => {
                      console.log('requestPatchFlowToCollection err', err);
                      setShowResultModal({
                        type: 'fail',
                        message: '提交失败，' + err.message,
                      });
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
          {(operatorIdx === 2 || operatorIdx === 3) && (
            <Row>
              <Pressable
                onPress={() => {
                  setShowFinishModal(true);
                }}>
                <Center
                  w={ls(80)}
                  h={ss(40)}
                  bgColor={'rgba(243, 96, 30, 0.20)'}
                  borderWidth={1}
                  borderColor={'#F3601E'}
                  borderRadius={ss(4)}>
                  <Text color='#F3601E' fontSize={sp(14)}>
                    结束
                  </Text>
                </Center>
              </Pressable>
              <Pressable>
                <Center
                  w={ls(80)}
                  h={ss(40)}
                  ml={ls(20)}
                  bgColor={'rgba(3, 203, 178, 0.20)'}
                  borderWidth={1}
                  borderColor={'#03CBB2'}
                  borderRadius={ss(4)}>
                  <Text color='#0C1B16' fontSize={sp(14)}>
                    完成
                  </Text>
                </Center>
              </Pressable>
            </Row>
          )}
        </Row>
        <Box borderRadius={ss(10)} flex={1} mt={ss(10)}>
          {operatorIdx === 0 && <HealthInfo />}
          {operatorIdx === 1 && <Guidance />}
          {operatorIdx === 2 && <Conclusion />}
          {operatorIdx === 3 && <Solution />}
        </Box>
      </Box>

      <Modal
        isOpen={showResultModal.type !== 'none'}
        onClose={() => setShowResultModal({ type: 'none', message: '' })}>
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
                {showResultModal.type === 'success'
                  ? '提交成功，待分析师处理'
                  : '提交失败，提示原因'}
              </Text>
            </Center>
          )}
        </Modal.Content>
      </Modal>

      <Modal isOpen={showFinishModal} onClose={() => setShowFinishModal(false)}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>温馨提示</Modal.Header>
          <Modal.Body>
            <Center>
              <Text fontSize={sp(20)} color='#333' mt={ss(40)}>
                是否确认结束？
              </Text>
              <Row mt={ss(50)} mb={ss(20)}>
                <Pressable
                  onPress={() => {
                    setShowFinishModal(false);
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
                    alert('是');
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
    </Box>
  );
}
