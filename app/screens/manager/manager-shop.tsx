import dayjs from 'dayjs';
import {
  Box,
  Column,
  Icon,
  Input,
  Pressable,
  Row,
  ScrollView,
  Text,
} from 'native-base';
import NavigationBar from '~/app/components/navigation-bar';
import { sp, ss, ls } from '~/app/utils/style';
import { AppStackScreenProps } from '~/app/types';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function ManagerShop({
  navigation,
}: AppStackScreenProps<'ManagerShop'>) {
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
          <Box w={ls(90)}>
            <Text fontSize={sp(18)} color={'#333'}>
              门店名称
            </Text>
          </Box>
          <Box w={ls(90)}>
            <Text fontSize={sp(18)} color={'#333'}>
              负责人
            </Text>
          </Box>
          <Box w={ls(140)}>
            <Text fontSize={sp(18)} color={'#333'}>
              所属区域
            </Text>
          </Box>
          <Box w={ls(140)}>
            <Text fontSize={sp(18)} color={'#333'}>
              详细地址
            </Text>
          </Box>
          <Box w={ls(140)}>
            <Text fontSize={sp(18)} color={'#333'}>
              联系电话
            </Text>
          </Box>
          <Box w={ls(140)}>
            <Text fontSize={sp(18)} color={'#333'}>
              营业时间
            </Text>
          </Box>
          <Box w={ls(140)}>
            <Text fontSize={sp(18)} color={'#333'}>
              操作
            </Text>
          </Box>
        </Row>
      </Column>
    );
  };
  return (
    <Box flex={1}>
      <NavigationBar
        onBackIntercept={() => false}
        leftElement={
          <Text color='white' fontWeight={600} fontSize={sp(20, { min: 14 })}>
            门店管理
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
  const [showFilter, setShowFilter] = useState(false);
  const navigation = useNavigation();
  return (
    <Column bgColor='white' borderRadius={ss(10)}>
      <Row py={ss(20)} px={ls(40)} alignItems={'center'}>
        <Icon
          as={<Ionicons name={'people'} />}
          size={ss(40)}
          color={'#5EACA3'}
        />
        <Text color='#000' fontSize={sp(20)} fontWeight={600} ml={ls(10)}>
          已登记：<Text color='#5EACA3'>7</Text>
        </Text>
        <Input
          ml={ls(30)}
          w={ls(240)}
          minH={ss(40, { max: 18 })}
          p={ss(8)}
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
          placeholder='请输入客户姓名、手机号'
        />
        <Input
          ml={ls(20)}
          w={ls(160)}
          minH={ss(40, { max: 18 })}
          p={ss(8)}
          placeholderTextColor={'#AFB0B4'}
          color={'#333333'}
          fontSize={ss(18)}
          InputLeftElement={
            <Icon
              as={<MaterialIcons name='date-range' />}
              size={ss(25)}
              color='#AFB0B4'
              ml={ss(10)}
            />
          }
          value='2023-02-21'
          isReadOnly
        />
        <Text mx={ls(10)} color='#333' fontSize={sp(16)}>
          至
        </Text>
        <Input
          ml={ls(20)}
          w={ls(160)}
          minH={ss(40, { max: 18 })}
          p={ss(8)}
          placeholderTextColor={'#AFB0B4'}
          color={'#333333'}
          fontSize={ss(18)}
          InputLeftElement={
            <Icon
              as={<MaterialIcons name='date-range' />}
              size={ss(25)}
              color='#AFB0B4'
              ml={ss(10)}
            />
          }
          value='2023-02-21'
          isReadOnly
        />
        <Pressable
          onPress={() => {
            setShowFilter(!showFilter);
          }}>
          <Row alignItems={'center'}>
            <Icon
              as={<FontAwesome name='filter' />}
              size={ss(16)}
              color='#00B49E'
              ml={ss(10)}
            />
            <Text color='#00B49E' fontSize={sp(18)} ml={ls(4)}>
              筛选
            </Text>
          </Row>
        </Pressable>
      </Row>
    </Column>
  );
}
