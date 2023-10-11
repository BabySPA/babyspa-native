import SelectDropdown from '~/app/components/select-dropdown';
import { ss, ls, sp } from '../utils/style';
import { Icon } from 'native-base';
import { FontAwesome } from '@expo/vector-icons';
import useManagerStore from '../stores/manager';
import { useEffect, useState } from 'react';
import { RoleStatus, ShopType } from '../stores/manager/type';

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
  const roles = useManagerStore((state) => state.roles);
  const requestGetRoles = useManagerStore((state) => state.requestGetRoles);

  const [filterRoles, setFilterRoles] = useState(roles);
  const [defaultValue, setDefaultValue] = useState('');

  useEffect(() => {
    requestGetRoles();
  }, []);

  useEffect(() => {
    setFilterRoles(
      roles.filter(
        (role) => role.type === type && role.status === RoleStatus.OPEN,
      ),
    );
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
