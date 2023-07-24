import { AntDesign } from '@expo/vector-icons';
import {
  Box,
  Column,
  Row,
  Text,
  Center,
  Icon,
  Pressable,
  ScrollView,
} from 'native-base';
import { TextInput } from 'react-native';
import { ss, sp, ls } from '~/app/utils/style';
import { useNavigation } from '@react-navigation/native';
import DashedLine from 'react-native-dashed-line';
import useFlowStore from '~/app/stores/flow';
import ImageBox from './image-box';
import BoxItem from './box-item';
import RecordBox from './record-box';

export default function HealthInfo() {
  const {
    addlingualImage,
    updatelingualImage,
    addLeftHandImage,
    updateLeftHandImage,
    addRightHandImage,
    updateRightHandImage,
    currentFlow,
  } = useFlowStore();

  const { healthInfo } = currentFlow;

  return (
    <Row flex={1}>
      <Column flex={1}>
        <BoxItem title={'过敏史'} icon={require('~/assets/images/notice.png')}>
          <Box flex={1}>
            <TextInput
              multiline={true}
              placeholder='请输入过敏史'
              style={{
                borderRadius: ss(4),
                borderColor: '#DFE1DE',
                borderWidth: 1,
                height: ss(221),
                backgroundColor: '#F8F8F8',
                padding: ss(10),
                fontSize: sp(14),
                color: '#999',
              }}
            />
          </Box>
        </BoxItem>
        <BoxItem
          title={'备注'}
          icon={require('~/assets/images/notice.png')}
          mt={ss(10)}
          autoScroll={false}>
          <Row>
            <Box flex={1}>
              <Text fontSize={sp(12)} fontWeight={600} color='#333'>
                录音
              </Text>
              <RecordBox />
            </Box>
            <DashedLine
              axis='vertical'
              dashLength={ss(12)}
              dashGap={ss(12)}
              dashColor='#DFE1DE'
              style={{ marginHorizontal: ls(15) }}
            />
            <Box flex={1}>
              <Text fontSize={sp(12)} fontWeight={600} color='#333'>
                其他
              </Text>
              <Pressable>
                <Center
                  borderColor={'#ACACAC'}
                  borderWidth={1}
                  borderStyle={'dashed'}
                  bgColor={'#FFF'}
                  mt={ss(10)}
                  w={ss(100)}
                  h={ss(100)}>
                  <Icon
                    as={<AntDesign name='plus' size={ss(40)} />}
                    color={'#ACACAC'}
                  />
                </Center>
              </Pressable>
            </Box>
          </Row>
        </BoxItem>
      </Column>
      <Column flex={1} ml={ss(10)}>
        <BoxItem
          title={'舌部图片'}
          icon={require('~/assets/images/tongue.png')}>
          <ImageBox
            images={healthInfo.lingualImage}
            selectedCallback={function (filename: string, uri: string): void {
              addlingualImage({
                name: filename,
                uri: uri,
              });
            }}
            takePhotoCallback={function (filename: string, uri: string): void {
              throw new Error('Function not implemented.');
            }}
            uploadCallback={function (filename: string, url: string): void {
              updatelingualImage(filename, url);
            }}
            errorCallback={function (err: any): void {
              throw new Error('Function not implemented.');
            }}
          />
        </BoxItem>
        <BoxItem
          title={'手部图片'}
          icon={require('~/assets/images/hand.png')}
          mt={ss(10)}>
          <Row>
            <Box flex={1}>
              <Row>
                <Text
                  mr={ls(10)}
                  fontSize={sp(12)}
                  fontWeight={600}
                  color='#333'>
                  左手
                </Text>
                <ImageBox
                  images={healthInfo.leftHandImages}
                  selectedCallback={function (
                    filename: string,
                    uri: string,
                  ): void {
                    addLeftHandImage({
                      name: filename,
                      uri: uri,
                    });
                  }}
                  takePhotoCallback={function (
                    filename: string,
                    uri: string,
                  ): void {
                    throw new Error('Function not implemented.');
                  }}
                  uploadCallback={function (
                    filename: string,
                    url: string,
                  ): void {
                    updateLeftHandImage(filename, url);
                  }}
                  errorCallback={function (err: any): void {
                    throw new Error('Function not implemented.');
                  }}
                />
              </Row>
            </Box>
            <DashedLine
              axis='vertical'
              dashLength={ss(12)}
              dashGap={ss(12)}
              dashColor='#DFE1DE'
              style={{ marginHorizontal: ls(15) }}
            />
            <Box flex={1}>
              <Row>
                <Text
                  mr={ls(10)}
                  fontSize={sp(12)}
                  fontWeight={600}
                  color='#333'>
                  右手
                </Text>
                <ImageBox
                  images={healthInfo.rightHandImages}
                  selectedCallback={function (
                    filename: string,
                    uri: string,
                  ): void {
                    addRightHandImage({
                      name: filename,
                      uri: uri,
                    });
                  }}
                  takePhotoCallback={function (
                    filename: string,
                    uri: string,
                  ): void {
                    throw new Error('Function not implemented.');
                  }}
                  uploadCallback={function (
                    filename: string,
                    url: string,
                  ): void {
                    updateRightHandImage(filename, url);
                  }}
                  errorCallback={function (err: any): void {
                    throw new Error('Function not implemented.');
                  }}
                />
              </Row>
            </Box>
          </Row>
        </BoxItem>
      </Column>
    </Row>
  );
}
