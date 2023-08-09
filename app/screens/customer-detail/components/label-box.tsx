import { Row, Text } from 'native-base';
import { sp, ls } from '~/app/utils/style';

export default function LabelBox({
  title,
  value,
  flex,
}: {
  title: string;
  value: string | undefined;
  flex?: number;
}) {
  return (
    <Row alignItems={'center'} flex={flex || 1}>
      <Text fontSize={sp(20)} color='#999' w={ls(120)} textAlign={'right'}>
        {title}：
      </Text>
      <Text fontSize={sp(20)} color='#333'>
        {value}
      </Text>
    </Row>
  );
}
