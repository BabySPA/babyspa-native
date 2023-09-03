import SelectDropdown from '~/app/components/select-dropdown';
import { ss, ls, sp } from '../utils/style';
import { Icon } from 'native-base';
import { FontAwesome } from '@expo/vector-icons';

export const getDay = (day: number) => {
  const d: { [key: number]: string } = {
    0: '今',
    1: '明',
    2: '后',
  };
  if (day in d) {
    return d[day];
  }
  if (day) {
    return '已过期';
  } else {
    return '今';
  }
};

export const Days = [
  { name: '今', value: 0 },
  { name: '明', value: 1 },
  { name: '后', value: 2 },
];

export default function SelectDay({
  onSelect,
  defaultButtonText,
}: {
  onSelect: (selectedItem: any, index: number) => void;
  defaultButtonText: string;
}) {
  return (
    <SelectDropdown
      data={Days}
      onSelect={(selectedItem, index) => {
        onSelect(selectedItem, index);
      }}
      defaultValue={defaultButtonText}
      defaultButtonText={defaultButtonText}
      buttonTextAfterSelection={(selectedItem, index) => {
        return selectedItem.name;
      }}
      rowTextForSelection={(item, index) => {
        return item.name;
      }}
      buttonStyle={{
        maxWidth: ls(112),
        height: ss(48, { min: 26 }),
        backgroundColor: '#fff',
        borderRadius: ss(4),
        borderWidth: 1,
        borderColor: '#D8D8D8',
      }}
      buttonTextStyle={{
        color: '#333333',
        textAlign: 'left',
        fontSize: sp(16, { min: 12 }),
      }}
      renderDropdownIcon={(isOpened) => {
        return (
          <Icon
            as={<FontAwesome name={isOpened ? 'angle-up' : 'angle-down'} />}
            size={ss(18, { min: 15 })}
            color='#999'
          />
        );
      }}
      dropdownIconPosition={'right'}
      dropdownStyle={{
        backgroundColor: '#fff',
        borderRadius: ss(8),
      }}
      rowStyle={{
        backgroundColor: '#fff',
        borderBottomColor: '#D8D8D8',
      }}
      rowTextStyle={{
        color: '#333',
        textAlign: 'center',
        fontSize: sp(16, { min: 12 }),
      }}
      selectedRowStyle={{
        backgroundColor: '#CBEDE2',
      }}
    />
  );
}
