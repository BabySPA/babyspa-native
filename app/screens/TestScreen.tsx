import { Button, Center, Flex, Text } from 'native-base';

import { useNavigationContainerRef } from '@react-navigation/native';
import { AppStackScreenProps } from '../../types';

export default function TestScreen({
  navigation,
}: AppStackScreenProps<'Test'>) {
  const goback = () => {
    navigation.goBack();
  };
  return (
    <Flex safeArea>
      <Center h={'full'}>
        <Text>Test Page</Text>
        <Button onPress={goback}>go back</Button>
      </Center>
    </Flex>
  );
}
