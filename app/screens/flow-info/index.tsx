import {
  Box,
  Text,
  Pressable,
  Row,
  useToast,
  Spinner,
  Column,
  ScrollView,
} from 'native-base';
import { AppStackScreenProps, CustomerStatus } from '../../types';
import NavigationBar from '~/app/components/navigation-bar';
import { sp, ss, ls } from '~/app/utils/style';
import { useEffect, useState } from 'react';
import useFlowStore from '~/app/stores/flow';
import RegisterCard from '~/app/components/info-cards/register-card';
import CollectionCard from '~/app/components/info-cards/collection-card';
import AnalyzeCard from '~/app/components/info-cards/analyze-card';
import EvaluateCard, {
  EvaluateCardDialog,
} from '~/app/components/info-cards/evaluate-card';
import FollowUpCard from '~/app/components/info-cards/follow-up-card';

export default function FlowInfo({
  navigation,
  route: { params },
}: AppStackScreenProps<'FlowInfo'>) {
  const {
    requestGetFlow,
    currentFlowCustomer,
    currentFlow: { evaluate },
  } = useFlowStore();

  const { from } = params;

  useEffect(() => {
    requestGetFlow(currentFlowCustomer.flowId);
  }, []);
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const [isEvaluateCardDialogShow, setIsEvaluateCardDialogShow] =
    useState(false);
  return (
    <Box flex={1}>
      <NavigationBar
        onBackIntercept={() => false}
        leftElement={
          <Text color='white' fontWeight={600} fontSize={sp(20, { min: 14 })}>
            客户详情
          </Text>
        }
        rightElement={
          from == 'analyze' ? (
            <Pressable
              onPress={() => {
                // TODO 打印
              }}>
              <Row
                bgColor={'white'}
                borderRadius={ss(4)}
                px={ls(26)}
                py={ss(10)}>
                {loading && <Spinner mr={ls(5)} color='emerald.500' />}
                <Text
                  color={'#03CBB2'}
                  opacity={loading ? 0.6 : 1}
                  fontSize={sp(14, { min: 12 })}>
                  打印
                </Text>
              </Row>
            </Pressable>
          ) : // 从评价详情进入，并且未评价
          from == 'evaluate-detail' && !evaluate ? (
            <Pressable
              onPress={() => {
                setIsEvaluateCardDialogShow(true);
              }}>
              <Row
                bgColor={'white'}
                borderRadius={ss(4)}
                px={ls(26)}
                py={ss(10)}>
                {loading && <Spinner mr={ls(5)} color='emerald.500' />}
                <Text
                  color={'#03CBB2'}
                  opacity={loading ? 0.6 : 1}
                  fontSize={sp(14, { min: 12 })}>
                  评价
                </Text>
              </Row>
            </Pressable>
          ) : null
        }
      />
      <Row safeAreaLeft bgColor={'#F6F6FA'} flex={1} p={ss(20)} safeAreaBottom>
        <Column flex={1}>
          <ScrollView>
            <RegisterCard />
            <CollectionCard style={{ marginTop: ls(10) }} />
            {(from == 'evaluate' || from == 'follow-up') && (
              <AnalyzeCard edit={false} style={{ marginTop: ls(10) }} />
            )}
          </ScrollView>
        </Column>
        <Column flex={1} ml={ls(10)}>
          <ScrollView>
            {from !== 'evaluate' && from !== 'follow-up' && (
              <AnalyzeCard edit={from == 'analyze'} />
            )}
            {/* (从评价按钮点进来)或者(从评价点击卡片并且已经评价完成) */}
            {(from == 'evaluate' ||
              (from == 'evaluate-detail' && evaluate)) && (
              <EvaluateCard type='card' canEdit={from == 'evaluate'} />
            )}
            {/* 从随访点击卡片进来 */}
            {(from == 'follow-up' || from === 'follow-up-detail') && (
              <FollowUpCard
                edit={from == 'follow-up'}
                style={from == 'follow-up-detail' ? { marginTop: ss(10) } : {}}
              />
            )}
          </ScrollView>
        </Column>
      </Row>
      <EvaluateCardDialog
        isOpen={isEvaluateCardDialogShow}
        onClose={function (): void {
          setIsEvaluateCardDialogShow(false);
        }}
      />
    </Box>
  );
}
