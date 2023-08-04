import { Box, Column, Divider, Pressable, Row, Text } from 'native-base';
import { StyleProp, ViewStyle, Image, TextInput } from 'react-native';
import useFlowStore from '~/app/stores/flow';
import BoxTitle from '~/app/components/box-title';
import { ss, sp, ls } from '~/app/utils/style';
import { getAge } from '~/app/utils';
import { EvaluateStoreConfig, EvaluateStores } from '~/app/constants';
import { Score } from '~/app/stores/flow/type';

interface EvaluateCardParams {
  style?: StyleProp<ViewStyle>;
  type: 'dialog' | 'card';
}

export default function EvaluateCard(params: EvaluateCardParams) {
  let {
    currentFlow: { evaluate },
    updateEvaluate,
  } = useFlowStore();

  const { style = {}, type } = params;

  const DialogBtn = () => (
    <Row justifyContent={'center'} mt={ss(110)}>
      <Pressable onPress={() => {}}>
        <Box
          bgColor={'#D8D8D8'}
          px={ls(26)}
          py={ss(12)}
          borderWidth={1}
          borderColor={'#CCCCCC'}
          borderRadius={ss(8)}
          _text={{ fontSize: ss(16, { min: 12 }), color: 'white' }}>
          取消
        </Box>
      </Pressable>
      <Pressable onPress={() => {}}>
        <Box
          bgColor={'rgba(0, 180, 158, 0.10)'}
          px={ls(26)}
          py={ss(12)}
          ml={ss(20)}
          borderRadius={ss(8)}
          borderWidth={1}
          borderColor={'#00B49E'}
          _text={{ fontSize: ss(16, { min: 12 }), color: '#00B49E' }}>
          确定
        </Box>
      </Pressable>
    </Row>
  );

  const CardBtn = () => (
    <Row justifyContent={'flex-end'} mt={ss(40)}>
      <Pressable onPress={() => {}}>
        <Box
          bgColor={'rgba(0, 180, 158, 0.10)'}
          px={ls(26)}
          py={ss(12)}
          borderRadius={ss(8)}
          borderWidth={1}
          borderColor={'#00B49E'}
          _text={{ fontSize: ss(16, { min: 12 }), color: '#00B49E' }}>
          确定
        </Box>
      </Pressable>
    </Row>
  );

  return (
    <Column bgColor={'#fff'} p={ss(20)} borderRadius={ss(10)} style={style}>
      <BoxTitle title='评价反馈' />
      <Divider color={'#DFE1DE'} my={ss(14)} />
      <Box bgColor={'#FEFAEF'} borderRadius={ss(4)} px={ss(16)} py={ss(10)}>
        <Text fontSize={sp(18)} color='#A39384'>
          您可以对本次信息处理进行评价哦
        </Text>
      </Box>
      <Row alignItems={'center'} justifyContent={'space-between'} mt={ss(30)}>
        <Row>
          {EvaluateStores.map((item: Score) => {
            return (
              <Pressable
                key={item}
                mr={ss(10)}
                onPress={() => {
                  updateEvaluate({
                    remark: evaluate?.remark || '',
                    score: item,
                  });
                }}>
                <Image
                  source={
                    item <= (evaluate?.score || 3)
                      ? require('~/assets/images/star.png')
                      : require('~/assets/images/star-empty.png')
                  }
                  style={{ width: ss(50), height: ss(50) }}
                />
              </Pressable>
            );
          })}
        </Row>
        {evaluate && (
          <Row mt={ss(6)}>
            <Text color='#FFBB2A' fontSize={sp(16)}>
              {evaluate?.score}分
            </Text>
            <Text color='#000' ml={ss(13)} fontSize={sp(16)}>
              {EvaluateStoreConfig[evaluate?.score]}
            </Text>
          </Row>
        )}
      </Row>
      <Row alignItems={'flex-start'} mt={ss(30)}>
        <Text fontSize={sp(18)} color='#333'>
          评价意见
        </Text>
        <Box flex={1} ml={ss(12)}>
          <TextInput
            multiline={true}
            placeholder='您可以从分析速度、调理方案准确性、以及客户满意度等方面进行评价'
            style={{
              textAlignVertical: 'top',
              borderRadius: ss(4),
              borderColor: '#DFE1DE',
              borderWidth: 1,
              height: ss(170),
              padding: ss(12),
              fontSize: sp(18),
              color: '#999',
            }}
            value={evaluate?.remark || ''}
            onChangeText={(text) => {
              updateEvaluate({
                remark: text,
                score: evaluate?.score || 3,
              });
            }}
          />
        </Box>
      </Row>
      {type == 'card' ? <CardBtn /> : <DialogBtn />}
    </Column>
  );
}
