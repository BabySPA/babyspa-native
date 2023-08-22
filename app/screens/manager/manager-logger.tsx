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
} from 'native-base';
import NavigationBar from '~/app/components/navigation-bar';
import { sp, ss, ls } from '~/app/utils/style';
import { AppStackScreenProps, Gender } from '~/app/types';
import { useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import useManagerStore, { DefaultRole } from '~/app/stores/manager';
import { useNavigation } from '@react-navigation/native';

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
          <Row w={ls(150)} justifyContent={'center'}>
            <Text fontSize={sp(18)} color={'#333'}>
              操作时间
            </Text>
          </Row>
        </Row>
        {logs.map((log, idx) => {
          return (
            <Row
              key={idx}
              px={ls(40)}
              minH={ss(60)}
              py={ss(10)}
              alignItems={'center'}
              borderTopRadius={ss(10)}
              width={'100%'}
              borderBottomWidth={1}
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
              <Row w={ls(150)}>
                <Text fontSize={sp(18)} color={'#333'}>
                  {log.createdAt}
                </Text>
              </Row>
            </Row>
          );
        })}
      </Column>
    );
  };

  return (
    <Box flex={1}>
      <NavigationBar
        onBackIntercept={() => false}
        leftElement={
          <Text color='white' fontWeight={600} fontSize={sp(20, { min: 14 })}>
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
  const navigation = useNavigation();
  const { setCurrentRole } = useManagerStore();

  return (
    <Row
      bgColor='white'
      borderRadius={ss(10)}
      justifyContent={'space-between'}
      alignItems={'center'}
      px={ls(40)}>
      <Row py={ss(20)} alignItems={'center'}>
        <Input
          w={ls(240)}
          minH={ss(40, { max: 18 })}
          p={ss(8)}
          mr={ss(40)}
          placeholderTextColor={'#6E6F73'}
          color={'#333333'}
          fontSize={ss(16)}
          InputLeftElement={
            <Icon
              as={<MaterialIcons name='search' />}
              size={ss(25)}
              color='#AFB0B4'
              ml={ss(10)}
            />
          }
          placeholder='请输入操作人员姓名搜索'
          onChangeText={(text) => {}}
        />
      </Row>
    </Row>
  );
}
