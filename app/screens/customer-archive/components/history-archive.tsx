import { AntDesign } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { Box, Icon, Pressable, Row, ScrollView, Text } from 'native-base';
import { useState } from 'react';
import { FlowItemResponse } from '~/app/stores/flow/type';
import { arabicToChineseNumber } from '~/app/utils';
import { ls, ss, sp } from '~/app/utils/style';

interface HistoryArchiveParams {
  courses: FlowItemResponse[][];
  onPressToFlowInfo: (archive: FlowItemResponse) => void;
}
export function HistoryArchive(params: HistoryArchiveParams) {
  const [selectIdx, setSelectIdx] = useState(0);

  return (
    <Box>
      {params.courses && (
        <Row>
          <ScrollView py={ss(10)} maxW={ls(290)}>
            {params.courses.map((course, idx) => {
              const latestCourse = course[0];
              return (
                <Pressable
                  hitSlop={ss(10)}
                  onPress={() => {
                    setSelectIdx(idx);
                  }}
                  key={idx}
                  mt={ss(20)}
                  w={ls(262)}
                  minH={ss(94)}
                  borderRadius={4}
                  borderWidth={1}
                  p={ss(20)}
                  borderColor={selectIdx === idx ? '#03CBB2' : '#60ADA4'}>
                  <Text fontSize={sp(20)} color={'#333'}>
                    <Text>{latestCourse.analyze?.conclusion}</Text>
                    {course.length}次
                  </Text>

                  <Text fontSize={sp(14)} color={'#999'} mt={ss(6)}>
                    调理时间
                    {dayjs(latestCourse.updatedAt).format('YYYY-MM-DD')}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
          <ScrollView horizontal ml={ls(30)} mt={ss(30)} flex={1}>
            {params.courses[selectIdx].map((course, idx) => {
              return (
                <Pressable
                  hitSlop={ss(10)}
                  onPress={() => {
                    params.onPressToFlowInfo(course);
                  }}
                  key={idx}
                  w={ls(370)}
                  maxH={ss(280)}
                  borderRadius={4}
                  borderWidth={1}
                  mr={ls(40)}
                  pb={ss(20)}
                  borderColor={'#B1DAD5'}>
                  <Text
                    fontSize={sp(16)}
                    color={'#C87939'}
                    m={ss(20)}
                    numberOfLines={2}
                    ellipsizeMode='tail'>
                    调理导向：
                    <Text color='#999'>{course.collect?.guidance}</Text>
                  </Text>

                  <Box bgColor={'#F6FBFA'} mx={ls(10)} p={ss(16)} h={ss(116)}>
                    <Text
                      fontSize={sp(16)}
                      color={'#5FADA4'}
                      numberOfLines={4}
                      ellipsizeMode='tail'>
                      {course.analyze?.remark}
                    </Text>
                  </Box>
                  <Row
                    justifyContent={'space-between'}
                    alignItems={'center'}
                    px={ls(10)}
                    mt={ss(20)}>
                    <Text
                      fontSize={sp(14)}
                      color={'#60ADA4'}
                      borderRadius={4}
                      borderWidth={1}
                      px={ls(10)}
                      py={ss(2)}
                      borderColor={'#60ADA4'}>
                      {idx === 0
                        ? '首次'
                        : `第${arabicToChineseNumber(idx + 1)}次`}
                    </Text>
                    <Row>
                      <Icon
                        as={<AntDesign name='clockcircleo' />}
                        size={ss(16)}
                        color={'#99A9BF'}
                      />
                      <Text fontSize={sp(14)} color={'#999'} ml={ls(16)}>
                        {dayjs(course.updatedAt).format('YYYY-MM-DD')}
                      </Text>
                    </Row>
                  </Row>
                </Pressable>
              );
            })}
          </ScrollView>
        </Row>
      )}
    </Box>
  );
}
