import { Flex, Text } from 'native-base';
import { StyleProp, ViewStyle } from 'react-native';

interface SelectCustomerParams {
  style?: StyleProp<ViewStyle>;
}
export default function SelectCustomer(params: SelectCustomerParams) {
  const { style = {} } = params;
  return (
    <Flex flex={1} bgColor={'#fff'} style={style}>
      <Text>bbb</Text>
    </Flex>
  );
}
