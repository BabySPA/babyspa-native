import SelectDropdown from 'react-native-select-dropdown';
import { ss, ls, sp } from '../utils/style';
import { Icon } from 'native-base';
import { FontAwesome } from '@expo/vector-icons';

export default function SelectShop({
  shops,
  onSelect,
  defaultButtonText,
  buttonHeight,
  buttonWidth,
}: {
  shops: any;
  onSelect: (selectedItem: any, index: number) => void;
  defaultButtonText: string;
  buttonHeight?: number;
  buttonWidth?: number;
}) {
  return (
    <SelectDropdown
      data={shops}
      onSelect={(selectedItem, index) => {
        onSelect(selectedItem, index);
      }}
      defaultButtonText={defaultButtonText}
      buttonTextAfterSelection={(selectedItem, index) => {
        return selectedItem.name;
      }}
      rowTextForSelection={(item, index) => {
        return item.name;
      }}
      buttonStyle={{
        width: buttonWidth ?? ss(200),
        height: buttonHeight ?? ss(48),
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
        backgroundColor: '#f8f8f8',
      }}
    />
  );
}
