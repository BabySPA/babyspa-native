import { Box, Center } from "native-base";
import { ss, ls } from "../utils/style";

export default function Dot(props: { color?: string }) {
  return (
    <Center w={ls(28)} h={ls(28)}>
      <Box
        w={ss(8, { min: 2 })}
        h={ss(8, { min: 2 })}
        borderRadius={ss(4, { min: 1 })}
        bgColor={props.color ?? "#000"}
      />
    </Center>
  );
}
