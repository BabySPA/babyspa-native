import dayjs from 'dayjs';
import {
  Box,
  Column,
  Icon,
  Pressable,
  Row,
  Text,
  Image,
  Container,
  ScrollView,
} from 'native-base';
import { useToast } from 'react-native-toast-notifications';
import NavigationBar from '~/app/components/navigation-bar';
import { sp, ss, ls } from '~/app/utils/style';
import { AppStackScreenProps } from '~/app/types';
import { useEffect, useState } from 'react';
import {
  AntDesign,
  FontAwesome,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { getAge } from '~/app/utils';
import { ShopArchive } from './components/shop-archive';
import { HistoryArchive } from './components/history-archive';
import { GrowthCurve } from './components/growth-curve';
import useFlowStore from '~/app/stores/flow';
import {
  FlowItemResponse,
  GrowthCurveStatisticsResponse,
} from '~/app/stores/flow/type';
import { DialogModal, GrowthCurveModal } from '~/app/components/modals';
import { toastAlert } from '~/app/utils/toast';
import EmptyBox from '~/app/components/empty-box';

const configs = [
  {
    key: 'shop-archive',
    text: '门店记录',
  },
  {
    key: 'history-archive',
    text: '历史记录',
  },
  {
    key: 'growth-curve',
    text: '生长曲线',
  },
];
export default function CustomerArchive({
  navigation,
}: AppStackScreenProps<'CustomerArchive'>) {
  useEffect(() => {}, []);

  const requestCustomerArchiveCourses = useFlowStore(
    (state) => state.requestCustomerArchiveCourses,
  );
  const requestCustomerArchiveHistory = useFlowStore(
    (state) => state.requestCustomerArchiveHistory,
  );
  const requestCustomerGrowthCurve = useFlowStore(
    (state) => state.requestCustomerGrowthCurve,
  );
  const requestPutCustomerGrowthCurve = useFlowStore(
    (state) => state.requestPutCustomerGrowthCurve,
  );
  const requestPatchCustomerGrowthCurve = useFlowStore(
    (state) => state.requestPatchCustomerGrowthCurve,
  );
  const requestDeleteCustomer = useFlowStore(
    (state) => state.requestDeleteCustomer,
  );
  const requestArchiveCustomers = useFlowStore(
    (state) => state.requestArchiveCustomers,
  );
  const customer = useFlowStore((state) => state.currentArchiveCustomer);
  const updateCurrentFlow = useFlowStore((state) => state.updateCurrentFlow);

  const age = getAge(customer?.birthday || dayjs().format('YYYY-MM-DD'));
  const toast = useToast();

  const [archives, setArchives] = useState<FlowItemResponse[]>([]);
  const [courses, setCourses] = useState<FlowItemResponse[][]>([]);
  const [growthCurves, setGrowthCurves] = useState<
    GrowthCurveStatisticsResponse[]
  >([]);

  useEffect(() => {
    requestCustomerArchiveHistory(customer?._id || '').then((res) => {
      setArchives(res);
    });

    requestCustomerArchiveCourses(customer?._id || '').then((res) => {
      setCourses(res);
    });
    getGrowthCurveDatas();
  }, []);

  const getGrowthCurveDatas = () => {
    requestCustomerGrowthCurve(customer?._id || '').then((res) => {
      setGrowthCurves(res);
    });
  };

  const [selectFragment, setSelectedFragment] = useState(0);

  const [showEditGrowthCurve, setShowEditGrowthCurve] = useState({
    isOpen: false,
    date: '',
    defaultHeight: 0,
    defaultWeight: 0,
  });

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <Box flex={1}>
      <NavigationBar
        onBackIntercept={() => false}
        leftElement={
          <Text color='white' fontWeight={600} fontSize={sp(20)}>
            客户档案
          </Text>
        }
        rightElement={
          <Text color={'#fff'} fontSize={sp(20)}>
            {dayjs().format('YYYY-MM-DD')}
          </Text>
        }
      />
      <Column
        safeAreaLeft
        bgColor={'#F6F6FA'}
        flex={1}
        p={ss(10)}
        safeAreaBottom>
        <Row
          py={ss(20)}
          px={ss(40)}
          bgColor='white'
          borderRadius={ss(10)}
          justifyContent={'space-between'}
          alignItems={'center'}>
          <Row alignItems={'center'}>
            <Image
              style={{ width: ss(60), height: ss(60) }}
              source={
                customer.gender == 1
                  ? require('~/assets/images/boy.png')
                  : require('~/assets/images/girl.png')
              }
              alt='头像'
            />
            <Text fontSize={sp(24)} ml={ls(26)} color={'#333'}>
              {customer.name}
              {customer.nickname && <Text>({customer.nickname})</Text>}
            </Text>
            <Icon
              ml={ss(10)}
              as={
                <MaterialCommunityIcons
                  name={customer.gender == 1 ? 'gender-male' : 'gender-female'}
                />
              }
              size={sp(26)}
              color={customer.gender == 1 ? '#648B62' : '#F3AF62'}
            />
            <Text ml={ls(16)} fontSize={sp(20)} color={'#666'}>
              {age?.year}岁{age?.month}月
            </Text>

            <Text ml={ls(16)} fontSize={sp(20)} color={'#666'}>
              {customer.phoneNumber}
            </Text>
          </Row>

          <Row>
            <Pressable
              _pressed={{
                opacity: 0.6,
              }}
              hitSlop={ss(20)}
              onPress={() => {
                // 删除客户
                setShowDeleteDialog(true);
              }}>
              <Row alignItems={'center'}>
                <Icon
                  as={<AntDesign name='delete' />}
                  size={sp(24)}
                  color={'#99A9BF'}
                />
                <Text fontSize={sp(20)} color={'#000'} ml={ls(4)}>
                  删除
                </Text>
              </Row>
            </Pressable>
            {showDeleteDialog && (
              <DialogModal
                isOpen={showDeleteDialog}
                title={'是否确认删除客户？'}
                onClose={function (): void {
                  setShowDeleteDialog(false);
                }}
                onConfirm={function (): void {
                  requestDeleteCustomer(customer?._id || '')
                    .then(async (res) => {
                      toastAlert(toast, 'success', '删除成功！');
                      await requestArchiveCustomers();
                      navigation.goBack();
                    })
                    .catch((err) => {
                      toastAlert(toast, 'error', '删除失败！');
                    })
                    .finally(() => {
                      setShowDeleteDialog(false);
                    });
                }}
              />
            )}
            <Pressable
              _pressed={{
                opacity: 0.6,
              }}
              hitSlop={ss(20)}
              ml={ls(40)}
              onPress={() => {
                navigation.navigate('AddNewCustomer');
              }}>
              <Row alignItems={'center'}>
                <Icon
                  as={<FontAwesome name='edit' />}
                  size={sp(24)}
                  color={'#99A9BF'}
                />
                <Text fontSize={sp(20)} color={'#000'} ml={ls(4)}>
                  编辑
                </Text>
              </Row>
            </Pressable>
          </Row>
        </Row>

        <ScrollView
          mt={ss(10)}
          bgColor='white'
          borderRadius={ss(10)}
          flex={1}
          p={ss(40)}>
          <Row alignItems={'center'} justifyContent={'space-between'}>
            <Container>
              <Row
                borderRadius={ss(4)}
                borderColor={'#99A9BF'}
                borderWidth={ss(1)}
                borderStyle={'solid'}>
                {configs.map((item, idx) => {
                  return (
                    <Pressable
                      _pressed={{
                        opacity: 0.6,
                      }}
                      hitSlop={ss(20)}
                      key={item.key}
                      borderRightWidth={idx == configs.length - 1 ? 0 : 1}
                      borderRightColor={'#99A9BF'}
                      onPress={() => {
                        setSelectedFragment(idx);
                      }}>
                      <Box
                        minW={ss(120)}
                        px={ss(20)}
                        py={ss(10)}
                        bgColor={
                          configs[selectFragment].key == item.key
                            ? '#03CBB2'
                            : 'transparent'
                        }>
                        <Text
                          fontSize={sp(20)}
                          fontWeight={600}
                          color={
                            configs[selectFragment].key == item.key
                              ? '#fff'
                              : '#333'
                          }>
                          {item.text}
                        </Text>
                      </Box>
                    </Pressable>
                  );
                })}
              </Row>
            </Container>
            {configs[selectFragment].key == 'growth-curve' && (
              <Pressable
                _pressed={{
                  opacity: 0.6,
                }}
                hitSlop={ss(20)}
                onPress={() => {
                  setShowEditGrowthCurve({
                    ...showEditGrowthCurve,
                    isOpen: true,
                  });
                }}
                bgColor={'rgba(0, 180, 158, 0.10)'}
                borderColor={'#00B49E'}
                borderRadius={ss(4)}
                borderWidth={ss(1)}
                px={ls(16)}
                py={ss(8)}>
                <Text color='#03CBB2' fontSize={sp(14)}>
                  新建
                </Text>
              </Pressable>
            )}
          </Row>
          <Box mb={ss(60)}>
            {configs[selectFragment].key == 'shop-archive' &&
              (archives.length > 0 ? (
                <ShopArchive
                  archives={archives}
                  onPressToFlowInfo={function (archive): void {
                    updateCurrentFlow(archive);
                    navigation.navigate('FlowInfo', { from: 'analyze' });
                  }}
                />
              ) : (
                <EmptyBox />
              ))}
            {configs[selectFragment].key == 'history-archive' &&
              (courses.length > 0 ? (
                <HistoryArchive
                  courses={courses}
                  onPressToFlowInfo={function (archive): void {
                    updateCurrentFlow(archive);
                    navigation.navigate('FlowInfo', { from: 'analyze' });
                  }}
                />
              ) : (
                <EmptyBox />
              ))}
            {configs[selectFragment].key == 'growth-curve' &&
              (growthCurves.length > 0 ? (
                <GrowthCurve
                  growthCurves={growthCurves}
                  onEditClick={function (
                    item: GrowthCurveStatisticsResponse,
                  ): void {
                    setShowEditGrowthCurve({
                      isOpen: true,
                      date: item.date,
                      defaultHeight: item.heightData.height,
                      defaultWeight: item.weightData.weight,
                    });
                  }}
                />
              ) : (
                <EmptyBox />
              ))}
          </Box>
        </ScrollView>
      </Column>
      {showEditGrowthCurve.isOpen && (
        <GrowthCurveModal
          isOpen={showEditGrowthCurve.isOpen}
          defaultHeight={showEditGrowthCurve.defaultHeight}
          defaultWeight={showEditGrowthCurve.defaultWeight}
          onClose={function (): void {
            setShowEditGrowthCurve({
              isOpen: false,
              date: '',
              defaultHeight: 0,
              defaultWeight: 0,
            });
          }}
          onConfirm={function ({
            height,
            weight,
          }: {
            height: number;
            weight: number;
          }): void {
            if (showEditGrowthCurve.date.length > 0) {
              requestPatchCustomerGrowthCurve(customer?._id || '', {
                height,
                weight,
                date: showEditGrowthCurve.date,
              })
                .then((res) => {
                  toastAlert(toast, 'success', '修改信息成功！');
                  getGrowthCurveDatas();
                  setShowEditGrowthCurve({
                    isOpen: false,
                    date: '',
                    defaultHeight: 0,
                    defaultWeight: 0,
                  });
                })
                .catch((err) => {
                  toastAlert(toast, 'error', '修改信息失败！');
                  setShowEditGrowthCurve({
                    isOpen: false,
                    date: '',
                    defaultHeight: 0,
                    defaultWeight: 0,
                  });
                });
            } else {
              requestPutCustomerGrowthCurve(customer?._id || '', {
                height,
                weight,
              })
                .then((res) => {
                  toastAlert(toast, 'success', '添加成功！');
                  getGrowthCurveDatas();
                  setShowEditGrowthCurve({
                    isOpen: false,
                    date: '',
                    defaultHeight: 0,
                    defaultWeight: 0,
                  });
                })
                .catch((err) => {
                  toastAlert(toast, 'error', '添加失败！');
                  setShowEditGrowthCurve({
                    isOpen: false,
                    date: '',
                    defaultHeight: 0,
                    defaultWeight: 0,
                  });
                });
            }
          }}
        />
      )}
    </Box>
  );
}
