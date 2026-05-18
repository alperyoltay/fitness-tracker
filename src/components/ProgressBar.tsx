import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Spacing } from '../constants/theme';

interface ProgressBarProps {
  progress: number; // 0 to 1
  label?: string;
  showPercentage?: boolean;
  color?: string;
  height?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  showPercentage = true,
  color = '#34C759', // Apple green
  height = 8,
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round(progress * 100)));

  return (
    <View style={styles.container}>
      {(label || showPercentage) && (
        <View style={styles.header}>
          {label && <Text style={styles.label}>{label}</Text>}
          {showPercentage && <Text style={styles.percentage}>{percentage}%</Text>}
        </View>
      )}
      <View style={[styles.track, { height, borderRadius: height / 2 }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${percentage}%`,
              backgroundColor: color,
              height,
              borderRadius: height / 2,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: Spacing.two,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.one,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1C1C1E',
  },
  percentage: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
  },
  track: {
    width: '100%',
    backgroundColor: '#E5E5EA',
    overflow: 'hidden',
  },
  fill: {
    minWidth: 4,
  },
});
