import { AntDesign } from '@expo/vector-icons';
import { Icon, Pressable, Text } from 'native-base';
import { sp, ss } from '~/app/utils/style';

export default function AddCountSelector({
  count,
  onSubtraction,
  onAddition,
}: {
  count: number;
  onSubtraction: () => void;
  onAddition: () => void;
}) {
  return (
    <>
      <Pressable
        _pressed={{
          opacity: 0.6,
        }}
        hitSlop={ss(20)}
        onPress={() => {
          if (count === 0) return;
          onSubtraction();
        }}>
        <Icon
          as={<AntDesign name='minuscircle' />}
          size={sp(20)}
          color={'#99A9BF'}
          opacity={count === 0 ? 0.5 : 1}
        />
      </Pressable>
      <Text color='#E36C36' fontSize={sp(18)} mx={ss(20)}>
        {count}
      </Text>
      <Pressable
        _pressed={{
          opacity: 0.6,
        }}
        hitSlop={ss(20)}
        onPress={() => {
          onAddition();
        }}>
        <Icon
          as={<AntDesign name='pluscircle' />}
          size={sp(20)}
          color={'#99A9BF'}
        />
      </Pressable>
    </>
  );
}
