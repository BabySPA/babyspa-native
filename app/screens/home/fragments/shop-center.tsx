import {
  Box,
  Flex,
  Text,
  ScrollView,
  Icon,
  Input,
  Row,
  Column,
  Pressable,
} from 'native-base';
import { useEffect, useState } from 'react';
import useFlowStore from '~/app/stores/flow';
import { ls, sp, ss } from '~/app/utils/style';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
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
