import { Box, Column, Row, Text, Pressable } from 'native-base';
import { Image } from 'react-native';
import BoxTitle from '~/app/components/box-title';
import { ss, ls, sp } from '~/app/utils/style';
import dayjs from 'dayjs';
import { FlowStatus, Gender } from '~/app/types';
import { getAge } from '~/app/utils';
import LabelBox from './label-box';
import useFlowStore from '~/app/stores/flow';
import { RegisterStatus } from '~/app/stores/flow/type';

interface InfoBoxParams {
  onPressEdit: () => void;
  onPressCancel: () => void;
}

export default function InfoBox(params: InfoBoxParams) {
  const { currentFlow } = useFlowStore();
  const age = getAge(currentFlow.customer.birthday ?? '');

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
            <LabelBox title='姓名' value={currentFlow.customer.name} />
            <LabelBox title='乳名' value={currentFlow.customer.nickname} />
          </Row>
          <Row alignItems={'center'} mt={ss(40)}>
            <LabelBox
              title='性别'
              value={currentFlow.customer.gender == Gender.MAN ? '男' : '女'}
            />
            <LabelBox
              title='生日'
              value={dayjs(currentFlow.customer.birthday).format(
                'YYYY年MM月DD日',
              )}
            />
          </Row>
          <Row alignItems={'center'} mt={ss(40)}>
            <LabelBox title='年龄' value={`${age?.year}岁${age?.month}月`} />
            <LabelBox title='电话' value={currentFlow.customer.phoneNumber} />
          </Row>
          <Row alignItems={'center'} mt={ss(40)}>
            <LabelBox
              title='过敏原'
              value={currentFlow.collect.healthInfo.allergy || '未设置'}
              alignItems='flex-start'
            />
            <LabelBox
              title='理疗师'
              value={currentFlow.collectionOperator?.name}
            />
          </Row>
          <Row alignItems={'center'} mt={ss(40)}>
            <LabelBox
              title='登记时间'
              value={dayjs(currentFlow.register.updatedAt).format(
                'YYYY-MM-DD HH:mm:ss',
              )}
            />
            <LabelBox title='登记号码' value={currentFlow.tag} />
          </Row>
        </Box>
      </Column>
      <Image
        source={
          currentFlow.register.status === RegisterStatus.CANCEL
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
hitSlop={ss(10)}
          onPress={() => {
            params.onPressCancel();
          }}>
          <Box
            px={ls(34)}
            py={ss(12)}
            mr={ls(74)}
            bgColor={'rgba(216, 216, 216, 0.10)'}
            borderRadius={4}
            borderWidth={1}
            borderColor={'#D8D8D8'}>
            <Text color='#333' fontSize={sp(16)}>
              取消
            </Text>
          </Box>
        </Pressable> */}
        <Pressable
          hitSlop={ss(10)}
          onPress={() => {
            params.onPressEdit();
          }}>
          <Box
            px={ls(34)}
            py={ss(12)}
            bgColor={'rgba(0, 180, 158, 0.10);'}
            borderRadius={4}
            borderWidth={1}
            borderColor={'#00B49E'}>
            <Text color='#00B49E' fontSize={sp(16)}>
              {currentFlow.register.status === RegisterStatus.CANCEL
                ? '再次登记'
                : '修改'}
            </Text>
          </Box>
        </Pressable>
      </Row>
    </Column>
  );
}
