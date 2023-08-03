import { Box, Row, Text } from 'native-base';
import { sp, ss } from '../utils/style';
interface BoxTitleParams {
  title: string;
  rightElement?: React.ReactNode | null | undefined;
}

export default function BoxTitle(props: BoxTitleParams) {
  return (
    <Row alignItems={'center'} justifyContent={'space-between'}>
      <Row alignItems={'center'}>
        <Box bgColor={'#00B49E'} w={ss(4)} h={ss(20)} />
        <Text fontSize={sp(20, { min: 14 })} ml={ss(20)} color={'#000'}>
          {props.title}
        </Text>
      </Row>
      {props.rightElement}
    </Row>
  );
}
