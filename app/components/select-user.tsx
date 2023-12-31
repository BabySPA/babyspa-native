import SelectDropdown from '~/app/components/select-dropdown';
import { ss, sp, ls } from '../utils/style';
import { Icon } from 'native-base';
import { FontAwesome } from '@expo/vector-icons';
import useAuthStore from '../stores/auth';

export default function SelectUser({
  onSelect,
  buttonHeight,
  buttonWidth,
  style,
  textStyle,
}: {
  onSelect: (selectedItem: any, index: number) => void;
  defaultButtonText?: string;
  buttonHeight?: number;
  buttonWidth?: number;
  style?: any;
  textStyle?: any;
}) {
  const user = useAuthStore((state) => state.user);
  const currentShopWithRole = useAuthStore(
    (state) => state.currentShopWithRole,
  );

  return (
    <SelectDropdown
      data={user?.shopsWithRole || []}
      onSelect={(selectedItem, index) => {
        onSelect(selectedItem, index);
      }}
      defaultValue={currentShopWithRole?.shop.name}
      defaultButtonText={currentShopWithRole?.shop.name}
      buttonTextAfterSelection={(selectedItem, index) => {
        return selectedItem.shop.name;
      }}
      rowTextForSelection={(item, index) => {
        return item.shop.name;
      }}
      numberOfLines={1}
      buttonStyle={{
        width: ls(120),
        height: buttonHeight || ss(40, 34),
        backgroundColor: 'transparent',
        ...style,
      }}
      buttonTextStyle={{
        color: '#fff',
        fontSize: sp(14, 17),
        ...textStyle,
      }}
      renderDropdownIcon={(isOpened) => {
        return (
          <Icon
            as={<FontAwesome name={isOpened ? 'angle-up' : 'angle-down'} />}
            size={sp(15, 17)}
            color='#fff'
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
        fontSize: sp(14),
      }}
      selectedRowStyle={{
        backgroundColor: '#CBEDE2',
      }}
    />
  );
}
