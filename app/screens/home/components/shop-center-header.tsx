import { Box, Center, Column, Image, Row, Text } from 'native-base';
import useAuthStore from '~/app/stores/auth';
import { ls, sp, ss } from '~/app/utils/style';

export default function ShopCenterHeader() {
  const shop = useAuthStore((state) => state.currentShopWithRole?.shop);

  return (
    <Row bgColor={'#fff'} borderRadius={ss(10)} p={ss(30)}>
      <Image
        size={sp(100)}
        source={require('~/assets/images/shop-header.png')}
        alt=''
      />
      <Column ml={ls(20)}>
        <Text color='#5EACA3' fontSize={sp(26)}>
          {shop?.name}
        </Text>
        <Row mt={ss(10)}>
          <Text fontSize={sp(20)} color={'#999'}>
            联系方式：{shop?.phoneNumber}
          </Text>
          <Text fontSize={sp(20)} color={'#999'} ml={ls(50)}>
            营业时间：{shop?.openingTime}-{shop?.closingTime}
          </Text>
        </Row>
        <Row mt={ss(10)}>
          <Text fontSize={sp(20)} color={'#999'}>
            门店地址：{shop?.region} {shop?.address}
          </Text>
        </Row>
      </Column>
    </Row>
  );
}
