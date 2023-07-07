import { Button, Center, Flex, Text } from 'native-base';

import useAuthStore from '../stores/AuthStore';
import {  AppStackScreenProps } from '../../types';

export default function HomeScreen({
  navigation,
}: AppStackScreenProps<'Home'>) {
  const { token, logout } = useAuthStore();

  const goTestPage = () => {
    navigation.push('Test');
  };
  return (
    <Flex safeArea>
      <Center h={'full'}>
        <Text>Welcome, {token}</Text>
        <Button onPress={logout}>Logout</Button>
        <Button onPress={goTestPage}>Go TestPage</Button>
      </Center>
    </Flex>
  );
}
