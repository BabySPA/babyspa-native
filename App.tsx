import { StatusBar } from 'expo-status-bar';
import { NativeBaseProvider, ScrollView, extendTheme } from 'native-base';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import useCachedResources from './app/hooks/use-cached-resources';
import useColorScheme from './app/hooks/use-color-scheme';
import Navigation from './app/navigation/root-navigator';
import { LogBox } from 'react-native';
import KeyboardAvoider from '~/app/components/keyboard-avoid';

LogBox.ignoreLogs([
  'Require cycle',
  'Constants.platform',
  'No native splash',
  'Sending `onAnimatedValueUpdate` with no listeners registered',
  'Cannot update a component',
]);

const config = {
  dependencies: {
    'linear-gradient': LinearGradient,
  },
};

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const theme = extendTheme({
    colors: {
      // Add new color
      primary: {
        50: '#E3F2F9',
        100: '#C5E4F3',
        200: '#A2D4EC',
        300: '#7AC1E4',
        400: '#47A9DA',
        500: '#0088CC',
        600: '#007AB8',
        700: '#006BA1',
        800: '#005885',
        900: '#003F5E',
      },
      babyspa: {
        500: '#03CBB2',
      },
    },
  });

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <NativeBaseProvider config={config} theme={theme}>
          <KeyboardAvoider>
            <Navigation colorScheme={colorScheme} />
            <StatusBar />
          </KeyboardAvoider>
        </NativeBaseProvider>
      </SafeAreaProvider>
    );
  }
}
