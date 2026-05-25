import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { ViewProps, ViewStyle } from 'react-native';

import { useAppTheme } from '@/theme/colors';

type GlassCardProps = ViewProps & {
  children: React.ReactNode;
  elevated?: boolean;
  style?: ViewStyle | ViewStyle[];
};

export const GlassCard = ({
  children,
  elevated = true,
  style,
  ...props
}: GlassCardProps) => {
  const theme = useAppTheme();

  return (
    <View
      {...props}
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.glass,
          borderColor: theme.colors.glassBorder,
          shadowColor: theme.colors.shadow,
        },
        elevated && styles.elevated,
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
  },
  elevated: {
    elevation: 8,
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.16,
    shadowRadius: 34,
  },
});
