import dayjs from 'dayjs';
import {
  Box,
  Circle,
  Column,
  Pressable,
  Row,
  ScrollView,
  Text,
} from 'native-base';
import { FlowItemResponse } from '~/app/stores/flow/type';
import { ls, sp, ss } from '~/app/utils/style';

interface ShopArchiveParams {
  archives: FlowItemResponse[];
  onPressToFlowInfo: (archive: FlowItemResponse) => void;
}
export function ShopArchive(params: ShopArchiveParams) {
  return (
    <Box>
      <ScrollView horizontal mt={ss(30)}>
        {params.archives.map((archive, idx) => {
          return (
            <Pressable
              hitSlop={ss(20)}
              key={archive._id}
              w={ls(302)}
              onPress={() => {
                params.onPressToFlowInfo(archive);
              }}>
              <Row alignItems={'center'}>
                <Circle size={ss(20)} borderRadius={ss(18)} bgColor={'#DCEEED'}>
                  <Circle size={ss(12)} bgColor={'#5EACA3'} />
                </Circle>
                {idx !== params.archives.length - 1 && (
                  <Box w={'100%'} h={ss(1)} bgColor={'#DFE1DE'} />
                )}
              </Row>

              <Text color='#5EACA3' fontSize={sp(16)} my={ss(10)}>
                {dayjs(archive.updatedAt).format('YYYY-MM-DD HH:mm')}
              </Text>
              <Column
                p={ss(20)}
                w={ls(262)}
                h={ss(404)}
                borderRadius={ss(4)}
                borderWidth={1}
                borderColor={'#5EACA3'}>
                <Box
                  bgColor={'#03CBB2'}
                  position={'absolute'}
                  right={0}
                  px={ls(12)}
                  borderTopRightRadius={ss(4)}
                  borderBottomLeftRadius={ss(4)}
                  py={ss(6)}>
                  <Text fontSize={sp(16)} color={'#fff'}>
                    {archive.shop?.name}
                  </Text>
                </Box>
                <Text color='#C87939' fontSize={sp(16)}>
                  调理导向:
                </Text>
                <Text
                  height={ss(74)}
                  color='#000'
                  fontSize={sp(16)}
                  mt={ss(10)}>
                  {archive.collect?.guidance}
                </Text>
                <Box bgColor={'#F6FBFA'} px={ls(10)} py={ss(20)} flex={1}>
                  <Text color='#5FADA4' fontSize={sp(16)}>
                    {archive.analyze?.remark}
                  </Text>
                </Box>
              </Column>
            </Pressable>
          );
        })}
      </ScrollView>
    </Box>
  );
}
