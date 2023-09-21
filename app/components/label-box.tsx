import { Row, Text } from 'native-base';
import { sp, ls } from '~/app/utils/style';

export default function LabelBox({
  title,
  value,
  rightElement,
  flex,
  alignItems,
}: {
  title: string;
  value: string | undefined;
  rightElement?: React.ReactNode;
  flex?: number;
  alignItems?: 'flex-start' | 'center' | 'flex-end';
}) {
  return (
    <Row alignItems={alignItems || 'flex-start'} flex={flex || 1}>
      <Text fontSize={sp(20)} color='#999' minW={ls(120)} textAlign={'right'}>
        {title}：
      </Text>
      <Text fontSize={sp(20)} color='#333' maxW={'80%'}>
        {value}
      </Text>
      {rightElement}
    </Row>
  );
}
