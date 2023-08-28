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
        hitSlop={ss(10)}
        onPress={() => {
          onSubtraction();
        }}>
        <Icon
          as={<AntDesign name='minuscircle' />}
          size={ss(20)}
          color={'#99A9BF'}
        />
      </Pressable>
      <Text color='#E36C36' fontSize={sp(18)} mx={ss(20)}>
        {count}
      </Text>
      <Pressable
        hitSlop={ss(10)}
        onPress={() => {
          onAddition();
        }}>
        <Icon
          as={<AntDesign name='pluscircle' />}
          size={ss(20)}
          color={'#99A9BF'}
        />
      </Pressable>
    </>
  );
}
