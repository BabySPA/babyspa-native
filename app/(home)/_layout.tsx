import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { View } from "../../components/Themed";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false
      }}
    >
    </Stack>
  );
}
