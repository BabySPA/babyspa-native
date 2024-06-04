import { Ionicons } from '@expo/vector-icons';
import { Icon, Pressable, Row, Text } from 'native-base';
import { memo, useState } from 'react';
import { ls, sp, ss } from '~/app/utils/style';

const TextChild = ({
  canEdit,
  item,
  level,
  onDeleteItem,
  onLongPress,
}: {
  canEdit: boolean;
  onLongPress: () => void;
  item: any;
  level: number;
  onDeleteItem: (item: any, level: number) => void;
}) => {
  if(typeof item!=='string'){
    return null
  }
  return (
    <Pressable
      hitSlop={ss(20)}
      onLongPress={() => {
        onLongPress();
      }}
      mr={ls(10)}
      mb={ss(10)}
      borderWidth={ss(1)}
      borderRadius={2}
      borderColor={'#D8D8D8'}
      px={ls(20)}
      py={ss(7)}>
      <Row alignItems={'center'}>
        <Text maxWidth={ss(300)} fontSize={sp(18)}>
          {item}
        </Text>
        {canEdit && (
          <Pressable
            hitSlop={ss(20)}
            onPress={() => {
              onDeleteItem(item, level);
            }}>
            <Icon
              ml={ls(10)}
              as={<Ionicons name='ios-close-circle-outline' />}
              size={sp(20)}
              color='#FB6459'
            />
          </Pressable>
        )}
      </Row>
    </Pressable>
  );
};

export default memo(TextChild);
