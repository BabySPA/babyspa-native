import { Pressable, Row, Text } from 'native-base';
import { Image } from 'react-native';
import { ls, sp, ss } from '~/app/utils/style';
export function RadioBox(params: {
  config: {
    label: string;
    value: string | number;
  }[];
  margin: number;
  current: string | number | undefined;
  onChange: (value: { label: string; value: string | number }) => void;
}) {
  return (
    <Row alignItems='center'>
      {params.config.map((item, idx) => {
        return (
          <Pressable
            hitSlop={ss(10)}
            key={item.value}
            ml={idx == 0 ? 0 : params.margin}
            onPress={() => {
              params.onChange(item);
            }}
          >
            <Row mr={ls(10)} alignItems={'center'}>
              <Image
                source={
                  params.current == item.value
                    ? require('~/assets/images/check-yes.png')
                    : require('~/assets/images/check-no.png')
                }
                style={{ width: ss(20), height: ss(20) }}
              />
              <Text
                fontSize={sp(18)}
                ml={ls(5)}
                color={params.current == item.value ? '#333' : '#333'}
              >
                {item.label}
              </Text>
            </Row>
          </Pressable>
        );
      })}
    </Row>
  );
}
