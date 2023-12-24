import { memo } from 'react';
import { TextInput } from 'react-native-gesture-handler';

// @ts-ignore
import { makeStyledComponent } from 'native-base/lib/module/utils/styled';

const StyledInput = makeStyledComponent(TextInput);

function Input(props: any) {
  return <StyledInput {...props} />;
}

export default memo(Input);
