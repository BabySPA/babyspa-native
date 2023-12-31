import { Column, Icon, Pressable, Row, Text } from 'native-base';
import { Image } from 'react-native';
import { ss, ls, sp } from '../utils/style';
import { UpdatingAudioFile } from '../stores/flow/type';
import { Audio } from 'expo-av';
import { AntDesign } from '@expo/vector-icons';

interface SoundListProps {
  audioFiles: UpdatingAudioFile[];
  edit: boolean;
  removedCallback?: (index: number) => void;
}

export default function SoundList({
  audioFiles,
  edit = false,
  removedCallback = (idx) => {},
}: SoundListProps) {
  async function playSound(uri: string) {
    const { sound: playbackObject } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: true },
    );
    const status = playbackObject.playAsync();

    status.then((res) => {
      console.log('playbackObject.playAsync() finished', res);
    });
  }

  return (
    <Column mt={ss(10)}>
      {audioFiles.map((audioFile, idx) => {
        return (
          <Pressable
            _pressed={{
              opacity: 0.6,
            }}
            hitSlop={ss(20)}
            key={idx}
            mt={idx === 0 ? 0 : ss(10)}
            onPress={() => {
              playSound(audioFile.uri);
            }}>
            <Row
              borderRadius={ss(4)}
              borderColor={'#A4D4D6'}
              borderWidth={ss(1)}
              alignItems={'center'}
              justifyContent={'space-between'}
              w={ls(253)}
              p={ss(10)}>
              <Row alignItems={'center'}>
                <Image
                  source={require('~/assets/images/signal.png')}
                  style={{
                    width: ss(20),
                    height: ss(20),
                  }}
                />
                <Text color='#000000' fontSize={sp(18)} ml={ls(10)}>
                  {Math.floor(audioFile.duration / 1000)} "
                </Text>
              </Row>
              {edit && (
                <Pressable
                  _pressed={{
                    opacity: 0.6,
                  }}
                  hitSlop={ss(20)}
                  onPress={() => {
                    removedCallback(idx);
                  }}>
                  <Icon
                    as={<AntDesign name={'delete'} />}
                    size={sp(20)}
                    color='#99A9BF'
                  />
                </Pressable>
              )}
            </Row>
          </Pressable>
        );
      })}
    </Column>
  );
}
