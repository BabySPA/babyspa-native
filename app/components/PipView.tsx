import { Icon, Pressable, Text, View } from 'native-base';
import { useCallback } from 'react';
import PipHandler, { usePipModeListener } from 'react-native-pip-android';
import { ss, sp } from '../utils/style';
import { Feather } from '@expo/vector-icons';

export default function PipView() {
  const action = useCallback(() => {
    PipHandler.enterPipMode();
  }, []);
 
  return (
    <Pressable
      _pressed={{
        opacity: 0.8,
      }}
      onPress={action}
      hitSlop={ss(20)}
      position={'absolute'}
      right={ss(20, 50)}>
      <Icon
        as={<Feather name='minimize' color='black' />}
        size={sp(24)}
        color={'#fff'}
      />
    </Pressable>
  );
}
