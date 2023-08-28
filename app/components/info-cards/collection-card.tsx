import { Column, Divider, Icon, Row, Text } from 'native-base';
import { StyleProp, ViewStyle } from 'react-native';
import useFlowStore from '~/app/stores/flow';
import BoxTitle from '~/app/components/box-title';
import { ss, ls, sp } from '~/app/utils/style';
import { Image } from 'expo-image';
import dayjs from 'dayjs';
import SoundList from '../sound-list';
import PreviewImage from '../preview-image';

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
            return <PreviewImage source={item as string} key={idx} />;
          })}
        </Row>
        <Row mt={ss(20)}>
          <Text fontSize={sp(18)} color='#999' w={ls(100)} textAlign={'right'}>
            左手手相：
          </Text>
          {collect.healthInfo.leftHandImages.map((item, idx) => {
            return <PreviewImage source={item as string} key={idx} />;
          })}
        </Row>
        <Row mt={ss(20)}>
          <Text fontSize={sp(18)} color='#999' w={ls(100)} textAlign={'right'}>
            右手手相：
          </Text>
          {collect.healthInfo.rightHandImages.map((item, idx) => {
            return <PreviewImage source={item as string} key={idx} />;
          })}
        </Row>
        <Row mt={ss(20)}>
          <Text fontSize={sp(18)} color='#999' w={ls(100)} textAlign={'right'}>
            录音：
          </Text>
          {collect.healthInfo.audioFiles.length > 0 ? (
            <SoundList
              audioFiles={collect.healthInfo.audioFiles}
              edit={false}
              removedCallback={function (index: number): void {
                console.log(index);
              }}
            />
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
          <Text fontSize={sp(18)} color='#333' maxW={'80%'}>
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
