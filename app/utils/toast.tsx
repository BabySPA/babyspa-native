import { Alert, Text, Toast, Column, Row } from 'native-base';

export function toastAlert(
  toast: typeof Toast,
  type: 'info' | 'warning' | 'success' | 'error',
  text: string | JSX.Element,
) {
  toast.show({
    placement: 'top',
    render: () => {
      return (
        <Alert w='100%' variant={'subtle'} colorScheme={type} status={type}>
          <Column space={2} flexShrink={1} w='100%'>
            <Row
              flexShrink={1}
              space={2}
              alignItems='center'
              justifyContent='space-between'>
              <Row space={2} flexShrink={1} alignItems='center'>
                <Alert.Icon />
                <Text>{text}</Text>
              </Row>
            </Row>
          </Column>
        </Alert>
      );
    },
  });
}
