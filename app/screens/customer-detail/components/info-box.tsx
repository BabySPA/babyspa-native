import { Box, Column, Row, Text, Pressable } from 'native-base';
import { Image } from 'react-native';
import useFlowStore from '~/app/stores/flow';
import BoxTitle from '~/app/components/box-title';
import { ss, ls, sp } from '~/app/utils/style';
import dayjs from 'dayjs'
import { CustomerStatus, Gender } from '~/app/types';
import { getAge } from '~/app/utils';
import LabelBox from './label-box';

interface InfoBoxParams {
  onPressEdit: () => void;
  onPressCancel: () => void;
}

export default function InfoBox(params: InfoBoxParams) {
  const { currentRegisterCustomer } = useFlowStore();
  const age = getAge(currentRegisterCustomer.birthday ?? '');
  return (
    <Column
      flex={1}
      bgColor={'#fff'}
      p={ss(20)}
      borderRadius={ss(10)}
      justifyContent={'space-between'}>
      <Column>
        <BoxTitle title='客户信息' />
        <Box mt={ss(30)} px={ls(50)}>
          <Row alignItems={'center'}>
            <LabelBox title='姓名' value={currentRegisterCustomer.name} />
            <LabelBox title='乳名' value={currentRegisterCustomer.nickname} />
          </Row>
          <Row alignItems={'center'} mt={ss(40)}>
            <LabelBox
              title='性别'
              value={currentRegisterCustomer.gender == Gender.MAN ? '男' : '女'}
            />
            <LabelBox
              title='生日'
              value={dayjs(currentRegisterCustomer.birthday).format(
                'YYYY年MM月DD日',
              )}
            />
          </Row>
          <Row alignItems={'center'} mt={ss(40)}>
            <LabelBox title='年龄' value={`${age?.year}岁${age?.month}月`} />
            <LabelBox
              title='电话'
              value={currentRegisterCustomer.phoneNumber}
            />
          </Row>
          <Row alignItems={'center'} mt={ss(40)}>
            <LabelBox title='过敏原' value={currentRegisterCustomer.allergy} />
            <LabelBox
              title='调理师'
              value={currentRegisterCustomer.operator?.name}
            />
          </Row>
          <Row alignItems={'center'} mt={ss(40)}>
            <LabelBox
              title='登记时间'
              value={dayjs(currentRegisterCustomer.updatedAt).format(
                'YYYY-MM-DD HH:mm:ss',
              )}
            />
            <LabelBox title='登记号码' value={currentRegisterCustomer.tag} />
          </Row>
        </Box>
      </Column>
      <Image
        source={
          currentRegisterCustomer.status === CustomerStatus.Canceled
            ? require('~/assets/images/register-cancel.png')
            : require('~/assets/images/register-success.png')
        }
        style={{
          width: ss(120),
          height: ss(120),
          position: 'absolute',
          top: ss(30),
          right: ls(100),
        }}
      />
      <Row justifyContent={'center'} mb={ss(40)}>
        {/* <Pressable
          onPress={() => {
            params.onPressCancel();
          }}>
          <Box
            px={ls(34)}
            py={ss(12)}
            mr={ls(74)}
            bgColor={'rgba(216, 216, 216, 0.10)'}
            borderRadius={ss(4)}
            borderWidth={1}
            borderColor={'#D8D8D8'}>
            <Text color='#333' fontSize={sp(16)}>
              取消
            </Text>
          </Box>
        </Pressable> */}
        <Pressable
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
              {currentRegisterCustomer.status === CustomerStatus.Canceled
                ? '再次登记'
                : '修改'}
            </Text>
          </Box>
        </Pressable>
      </Row>
    </Column>
  );
}
