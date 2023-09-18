import { Box, Icon, IconButton, Pressable, Row } from 'native-base';
import { ls, ss, sp } from '../utils/style';
import { MaterialIcons, SimpleLineIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface NavigationBarParams {
  hasLeftIcon?: boolean;
  onBackIntercept: () => boolean;
  leftElement: JSX.Element;
  rightElement: JSX.Element | null;
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
      py={ss(20)}>
      <Pressable
        hitSlop={ss(20)}
        onPress={() => {
          if (onBackIntercept()) return;
          navigation.goBack();
        }}>
        <Row alignItems={'center'}>
          {hasLeftIcon && (
            <Icon
              as={<SimpleLineIcons name='arrow-left' />}
              size={ss(20)}
              color={'#FFF'}
              mr={ls(10)}
            />
          )}
          {leftElement}
        </Row>
      </Pressable>
      {rightElement}
    </Row>
  );
}
