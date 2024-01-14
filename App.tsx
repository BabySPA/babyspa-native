import { StatusBar } from 'expo-status-bar';
import { NativeBaseProvider, extendTheme } from 'native-base';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import useCachedResources from './app/hooks/use-cached-resources';
import useColorScheme from './app/hooks/use-color-scheme';
import Navigation from './app/navigation/root-navigator';
import { LogBox } from 'react-native';
import KeyboardAvoider from '~/app/components/keyboard-avoid';
import 'react-native-gesture-handler';
import { ToastProvider } from 'react-native-toast-notifications';
import CodePush from 'react-native-code-push';
import { CacheManager } from '~/app/components/cache-image';
import { Dirs } from 'react-native-file-access';

LogBox.ignoreLogs([
  'Require cycle',
  'Constants.platform',
  'No native splash',
  'Sending `onAnimatedValueUpdate` with no listeners registered',
  'Cannot update a component',
  '请不要频繁请求相同的接口',
]);

CacheManager.config = {
  baseDir: `${Dirs.CacheDir}/images_cache/`,
  blurRadius: 0,
  cacheLimit: 0,
  maxRetries: 3 /* optional, if not provided defaults to 0 */,
  retryDelay: 3000 /* in milliseconds, optional, if not provided defaults to 0 */,
  sourceAnimationDuration: 500,
  thumbnailAnimationDuration: 500,
};

const config = {
  dependencies: {
    'linear-gradient': LinearGradient,
  },
};

function App() {
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
        <ToastProvider>
          <NativeBaseProvider config={config} theme={theme}>
            <KeyboardAvoider>
              <Navigation colorScheme={colorScheme} />
              <StatusBar hidden={true} />
            </KeyboardAvoider>
          </NativeBaseProvider>
        </ToastProvider>
      </SafeAreaProvider>
    );
  }
}
let codePushOptions = {
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
  updateDialog: {
    title: '发现更新',
    optionalUpdateMessage: '是否立即更新~',
    optionalInstallButtonLabel: '立即更新',
    optionalIgnoreButtonLabel: '忽略此更新',
    mandatoryUpdateMessage: '该更新为强制更新，是否立即更新~',
    mandatoryContinueButtonLabel: '继续',
  },
  installMode: CodePush.InstallMode.IMMEDIATE,
};

export default CodePush(codePushOptions)(App);
