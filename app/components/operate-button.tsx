import { Pressable, Box, Text } from 'native-base';
import { ss, ls, sp } from '../utils/style';

export default function OperateButton({
  text,
  onPress,
}: {
  text: string | undefined;
  onPress: () => void;
}) {
  if (!text) return null;
  return (
    <Pressable onPress={onPress}>
      <Box
        m={ss(10)}
        borderRadius={ss(6)}
        px={ls(20)}
        py={ss(6)}
        bg={{
          linearGradient: {
            colors: ['#22D59C', '#1AB7BE'],
            start: [0, 0],
            end: [1, 1],
          },
        }}>
        <Text color='white' fontSize={sp(16)}>
          {text}
        </Text>
      </Box>
    </Pressable>
  );
}
