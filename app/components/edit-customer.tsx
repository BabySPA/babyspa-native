import {
  Box,
  CheckIcon,
  Column,
  Flex,
  FormControl,
  IFlexProps,
  Icon,
  Input,
  Radio,
  Row,
  ScrollView,
  Select,
  Text,
} from "native-base";
import { Pressable, StyleProp, View, ViewStyle } from "react-native";
import BoxTitle from "./box-title";
import { ss, ls, sp } from "../utils/style";
import { useCallback, useState } from "react";
import Dot from "./dot";
import { CustomProps } from "native-base/lib/typescript/components/types";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { Button } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";
import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";
import dayjs from "dayjs";

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
    <Row style={style} h={ls(48)} alignItems={"center"}>
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
  const [birthday, setBirthday] = useState<CalendarDate>(new Date());
  const [openBirthdayPicker, setOpenBirthdayPicker] = useState(false);

  const onDismissBirthdayPicker = useCallback(() => {
    setOpenBirthdayPicker(false);
  }, [setOpenBirthdayPicker]);

  const onConfirmBirthdayPicker = (params: { date: CalendarDate }) => {
    setOpenBirthdayPicker(false);
    setBirthday(params.date);
  };

  const { style = {} } = params;
  const [formData, setData] = useState({});
  return (
    <ScrollView flex={1} bgColor={"#fff"} style={style} p={ss(20)}>
      <Flex>
        <BoxTitle title="客户信息" />
        <Column mt={ss(30)}>
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
          <FormBox
            title="性别"
            style={{ marginTop: ss(20) }}
            form={
              <Radio.Group
                defaultValue="1"
                name="gender"
                flexDirection={"row"}
                color={"#ff00ff"}
                onChange={(event) => {
                  console.log(event);
                }}
              >
                <Radio colorScheme="green" value="1">
                  男
                </Radio>
                <Radio colorScheme="green" value="2" ml={ls(40)}>
                  女
                </Radio>
              </Radio.Group>
            }
          />
          <FormBox
            title="生日"
            required
            style={{ marginTop: ss(20) }}
            form={
              <Box w={"70%"}>
                <Pressable
                  onPress={() => {
                    setOpenBirthdayPicker(true);
                  }}
                >
                  <Input
                    placeholder="请输入"
                    isReadOnly={true}
                    h={ss(40, { min: 26 })}
                    py={ss(10)}
                    px={ls(20)}
                    placeholderTextColor={"#CCC"}
                    color={"#333333"}
                    fontSize={sp(16, { min: 12 })}
                    value={dayjs(birthday).format("YYYY-MM-DD")}
                    rightElement={
                      <Icon
                        as={<FontAwesome name="angle-down" />}
                        size={5}
                        ml="2"
                        color="muted.400"
                      />
                    }
                  />
                  <DatePickerModal
                    locale="zh"
                    mode="single"
                    visible={openBirthdayPicker}
                    onDismiss={onDismissBirthdayPicker}
                    date={birthday}
                    onConfirm={onConfirmBirthdayPicker}
                  />
                </Pressable>
              </Box>
            }
          />
          <FormBox
            required
            title="电话"
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
          <FormBox
            title="过敏史"
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
          <FormBox
            title="理疗师"
            style={{ marginTop: ss(20) }}
            form={
              <Box w={"70%"}>
                <Pressable
                  onPress={() => {
                    setOpenBirthdayPicker(true);
                  }}
                >
                  <Input
                    placeholder="请输入"
                    isReadOnly={true}
                    h={ss(40, { min: 26 })}
                    py={ss(10)}
                    px={ls(20)}
                    placeholderTextColor={"#CCC"}
                    color={"#333333"}
                    fontSize={sp(16, { min: 12 })}
                    rightElement={
                      <Icon
                        as={<FontAwesome name="angle-down" />}
                        size={5}
                        ml="2"
                        color="muted.400"
                      />
                    }
                  />
                  <DatePickerModal
                    locale="zh"
                    mode="single"
                    visible={openBirthdayPicker}
                    onDismiss={onDismissBirthdayPicker}
                    date={birthday}
                    onConfirm={onConfirmBirthdayPicker}
                  />
                </Pressable>
              </Box>
            }
          />
        </Column>
      </Flex>
    </ScrollView>
  );
}
