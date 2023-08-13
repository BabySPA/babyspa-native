import { Row, Text } from 'native-base';
import { sp, ls } from '~/app/utils/style';

export default function LabelBox({
  title,
  value,
  rightElement,
  flex,
}: {
  title: string;
  value: string | undefined;
  rightElement?: React.ReactNode;
  flex?: number;
}) {
  return (
    <Row alignItems={'flex-start'} flex={flex || 1}>
      <Text fontSize={sp(20)} color='#999' w={ls(120)} textAlign={'right'}>
        {title}：
      </Text>
      <Text fontSize={sp(20)} color='#333' maxW={'80%'}>
        {value}
      </Text>
      {rightElement}
    </Row>
  );
}
