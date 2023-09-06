import { Platform, Dimensions, PixelRatio } from 'react-native';

interface M {
  min?: number;
  max?: number;
}

const { width, height } = Dimensions.get('window');

const aspectRatio = height / width;

if (aspectRatio > 1.6) {
  // Code for Iphone
  console.log('Iphone', width, height, Platform.isPad);
} else {
  // Code for Ipad
  console.log('Ipad', width, height, Platform.isPad);
}

const [shortDimension, longDimension] =
  width < height ? [width, height] : [height, width];

//Default guideline sizes are based on standard ~5" screen mobile device
const guidelineLong = 1194;
const guidelineShort = 835;

const PR = PixelRatio.get();
const FS = PixelRatio.getFontScale();

const S = Math.min(
  longDimension / guidelineLong,
  shortDimension / guidelineShort,
);

const setSpText = (size: number, minAndMax?: M) => {
  const num = Math.round(((size * S + 0.5) * PR) / FS);
  const r = num / PR;

  if (minAndMax === undefined) return r;
  const { min = r, max = r } = minAndMax;

  return r <= min ? min : r >= max ? max : r;
};

export const longScale = (size: number, minAndMax?: M) => {
  const r = (longDimension / guidelineLong) * size;

  if (minAndMax === undefined) {
    return r;
  }
  const { min = r, max = r } = minAndMax;
  return r <= min ? min : r >= max ? max : r;

  return size;
};

export const shortScale = (size: number, minAndMax?: M) => {
  const r = (shortDimension / guidelineShort) * size;

  if (minAndMax === undefined) {
    return r;
  }
  const { min = r, max = r } = minAndMax;
  return r <= min ? min : r >= max ? max : r;

  return size;
};

export const sp = setSpText;
export const ss = shortScale;
export const ls = longScale;
