import {
  Box,
  Column,
  Flex,
  FormControl,
  IFlexProps,
  Input,
  Row,
  ScrollView,
  Text,
} from "native-base";
import { StyleProp, View, ViewStyle } from "react-native";
import BoxTitle from "./box-title";
import { ss, ls, sp } from "../utils/style";
import { useState } from "react";
import Dot from "./dot";
import { CustomProps } from "native-base/lib/typescript/components/types";

interface EditCustomerParams {
  style?: StyleProp<ViewStyle>;
}

interface FormBoxParams {
  title: string;
  form: JSX.Element;
  required?: boolean;
  style?: StyleProp<ViewStyle>;
}

function FormBox(props: FormBoxParams) {
  const { required, form, title, style } = props;
  return (
    <Row style={style}>
      <Row alignItems={"center"} mr={ls(30)}>
        <Box opacity={required ? 1 : 0}>
          <Dot />
        </Box>
        <Text fontSize={sp(20, { min: 12 })}>{title}</Text>
      </Row>
      {form}
    </Row>
  );
}

export default function EditCustomer(params: EditCustomerParams) {
  const { style = {} } = params;
  const [formData, setData] = useState({});
  return (
    <ScrollView flex={1} bgColor={"#fff"} style={style} p={ss(20)}>
      <Flex>
        <BoxTitle title="客户信息" />
        <Column mt={ss(20)}>
          <FormBox
            title="姓名"
            required
            form={
              <Input
                w={"70%"}
                h={ss(40, { min: 26 })}
                py={ss(10)}
                px={ls(20)}
                placeholderTextColor={"#CCC"}
                color={"#333333"}
                fontSize={sp(16, { min: 12 })}
                placeholder="请输入"
              />
            }
          />
          <FormBox
            title="乳名"
            style={{ marginTop: ss(20) }}
            form={
              <Input
                w={"70%"}
                h={ss(40, { min: 26 })}
                py={ss(10)}
                px={ls(20)}
                placeholderTextColor={"#CCC"}
                color={"#333333"}
                fontSize={sp(16, { min: 12 })}
                placeholder="请输入"
              />
            }
          />
        </Column>
      </Flex>
    </ScrollView>
  );
}
