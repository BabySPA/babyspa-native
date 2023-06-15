import { Dimensions, PixelRatio, StyleSheet } from "react-native";

const uiWidth = 1194;
const uiHeight = 835;

const StyleUtils = {
  hairline: StyleSheet.hairlineWidth,
  pixel: 1 / PixelRatio.get(),
  screenWidth: Dimensions.get("window").width,
  screenHeight: Dimensions.get("window").height,
  pixelRatio: PixelRatio.get(),
  fontScale: PixelRatio.getFontScale(),
  scale: Math.min(
    Dimensions.get("window").height / uiHeight,
    Dimensions.get("window").width / uiWidth
  ),
  autoWidth(value: number) {
    return (Dimensions.get("window").width * value) / uiWidth;
  },
  autoHeight(value: number) {
    return (Dimensions.get("window").height * value) / uiHeight;
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
