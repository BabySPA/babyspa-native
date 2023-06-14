import { Dimensions, PixelRatio, StyleSheet } from "react-native";

const StyleUtils = {
  uiWidth: 1194,
  uiHeight: 835,
  hairline: StyleSheet.hairlineWidth,
  pixel: 1 / PixelRatio.get(),
  screenWidth: Dimensions.get("window").width,
  screenHeight: Dimensions.get("window").height,
  pixelRatio: PixelRatio.get(),
  fontScale: PixelRatio.getFontScale(),
  scale: Math.min(
    Dimensions.get("window").height / 835,
    Dimensions.get("window").width / 1194
  ),
  autoWidth(value: number) {
    return (Dimensions.get("window").width * value) / this.uiWidth;
  },
  autoHeight(value: number) {
    return (Dimensions.get("window").height * value) / this.uiHeight;
  },
  setSpText(number: number) {
    const num = Math.round(
      ((number * this.scale + 0.5) * this.pixelRatio) / this.fontScale
    );
    return num / PixelRatio.get();
  },
};

export const w = (e: number) => StyleUtils.autoWidth(e);
export const h = (e: number) => StyleUtils.autoHeight(e);
export const sp = (e: number) => StyleUtils.setSpText(e);
export const sw = StyleUtils.screenWidth;
export const sh = StyleUtils.screenHeight;
export const hair = StyleUtils.hairline;
