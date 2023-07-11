import { Box, Flex, Text, ScrollView, Icon, Input } from "native-base";
import { Image, Pressable } from "react-native";
import { useEffect } from "react";
import useFlowStore, { Customer, CustomerStatus } from "~/app/stores/flow";
import { ls, sp, ss } from "~/app/utils/style";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { getAge } from "~/app/utils";
import dayjs from "dayjs";

export default function Register() {
  const { getRegisterCustomers, registers } = useFlowStore();
  useEffect(() => {
    getRegisterCustomers();
  }, []);
  return (
    <Flex flex={1}>
      <Filter />
      <ScrollView margin={ss(10)}>
        <Flex
          flex={1}
          bgColor="white"
          borderRadius={ss(10)}
          flexDirection={"row"}
          justifyContent={"space-between"}
          flexWrap={"wrap"}
          padding={ss(40)}
        >
          {registers.map((register) => (
            <CustomerItem customer={register} key={register.id} />
          ))}
        </Flex>
      </ScrollView>
    </Flex>
  );
}

const StatusTextConfig = {
  [CustomerStatus.ToBeConfirmed]: {
    text: "待确认",
    textColor: "#F3AF62",
    bgColor: "rgba(243, 175, 98, 0.2)",
  },
  [CustomerStatus.ToBeCollected]: {
    text: "待采集",
    textColor: "#FE9505",
    bgColor: "rgba(254, 149, 5, 0.2)",
  },
  [CustomerStatus.ToBeAnalyzed]: {
    text: "待分析",
    textColor: "#2AA1F7",
    bgColor: "rgba(42, 161, 247, 0.2)",
  },
  [CustomerStatus.Completed]: {
    text: "已完成",
    textColor: "#00B49E",
    bgColor: "rgba(0, 180, 158, 0.2)",
  },
  [CustomerStatus.Canceled]: {
    text: "已取消",
    textColor: "#FB6459",
    bgColor: "rgba(251, 100, 89, 0.2)",
  },
};

function CustomerItem({ customer }: { customer: Customer }) {
  const age = getAge(customer.birthday);
  const ageText = `${age?.year}岁${age?.month}月`;
  return (
    <Flex
      borderRadius={ss(8)}
      borderStyle={"dashed"}
      borderWidth={1}
      borderColor={"#15BD8F"}
      w={ls(467)}
      h={ss(148)}
      mb={ss(40)}
      flexDirection={"row"}
      justifyContent={"space-between"}
    >
      <Flex flexDirection={"row"} pt={ss(20)} pl={ls(30)}>
        <Image
          style={{ width: ss(60), height: ss(60) }}
          source={
            customer.gender == 1
              ? require("~/assets/images/boy.png")
              : require("~/assets/images/girl.png")
          }
        />
        <Flex ml={ls(20)}>
          <Flex flexDirection={"row"} alignItems={"center"}>
            <Text color="#333" fontSize={sp(20)} fontWeight={400}>
              {customer.name}({customer.nickname} {customer.gender})
            </Text>
            <Icon
              as={
                <MaterialCommunityIcons
                  name={customer.gender == 1 ? "gender-male" : "gender-female"}
                />
              }
              size={ss(26)}
              color={customer.gender == 1 ? "#648B62" : "#F3AF62"}
            />
            <Text
              color={"#99A9BF"}
              fontWeight={400}
              fontSize={sp(18)}
              ml={ls(3)}
            >
              {ageText}
            </Text>
          </Flex>
          <Text mt={ss(10)} color={"#666"} fontSize={sp(18)}>
            理疗师：{customer.operator.name}
          </Text>
          <Flex flexDirection={"row"} alignItems={"center"} mt={ss(10)}>
            <Icon
              as={<Ionicons name={"ios-time-outline"} />}
              size={ss(17)}
              color={"#C87939"}
            />
            <Text
              color={"#C87939"}
              fontWeight={400}
              fontSize={sp(18)}
              ml={ls(10)}
            >
              {dayjs(customer.updatedAt).format("YYYY-MM-DD HH:mm")}
            </Text>
          </Flex>
        </Flex>
      </Flex>
      <Flex justifyContent={"space-between"}>
        <Box
          bgColor={StatusTextConfig[customer.status].bgColor}
          px={ls(12)}
          py={ss(6)}
          _text={{
            fontSize: sp(16),
            color: StatusTextConfig[customer.status].textColor,
          }}
          borderBottomLeftRadius={ss(8)}
          borderTopRightRadius={ss(8)}
        >
          {StatusTextConfig[customer.status].text}
        </Box>
        {customer.status == CustomerStatus.ToBeAnalyzed && (
          <Pressable>
            <Box
              m={ss(10)}
              borderRadius={ss(6)}
              px={ls(20)}
              bg={{
                linearGradient: {
                  colors: ["#22D59C", "#1AB7BE"],
                  start: [0, 0],
                  end: [1, 1],
                },
              }}
            >
              <Text color="white" fontSize={sp(16)}>
                分析
              </Text>
            </Box>
          </Pressable>
        )}
      </Flex>
    </Flex>
  );
}

function Filter() {
  return (
    <Flex
      mx={ss(10)}
      mt={ss(10)}
      bgColor="white"
      borderRadius={ss(10)}
      flexDirection={"row"}
      py={ss(20)}
      px={ls(40)}
      alignItems={"center"}
    >
      <Icon as={<Ionicons name={"people"} />} size={ss(40)} color={"#5EACA3"} />
      <Text color="#000" fontSize={sp(20)} fontWeight={600} ml={ls(10)}>
        已登记：<Text color="#5EACA3">7</Text>
      </Text>
      <Input
        ml={ss(30)}
        w={{
          base: "65%",
          md: "20%",
        }}
        h={ss(40)}
        padding={ss(10)}
        placeholderTextColor={"#AFB0B4"}
        color={"#333333"}
        InputLeftElement={
          <Icon
            as={<MaterialIcons name="search" />}
            size={ss(25)}
            color="#AFB0B4"
            ml={ss(10)}
          />
        }
        placeholder="请输入客户姓名、手机号"
      />
    </Flex>
  );
}
