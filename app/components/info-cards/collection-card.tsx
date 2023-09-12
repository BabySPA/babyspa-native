import { Column, Divider, Icon, Row, Text } from 'native-base';
import { StyleProp, ViewStyle } from 'react-native';
import useFlowStore from '~/app/stores/flow';
import BoxTitle from '~/app/components/box-title';
import { ss, ls, sp } from '~/app/utils/style';
import { Image } from 'expo-image';
import dayjs from 'dayjs';
import SoundList from '../sound-list';
import PreviewImage from '../preview-image';
import { CollectStatus } from '~/app/stores/flow/type';

interface CollectionCardParams {
  style?: StyleProp<ViewStyle>;
}

export default function CollectionCard(params: CollectionCardParams) {
  const {
    currentFlow: { collect, collectionOperator },
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
      {collect.status === CollectStatus.NOT_SET ? (
        <Column alignItems={'center'} py={ss(20)}>
          <Image
            source={require('~/assets/images/empty-box.png')}
            style={{ width: ls(250), height: ls(170) }}
            contentFit='contain'
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
              w={ls(100)}
              textAlign={'right'}>
              过敏原：
            </Text>
            <Text fontSize={sp(18)} color='#333' maxW={ls(370)}>
              {collect.healthInfo.allergy || '未设置'}
            </Text>
          </Row>
          <Row mt={ss(20)}>
            <Text
              fontSize={sp(18)}
              color='#999'
              w={ls(100)}
              textAlign={'right'}>
              舌象：
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
                未设置
              </Text>
            )}
          </Row>
          <Row mt={ss(20)}>
            <Text
              fontSize={sp(18)}
              color='#999'
              w={ls(100)}
              textAlign={'right'}>
              左手手相：
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
                未设置
              </Text>
            )}
          </Row>
          <Row mt={ss(20)}>
            <Text
              fontSize={sp(18)}
              color='#999'
              w={ls(100)}
              textAlign={'right'}>
              右手手相：
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
                未设置
              </Text>
            )}
          </Row>
          <Row mt={ss(20)}>
            <Text
              fontSize={sp(18)}
              color='#999'
              w={ls(100)}
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
              w={ls(100)}
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
                未设置
              </Text>
            )}
          </Row>
          <Row mt={ss(20)}>
            <Text
              fontSize={sp(18)}
              color='#999'
              w={ls(100)}
              textAlign={'right'}>
              调理导向：
            </Text>
            <Text fontSize={sp(18)} color='#333' maxW={'80%'}>
              {collect.guidance || '未设置'}
            </Text>
          </Row>

          <Row mt={ss(20)}>
            <Text
              fontSize={sp(18)}
              color='#999'
              w={ls(100)}
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
              w={ls(100)}
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
