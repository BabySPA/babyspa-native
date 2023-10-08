import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ColorSchemeName } from 'react-native';

import AuthNavigator from './auth-navigator';
import AppNavigator from './app-navigator';
import useAuthStore from '../stores/auth';
import { RootStackParamList } from '../types';

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
  const { accessToken } = useAuthStore();

  return (
    <Stack.Navigator>
      {!accessToken ? (
        <Stack.Screen
          name='Auth'
          component={AuthNavigator}
          options={{ headerShown: false }}
        />
      ) : (
        <Stack.Screen
          name='App'
          component={AppNavigator}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
}
