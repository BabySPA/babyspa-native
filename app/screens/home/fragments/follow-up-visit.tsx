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
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import EmptyBox from '~/app/components/empty-box';
import { debounce } from 'lodash';
import DatePickerModal from '~/app/components/date-picker-modal';
import CustomerFollowUpItem from '../components/customer-followup-item';
import SelectShop, { useSelectShops } from '~/app/components/select-shop';
import useGlobalLoading from '~/app/stores/loading';
import useLayoutConfigWithRole from '~/app/stores/layout';

export default function FollowUpVisit() {
  const navigation = useNavigation();
  const {
    updateCurrentFlow,
    customersFollowUp: { flows },
  } = useFlowStore();

  return (
    <Flex flex={1}>
      <Filter />
      <ScrollView margin={ss(10)}>
        {flows.length == 0 ? (
          <EmptyBox />
        ) : (
          <Row
            flex={1}
            bgColor='white'
            borderRadius={ss(10)}
            flexWrap={'wrap'}
            p={ss(40)}>
            {flows.map((flow, idx) => {
              return (
                <Pressable
                  hitSlop={ss(10)}
                  ml={idx % 2 == 1 ? ss(20) : 0}
                  key={idx}
                  onPress={() => {
                    updateCurrentFlow(flow);
                    navigation.navigate('FlowInfo', {
                      from: 'follow-up-detail',
                    });
                  }}>
                  <CustomerFollowUpItem flow={flow} />
                </Pressable>
              );
            })}
          </Row>
        )}
      </ScrollView>
    </Flex>
  );
}

function Filter() {
  const navigation = useNavigation();
  const {
    customersFollowUp,
    updateCustomersFollowupFilter,
    requestGetFollowUps,
  } = useFlowStore();

  const { defaultFollowUpSelectShop } = useLayoutConfigWithRole();
  const { openLoading, closeLoading } = useGlobalLoading();

  const [isOpenDatePicker, setIsOpenDatePicker] = useState<{
    type?: 'start' | 'end';
    isOpen: boolean;
  }>({
    isOpen: false,
  });

  useEffect(() => {
    updateCustomersFollowupFilter({
      shopId: defaultFollowUpSelectShop._id,
    });
    requestGetFollowUps();
  }, [defaultFollowUpSelectShop]);

  const [defaultSelectShop, selectShops] = useSelectShops(true);

  return (
    <Column mx={ss(10)} mt={ss(10)} bgColor='white' borderRadius={ss(10)}>
      <Row py={ss(20)} px={ls(40)} alignItems={'center'}>
        <SelectShop
          onSelect={function (selectedItem: any, index: number): void {
            updateCustomersFollowupFilter({
              shopId: selectedItem._id,
            });
            requestGetFollowUps();
          }}
          defaultButtonText={
            defaultFollowUpSelectShop?.name || defaultSelectShop?.name
          }
          buttonHeight={ss(40)}
          buttonWidth={ls(140)}
          shops={selectShops}
        />
        <Input
          autoCorrect={false}
          w={ls(240)}
          ml={ls(20)}
          minH={ss(40, { max: 18 })}
          p={ss(8)}
          borderRadius={4}
          placeholderTextColor={'#6E6F73'}
          color={'#333333'}
          fontSize={ss(16)}
          onChangeText={debounce((text) => {
            updateCustomersFollowupFilter({
              searchKeywords: text,
            });
            requestGetFollowUps();
          }, 1000)}
          InputLeftElement={
            <Icon
              as={<MaterialIcons name='search' />}
              size={ss(25)}
              color='#AFB0B4'
              ml={ss(10)}
            />
          }
          placeholder='请输入客户姓名、手机号'
        />
        <Pressable
          hitSlop={ss(10)}
          onPress={() => {
            setIsOpenDatePicker({
              isOpen: true,
              type: 'start',
            });
          }}
          flexDirection={'row'}
          ml={ls(20)}
          minH={ss(40, { max: 18 })}
          alignItems={'center'}
          py={ss(8)}
          pl={ls(12)}
          pr={ls(25)}
          borderRadius={4}
          borderColor={'#D8D8D8'}
          borderWidth={1}>
          <Icon
            as={<MaterialIcons name='date-range' />}
            size={ss(20)}
            color='rgba(0,0,0,0.2)'
          />
          <Text color={'#333333'} fontSize={ss(18)} ml={ls(8)}>
            {customersFollowUp.startDate}
          </Text>
        </Pressable>
        <Text mx={ls(10)} color='#333' fontSize={sp(16)}>
          至
        </Text>
        <Pressable
          hitSlop={ss(10)}
          onPress={() => {
            setIsOpenDatePicker({
              isOpen: true,
              type: 'end',
            });
          }}
          flexDirection={'row'}
          minH={ss(40, { max: 18 })}
          py={ss(8)}
          pl={ls(12)}
          pr={ls(25)}
          alignItems={'center'}
          borderRadius={4}
          borderColor={'#D8D8D8'}
          borderWidth={1}>
          <Icon
            as={<MaterialIcons name='date-range' />}
            size={ss(20)}
            color='rgba(0,0,0,0.2)'
          />
          <Text color={'#333333'} fontSize={ss(18)} ml={ls(8)}>
            {customersFollowUp.endDate}
          </Text>
        </Pressable>

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
              requestGetFollowUps();
            } else {
              updateCustomersFollowupFilter({
                endDate: date,
              });
              requestGetFollowUps();
            }
          }}
          current={
            isOpenDatePicker.type == 'start'
              ? customersFollowUp.startDate
              : customersFollowUp.endDate
          }
          selected={
            isOpenDatePicker.type == customersFollowUp.startDate
              ? customersFollowUp.startDate
              : customersFollowUp.endDate
          }
        />
      </Row>
    </Column>
  );
}
