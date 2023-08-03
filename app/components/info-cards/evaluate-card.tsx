import { Box, Column, Divider, Icon, Row, Text } from 'native-base';
import { StyleProp, ViewStyle, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useFlowStore from '~/app/stores/flow';
import BoxTitle from '~/app/components/box-title';
import { ss, sp } from '~/app/utils/style';
import { getAge } from '~/app/utils';

interface EvaluateCardParams {
  style?: StyleProp<ViewStyle>;
}

export default function EvaluateCard(params: EvaluateCardParams) {
  const { currentFlowCustomer } = useFlowStore();
  const age = getAge(currentFlowCustomer.birthday);
  const { style = {} } = params;

  return (
    <Column bgColor={'#fff'} p={ss(20)} borderRadius={ss(10)} style={style}>
      <BoxTitle title='评价反馈' />
      <Divider color={'#DFE1DE'} my={ss(14)} />
      <Box bgColor={'#FEFAEF'} borderRadius={ss(4)} px={ss(16)} py={ss(10)}>
        <Text fontSize={sp(18)} color='#A39384'>
          您可以对本次信息处理进行评价哦
        </Text>
      </Box>
    </Column>
  );
}
