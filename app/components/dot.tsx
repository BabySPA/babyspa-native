import { Box, Center } from 'native-base';
import { ss, ls } from '../utils/style';

export default function Dot(props: { color?: string; w?: number; h?: number }) {
  return (
    <Center w={props.w ?? ls(28)} h={props.h ?? ls(28)}>
      <Box
        w={ss(8)}
        h={ss(8)}
        borderRadius={ss(4)}
        bgColor={props.color ?? '#000'}
      />
    </Center>
  );
}
