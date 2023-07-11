import { Flex, Text } from "native-base";
import { StyleProp, ViewStyle } from "react-native";
interface EditCustomerParams {
  style?: StyleProp<ViewStyle>;
}
export default function EditCustomer(params: EditCustomerParams) {
  const { style = {} } = params;

  return (
    <Flex flex={1} bgColor={"#fff"} style={style}>
      <Text>bbb</Text>
    </Flex>
  );
}
