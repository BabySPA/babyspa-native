import { Flex, Text, Column } from 'native-base';
import { useEffect } from 'react';
import useFlowStore from '~/app/stores/flow';
import { ss } from '~/app/utils/style';
import { useNavigation } from '@react-navigation/native';

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
        <Text>门店中心</Text>
      </Column>
    </Flex>
  );
}
