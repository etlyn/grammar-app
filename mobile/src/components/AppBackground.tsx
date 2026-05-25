import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useAppTheme } from '@/theme/colors';

export const AppBackground = () => {
  const theme = useAppTheme();

  return (
    <View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFill,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <View
        style={[
          styles.panel,
          styles.topPanel,
          { backgroundColor: theme.colors.backgroundPanel },
        ]}
      />
      <View
        style={[
          styles.panel,
          styles.bottomPanel,
          { backgroundColor: theme.colors.accentSoft },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  panel: {
    position: 'absolute',
    borderRadius: 28,
    opacity: 0.78,
    transform: [{ rotate: '-8deg' }],
  },
  topPanel: {
    height: 180,
    left: -32,
    right: -24,
    top: 52,
  },
  bottomPanel: {
    bottom: 92,
    height: 160,
    left: 24,
    right: -56,
  },
});
