import { Ionicons } from '@expo/vector-icons';
import {
  Box,
  Divider,
  Icon,
  Modal,
  Pressable,
  Row,
  ScrollView,
  Text,
} from 'native-base';
import { useState } from 'react';
import { ImageSourcePropType, Image } from 'react-native';
import { ss, sp } from '~/app/utils/style';

export default function BoxItem({
  mt,
  title,
  icon,
  children,
  flex,
  detail,
  autoScroll = true,
}: {
  mt?: number;
  flex?: number;
  title: string;
  icon: ImageSourcePropType;
  children: React.ReactNode;
  detail?: string;
  autoScroll?: boolean;
}) {
  return (
    <Box
      flex={flex ?? 1}
      bgColor='#fff'
      borderRadius={ss(10)}
      mt={mt ?? 0}
      px={ss(20)}
      py={ss(18)}>
      <TitleBar title={title} icon={icon} detail={detail} />
      {autoScroll ? <ScrollView flex={1}>{children}</ScrollView> : children}
    </Box>
  );
}

function TitleBar({
  title,
  icon,
  detail,
}: {
  title: string;
  icon: ImageSourcePropType;
  detail?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box>
      <Row justifyContent={'space-between'}>
        <Row alignItems={'center'}>
          <Image style={{ width: ss(24), height: ss(24) }} source={icon} />
          <Text ml={ss(10)} fontSize={sp(20)} color='#333' fontWeight={600}>
            {title}
          </Text>
        </Row>
        {detail && (
          <Pressable
            onPress={() => {
              setIsOpen(true);
            }}>
            <Row alignItems={'center'}>
              <Icon
                as={<Ionicons name={'md-eye-outline'} />}
                size={sp(22)}
                color={'#1AB7BE'}
              />
              <Text ml={ss(10)} fontSize={sp(20)} color='#333' fontWeight={600}>
                查看
              </Text>
              <Modal
                isOpen={isOpen}
                onClose={() => {
                  setIsOpen(false);
                }}>
                <Modal.Content maxW={ss(500)}>
                  <Modal.CloseButton />
                  <Modal.Header>
                    <Text fontSize={sp(18)}>{title}</Text>
                  </Modal.Header>
                  <Modal.Body>
                    <Text fontSize={sp(16)}>{detail}</Text>
                  </Modal.Body>
                </Modal.Content>
              </Modal>
            </Row>
          </Pressable>
        )}
      </Row>
      <Divider color={'#DFE1DE'} my={ss(14)} />
    </Box>
  );
}
