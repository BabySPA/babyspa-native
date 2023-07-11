import { StatusBar } from "expo-status-bar";
import { NativeBaseProvider } from "native-base";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import useCachedResources from "./app/hooks/use-cached-resources";
import useColorScheme from "./app/hooks/use-color-scheme";
import Navigation from "./app/navigation/root-navigator";
import { LogBox } from "react-native";

LogBox.ignoreLogs(["Require cycle"]);

const config = {
  dependencies: {
    "linear-gradient": LinearGradient,
  },
};

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <NativeBaseProvider config={config}>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </NativeBaseProvider>
      </SafeAreaProvider>
    );
  }
}
