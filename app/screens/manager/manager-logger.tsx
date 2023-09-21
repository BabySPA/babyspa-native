import dayjs from 'dayjs';
import {
  Box,
  Column,
  Icon,
  Input,
  Pressable,
  Row,
  Text,
  Image,
  ScrollView,
  FlatList,
} from 'native-base';
import NavigationBar from '~/app/components/navigation-bar';
import { sp, ss, ls } from '~/app/utils/style';
import { AppStackScreenProps, Gender } from '~/app/types';
import { useEffect, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import useManagerStore, { DefaultRole } from '~/app/stores/manager';
import { useNavigation } from '@react-navigation/native';
import DatePickerModal from '~/app/components/date-picker-modal';

export default function ManagerLogger({
  navigation,
}: AppStackScreenProps<'ManagerLogger'>) {
  const { logs, requestGetLogs } = useManagerStore();

  useEffect(() => {
    requestGetLogs();
  }, []);

  const List = () => {
    return (
      <Column>
        <Row
          bgColor={'#EDF7F6'}
          px={ls(40)}
          h={ss(60)}
          alignItems={'center'}
          borderTopRadius={ss(10)}
          width={'100%'}
          justifyContent={'space-around'}>
          <Row w={ls(150)}>
            <Text fontSize={sp(18)} color={'#333'}>
              账号
            </Text>
          </Row>
          <Row w={ls(100)}>
            <Text fontSize={sp(18)} color={'#333'}>
              操作人
            </Text>
          </Row>

          <Row w={ls(150)}>
            <Text fontSize={sp(18)} color={'#333'}>
              模块名称
            </Text>
          </Row>
          <Row w={ls(150)}>
            <Text fontSize={sp(18)} color={'#333'}>
              操作内容
            </Text>
          </Row>
          <Row w={ls(200)} justifyContent={'center'}>
            <Text fontSize={sp(18)} color={'#333'}>
              操作时间
            </Text>
          </Row>
        </Row>
        <FlatList
          data={logs}
          renderItem={({ item: log }) => {
            return (
              <Row
                px={ls(40)}
                minH={ss(60)}
                py={ss(10)}
                alignItems={'center'}
                bgColor={'#fff'}
                width={'100%'}
                borderBottomWidth={ss(1)}
                borderBottomColor={'#DFE1DE'}
                borderBottomStyle={'solid'}
                justifyContent={'space-around'}>
                <Row w={ls(150)}>
                  <Text fontSize={sp(18)} color={'#333'}>
                    {log.username}
                  </Text>
                </Row>
                <Row w={ls(100)}>
                  <Text fontSize={sp(18)} color={'#333'}>
                    {log.name}
                  </Text>
                </Row>
                <Row w={ls(150)}>
                  <Text fontSize={sp(18)} color={'#333'}>
                    {log.module}
                  </Text>
                </Row>
                <Row w={ls(150)}>
                  <Text fontSize={sp(18)} color={'#333'}>
                    {log.action}
                  </Text>
                </Row>
                <Row w={ls(200)}>
                  <Text fontSize={sp(18)} color={'#333'}>
                    {dayjs(log.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                  </Text>
                </Row>
              </Row>
            );
          }}
          keyExtractor={(item) => item._id}
        />
      </Column>
    );
  };

  return (
    <Box flex={1}>
      <NavigationBar
        onBackIntercept={() => false}
        leftElement={
          <Text color='white' fontWeight={600} fontSize={sp(20)}>
            操作日志
          </Text>
        }
        rightElement={
          <Text color={'#fff'} fontSize={sp(20)}>
            {dayjs().format('YYYY-MM-DD')}
          </Text>
        }
      />
      <Column
        safeAreaLeft
        bgColor={'#F6F6FA'}
        flex={1}
        p={ss(10)}
        safeAreaBottom>
        <Filter />
        <Box mt={ss(10)}>
          <List />
        </Box>
      </Column>
    </Box>
  );
}

function Filter() {
  const { logFilter, setLogFilter, requestGetLogs } = useManagerStore();
  const [isOpenDatePicker, setIsOpenDatePicker] = useState<{
    type?: 'start' | 'end';
    isOpen: boolean;
  }>({
    isOpen: false,
  });

  return (
    <Row
      bgColor='white'
      borderRadius={ss(10)}
      justifyContent={'space-between'}
      alignItems={'center'}
      px={ls(40)}>
      <Row py={ss(20)} alignItems={'center'}>
        <Input
          w={ls(300)}
          h={ss(44)}
          p={ss(9)}
          mr={ss(40)}
          borderWidth={ss(1)}
          borderColor={'#D8D8D8'}
          placeholderTextColor={'#6E6F73'}
          color={'#333333'}
          fontSize={sp(16)}
          InputLeftElement={
            <Icon
              as={<MaterialIcons name='search' />}
              size={ss(25)}
              color='#AFB0B4'
              ml={ss(10)}
            />
          }
          defaultValue={logFilter.searchKeywords}
          placeholder='请输入操作人员姓名或账号搜索'
          onChangeText={(text) => {
            setLogFilter({
              searchKeywords: text,
            });
            requestGetLogs();
          }}
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
            size={ss(20)}
            color='rgba(0,0,0,0.2)'
          />
          <Text color={'#333333'} fontSize={sp(18)} ml={ls(8)}>
            {logFilter.startDate}
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
            size={ss(20)}
            color='rgba(0,0,0,0.2)'
          />
          <Text color={'#333333'} fontSize={sp(18)} ml={ls(8)}>
            {logFilter.endDate}
          </Text>
        </Pressable>
      </Row>

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
            setLogFilter({
              startDate: date,
            });
            requestGetLogs();
          } else {
            setLogFilter({
              endDate: date,
            });
            requestGetLogs();
          }
        }}
        current={
          isOpenDatePicker.type == 'start'
            ? logFilter.startDate
            : logFilter.endDate
        }
        selected={
          isOpenDatePicker.type == logFilter.startDate
            ? logFilter.startDate
            : logFilter.endDate
        }
      />
    </Row>
  );
}
