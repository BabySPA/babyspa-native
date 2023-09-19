import { Box, Column, Row, Text, Pressable } from 'native-base';
import BoxTitle from '~/app/components/box-title';
import { ss, ls, sp } from '~/app/utils/style';
import LabelBox from '~/app/components/label-box';
import useManagerStore from '~/app/stores/manager';

interface InfoBoxParams {
  onPressEdit: () => void;
  onPressCancel: () => void;
}

export default function InfoBox(params: InfoBoxParams) {
  const { currentShop } = useManagerStore();
  return (
    <Column
      flex={1}
      bgColor={'#fff'}
      p={ss(20)}
      borderRadius={ss(10)}
      justifyContent={'space-between'}>
      <Column>
        <BoxTitle title='门店信息' />
        <Box mt={ss(30)} px={ls(20)}>
          <Row alignItems={'center'}>
            <LabelBox title='门店名称' value={currentShop?.name} />
            <LabelBox title='负责人' value={currentShop?.maintainer} />
          </Row>
          <Row alignItems={'center'} mt={ss(40)}>
            <LabelBox title='联系电话' value={currentShop?.phoneNumber} />
            <LabelBox title='所属区域' value={currentShop?.region} />
          </Row>
          <Row alignItems={'center'} mt={ss(40)}>
            <LabelBox
              title='营业时间'
              value={`${currentShop?.openingTime}至${currentShop?.closingTime}`}
            />
            <LabelBox title='详细地址' value={currentShop?.address} />
          </Row>
          <Row alignItems={'center'} mt={ss(40)}>
            <LabelBox
              title='门店介绍'
              value={currentShop?.description || '未设置'}
            />
          </Row>
        </Box>
      </Column>
      <Row justifyContent={'center'} mb={ss(40)}>
        <Pressable
          _pressed={{
            opacity: 0.8,
          }}
          hitSlop={ss(20)}
          ml={ls(74)}
          onPress={() => {
            params.onPressEdit();
          }}>
          <Box
            px={ls(34)}
            py={ss(12)}
            bgColor={'rgba(0, 180, 158, 0.10);'}
            borderRadius={ss(4)}
            borderWidth={1}
            borderColor={'#00B49E'}>
            <Text color='#00B49E' fontSize={sp(16)}>
              编辑
            </Text>
          </Box>
        </Pressable>
      </Row>
    </Column>
  );
}
