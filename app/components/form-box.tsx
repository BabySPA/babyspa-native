import { Box, Row, Text } from 'native-base';
import { StyleProp, ViewStyle } from 'react-native';
import Dot from './dot';
import { sp, ls } from '../utils/style';

interface FormBoxParams {
  title: string;
  form: JSX.Element;
  required?: boolean;
  style?: StyleProp<ViewStyle>;
  titleWidth?: number;
}

export function FormBox(props: FormBoxParams) {
  const { required, form, title, style, titleWidth } = props;
  return (
    <Row style={style} minH={ls(48)} alignItems={'center'} minW={ls(140)}>
      <Row
        alignItems={'center'}
        mr={ls(30)}
        justifyContent={'flex-end'}
        minW={ls(80)}>
        <Box opacity={required ? 1 : 0}>
          <Dot />
        </Box>
        <Text fontSize={sp(20)} color='#333' w={titleWidth}>
          {title}
        </Text>
      </Row>
      {form}
    </Row>
  );
}
