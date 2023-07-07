import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  Heading,
  HStack,
  Icon,
  Input,
  Link,
  Text,
  useTheme,
  useToast,
  VStack,
} from 'native-base';
import { AuthStackScreenProps } from '../../types';
import { useState } from 'react';
import useAuthStore from '../stores/AuthStore';
import { MaterialIcons } from '@expo/vector-icons';

export default function LoginScreen({
  navigation,
}: AuthStackScreenProps<'Login'>) {
  const { login } = useAuthStore();
  const [username, setUsername] = useState('17666117715');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const onClickLogin = async () => {
    setLoading(true);
    login(username, password)
      .then((user) => {
        console.log('Login successful', user);
      })
      .catch((error) => {
        console.log('Login failed', error);
        toast.show({
          variant: 'left-accent',
          placement: 'top',
          title: 'Login failed',
          description: error.message,
          bg: 'danger.500',
        });
      })
      .finally(() => setLoading(false));
  };

  return (
    <Flex safeArea flex={1}>
      <Center h={'full'}>
        <Box safeArea p="2" py="8" w="90%" maxW="290">
          <Heading
            size="lg"
            fontWeight="600"
            color="coolGray.800"
            _dark={{
              color: 'warmGray.50',
            }}
          >
            Welcome
          </Heading>
          <Heading
            mt="1"
            _dark={{
              color: 'warmGray.200',
            }}
            color="coolGray.600"
            fontWeight="medium"
            size="xs"
          >
            登录以继续
          </Heading>

          <VStack space={3} mt="5">
            <FormControl>
              <FormControl.Label>用户名</FormControl.Label>
              <Input
                value={username}
                onChangeText={setUsername}
                InputLeftElement={
                  <Icon
                    as={<MaterialIcons name="person" />}
                    size={5}
                    ml="2"
                    color="muted.400"
                  />
                }
              />
            </FormControl>
            <FormControl>
              <FormControl.Label>Password</FormControl.Label>
              <Input
                type="password"
                value={password}
                onChangeText={setPassword}
                InputLeftElement={
                  <Icon
                    as={<MaterialIcons name="lock" />}
                    size={5}
                    ml="2"
                    color="muted.400"
                  />
                }
              />
            </FormControl>
            <Button
              mt="2"
              colorScheme="indigo"
              onPress={() => onClickLogin()}
              leftIcon={
                <Icon as={<MaterialIcons name="login" />} size={5} ml="2" />
              }
              isLoading={loading}
            >
              登录
            </Button>
          </VStack>
        </Box>
      </Center>
    </Flex>
  );
}
