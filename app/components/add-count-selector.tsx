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
        onPress={() => {
          onSubtraction();
        }}>
        <Icon
          as={<AntDesign name='minuscircle' />}
          size={ss(20, { min: 16 })}
          color={'#99A9BF'}
        />
      </Pressable>
      <Text color='#E36C36' fontSize={sp(18)} mx={ss(20)}>
        {count}
      </Text>
      <Pressable
        onPress={() => {
          onAddition();
        }}>
        <Icon
          as={<AntDesign name='pluscircle' />}
          size={ss(20, { min: 16 })}
          color={'#99A9BF'}
        />
      </Pressable>
    </>
  );
}