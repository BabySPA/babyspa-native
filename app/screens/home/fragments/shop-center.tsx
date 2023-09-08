import { Flex, Text, Column, Row, Box } from 'native-base';
import { useEffect } from 'react';
import useFlowStore from '~/app/stores/flow';
import useLayoutConfigWithRole from '~/app/stores/layout';
import { ss } from '~/app/utils/style';
import { useNavigation } from '@react-navigation/native';
import ShopCenterHeader from '../components/shop-center-header';
import ShopCenterBox from '../components/shop-center-box';
import { RoleAuthority } from '~/app/stores/auth/type';

export default function ShopCenter() {
  const navigation = useNavigation();
  const { requestArchiveCustomers } = useFlowStore();

  const { currentSelected, getLayoutConfig } = useLayoutConfigWithRole();

  const currentSelectedModule = getLayoutConfig()[currentSelected];

  const ShopCenterBoxes = (
    auth:
      | RoleAuthority.MANAGER_SHOP
      | RoleAuthority.MANAGER_STAFF
      | RoleAuthority.MANAGER_ROLE
      | RoleAuthority.MANAGER_TEMPLATE
      | RoleAuthority.MANAGER_LOGGER,
  ) => {
    return {
      [RoleAuthority.MANAGER_SHOP]: () => (
        <ShopCenterBox
          title={'门店管理'}
          content={'设置门店信息'}
          image={require('~/assets/images/manager-shop.png')}
          onPress={() => {
            navigation.navigate('ManagerShop');
          }}
        />
      ),
      [RoleAuthority.MANAGER_STAFF]: () => (
        <ShopCenterBox
          title={'员工管理'}
          content={'管理员工账号'}
          image={require('~/assets/images/manager-user.png')}
          onPress={() => {
            navigation.navigate('ManagerUser');
          }}
        />
      ),
      [RoleAuthority.MANAGER_ROLE]: () => (
        <ShopCenterBox
          title={'角色管理'}
          content={'角色及功能权限'}
          image={require('~/assets/images/manager-role.png')}
          onPress={() => {
            navigation.navigate('ManagerRole');
          }}
        />
      ),
      [RoleAuthority.MANAGER_TEMPLATE]: () => (
        <ShopCenterBox
          title={'模版管理'}
          content={'版本及内容更新'}
          image={require('~/assets/images/manager-template.png')}
          onPress={() => {
            navigation.navigate('ManagerTemplate');
          }}
        />
      ),
      [RoleAuthority.MANAGER_LOGGER]: () => (
        <ShopCenterBox
          title={'操作日志'}
          content={'查看操作日志'}
          image={require('~/assets/images/manager-logger.png')}
          onPress={() => {
            navigation.navigate('ManagerLogger');
          }}
        />
      ),
    }[auth];
  };

  useEffect(() => {
    requestArchiveCustomers();
  }, []);

  return (
    <Flex flex={1}>
      <Column m={ss(10)}>
        <ShopCenterHeader />
      </Column>
      <Row flexWrap={'wrap'} ml={ss(10)} mb={ss(10)}>
        {currentSelectedModule.features.map((feature) => {
          return (
            <Box key={feature.auth} w={'33.33%'}>
              {
                // @ts-ignore
                ShopCenterBoxes(feature.auth)()
              }
            </Box>
          );
        })}
      </Row>
    </Flex>
  );
}
