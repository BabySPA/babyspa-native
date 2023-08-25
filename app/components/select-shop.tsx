import SelectDropdown from 'react-native-select-dropdown';
import { ss, ls, sp } from '../utils/style';
import { Icon } from 'native-base';
import { FontAwesome } from '@expo/vector-icons';
import useManagerStore from '../stores/manager';
import { useEffect, useState } from 'react';
import useAuthStore from '../stores/auth';
import { Shop, ShopType } from '../stores/manager/type';

export default function SelectShop({
  onSelect,
  defaultButtonText,
  buttonHeight,
  buttonWidth,
}: {
  onSelect: (selectedItem: any, index: number) => void;
  defaultButtonText?: string;
  buttonHeight?: number;
  buttonWidth?: number;
}) {
  const { shops, requestGetShops } = useManagerStore();
  const { currentShopWithRole } = useAuthStore();

  const isCenter = currentShopWithRole?.shop?.type === ShopType.CENTER;

  const [defaultText, setDefaultText] = useState<string>(
    defaultButtonText || '请选择门店',
  );

  const [useShops, setUseShop] = useState<Shop[]>([]);

  useEffect(() => {
    if (shops.length > 0) {
      if (isCenter) {
        setDefaultText(shops[0].name);
        setUseShop(shops);
      } else {
        setDefaultText(currentShopWithRole?.shop.name || '请选择门店');
        setUseShop(
          shops.filter((item) => item._id === currentShopWithRole?.shop._id),
        );
      }
    }
  }, [shops]);

  useEffect(() => {
    requestGetShops();
  }, []);

  return (
    <SelectDropdown
      data={useShops}
      onSelect={(selectedItem, index) => {
        onSelect(selectedItem, index);
      }}
      defaultButtonText={defaultText}
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
