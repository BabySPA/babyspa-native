import SelectDropdown from '~/app/components/select-dropdown';
import { ss, ls, sp } from '../utils/style';
import { Icon } from 'native-base';
import { FontAwesome } from '@expo/vector-icons';
import useManagerStore from '../stores/manager';
import { useEffect, useState } from 'react';
import useAuthStore from '../stores/auth';
import { Shop, ShopType } from '../stores/manager/type';

export default function SelectShop({
  onSelect,
  shops,
  defaultButtonText,
  buttonHeight,
  buttonWidth,
}: {
  shops: Shop[];
  onSelect: (selectedItem: any, index: number) => void;
  defaultButtonText?: string;
  buttonHeight?: number;
  buttonWidth?: number;
}) {
  return (
    <SelectDropdown
      data={shops}
      onSelect={(selectedItem, index) => {
        onSelect(selectedItem, index);
      }}
      defaultValue={defaultButtonText}
      defaultButtonText={defaultButtonText || '请选择门店'}
      buttonTextAfterSelection={(selectedItem, index) => {
        return selectedItem.name;
      }}
      rowTextForSelection={(item, index) => {
        return item.name;
      }}
      buttonStyle={{
        width: buttonWidth ?? ss(140),
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

export function useSelectShops(filterCenter: boolean): [Shop | null, Shop[]] {
  const { currentShopWithRole } = useAuthStore();
  const { shops, requestGetShops } = useManagerStore();

  const [defaultSelectShop, setDefaultSelectShop] = useState<Shop | null>();
  const [selectShops, setSelectShops] = useState<Shop[]>([]);

  useEffect(() => {
    if (shops.length > 0) {
      if (currentShopWithRole?.shop.type === ShopType.CENTER) {
        if (filterCenter) {
          const filterShops = shops.filter(
            (item) => item.type !== ShopType.CENTER,
          );
          setDefaultSelectShop(filterShops[0]);
          setSelectShops(filterShops);
        } else {
          setDefaultSelectShop(currentShopWithRole?.shop);
          setSelectShops(shops);
        }
      } else {
        setDefaultSelectShop(currentShopWithRole?.shop);
        const selectShop = shops.filter(
          (item) => item._id === currentShopWithRole?.shop._id,
        );
        setSelectShops(selectShop);
      }
    } else {
      requestGetShops();
    }
  }, [shops]);

  return [defaultSelectShop as Shop, selectShops];
}
