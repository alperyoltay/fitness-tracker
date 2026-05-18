import React from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { Spacing } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface StockWarningProps {
  lowStockItems: Array<{
    name: string;
    quantity: number;
    unit: string;
    minAlertThreshold: number;
  }>;
  onPress?: () => void;
}

export const StockWarning: React.FC<StockWarningProps> = ({ lowStockItems, onPress }) => {
  if (lowStockItems.length === 0) return null;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.container, pressed && styles.pressed]}>
      <View style={styles.header}>
        <Ionicons name="warning" size={18} color="#FF9500" />
        <Text style={styles.title}>Stok Uyarısı</Text>
      </View>
      <Text style={styles.description}>
        Aşağıdaki malzemeleriniz kritik seviyenin altında. Satın almanız önerilir:
      </Text>
      <View style={styles.list}>
        {lowStockItems.map((item, index) => (
          <View key={item.name} style={styles.itemRow}>
            <Text style={styles.itemName}>• {item.name}</Text>
            <Text style={styles.itemQuantity}>
              Kalan: {item.quantity} {item.unit} (Kritik: {item.minAlertThreshold} {item.unit})
            </Text>
          </View>
        ))}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF9E6',
    borderWidth: 1,
    borderColor: '#FFE0B2',
    borderRadius: 12,
    padding: Spacing.three,
    marginVertical: Spacing.two,
    width: '100%',
  },
  pressed: {
    opacity: 0.9,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginBottom: Spacing.one,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#E65100',
  },
  description: {
    fontSize: 13,
    color: '#5D4037',
    marginBottom: Spacing.two,
  },
  list: {
    gap: Spacing.one,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#3E2723',
  },
  itemQuantity: {
    fontSize: 12,
    color: '#795548',
  },
});
