import { StatusBar } from "expo-status-bar";
import { NativeBaseProvider } from "native-base";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import useCachedResources from "./app/hooks/use-cached-resources";
import useColorScheme from "./app/hooks/use-color-scheme";
import Navigation from "./app/navigation/root-navigator";
import { LogBox } from "react-native";
import { zh, registerTranslation } from "react-native-paper-dates";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
registerTranslation("zh", zh);

LogBox.ignoreLogs(["Require cycle"]);

const config = {
  dependencies: {
    "linear-gradient": LinearGradient,
  },
};

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const theme = {
    // 修改主题色码
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: "#00B49E", // 设置为你想要的主题色码
    },
  };

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <NativeBaseProvider config={config}>
            <Navigation colorScheme={colorScheme} />
            <StatusBar />
          </NativeBaseProvider>
        </PaperProvider>
      </SafeAreaProvider>
    );
  }
}
