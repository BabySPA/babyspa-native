import { Box, Column, Pressable, Row, Text, useToast } from 'native-base';
import { ss, sp, ls } from '~/app/utils/style';
import useFlowStore from '~/app/stores/flow';
import ImageBox from './image-box';
import BoxItem from './box-item';
import RecordBox from './record-box';
import DashedLine from 'react-native-dashed-line';
import { TemplateModal } from '~/app/components/modals';
import useManagerStore from '~/app/stores/manager';
import { FlowOperatorConfigItem, TemplateGroupKeys } from '~/app/constants';
import { useState } from 'react';
import { toastAlert } from '~/app/utils/toast';

export default function HealthInfo({
  selectedConfig,
}: {
  selectedConfig: FlowOperatorConfigItem;
}) {
  const {
    addLingualImage,
    updateLingualImage,
    addLeftHandImage,
    updateLeftHandImage,
    addRightHandImage,
    updateRightHandImage,
    addOtherImage,
    updateOtherImage,
    updateCollection,
    removeOtherImage,
    removeLingualImage,
    removeLeftHandImage,
    removeRightHandImage,
    currentFlow: { collect },
  } = useFlowStore();

  const { getTemplateGroups } = useManagerStore();
  const [isOpenTemplatePicker, setIsOpenTemplatePicker] = useState(false);
  const toast = useToast();

  return (
    <Row flex={1}>
      <Column flex={1}>
        <BoxItem
          title={'过敏原'}
          icon={require('~/assets/images/notice.png')}
          autoScroll={false}>
          <Box flex={1}>
            <Pressable
              _pressed={{
                opacity: 0.6,
              }}
              onPress={() => {
                if (selectedConfig.disabled) {
                  return;
                }
                setIsOpenTemplatePicker(true);
              }}
              style={{
                borderRadius: ss(4),
                borderColor: '#DFE1DE',
                borderWidth: 1,
                height: ss(170),
                backgroundColor: '#F8F8F8',
                padding: ss(10),
              }}>
              <Text
                fontSize={sp(14)}
                color='#999'
                style={{ textAlignVertical: 'top' }}>
                {collect.healthInfo.allergy || '请输入或选择过敏原'}
              </Text>
              <Text
                fontSize={sp(14)}
                color={'#999'}
                style={{ position: 'absolute', right: ss(10), bottom: ss(10) }}>
                {collect.healthInfo.allergy.length}/300
              </Text>
            </Pressable>
            <TemplateModal
              defaultText={collect.healthInfo.allergy || ''}
              template={getTemplateGroups(TemplateGroupKeys.allergy)}
              isOpen={isOpenTemplatePicker}
              onClose={function (): void {
                setIsOpenTemplatePicker(false);
              }}
              onConfirm={function (text): void {
                updateCollection({
                  healthInfo: {
                    ...collect.healthInfo,
                    allergy: text,
                  },
                });
                setIsOpenTemplatePicker(false);
              }}
            />
          </Box>
        </BoxItem>
        <BoxItem
          title={'备注'}
          icon={require('~/assets/images/notice.png')}
          mt={ss(10)}
          autoScroll={false}>
          <Row flex={1}>
            <Box flex={1}>
              <RecordBox edit={selectedConfig.disabled ? false : true} />
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
              <ImageBox
                edit={selectedConfig.disabled ? false : true}
                images={collect.healthInfo.otherImages}
                selectedCallback={function (
                  filename: string,
                  uri: string,
                ): void {
                  addOtherImage({
                    name: filename,
                    uri: uri,
                  });
                }}
                takePhotoCallback={function (
                  filename: string,
                  uri: string,
                ): void {
                  addOtherImage({
                    name: filename,
                    uri: uri,
                  });
                }}
                uploadCallback={function (filename: string, url: string): void {
                  updateOtherImage(filename, url);
                }}
                errorCallback={function (err: any): void {
                  toastAlert(toast, 'error', '上传图片失败');
                }}
                type={'other'}
                removedCallback={function (idx: number): void {
                  removeOtherImage(idx);
                }}
              />
            </Box>
          </Row>
        </BoxItem>
      </Column>
      <Column flex={1} ml={ss(10)}>
        <BoxItem
          title={'舌部图片'}
          icon={require('~/assets/images/tongue.png')}>
          <ImageBox
            edit={selectedConfig.disabled ? false : true}
            images={collect.healthInfo.lingualImage}
            selectedCallback={function (filename: string, uri: string): void {
              addLingualImage({
                name: filename,
                uri: uri,
              });
            }}
            takePhotoCallback={function (filename: string, uri: string): void {
              addLingualImage({
                name: filename,
                uri: uri,
              });
            }}
            uploadCallback={function (filename: string, url: string): void {
              updateLingualImage(filename, url);
            }}
            errorCallback={function (err: any): void {
              toastAlert(toast, 'error', '上传图片失败');
            }}
            type={'lingual'}
            removedCallback={function (idx: number): void {
              removeLingualImage(idx);
            }}
          />
        </BoxItem>
        <BoxItem
          title={'手部图片'}
          icon={require('~/assets/images/hand.png')}
          mt={ss(10)}>
          <Row>
            <Box flex={1}>
              <Text mr={ls(10)} fontSize={sp(12)} fontWeight={600} color='#333'>
                左手
              </Text>
              <Row mt={ss(10)}>
                <ImageBox
                  edit={selectedConfig.disabled ? false : true}
                  images={collect.healthInfo.leftHandImages}
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
                    addLeftHandImage({
                      name: filename,
                      uri: uri,
                    });
                  }}
                  uploadCallback={function (
                    filename: string,
                    url: string,
                  ): void {
                    updateLeftHandImage(filename, url);
                  }}
                  errorCallback={function (err: any): void {
                    toastAlert(toast, 'error', '上传图片失败');
                  }}
                  type={'lefthand'}
                  removedCallback={function (idx: number): void {
                    removeLeftHandImage(idx);
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
              <Text mr={ls(10)} fontSize={sp(12)} fontWeight={600} color='#333'>
                右手
              </Text>
              <Row mt={ss(10)}>
                <ImageBox
                  edit={selectedConfig.disabled ? false : true}
                  images={collect.healthInfo.rightHandImages}
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
                    addRightHandImage({
                      name: filename,
                      uri: uri,
                    });
                  }}
                  uploadCallback={function (
                    filename: string,
                    url: string,
                  ): void {
                    updateRightHandImage(filename, url);
                  }}
                  errorCallback={function (err: any): void {
                    toastAlert(toast, 'error', '上传图片失败');
                  }}
                  type={'righthand'}
                  removedCallback={function (idx: number): void {
                    removeRightHandImage(idx);
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
