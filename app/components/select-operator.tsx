import SelectDropdown from '~/app/components/select-dropdown';
import { ss, ls, sp } from '../utils/style';
import { Icon } from 'native-base';
import { FontAwesome } from '@expo/vector-icons';

export default function SelectOperator({
  operators,
  onSelect,
  defaultButtonText,
}: {
  operators: any;
  onSelect: (selectedItem: any, index: number) => void;
  defaultButtonText: string;
}) {
  return (
    <SelectDropdown
      data={operators}
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
        width: '100%',
        height: ss(48),
        backgroundColor: '#fff',
        borderRadius: ss(4),
        borderWidth: ss(1),
        borderColor: '#D8D8D8',
      }}
      buttonTextStyle={{
        color: '#333333',
        textAlign: 'left',
        fontSize: sp(16),
      }}
      renderDropdownIcon={(isOpened) => {
        return (
          <Icon
            as={<FontAwesome name={isOpened ? 'angle-up' : 'angle-down'} />}
            size={sp(18)}
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
        fontSize: sp(16),
      }}
      selectedRowStyle={{
        backgroundColor: '#CBEDE2',
      }}
    />
  );
}
