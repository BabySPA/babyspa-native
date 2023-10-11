import {
  Box,
  Text,
  Pressable,
  Row,
  Column,
  ScrollView,
  Icon,
  Circle,
  Divider,
  Modal,
  Center,
  Image,
} from 'native-base';
import { AppStackScreenProps, FlowStatus } from '../../types';
import NavigationBar from '~/app/components/navigation-bar';
import { sp, ss, ls } from '~/app/utils/style';
import { useState } from 'react';
import useFlowStore from '~/app/stores/flow';
import RegisterCard from '~/app/components/info-cards/register-card';
import { PrintButton } from '~/app/components/print-button';
import { AntDesign } from '@expo/vector-icons';
import BoxTitle from '~/app/components/box-title';
import dayjs from 'dayjs';
import SoundList from '~/app/components/sound-list';
import PreviewImage from '~/app/components/preview-image';
import { AnalyzeStatus } from '~/app/stores/flow/type';
import EmptyBox from '~/app/components/empty-box';

export default function AnalyzeInfo({
  navigation,
}: AppStackScreenProps<'AnalyzeInfo'>) {
  const currentFlow = useFlowStore((state) => state.currentFlow);
  const { collect, analyze, analyzeOperator, collectionOperator } = currentFlow;

  const [showWarn, setShowWarn] = useState<boolean>(true);
  const [showCollection, setShowCollection] = useState<boolean>(false);

  return (
    <Box flex={1}>
      <NavigationBar
        onBackIntercept={() => false}
        leftElement={
          <Text color='white' fontWeight={600} fontSize={sp(20)}>
            分析详情
          </Text>
        }
        rightElement={
          <Row>
            <Pressable
              _pressed={{
                opacity: 0.6,
              }}
              hitSlop={ss(20)}
              onPress={() => {
                setShowCollection(true);
              }}>
              <Row
                bgColor={'transparent'}
                borderRadius={ss(4)}
                px={ls(12)}
                py={ss(10)}
                borderWidth={ss(1)}
                borderColor={'#FFF'}
                mr={ls(40)}>
                <Text color={'#FFF'} fontSize={sp(14)}>
                  采集信息
                </Text>
              </Row>
            </Pressable>
            {(analyze.status === AnalyzeStatus.DONE ||
              analyze.status === AnalyzeStatus.CANCEL) && <PrintButton />}
          </Row>
        }
      />
      {showWarn && (
        <Row
          py={ss(12)}
          px={ls(20)}
          bgColor={'#F9EDA5'}
          alignItems={'center'}
          justifyContent={'space-between'}>
          <Row alignItems={'center'}>
            <Circle bgColor={'#F56121'} size={sp(24)}>
              <Text color='#fff' fontSize={sp(14)}>
                !
              </Text>
            </Circle>
            <Text color='#F86021' fontSize={sp(18)} ml={ss(20)}>
              过敏原：
              {collect.healthInfo.allergy || '无'}
            </Text>
          </Row>
          <Pressable
            _pressed={{
              opacity: 0.6,
            }}
            hitSlop={ss(20)}
            onPress={() => {
              setShowWarn(false);
            }}>
            <Icon
              as={<AntDesign name='closecircleo' size={sp(30)} />}
              color={'#99A9BF'}
            />
          </Pressable>
        </Row>
      )}
      <Row safeAreaLeft bgColor={'#F6F6FA'} flex={1} p={ss(20)} safeAreaBottom>
        <Column flex={1}>
          <ScrollView>
            <RegisterCard />
            <Column
              flex={1}
              bgColor={'#fff'}
              p={ss(20)}
              borderRadius={ss(10)}
              mt={ss(10)}>
              <BoxTitle title='贴敷' />
              <Divider color={'#DFE1DE'} my={ss(14)} />
              {analyze.status === AnalyzeStatus.DONE ||
              analyze.status === AnalyzeStatus.CANCEL ? (
                <Column>
                  {analyze.solution.applications.length > 0 ? (
                    analyze.solution.applications.map((item, idx) => {
                      return (
                        <Column key={idx}>
                          {item.count ? (
                            <Column
                              mt={idx === 0 ? 0 : ss(20)}
                              bgColor={'#F2F9F8'}
                              borderRadius={1}
                              borderStyle={'dashed'}
                              borderWidth={ss(1)}
                              borderColor={'#7AB6AF'}
                              p={ss(20)}>
                              <Row
                                alignItems={'flex-start'}
                                justifyContent={'space-between'}>
                                <Text fontSize={sp(20)} color='#666'>
                                  {item.name}
                                </Text>
                                <Text fontSize={sp(18)} color='#999'>
                                  贴数： {item.count}贴
                                </Text>
                              </Row>
                              <Row
                                alignItems={'flex-start'}
                                justifyContent={'space-between'}
                                mt={ss(20)}>
                                <Text
                                  fontSize={sp(18)}
                                  color='#999'
                                  maxW={'60%'}>
                                  穴位：
                                  <Text fontSize={sp(16)} color='#333'>
                                    {item.acupoint || '无'}
                                  </Text>
                                </Text>
                              </Row>
                            </Column>
                          ) : null}
                        </Column>
                      );
                    })
                  ) : (
                    <Center
                      flex={1}
                      bgColor='white'
                      borderRadius={ss(10)}
                      py={ss(20)}>
                      <Image
                        style={{ height: ss(180) }}
                        source={require('~/assets/images/no-data.png')}
                        resizeMode='contain'
                        alt=''
                      />
                      <Text
                        fontSize={sp(16)}
                        color='#1E262F'
                        opacity={0.4}
                        mt={ss(10)}>
                        贴敷无
                      </Text>
                    </Center>
                  )}
                </Column>
              ) : (
                <Center
                  flex={1}
                  bgColor='white'
                  borderRadius={ss(10)}
                  py={ss(20)}>
                  <Image
                    style={{ height: ss(180) }}
                    source={require('~/assets/images/no-data.png')}
                    resizeMode='contain'
                    alt=''
                  />
                  <Text
                    fontSize={sp(16)}
                    color='#1E262F'
                    opacity={0.4}
                    mt={ss(10)}>
                    分析未完成
                  </Text>
                </Center>
              )}
            </Column>
          </ScrollView>
        </Column>
        <Column flex={1} ml={ls(10)}>
          <ScrollView>
            <Column flex={1} bgColor={'#fff'} p={ss(20)} borderRadius={ss(10)}>
              <BoxTitle title='理疗' />
              <Divider color={'#DFE1DE'} my={ss(14)} />
              {analyze.status === AnalyzeStatus.DONE ||
              analyze.status === AnalyzeStatus.CANCEL ? (
                <>
                  <Column>
                    {analyze.solution.massages.map((item, idx) => {
                      return (
                        <Column key={idx}>
                          {item.count ? (
                            <Column
                              mt={idx === 0 ? 0 : ss(20)}
                              bgColor={'#F2F9F8'}
                              borderRadius={1}
                              borderStyle={'dashed'}
                              borderWidth={ss(1)}
                              borderColor={'#7AB6AF'}
                              p={ss(20)}>
                              <Row
                                alignItems={'flex-start'}
                                justifyContent={'space-between'}>
                                <Text fontSize={sp(20)} color='#666'>
                                  {item.name}
                                </Text>
                                <Text fontSize={sp(18)} color='#999'>
                                  次数： {item.count}次
                                </Text>
                              </Row>
                              <Row
                                alignItems={'flex-start'}
                                justifyContent={'flex-start'}
                                mt={ss(20)}>
                                <Text fontSize={sp(18)} color='#999'>
                                  备注：
                                </Text>
                                <Text
                                  fontSize={sp(16)}
                                  color='#333'
                                  maxW={'85%'}>
                                  {item.remark || '无'}
                                </Text>
                              </Row>
                            </Column>
                          ) : null}
                        </Column>
                      );
                    })}
                  </Column>
                  <Row mt={ss(20)}>
                    <Text
                      fontSize={sp(18)}
                      color='#999'
                      w={ls(120)}
                      textAlign={'right'}>
                      调理导向：
                    </Text>
                    <Text fontSize={sp(18)} color='#333'>
                      {collect.guidance || '无'}
                    </Text>
                  </Row>
                  <Row mt={ss(20)}>
                    <Text
                      fontSize={sp(18)}
                      color='#999'
                      w={ls(120)}
                      textAlign={'right'}>
                      注意事项：
                    </Text>
                    <Text fontSize={sp(18)} color='#333'>
                      {analyze.remark || '无'}
                    </Text>
                  </Row>
                  <Row mt={ss(20)} justifyContent={'space-between'}>
                    <Row>
                      <Text
                        fontSize={sp(18)}
                        color='#999'
                        w={ls(120)}
                        textAlign={'right'}>
                        分析师：
                      </Text>
                      <Text fontSize={sp(18)} color='#333'>
                        {analyzeOperator?.name || '暂未分析'}
                      </Text>
                    </Row>
                    <Row>
                      <Text
                        fontSize={sp(18)}
                        color='#999'
                        w={ls(120)}
                        textAlign={'right'}>
                        随访时间：
                      </Text>
                      <Text fontSize={sp(18)} color='#333'>
                        {analyze.followUp.followUpTime
                          ? dayjs(analyze.followUp.followUpTime).format(
                              'YYYY-MM-DD',
                            )
                          : '无'}
                      </Text>
                    </Row>
                  </Row>
                  <Row mt={ss(20)} justifyContent={'space-between'}>
                    <Row>
                      <Text
                        fontSize={sp(18)}
                        color='#999'
                        w={ls(120)}
                        textAlign={'right'}>
                        分析时间：
                      </Text>
                      <Text fontSize={sp(18)} color='#333'>
                        {analyze.updatedAt
                          ? dayjs(analyze.updatedAt).format('YYYY-MM-DD HH:mm')
                          : '暂未分析'}
                      </Text>
                    </Row>
                    <Row>
                      <Text
                        fontSize={sp(18)}
                        color='#999'
                        w={ls(120)}
                        textAlign={'right'}>
                        复推时间：
                      </Text>
                      <Text fontSize={sp(18)} color='#333'>
                        {analyze.next.nextTime
                          ? dayjs(analyze.next.nextTime).format('YYYY-MM-DD')
                          : '无'}
                      </Text>
                    </Row>
                  </Row>
                </>
              ) : (
                <Center
                  flex={1}
                  bgColor='white'
                  borderRadius={ss(10)}
                  py={ss(20)}>
                  <Image
                    style={{ height: ss(180) }}
                    source={require('~/assets/images/no-data.png')}
                    resizeMode='contain'
                    alt=''
                  />
                  <Text
                    fontSize={sp(16)}
                    color='#1E262F'
                    opacity={0.4}
                    mt={ss(10)}>
                    分析未完成
                  </Text>
                </Center>
              )}
            </Column>
          </ScrollView>
        </Column>
      </Row>

      {showCollection && (
        <Modal
          isOpen={showCollection}
          onClose={() => {
            setShowCollection(false);
          }}>
          <Column bgColor={'white'} borderRadius={ss(10)} w={ls(582)}>
            <Row
              px={ls(30)}
              py={ss(20)}
              alignItems={'center'}
              justifyContent={'space-between'}>
              <Row alignItems={'center'}>
                <Box bgColor={'#00B49E'} w={ss(4)} h={ss(20)} />
                <Text fontSize={sp(20)} ml={ls(10)} color={'#000'}>
                  采集信息
                </Text>
              </Row>
              <Pressable
                _pressed={{
                  opacity: 0.6,
                }}
                hitSlop={ss(20)}
                onPress={() => {
                  setShowCollection(false);
                }}>
                <Icon
                  as={<AntDesign name={'close'} />}
                  size={sp(24)}
                  color='#999'
                />
              </Pressable>
            </Row>
            <Divider color={'#DFE1DE'} mb={ss(20)} />
            <ScrollView maxH={ss(550)}>
              <Column px={ls(20)}>
                <Row>
                  <Text
                    fontSize={sp(18)}
                    color='#999'
                    w={ls(120)}
                    textAlign={'right'}>
                    过敏原：
                  </Text>
                  <Text fontSize={sp(18)} color='#333' maxW={ls(370)}>
                    {collect.healthInfo.allergy || '无'}
                  </Text>
                </Row>
                <Row mt={ss(20)}>
                  <Text
                    fontSize={sp(18)}
                    color='#999'
                    w={ls(120)}
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
                      无
                    </Text>
                  )}
                </Row>
                <Row mt={ss(20)}>
                  <Text
                    fontSize={sp(18)}
                    color='#999'
                    w={ls(120)}
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
                      无
                    </Text>
                  )}
                </Row>
                <Row mt={ss(20)}>
                  <Text
                    fontSize={sp(18)}
                    color='#999'
                    w={ls(120)}
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
                      无
                    </Text>
                  )}
                </Row>
                <Row mt={ss(20)}>
                  <Text
                    fontSize={sp(18)}
                    color='#999'
                    w={ls(120)}
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
                    w={ls(120)}
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
                    w={ls(120)}
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
                    w={ls(120)}
                    textAlign={'right'}>
                    理疗师：
                  </Text>
                  <Text fontSize={sp(18)} color='#333'>
                    {collectionOperator?.name || '无'}
                  </Text>
                </Row>

                <Row mt={ss(20)}>
                  <Text
                    fontSize={sp(18)}
                    color='#999'
                    w={ls(120)}
                    textAlign={'right'}>
                    采集时间：
                  </Text>
                  <Text fontSize={sp(18)} color='#333'>
                    {dayjs(collect.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
                  </Text>
                </Row>
              </Column>
            </ScrollView>
          </Column>
        </Modal>
      )}
    </Box>
  );
}
