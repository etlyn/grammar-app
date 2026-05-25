import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/theme/colors';

type MetricBadgeProps = {
  label: string;
  value: string | number;
};

export const MetricBadge = ({ label, value }: MetricBadgeProps) => {
  const theme = useAppTheme();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: theme.colors.glassStrong,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <Text style={[styles.label, { color: theme.colors.textMuted }]}>
        {label}
      </Text>
      <Text style={[styles.value, { color: theme.colors.textPrimary }]}>
        {value}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    minWidth: 78,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 18,
    fontWeight: '900',
    marginTop: 2,
  },
});
