import {
  Box,
  Column,
  Divider,
  Input,
  Modal,
  Pressable,
  Row,
  Spinner,
  Text,
} from 'native-base';
import { useToast } from 'react-native-toast-notifications';

import { StyleProp, ViewStyle, Image, TextInput } from 'react-native';
import useFlowStore from '~/app/stores/flow';
import BoxTitle from '~/app/components/box-title';
import { ss, sp, ls } from '~/app/utils/style';
import { EvaluateStoreConfig, EvaluateStores } from '~/app/constants';
import { Score } from '~/app/stores/flow/type';
import { useState } from 'react';
import { toastAlert } from '~/app/utils/toast';

interface EvaluateCardParams {
  style?: StyleProp<ViewStyle>;
  type: 'dialog' | 'card';
  canEdit: boolean;
  onClose?: () => void;
  onEvaluated?: () => void;
}

export default function EvaluateCard(params: EvaluateCardParams) {
  const evaluate = useFlowStore((state) => state.currentFlow.evaluate);
  const requestPutFlowToEvaluate = useFlowStore(
    (state) => state.requestPutFlowToEvaluate,
  );
  const requestGetEvaluateFlows = useFlowStore(
    (state) => state.requestGetEvaluateFlows,
  );

  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const { style = {}, type, canEdit, onClose, onEvaluated } = params;

  const [templateEvaluate, setTemplateEvaluate] = useState(evaluate);

  const DialogBtn = () => (
    <Row justifyContent={'center'} mt={ss(110)}>
      <Pressable
        _pressed={{
          opacity: 0.6,
        }}
        hitSlop={ss(20)}
        onPress={() => {
          onClose?.();
        }}>
        <Box
          bgColor={'#D8D8D8'}
          px={ls(26)}
          py={ss(12)}
          borderWidth={ss(1)}
          borderColor={'#CCCCCC'}
          borderRadius={ss(8)}
          _text={{ fontSize: sp(16), color: 'white' }}>
          取消
        </Box>
      </Pressable>
      <Pressable
        _pressed={{
          opacity: 0.6,
        }}
        hitSlop={ss(20)}
        onPress={() => {
          evaluateNow();
          onClose?.();
        }}>
        <Row
          alignItems={'center'}
          bgColor={'rgba(0, 180, 158, 0.10)'}
          px={ls(26)}
          py={ss(12)}
          ml={ss(20)}
          borderRadius={ss(8)}
          borderWidth={ss(1)}
          borderColor={'#00B49E'}>
          {loading && <Spinner size={sp(20)} mr={ls(5)} color='emerald.500' />}
          <Text fontSize={sp(16)} color={'#00B49E'}>
            确定
          </Text>
        </Row>
      </Pressable>
    </Row>
  );

  const evaluateNow = () => {
    if (templateEvaluate?.score && templateEvaluate.remark) {
      if (loading) {
        return;
      }
      setLoading(true);
      requestPutFlowToEvaluate(templateEvaluate)
        .then(async (res) => {
          toastAlert(toast, 'success', '评价成功！');
          await requestGetEvaluateFlows();
          onEvaluated?.();
        })
        .catch((e) => {
          toastAlert(toast, 'error', '评价失败！请稍后重试。');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  const CardBtn = () => (
    <Row justifyContent={'flex-end'} mt={ss(40)}>
      <Pressable
        _pressed={{
          opacity: 0.6,
        }}
        hitSlop={ss(20)}
        onPress={() => {
          evaluateNow();
        }}>
        <Row
          alignItems={'center'}
          opacity={templateEvaluate?.score && templateEvaluate.remark ? 1 : 0.6}
          bgColor={'rgba(0, 180, 158, 0.10)'}
          px={ls(26)}
          py={ss(12)}
          ml={ss(20)}
          borderRadius={ss(8)}
          borderWidth={ss(1)}
          borderColor={'#00B49E'}>
          {loading && <Spinner size={sp(20)} mr={ls(5)} color='emerald.500' />}
          <Text fontSize={sp(16)} color={'#00B49E'}>
            确定
          </Text>
        </Row>
      </Pressable>
    </Row>
  );

  return (
    <Column bgColor={'#fff'} p={ss(20)} borderRadius={ss(10)} style={style}>
      <BoxTitle title='评价反馈' />
      <Divider color={'#DFE1DE'} my={ss(14)} />
      {canEdit && (
        <Box bgColor={'#FEFAEF'} borderRadius={ss(4)} px={ss(16)} py={ss(10)}>
          <Text fontSize={sp(18)} color='#A39384'>
            您可以对本次信息处理进行评价哦
          </Text>
        </Box>
      )}
      <Row alignItems={'center'} justifyContent={'space-between'} mt={ss(30)}>
        <Row>
          {EvaluateStores.map((item: Score) => {
            return (
              <Pressable
                _pressed={{
                  opacity: 0.6,
                }}
                hitSlop={ss(20)}
                key={item}
                mr={ss(10)}
                onPress={() => {
                  if (canEdit) {
                    setTemplateEvaluate({
                      ...templateEvaluate,
                      remark: templateEvaluate?.remark || '',
                      score: item,
                    });
                  }
                }}>
                <Image
                  source={
                    item <= (templateEvaluate?.score || 3)
                      ? require('~/assets/images/star.png')
                      : require('~/assets/images/star-empty.png')
                  }
                  style={{ width: ss(50), height: ss(50) }}
                />
              </Pressable>
            );
          })}
        </Row>
        {templateEvaluate && (
          <Row mt={ss(6)}>
            <Text color='#FFBB2A' fontSize={sp(16)}>
              {templateEvaluate?.score || 3}分
            </Text>
            <Text color='#000' ml={ss(13)} fontSize={sp(16)}>
              {EvaluateStoreConfig[templateEvaluate?.score || 3]}
            </Text>
          </Row>
        )}
      </Row>
      <Row alignItems={'flex-start'} mt={ss(30)}>
        <Text fontSize={sp(18)} color='#333'>
          评价意见
        </Text>
        <Box flex={1} ml={ss(12)}>
          <Input
            borderWidth={ss(1)}
            borderColor={'#D8D8D8'}
            isReadOnly={!canEdit}
            autoCorrect={false}
            multiline={true}
            textAlignVertical='top'
            placeholder='您可以从分析速度、调理方案准确性、以及客户满意度等方面进行评价'
            style={{
              textAlignVertical: 'top',
              borderRadius: ss(4),
              borderColor: '#DFE1DE',
              borderWidth: ss(1),
              height: ss(170),
              padding: ss(12),
              fontSize: sp(18),
              color: '#999',
            }}
            value={templateEvaluate?.remark || ''}
            onChangeText={(text) => {
              setTemplateEvaluate({
                ...templateEvaluate,
                remark: text,
                score: templateEvaluate?.score || 3,
              });
            }}
            returnKeyType='done'
          />
        </Box>
      </Row>
      {canEdit ? type == 'card' ? <CardBtn /> : <DialogBtn /> : null}
    </Column>
  );
}

interface EvaluateCardDialogParams {
  isOpen: boolean;
  onClose: () => void;
  onEvaluated?: () => void;
}

export function EvaluateCardDialog({
  isOpen,
  onClose,
  onEvaluated,
}: EvaluateCardDialogParams) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
      }}>
      <EvaluateCard
        type={'dialog'}
        canEdit={true}
        onEvaluated={onEvaluated}
        style={{ width: ls(580) }}
        onClose={() => {
          onClose();
        }}
      />
    </Modal>
  );
}
