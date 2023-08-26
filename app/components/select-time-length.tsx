import SelectDropdown from '~/app/components/select-dropdown';
import { ss, ls, sp } from '../utils/style';

const times = [
  {
    name: '15分钟',
    value: 15 * 60 * 1000,
  },
  {
    name: '30分钟',
    value: 30 * 60 * 1000,
  },
  {
    name: '45分钟',
    value: 45 * 60 * 1000,
  },
  {
    name: '1小时',
    value: 60 * 60 * 1000,
  },
  {
    name: '1小时15分钟',
    value: 75 * 60 * 1000,
  },
  {
    name: '1小时30分钟',
    value: 90 * 60 * 1000,
  },
  {
    name: '1小时45分钟',
    value: 105 * 60 * 1000,
  },
  {
    name: '2小时',
    value: 120 * 60 * 1000,
  },
];

export default function SelectTimeLength({
  onSelect,
  defaultButtonText,
}: {
  onSelect: (selectedItem: any, index: number) => void;
  defaultButtonText: string;
}) {
  return (
    <SelectDropdown
      data={times}
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
        width: ls(120),
        height: ss(26),
        backgroundColor: 'transparent',
        padding: 0,
      }}
      buttonTextStyle={{
        color: '#E36C36',
        fontSize: sp(16),
        textAlign: 'left',
        marginLeft: ls(-5),
      }}
      renderDropdownIcon={(isOpened) => {
        return null;
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
