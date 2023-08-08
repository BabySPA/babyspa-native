import { Flex, Text, Column, Row } from 'native-base';
import { useEffect } from 'react';
import useFlowStore from '~/app/stores/flow';
import { ss } from '~/app/utils/style';
import { useNavigation } from '@react-navigation/native';
import ShopCenterHeader from '../components/shop-center-header';
import ShopCenterBox from '../components/shop-center-box';

export default function ShopCenter() {
  const navigation = useNavigation();
  const {
    requestCustomersArchive,
    updateCurrentFlowCustomer,
    customersArchive: { customers },
  } = useFlowStore();

  useEffect(() => {
    requestCustomersArchive();
  }, []);

  return (
    <Flex flex={1}>
      <Column margin={ss(10)}>
        <ShopCenterHeader />
        <Row flexWrap={'wrap'} mt={ss(10)}>
          <ShopCenterBox />
          <ShopCenterBox />
          <ShopCenterBox />
          <ShopCenterBox />
          <ShopCenterBox />
        </Row>
      </Column>
    </Flex>
  );
}
