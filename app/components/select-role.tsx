import SelectDropdown from '~/app/components/select-dropdown';
import { ss, ls, sp } from '../utils/style';
import { Icon } from 'native-base';
import { FontAwesome } from '@expo/vector-icons';
import useManagerStore from '../stores/manager';
import { useEffect, useState } from 'react';
import { ShopType } from '../stores/manager/type';

export default function SelectRole({
  onSelect,
  type,
  defaultButtonText,
  buttonHeight,
  buttonWidth,
}: {
  onSelect: (selectedItem: any, index: number) => void;
  type: ShopType;
  defaultButtonText?: string;
  buttonHeight?: number;
  buttonWidth?: number;
}) {
  const { roles, requestGetRoles } = useManagerStore();

  const [filterRoles, setFilterRoles] = useState(roles);
  const [defaultValue, setDefaultValue] = useState('');

  useEffect(() => {
    requestGetRoles();
  }, []);

  useEffect(() => {
    setFilterRoles(roles.filter((role) => role.type === type));
  }, [type]);

  useEffect(() => {
    if (filterRoles.length > 0) {
      const idx = filterRoles.findIndex((role) => role.name === defaultValue);
      if (idx == -1) {
        setDefaultValue('');
      }
    }
  }, [filterRoles]);
  useEffect(() => {
    setDefaultValue(defaultButtonText || '');
  }, [defaultButtonText]);

  return (
    <SelectDropdown
      data={filterRoles}
      onSelect={(selectedItem, index) => {
        onSelect(selectedItem, index);
      }}
      defaultValue={defaultValue}
      defaultButtonText={defaultValue || '请选择角色'}
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
        backgroundColor: '#CBEDE2',
      }}
    />
  );
}
