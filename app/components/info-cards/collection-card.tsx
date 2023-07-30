import { Column, Divider, Icon, Row, Text } from 'native-base';
import { StyleProp, ViewStyle } from 'react-native';
import useFlowStore from '~/app/stores/flow';
import BoxTitle from '~/app/components/box-title';
import { ss, ls, sp } from '~/app/utils/style';
import { Image } from 'expo-image';
import dayjs from 'dayjs';

interface CollectionCardParams {
  style?: StyleProp<ViewStyle>;
}

export default function CollectionCard(params: CollectionCardParams) {
  const {
    currentFlow: { collect },
  } = useFlowStore();
  const { style = {} } = params;

  return (
    <Column
      flex={1}
      bgColor={'#fff'}
      p={ss(20)}
      borderRadius={ss(10)}
      style={style}>
      <BoxTitle title='采集信息' />
      <Divider color={'#DFE1DE'} my={ss(14)} />
      <Column px={ls(20)}>
        <Row>
          <Text fontSize={sp(18)} color='#999' w={ls(100)} textAlign={'right'}>
            过敏原：
          </Text>
          <Text fontSize={sp(18)} color='#333'>
            {collect.healthInfo.allergy}
          </Text>
        </Row>
        <Row mt={ss(20)}>
          <Text fontSize={sp(18)} color='#999' w={ls(100)} textAlign={'right'}>
            舌象：
          </Text>
          {collect.healthInfo.lingualImage.map((item, idx) => {
            return (
              <Image
                key={idx}
                style={{
                  width: ss(100),
                  height: ss(100),
                }}
                source={item}
                contentFit='cover'
                transition={1000}
              />
            );
          })}
        </Row>
        <Row mt={ss(20)}>
          <Text fontSize={sp(18)} color='#999' w={ls(100)} textAlign={'right'}>
            左手手相：
          </Text>
          {collect.healthInfo.leftHandImages.map((item) => {
            return (
              <Image
                style={{
                  width: ss(100),
                  height: ss(100),
                }}
                source={item}
                contentFit='cover'
                transition={1000}
              />
            );
          })}
        </Row>
        <Row mt={ss(20)}>
          <Text fontSize={sp(18)} color='#999' w={ls(100)} textAlign={'right'}>
            右手手相：
          </Text>
          {collect.healthInfo.rightHandImages.map((item) => {
            return (
              <Image
                style={{
                  width: ss(100),
                  height: ss(100),
                }}
                source={item}
                contentFit='cover'
                transition={1000}
              />
            );
          })}
        </Row>
        <Row mt={ss(20)}>
          <Text fontSize={sp(18)} color='#999' w={ls(100)} textAlign={'right'}>
            录音：
          </Text>
          {collect.healthInfo.audioFiles.length > 0 ? (
            collect.healthInfo.audioFiles.map((item) => {
              return (
                <Row
                  borderRadius={ss(4)}
                  borderColor={'#A4D4D6'}
                  borderWidth={1}
                  alignItems={'center'}
                  w={ls(253)}
                  p={ss(10)}>
                  <Image
                    source={require('~/assets/images/signal.png')}
                    style={{
                      width: ss(20),
                      height: ss(20),
                    }}
                  />
                  <Text color='#000000' fontSize={sp(18)} ml={ls(10)}>
                    10 "
                  </Text>
                </Row>
              );
            })
          ) : (
            <Text fontSize={sp(18)} color='#333'>
              暂无录音
            </Text>
          )}
        </Row>
        <Row mt={ss(20)}>
          <Text fontSize={sp(18)} color='#999' w={ls(100)} textAlign={'right'}>
            调理导向：
          </Text>
          <Text fontSize={sp(18)} color='#333'>
            {collect.guidance}
          </Text>
        </Row>

        <Row mt={ss(20)}>
          <Text fontSize={sp(18)} color='#999' w={ls(100)} textAlign={'right'}>
            调理师：
          </Text>
          <Text fontSize={sp(18)} color='#333'>
            {collect.operator?.name}
          </Text>
        </Row>

        <Row mt={ss(20)}>
          <Text fontSize={sp(18)} color='#999' w={ls(100)} textAlign={'right'}>
            采集时间：
          </Text>
          <Text fontSize={sp(18)} color='#333'>
            {dayjs(collect.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
          </Text>
        </Row>
      </Column>
    </Column>
  );
}
