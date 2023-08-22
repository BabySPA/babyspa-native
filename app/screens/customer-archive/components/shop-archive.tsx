import dayjs from 'dayjs';
import {
  Box,
  Center,
  Circle,
  Column,
  Image,
  Row,
  ScrollView,
  Text,
} from 'native-base';
import { FlowArchive } from '~/app/stores/flow/type';
import { ls, sp, ss } from '~/app/utils/style';

interface ShopArchiveParams {
  archives: FlowArchive[];
}
export function ShopArchive(params: ShopArchiveParams) {
  return (
    <Box>
      <ScrollView horizontal mt={ss(30)}>
        {params.archives.map((archive) => {
          return (
            <Column key={archive._id} w={ls(302)}>
              <Row alignItems={'center'}>
                <Circle size={ss(20)} borderRadius={ss(18)} bgColor={'#DCEEED'}>
                  <Circle size={ss(12)} bgColor={'#5EACA3'} />
                </Circle>
                <Box w={'100%'} h={ss(1)} bgColor={'#DFE1DE'} />
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
                <Text color='#C87939' fontSize={sp(16)}>
                  调理导向:
                </Text>
                <Text height={ss(74)} color='#000' fontSize={sp(16)}>
                  {archive.collect?.guidance}
                </Text>
                <Box bgColor={'#F6FBFA'} px={ls(10)} py={ss(20)} flex={1}>
                  <Text color='#5FADA4' fontSize={sp(16)}>
                    {archive.analyze?.remark}
                  </Text>
                </Box>
              </Column>
            </Column>
          );
        })}
      </ScrollView>
    </Box>
  );
}
