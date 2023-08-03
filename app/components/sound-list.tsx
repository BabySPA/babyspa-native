import { Column, Pressable, Row, Text } from 'native-base';
import { Image } from 'react-native';
import { ss, ls, sp } from '../utils/style';
import { UpdatingAudioFile } from '../stores/flow/type';
import { useEffect, useRef } from 'react';
import { Audio } from 'expo-av';

interface SoundListProps {
  audioFiles: UpdatingAudioFile[];
}

export default function SoundList({ audioFiles }: SoundListProps) {
  async function playSound(uri: string) {
    const { sound: playbackObject } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: true },
    );
    const status = playbackObject.playAsync();

    status.then((res) => {
      console.log('playbackObject.playAsync() finished', res.isLoaded);
    });
  }

  return (
    <Column>
      {audioFiles.map((audioFile, idx) => {
        return (
          <Pressable
            key={idx}
            mt={idx === 0 ? 0 : ss(10)}
            onPress={() => {
              playSound(audioFile.uri);
            }}>
            <Row
              borderRadius={ss(4)}
              borderColor={'#A4D4D6'}
              borderWidth={1}
              alignItems={'center'}
              w={ls(253)}
              p={ss(10)}>
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
          </Pressable>
        );
      })}
    </Column>
  );
}
