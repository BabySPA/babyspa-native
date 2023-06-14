import * as React from "react";
import { View, StyleSheet, Button, Platform, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { h, sh, sp, w } from "../../utils/screen";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function App() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container]}>
      <LinearGradient
        colors={["#22D59C", "#1AB7BE"]}
        start={{ x: 0, y: 0 }} 
        end={{ x: 0, y: 1 }}
        style={styles.menuBar}
      >
        <View style={[{ paddingTop: insets.top }]}>
          <Text style={styles.text}></Text>
        </View>
      </LinearGradient>
      <View style={styles.contentContainer}>
        <LinearGradient
          // Background Linear Gradient
          colors={["#22D59C", "#1AB7BE"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.topMenuBar}
        >
          <View style={[{ paddingTop: insets.top }]}>
            <Text style={styles.text}></Text>
          </View>
        </LinearGradient>
        <View style={styles.contentBox}></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  rowBox: {
    alignItems: "center",
    paddingTop: h(22),
    paddingBottom: h(22),
  },
  columnBox: {
    flex: 1,
  },
  text: {
    fontSize: 20,
  },
  menuBar: {
    height: sh,
    width: w(120),
  },
  contentContainer: {
    flex: 1,
    flexDirection: "column",
  },
  topMenuBar: {
    paddingTop: h(22),
    paddingBottom: h(22),
    fontSize: 20,
  },
  contentBox: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
