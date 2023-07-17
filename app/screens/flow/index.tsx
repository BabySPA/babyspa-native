import { Box, Text, Pressable } from 'native-base';
import { AppStackScreenProps } from '../../types';
import NavigationBar from '~/app/components/navigation-bar';
import { sp, ss, ls } from '~/app/utils/style';
import { useEffect } from 'react';
import useFlowStore from '~/app/stores/flow';

export default function FlowScreen({
  navigation,
  route,
}: AppStackScreenProps<'Flow'>) {
  const { status, customer } = route.params;
  const { requestGetFlow } = useFlowStore();
  useEffect(() => {
    requestGetFlow(customer.flowId).then((res) => {
      console.log(res);
    });
  }, [requestGetFlow]);
  return (
    <Box flex={1}>
      <NavigationBar
        onBackIntercept={() => false}
        leftElement={
          <Text color='white' fontWeight={600} fontSize={sp(20)}>
            {customer.name}
          </Text>
        }
        rightElement={
          <Pressable
            onPress={() => {
              console.log('登记');
            }}>
            <Box
              bgColor={'white'}
              borderRadius={ss(4)}
              _text={{ color: '#03CBB2', fontSize: sp(14) }}
              px={ls(26)}
              py={ss(10)}>
              时间
            </Box>
          </Pressable>
        }
      />
      <Box safeAreaLeft bgColor={'#F6F6FA'} flex={1}></Box>
    </Box>
  );
}
