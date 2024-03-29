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
  Center,
  FlatList,
} from 'native-base';
import { useEffect, useState } from 'react';
import useFlowStore from '~/app/stores/flow';
import { ls, sp, ss } from '~/app/utils/style';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import EmptyBox from '~/app/components/empty-box';
import { debounce } from 'lodash';
import DatePickerModal from '~/app/components/date-picker-modal';
import CustomerFollowUpItem from '../components/customer-followup-item';
import SelectShop, { useSelectShops } from '~/app/components/select-shop';
import { Shop } from '../../../stores/manager/type';

export default function FollowUpVisit(params: {
  shop?: Pick<Shop, 'name' | '_id'>;
}) {
  const navigation = useNavigation();

  const flows = useFlowStore((state) => state.customersFollowUp.flows);
  const requestGetFollowUps = useFlowStore(
    (state) => state.requestGetFollowUps,
  );
  const resetFollowUps = useFlowStore((state) => state.resetFollowUps);

  useEffect(() => {
    refresh();
    return () => {
      resetFollowUps();
    };
  }, []);

  const [refreshing, setRefreshing] = useState(false);

  const refresh = async () => {
    setRefreshing(true);
    await requestGetFollowUps();
    setRefreshing(false);
  };

  const [renderWaiting, setRenderWaiting] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setRenderWaiting(true);
    }, 10);
  }, []);
  return (
    <Flex flex={1}>
      <Filter
        shop={params?.shop}
        onRequest={() => {
          refresh();
        }}
      />
      <Box margin={ss(10)} flex={1}>
        <Row
          flex={1}
          p={ss(40)}
          pb={0}
          bgColor='white'
          borderRadius={ss(10)}
          minH={'100%'}>
          {renderWaiting && (
            <FlatList
              nestedScrollEnabled
              refreshing={refreshing}
              onRefresh={() => {
                refresh();
              }}
              ListEmptyComponent={<EmptyBox />}
              mb={ss(120)}
              data={flows}
              numColumns={2}
              renderItem={({ item: flow, index: idx }) => {
                return (
                  <Center width={'50%'} key={idx}>
                    <Pressable
                      _pressed={{
                        opacity: 0.8,
                      }}
                      ml={idx % 2 == 1 ? ss(20) : 0}
                      mr={idx % 2 == 0 ? ss(20) : 0}
                      mb={ss(40)}
                      hitSlop={ss(20)}
                      onPress={() => {
                        navigation.navigate('FlowInfo', {
                          from: 'follow-up-detail',
                          currentFlow: flow,
                        });
                      }}>
                      <CustomerFollowUpItem flow={flow} />
                    </Pressable>
                  </Center>
                );
              }}
            />
          )}
        </Row>
      </Box>
    </Flex>
  );
}

function Filter({
  shop,
  onRequest,
}: {
  shop?: Pick<Shop, 'name' | '_id'>;
  onRequest: () => void;
}) {
  const customersFollowUp = useFlowStore((state) => state.customersFollowUp);
  const updateCustomersFollowupFilter = useFlowStore(
    (state) => state.updateCustomersFollowupFilter,
  );

  const [isOpenDatePicker, setIsOpenDatePicker] = useState<{
    type?: 'start' | 'end';
    isOpen: boolean;
  }>({
    isOpen: false,
  });

  useEffect(() => {
    updateCustomersFollowupFilter({
      shopId: shop?._id,
    });
    onRequest();
  }, [shop]);

  const [defaultSelectShop, selectShops] = useSelectShops(true);

  return (
    <Column mx={ss(10)} mt={ss(10)} bgColor='white' borderRadius={ss(10)}>
      <Row h={ss(75)} px={ls(40)} alignItems={'center'}>
        <SelectShop
          onSelect={function (selectedItem: any, index: number): void {
            updateCustomersFollowupFilter({
              shopId: selectedItem._id,
            });
            onRequest();
          }}
          defaultButtonText={shop?.name || defaultSelectShop?.name}
          buttonHeight={ss(44)}
          buttonWidth={ls(140, 210)}
          shops={selectShops}
        />
        <Input
          autoCorrect={false}
          minW={ls(240, 360)}
          ml={ls(20)}
          h={ss(44)}
          p={ss(9)}
          borderWidth={ss(1)}
          borderColor={'#D8D8D8'}
          borderRadius={ss(4)}
          placeholderTextColor={'#6E6F73'}
          color={'#333333'}
          fontSize={sp(16)}
          onChangeText={debounce((text) => {
            updateCustomersFollowupFilter({
              searchKeywords: text,
            });
            onRequest();
          }, 1000)}
          InputLeftElement={
            <Icon
              as={<MaterialIcons name='search' />}
              size={sp(25)}
              color='#AFB0B4'
              ml={ss(10)}
            />
          }
          placeholder='请输入客户姓名、手机号'
        />
        <Pressable
          _pressed={{
            opacity: 0.8,
          }}
          hitSlop={ss(20)}
          onPress={() => {
            setIsOpenDatePicker({
              isOpen: true,
              type: 'start',
            });
          }}
          flexDirection={'row'}
          ml={ls(20)}
          h={ss(44)}
          alignItems={'center'}
          pl={ls(12)}
          pr={ls(25)}
          borderRadius={ss(4)}
          borderColor={'#D8D8D8'}
          borderWidth={ss(1)}>
          <Icon
            as={<MaterialIcons name='date-range' />}
            size={sp(20)}
            color='rgba(0,0,0,0.2)'
          />
          <Text color={'#333333'} fontSize={sp(18)} ml={ls(8)}>
            {customersFollowUp.startDate}
          </Text>
        </Pressable>
        <Text mx={ls(10)} color='#333' fontSize={sp(16)}>
          至
        </Text>
        <Pressable
          _pressed={{
            opacity: 0.8,
          }}
          hitSlop={ss(20)}
          onPress={() => {
            setIsOpenDatePicker({
              isOpen: true,
              type: 'end',
            });
          }}
          flexDirection={'row'}
          h={ss(44)}
          pl={ls(12)}
          pr={ls(25)}
          alignItems={'center'}
          borderRadius={ss(4)}
          borderColor={'#D8D8D8'}
          borderWidth={ss(1)}>
          <Icon
            as={<MaterialIcons name='date-range' />}
            size={sp(20)}
            color='rgba(0,0,0,0.2)'
          />
          <Text color={'#333333'} fontSize={sp(18)} ml={ls(8)}>
            {customersFollowUp.endDate}
          </Text>
        </Pressable>

        {isOpenDatePicker.isOpen && (
          <DatePickerModal
            isOpen={isOpenDatePicker.isOpen}
            onClose={() => {
              setIsOpenDatePicker({
                isOpen: false,
              });
            }}
            onSelectedChange={(date: string) => {
              if (!isOpenDatePicker.type) return;
              if (isOpenDatePicker.type == 'start') {
                updateCustomersFollowupFilter({
                  startDate: date,
                });
                onRequest();
              } else {
                updateCustomersFollowupFilter({
                  endDate: date,
                });
                onRequest();
              }
            }}
            current={
              isOpenDatePicker.type == 'start'
                ? customersFollowUp.startDate
                : customersFollowUp.endDate
            }
            selected={
              isOpenDatePicker.type == 'start'
                ? customersFollowUp.startDate
                : customersFollowUp.endDate
            }
          />
        )}
      </Row>
    </Column>
  );
}
