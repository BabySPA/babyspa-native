import { Image } from 'react-native';
import { Text, Icon, Box, Row, Pressable } from 'native-base';
import { ls, sp, ss } from '~/app/utils/style';
import useManagerStore from '~/app/stores/manager';
import { FontAwesome } from '@expo/vector-icons';

const CheckboxTree = () => {
  const { configAuthTree, setConfigAuthTree } = useManagerStore();

  return (
    <Box>
      {configAuthTree?.length > 0 &&
        configAuthTree.map((node, nodeIdx) => {
          return (
            <Box key={node.text} mb={ss(10)}>
              <Pressable
                hitSlop={ss(10)}
                onPress={() => {
                  const COPY = JSON.parse(JSON.stringify(configAuthTree));
                  COPY[nodeIdx].hasAuth = !node.hasAuth;

                  COPY[nodeIdx].features.forEach((fi: any) => {
                    fi.hasAuth = !node.hasAuth;
                  });

                  setConfigAuthTree([...COPY]);
                }}>
                <Row alignItems={'center'}>
                  <Image
                    source={
                      node.hasAuth
                        ? require('~/assets/images/checkbox-y.png')
                        : require('~/assets/images/checkbox-n.png')
                    }
                    style={{ width: ss(24), height: ss(24) }}
                  />
                  <Text color='#333' fontSize={sp(20)} ml={ls(10)}>
                    {node.text}
                  </Text>
                  <Pressable
                    hitSlop={ss(10)}
                    onPress={() => {
                      const COPY = JSON.parse(JSON.stringify(configAuthTree));
                      COPY[nodeIdx].isOpen = !node.isOpen;
                      setConfigAuthTree([...COPY]);
                    }}>
                    <Icon
                      ml={ss(16)}
                      as={
                        <FontAwesome
                          name={node.isOpen ? 'angle-down' : 'angle-right'}
                        />
                      }
                      size={ss(20)}
                      color='#BCBCBC'
                    />
                  </Pressable>
                </Row>
              </Pressable>
              {node.isOpen && (
                <Box>
                  {node.features.map((feature, featureIdx) => {
                    return (
                      <Pressable
                        hitSlop={ss(10)}
                        key={feature.text}
                        onPress={() => {
                          const COPY = JSON.parse(
                            JSON.stringify(configAuthTree),
                          );
                          COPY[nodeIdx].features[featureIdx].hasAuth =
                            !feature.hasAuth;
                          setConfigAuthTree([...COPY]);
                        }}>
                        <Row ml={ls(20)} mt={ss(10)}>
                          <Image
                            source={
                              feature.hasAuth
                                ? require('~/assets/images/checkbox-y.png')
                                : require('~/assets/images/checkbox-n.png')
                            }
                            style={{ width: ss(24), height: ss(24) }}
                          />
                          <Text color='#333' fontSize={sp(20)} ml={ls(10)}>
                            {feature.text}
                          </Text>
                        </Row>
                      </Pressable>
                    );
                  })}
                </Box>
              )}
            </Box>
          );
        })}
    </Box>
  );
};

export default CheckboxTree;
