import Picker from 'react-native-picker';
import { createAreaData } from '.';
import { sp } from './style';
const area = createAreaData();

export const showAreaPicker = (
  defaultRegion: string[],
  onPickerConfirm: (val: string[]) => void,
) => {
  Picker.init({
    pickerData: area,
    pickerTitleText: '选择地区',
    pickerConfirmBtnText: '确定',
    pickerCancelBtnText: '取消',
    pickerConfirmBtnColor: [255, 255, 255, 1],
    pickerCancelBtnColor: [255, 255, 255, 1],
    pickerToolBarBg: [3, 203, 178, 1],
    pickerBg: [243, 243, 243, 1],
    pickerToolBarFontSize: sp(16),
    pickerFontSize: sp(16),
    selectedValue: defaultRegion,
    onPickerConfirm: (pickedValue) => {
      onPickerConfirm(pickedValue);
    },
  });
  Picker.show();
};

export const showTimePicker = (
  time: string[],
  onPickerConfirm: (val: string[]) => void,
) => {
  let hours = [],
    minutes = [];

  for (let i = 1; i <= 23; i++) {
    if (i < 10) {
      hours.push(`0${i}`);
    } else {
      hours.push(`${i}`);
    }
  }
  for (let i = 1; i <= 59; i++) {
    if (i < 10) {
      minutes.push(`0${i}`);
    } else {
      minutes.push(`${i}`);
    }
  }
  let pickerData = [hours, minutes];
  let date = new Date();
  let selectedValue = [date.getHours(), date.getMinutes()];

  Picker.init({
    pickerData,
    selectedValue,
    pickerTitleText: '选择时间',
    pickerConfirmBtnText: '确定',
    pickerCancelBtnText: '取消',
    pickerConfirmBtnColor: [255, 255, 255, 1],
    pickerCancelBtnColor: [255, 255, 255, 1],
    pickerToolBarBg: [3, 203, 178, 1],
    pickerBg: [243, 243, 243, 1],
    pickerToolBarFontSize: sp(16),
    pickerFontSize: sp(16),
    onPickerConfirm: (pickedValue) => {
      onPickerConfirm(pickedValue);
    },
  });
  Picker.show();
};
