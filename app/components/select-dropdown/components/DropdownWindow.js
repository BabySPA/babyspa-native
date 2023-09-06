import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ss, ls, sp } from '../../../utils/style';

const DropdownWindow = ({ layoutStyle, children }) => {
  return (
    <View
      style={{
        ...styles.dropdownOverlayView,
        ...styles.shadow,
        ...layoutStyle,
      }}>
      {children}
    </View>
  );
};

export default DropdownWindow;

const styles = StyleSheet.create({
  dropdownOverlayView: {
    backgroundColor: '#EFEFEF',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: ss(10),
    elevation: ss(10),
  },
});
