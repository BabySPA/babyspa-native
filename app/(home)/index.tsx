import * as React from "react";
import { View, StyleSheet, Image, Platform, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { h, sh, sp, w } from "../../utils/screen";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const tabs = [
  {
    image: require("../../assets/images/tab_md.png"),
    text: "门店",
  },
  {
    image: require("../../assets/images/tab_kh.png"),
    text: "客户",
  },
  {
    image: require("../../assets/images/tab_gl.png"),
    text: "管理",
  },
  {
    image: require("../../assets/images/tab_tj.png"),
    text: "统计",
  },
];

export default function App() {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={["#22D59C", "#1AB7BE"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.menuBar}>
        <View style={[{ paddingTop: insets.top }]}>
          <View
            style={{
              width: "100%",
              alignItems: "center",
              paddingTop: h(30),
            }}
          >
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.logo}
            />
            <Text style={{ color: "white", marginTop: h(3), fontSize: sp(20) }}>
              茗淳儿推
            </Text>
          </View>
          <View style={{ marginTop: h(10) }}>
            {tabs.map((item, idx) => {
              return (
                <View
                  key={idx}
                  style={[
                    styles.tabBox,
                    idx == 1 ? { backgroundColor: "#fff" } : {},
                  ]}
                >
                  <Image source={item.image} style={styles.tabImage} />
                  <Text
                    style={[
                      styles.tabText,
                      idx == 1 ? { color: "#64CF97" } : {},
                    ]}
                  >
                    {item.text}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.topMenuBar}>
          <View style={[{ paddingTop: insets.top }]}></View>
        </View>
        <View
          style={{
            flex: 1,
            borderTopLeftRadius: 20,
            backgroundColor: "white",
          }}
        ></View>
      </View>
    </LinearGradient>
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
    height: "100%",
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
  logo: {
    width: h(60),
    height: h(60),
  },
  tabBox: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: h(15),
  },
  tabImage: {
    width: w(40),
    height: w(40),
  },
  tabText: {
    fontSize: sp(18),
    marginTop: h(8),
    color: "#fff",
  },
});
