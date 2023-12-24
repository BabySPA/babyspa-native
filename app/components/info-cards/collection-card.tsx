import { Column, Divider, Icon, Row, Text } from 'native-base';
import { Image, StyleProp, ViewStyle } from 'react-native';
import BoxTitle from '~/app/components/box-title';
import { ss, ls, sp } from '~/app/utils/style';
import dayjs from 'dayjs';
import SoundList from '../sound-list';
import PreviewImage from '../PreviewImage';
import { CollectStatus, FlowItemResponse } from '~/app/stores/flow/type';

interface CollectionCardParams {
  style?: StyleProp<ViewStyle>;
  currentFlow: FlowItemResponse;
}

export default function CollectionCard(params: CollectionCardParams) {
  const { style = {}, currentFlow } = params;

  const collect = currentFlow.collect;
  const collectionOperator = currentFlow.collectionOperator;

  return (
    <Column
      flex={1}
      bgColor={'#fff'}
      p={ss(20)}
      borderRadius={ss(10)}
      style={style}>
      <BoxTitle title='采集信息' />
      <Divider color={'#DFE1DE'} my={ss(14)} />
      {collect.status === CollectStatus.NOT_SET ? (
        <Column alignItems={'center'} py={ss(20)}>
          <Image
            source={require('~/assets/images/empty-box.png')}
            style={{ width: ls(250), height: ls(170) }}
            resizeMode='contain'
          />
          <Text color='#909499' fontSize={sp(16)} mt={ss(20)}>
            暂无采集信息
          </Text>
        </Column>
      ) : (
        <Column px={ls(20)}>
          <Row>
            <Text
              fontSize={sp(18)}
              color='#999'
              w={ls(100, 140)}
              textAlign={'right'}>
              过敏原：
            </Text>
            <Text fontSize={sp(18)} color='#333' maxW={'85%'}>
              {collect.healthInfo.allergy || '无'}
            </Text>
          </Row>
          <Row mt={ss(20)}>
            <Text
              fontSize={sp(18)}
              color='#999'
              w={ls(100, 140)}
              textAlign={'right'}>
              舌头照片：
            </Text>
            {collect.healthInfo.lingualImage.length > 0 ? (
              collect.healthInfo.lingualImage.map((item, idx) => {
                return (
                  <PreviewImage
                    source={item as string}
                    key={idx}
                    current={idx}
                    images={[
                      ...collect.healthInfo.lingualImage,
                      ...collect.healthInfo.leftHandImages,
                      ...collect.healthInfo.rightHandImages,
                      ...collect.healthInfo.otherImages,
                    ].map((item) => ({
                      url: typeof item === 'string' ? item : item.uri,
                    }))}
                  />
                );
              })
            ) : (
              <Text fontSize={sp(18)} color='#333'>
                无
              </Text>
            )}
          </Row>
          <Row mt={ss(20)}>
            <Text
              fontSize={sp(18)}
              color='#999'
              w={ls(100, 140)}
              textAlign={'right'}>
              左手图片：
            </Text>
            {collect.healthInfo.leftHandImages.length > 0 ? (
              collect.healthInfo.leftHandImages.map((item, idx) => {
                return (
                  <PreviewImage
                    source={item as string}
                    key={idx}
                    current={idx}
                    images={[
                      ...collect.healthInfo.leftHandImages,
                      ...collect.healthInfo.rightHandImages,
                      ...collect.healthInfo.lingualImage,
                      ...collect.healthInfo.otherImages,
                    ].map((item) => ({
                      url: typeof item === 'string' ? item : item.uri,
                    }))}
                  />
                );
              })
            ) : (
              <Text fontSize={sp(18)} color='#333'>
                无
              </Text>
            )}
          </Row>
          <Row mt={ss(20)}>
            <Text
              fontSize={sp(18)}
              color='#999'
              w={ls(100, 140)}
              textAlign={'right'}>
              右手图片：
            </Text>
            {collect.healthInfo.rightHandImages.length > 0 ? (
              collect.healthInfo.rightHandImages.map((item, idx) => {
                return (
                  <PreviewImage
                    source={item as string}
                    key={idx}
                    current={idx}
                    images={[
                      ...collect.healthInfo.rightHandImages,
                      ...collect.healthInfo.leftHandImages,
                      ...collect.healthInfo.lingualImage,
                      ...collect.healthInfo.otherImages,
                    ].map((item) => ({
                      url: typeof item === 'string' ? item : item.uri,
                    }))}
                  />
                );
              })
            ) : (
              <Text fontSize={sp(18)} color='#333'>
                无
              </Text>
            )}
          </Row>
          <Row mt={ss(20)}>
            <Text
              fontSize={sp(18)}
              color='#999'
              w={ls(100, 140)}
              textAlign={'right'}>
              录音：
            </Text>
            {collect.healthInfo.audioFiles.length > 0 ? (
              <SoundList
                audioFiles={collect.healthInfo.audioFiles}
                edit={false}
              />
            ) : (
              <Text fontSize={sp(18)} color='#333'>
                暂无录音
              </Text>
            )}
          </Row>
          <Row mt={ss(20)}>
            <Text
              fontSize={sp(18)}
              color='#999'
              w={ls(100, 140)}
              textAlign={'right'}>
              其他：
            </Text>
            {collect.healthInfo.otherImages.length > 0 ? (
              collect.healthInfo.otherImages.map((item, idx) => {
                return (
                  <PreviewImage
                    source={item as string}
                    key={idx}
                    current={idx}
                    images={[
                      ...collect.healthInfo.otherImages,
                      ...collect.healthInfo.lingualImage,
                      ...collect.healthInfo.leftHandImages,
                      ...collect.healthInfo.rightHandImages,
                    ].map((item) => ({
                      url: typeof item === 'string' ? item : item.uri,
                    }))}
                  />
                );
              })
            ) : (
              <Text fontSize={sp(18)} color='#333'>
                无
              </Text>
            )}
          </Row>
          <Row mt={ss(20)}>
            <Text
              fontSize={sp(18)}
              color='#999'
              w={ls(100, 140)}
              textAlign={'right'}>
              调理导向：
            </Text>
            <Text fontSize={sp(18)} color='#333' maxW={'80%'}>
              {collect.guidance || '无'}
            </Text>
          </Row>

          <Row mt={ss(20)}>
            <Text
              fontSize={sp(18)}
              color='#999'
              w={ls(100, 140)}
              textAlign={'right'}>
              理疗师：
            </Text>
            <Text fontSize={sp(18)} color='#333'>
              {collectionOperator?.name}
            </Text>
          </Row>

          <Row mt={ss(20)}>
            <Text
              fontSize={sp(18)}
              color='#999'
              w={ls(100, 140)}
              textAlign={'right'}>
              采集时间：
            </Text>
            <Text fontSize={sp(18)} color='#333'>
              {dayjs(collect.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
            </Text>
          </Row>
        </Column>
      )}
    </Column>
  );
}
