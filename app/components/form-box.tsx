import { Box, Row, Text } from 'native-base';
import { StyleProp, ViewStyle } from 'react-native';
import Dot from './dot';
import { sp, ls } from '../utils/style';

interface FormBoxParams {
  title: string;
  form: JSX.Element;
  required?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function FormBox(props: FormBoxParams) {
  const { required, form, title, style } = props;
  return (
    <Row style={style} h={ls(48)} alignItems={'center'}>
      <Row alignItems={'center'} mr={ls(30)} minW={ls(75)}>
        <Box opacity={required ? 1 : 0}>
          <Dot />
        </Box>
        <Text fontSize={sp(20, { min: 12 })} width={ls(80)} color='#333'>
          {title}
        </Text>
      </Row>
      {form}
    </Row>
  );
}
