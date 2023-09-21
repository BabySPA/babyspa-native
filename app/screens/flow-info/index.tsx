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
import { AppStackScreenProps, FlowStatus } from '../../types';
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
import { PrintButton } from '~/app/components/print-button';
import { AnalyzeStatus, EvaluateStatus } from '~/app/stores/flow/type';
import { getFlowStatus } from '~/app/constants';

export default function FlowInfo({
  navigation,
  route: { params },
}: AppStackScreenProps<'FlowInfo'>) {
  const { currentFlow } = useFlowStore();

  const { evaluate } = currentFlow;

  const [from, setFrom] = useState(params.from);

  const [loading, setLoading] = useState(false);

  const [isEvaluateCardDialogShow, setIsEvaluateCardDialogShow] =
    useState(false);

  const ShowPrintButton = () => {
    return getFlowStatus(currentFlow) == FlowStatus.Analyzed ? (
      <PrintButton />
    ) : null;
  };

  const evalutedDone = () => {
    setFrom('evaluate-detail');
  };

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
          from == 'analyze' ? (
            <ShowPrintButton />
          ) : // 从评价详情进入，并且未评价
          from == 'evaluate-detail' &&
            evaluate.status == EvaluateStatus.NOT_SET ? (
            <Pressable
              _pressed={{
                opacity: 0.6,
              }}
              hitSlop={ss(20)}
              onPress={() => {
                setIsEvaluateCardDialogShow(true);
              }}>
              <Row
                bgColor={'white'}
                borderRadius={ss(4)}
                px={ls(26)}
                py={ss(10)}>
                {loading && (
                  <Spinner mr={ls(5)} color='emerald.500' size={ss(20)} />
                )}
                <Text
                  color={'#03CBB2'}
                  opacity={loading ? 0.6 : 1}
                  fontSize={sp(14)}>
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
              <AnalyzeCard
                edit={Boolean(
                  currentFlow.analyze.status == AnalyzeStatus.DONE &&
                    currentFlow.analyze.editable,
                )}
              />
            )}
            {/* (从评价按钮点进来)或者(从评价点击卡片并且已经评价完成) */}
            {(from == 'evaluate' ||
              (from == 'evaluate-detail' &&
                evaluate.status == EvaluateStatus.DONE)) && (
              <EvaluateCard
                type='card'
                canEdit={from == 'evaluate'}
                onEvaluated={() => {
                  evalutedDone();
                }}
              />
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
        onEvaluated={() => {
          evalutedDone();
        }}
      />
    </Box>
  );
}
