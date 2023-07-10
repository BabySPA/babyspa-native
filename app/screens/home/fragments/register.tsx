import { Box, Flex, Text } from 'native-base';
import { useEffect, useState } from 'react';
import useFlowStore from '~/app/stores/flow';
import { ls, ss } from '~/app/utils/style';

export default function Register() {
  const { getRegisterCustomers, registers } = useFlowStore();
  useEffect(() => {
    getRegisterCustomers();
  }, []);
  return (
    <Flex flex={1}>
      <Flex mx={ss(10)} mt={ss(10)} bgColor="white" borderRadius={ss(10)}>
        这里是筛选
      </Flex>
      <Flex
        flex={1}
        margin={ss(10)}
        bgColor="white"
        borderRadius={ss(10)}
        flexDirection={'row'}
        flexWrap={'wrap'}
      >
        {registers.map((register) => (
          <CustomerItem customer={register} key={register.id} />
        ))}
      </Flex>
    </Flex>
  );
}

function CustomerItem({ customer }) {
  return (
    <Box
      borderRadius={ss(8)}
      borderStyle={'dashed'}
      borderWidth={1}
      borderColor={'#15BD8F'}
      width={'40%'}
    >
      <Text>{customer.name}</Text>
    </Box>
  );
}
