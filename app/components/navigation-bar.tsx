import { Box, Icon, IconButton, Row } from "native-base";
import { ls, ss, sp } from "../utils/style";
import { MaterialIcons, SimpleLineIcons } from "@expo/vector-icons";

interface NavigationBarParams {
  hasLeftIcon?: boolean;
  onBackIntercept: () => boolean;
  leftElement: JSX.Element;
  rightElement: JSX.Element;
}

export default function NavigationBar(props: NavigationBarParams) {
  const {
    hasLeftIcon = true,
    onBackIntercept,
    leftElement,
    rightElement,
  } = props;
  return (
    <Row
      safeAreaTop
      safeAreaLeft
      safeAreaRight
      bg={{
        linearGradient: {
          colors: ["#22D59C", "#1AB7BE"],
          start: [0, 0],
          end: [1, 1],
        },
      }}
      alignItems={"center"}
      justifyContent={"space-between"}
      px={ss(20)}
      py={ss(20)}
    >
      <Row alignItems={"center"}>
        <IconButton
          variant="ghost"
          _icon={{
            as: SimpleLineIcons,
            name: "arrow-left",
            size: ss(20),
            color: "white",
          }}
        />
        {leftElement}
      </Row>
      {rightElement}
    </Row>
  );
}
