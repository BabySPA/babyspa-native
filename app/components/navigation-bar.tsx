import { Box, Icon, IconButton, Row } from 'native-base';
import { ls, ss, sp } from '../utils/style';
import { MaterialIcons, SimpleLineIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface NavigationBarParams {
  hasLeftIcon?: boolean;
  onBackIntercept: () => boolean;
  leftElement: JSX.Element;
  rightElement: JSX.Element;
}

export default function NavigationBar(props: NavigationBarParams) {
  const {
    hasLeftIcon = true,
    onBackIntercept = () => false,
    leftElement,
    rightElement,
  } = props;

  const navigation = useNavigation();
  return (
    <Row
      safeAreaTop
      safeAreaLeft
      safeAreaRight
      bg={{
        linearGradient: {
          colors: ['#22D59C', '#1AB7BE'],
          start: [0, 0],
          end: [1, 1],
        },
      }}
      alignItems={'center'}
      justifyContent={'space-between'}
      px={ss(20)}
      py={ss(20)}
    >
      <Row alignItems={'center'}>
        <IconButton
          onPress={() => {
            if (onBackIntercept()) return;
            navigation.goBack();
          }}
          variant='ghost'
          _icon={{
            as: SimpleLineIcons,
            name: 'arrow-left',
            size: ss(20, { min: 14 }),
            color: 'white',
          }}
        />
        {leftElement}
      </Row>
      {rightElement}
    </Row>
  );
}
