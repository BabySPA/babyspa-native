import {
  AspectRatio,
  Box,
  Button,
  Center,
  Flex,
  Text,
  Pressable,
  StatusBar,
  Icon,
} from "native-base";
import { AppStackScreenProps } from "../../types";
import NavigationBar from "~/app/components/navigation-bar";
import { sp, ss, ls } from "~/app/utils/style";
import { Ionicons } from "@expo/vector-icons";

export default function RegisterScreen({
  navigation,
}: AppStackScreenProps<"Register">) {
  return (
    <Box flex={1}>
      <NavigationBar
        onBackIntercept={() => true}
        leftElement={
          <Text color="white" fontWeight={600} fontSize={sp(20)}>
            登记
          </Text>
        }
        rightElement={
          <Pressable
            onPress={() => {
              console.log("登记");
            }}
          >
            <Box
              bgColor={"white"}
              borderRadius={ss(4)}
              _text={{ color: "#03CBB2", fontSize: sp(14) }}
              px={ls(26)}
              py={ss(10)}
            >
              确定
            </Box>
          </Pressable>
        }
      />
      <Box safeAreaLeft bgColor={"#F6F6FA"} flex={1}></Box>
    </Box>
  );
}
