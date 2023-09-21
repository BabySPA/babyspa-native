import { Platform, Dimensions, PixelRatio } from 'react-native';

interface M {
  min?: number;
  max?: number;
}

const { width, height } = Dimensions.get('window');

export const isPhone = height < 500;

const [shortDimension, longDimension] =
  width < height ? [width, height] : [height, width];

//Default guideline sizes are based on standard ~5" screen mobile device

let guidelineLong = 1194;
let guidelineShort = 835;

const PR = PixelRatio.get();
const FS = PixelRatio.getFontScale();

const S = Math.min(
  longDimension / guidelineLong,
  shortDimension / guidelineShort,
);

const setSpText = (size: number, phoneSize?: number) => {
  const num = Math.round(((size * S + 0.5) * PR) / FS);
  const r = num / PR;

  let pr = 0;
  if (phoneSize) {
    const pnum = Math.round(((phoneSize * S + 0.5) * PR) / FS);
    pr = pnum / PR;
  }

  return isPhone ? pr || r * 1.3 + 1 : r;
};

export const longScale = (size: number, phoneSize?: number) => {
  const r = (shortDimension / guidelineShort) * size;
  let pr = 0;
  if (phoneSize) {
    pr = (shortDimension / guidelineShort) * phoneSize;
  }
  return isPhone ? pr || r * 1.25 : r;
};

export const shortScale = (size: number, phoneSize?: number) => {
  const r = (shortDimension / guidelineShort) * size;
  let pr = 0;
  if (phoneSize) {
    pr = (shortDimension / guidelineShort) * phoneSize;
  }
  return isPhone ? pr || r * 1.25 : r;
};

export const sp = setSpText;
export const ss = shortScale;
export const ls = longScale;
