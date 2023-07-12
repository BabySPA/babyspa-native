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
  Row,
} from "native-base";
import { AppStackScreenProps } from "../../types";
import NavigationBar from "~/app/components/navigation-bar";
import { sp, ss, ls } from "~/app/utils/style";
import EditCustomer from "~/app/components/edit-customer";
import SelectCustomer from "~/app/components/select-customer";

export default function RegisterScreen({
  navigation,
}: AppStackScreenProps<"Register">) {
  return (
    <Box flex={1}>
      <NavigationBar
        onBackIntercept={() => true}
        leftElement={
          <Text color="white" fontWeight={600} fontSize={sp(20, { min: 14 })}>
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
              _text={{ color: "#03CBB2", fontSize: sp(14, { min: 12 }) }}
              px={ls(26)}
              py={ss(10)}
            >
              确定
            </Box>
          </Pressable>
        }
      />
      <Row safeAreaLeft bgColor={"#F6F6FA"} flex={1} p={ss(20)}>
        <EditCustomer style={{ marginRight: ss(10) }} />
        <SelectCustomer style={{ marginLeft: ss(10) }} />
      </Row>
    </Box>
  );
}
