import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, TextInput, Platform, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../store/appStore';
import { Spacing } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { useLanguage } from '../i18n/LanguageContext';

const BUDGET_WARNING_THRESHOLD_TL = 300;

export default function BudgetScreen() {
  const { t, tc } = useLanguage();
  const safeAreaInsets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const {
    shoppingList,
    stock,
    weeklyBudgetSpent,
    weeklyBudgetLimit,
    toggleShoppingItem,
    updateShoppingItemPrice,
    updateShoppingItemNotes,
    updateStockQuantity,
    resetWeeklyBudget,
  } = useAppStore();

  // Internal tab state: 'shopping' or 'stock'
  const [activeSubTab, setActiveSubTab] = useState<'shopping' | 'stock'>('shopping');

  // Inline editing state for prices
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [priceInputText, setPriceInputText] = useState<string>('');

  const handleStartEditPrice = (itemId: string, currentPrice: number) => {
    setEditingPriceId(itemId);
    setPriceInputText(currentPrice.toString());
  };

  const handleSavePrice = (itemId: string) => {
    const parsedPrice = parseFloat(priceInputText.trim());
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      if (Platform.OS === 'web') {
        alert(t.invalidPrice);
      } else {
        Alert.alert(t.error, t.invalidPrice);
      }
      return;
    }
    updateShoppingItemPrice(itemId, parsedPrice);
    setEditingPriceId(null);
  };

  const handleResetBudget = () => {
    const confirmReset = () => {
      resetWeeklyBudget();
      if (Platform.OS === 'web') {
        alert(t.resetDoneMessage);
      } else {
        Alert.alert(t.resetDoneTitle, t.resetDoneMessage);
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm(t.confirmResetMessage)) {
        confirmReset();
      }
    } else {
      Alert.alert(
        t.confirmTitle,
        t.confirmResetMessage,
        [
          { text: t.cancel, style: 'cancel' },
          { text: t.reset, style: 'destructive', onPress: confirmReset }
        ]
      );
    }
  };

  // Check if daily spend warning is triggered
  const isDailyBudgetExceeded = weeklyBudgetSpent > BUDGET_WARNING_THRESHOLD_TL;

  // Soft styling
  const containerStyle = [
    styles.container,
    { backgroundColor: isDark ? '#000000' : '#F8F9FA' }
  ];

  const cardStyle = [
    styles.card,
    { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF', borderColor: isDark ? '#2C2C2E' : '#E5E5EA' }
  ];

  const textStyle = {
    color: isDark ? '#FFFFFF' : '#1C1C1E'
  };

  const secondaryTextStyle = {
    color: isDark ? '#8E8E93' : '#60646C'
  };

  return (
    <View style={containerStyle}>
      {/* Sub-tab selection */}
      <View style={[styles.tabSelectorContainer, { borderBottomColor: isDark ? '#2C2C2E' : '#E5E5EA' }]}>
        <Pressable
          style={[styles.tabBtn, activeSubTab === 'shopping' && styles.activeTabBtn]}
          onPress={() => setActiveSubTab('shopping')}
        >
          <Ionicons
            name="cart-outline"
            size={18}
            color={activeSubTab === 'shopping' ? '#007AFF' : '#8E8E93'}
          />
          <Text
            style={[
              styles.tabBtnText,
              { color: activeSubTab === 'shopping' ? '#007AFF' : '#8E8E93' }
            ]}
          >
            {t.shoppingList}
          </Text>
        </Pressable>

        <Pressable
          style={[styles.tabBtn, activeSubTab === 'stock' && styles.activeTabBtn]}
          onPress={() => setActiveSubTab('stock')}
        >
          <Ionicons
            name="file-tray-stacked-outline"
            size={18}
            color={activeSubTab === 'stock' ? '#007AFF' : '#8E8E93'}
          />
          <Text
            style={[
              styles.tabBtnText,
              { color: activeSubTab === 'stock' ? '#007AFF' : '#8E8E93' }
            ]}
          >
            {t.pantry}
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: safeAreaInsets.bottom + Spacing.six }
        ]}
      >
        {activeSubTab === 'shopping' ? (
          /* Shopping List Content */
          <View style={styles.shoppingSection}>
            {/* Header info */}
            <View style={cardStyle}>
              <View style={styles.budgetHeader}>
                <View>
                  <Text style={[styles.budgetLabel, secondaryTextStyle]}>{t.spentBudget}</Text>
                  <Text style={[styles.budgetAmount, textStyle]}>
                    {weeklyBudgetSpent} TL <Text style={styles.limitText}>/ {weeklyBudgetLimit} TL</Text>
                  </Text>
                </View>
                <Pressable style={styles.resetBtn} onPress={handleResetBudget}>
                  <Text style={styles.resetBtnText}>{t.reset}</Text>
                </Pressable>
              </View>

              {/* Spend warning */}
              {isDailyBudgetExceeded && (
                <View style={styles.spendAlert}>
                  <Ionicons name="alert-circle" size={16} color="#FF3B30" />
                  <Text style={styles.spendAlertText}>
                    {t.dailyLimitWarning}
                  </Text>
                </View>
              )}
            </View>

            {/* Shopping List Rows */}
            <Text style={[styles.sectionTitle, textStyle]}>{t.weeklyShopping}</Text>
            <View style={styles.shoppingList}>
              {shoppingList.map((item) => (
                <View key={item.id} style={cardStyle}>
                  <View style={styles.shoppingItemHeader}>
                    {/* Circle checkbox */}
                    <Pressable
                      onPress={() => toggleShoppingItem(item.id)}
                      style={styles.checkboxContainer}
                    >
                      <View
                        style={[
                          styles.checkbox,
                          {
                            borderColor: item.purchased ? '#34C759' : '#C7C7CC',
                            backgroundColor: item.purchased ? '#34C759' : 'transparent'
                          }
                        ]}
                      >
                        {item.purchased && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                      </View>
                    </Pressable>

                    {/* Info */}
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[
                          styles.itemName,
                          textStyle,
                          item.purchased && styles.completedText
                        ]}
                      >
                        {tc(item.name)}
                      </Text>
                      <Text style={[styles.itemSubName, secondaryTextStyle]}>
                        {t.itemDetails(tc(item.quantity), tc(item.market), item.protein)}
                      </Text>
                    </View>

                    {/* Price and Edit */}
                    {editingPriceId === item.id ? (
                      <View style={styles.editPriceForm}>
                        <TextInput
                          style={[styles.editPriceInput, { color: textStyle.color }]}
                          keyboardType="numeric"
                          value={priceInputText}
                          onChangeText={setPriceInputText}
                          autoFocus
                        />
                        <Pressable onPress={() => handleSavePrice(item.id)}>
                          <Ionicons name="checkmark-circle" size={24} color="#34C759" />
                        </Pressable>
                      </View>
                    ) : (
                      <Pressable
                        style={styles.priceContainer}
                        onPress={() => handleStartEditPrice(item.id, item.price)}
                      >
                        <Text style={[styles.priceText, textStyle]}>{item.price} TL</Text>
                        <Ionicons name="pencil" size={12} color="#007AFF" style={{ marginLeft: 4 }} />
                      </Pressable>
                    )}
                  </View>

                  {/* Notes Field (Notion style, auto-saves onChangeText) */}
                  <View style={[styles.notesContainer, { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' }]}>
                    <Ionicons name="document-text-outline" size={14} color="#8E8E93" />
                    <TextInput
                      style={[styles.notesInput, { color: textStyle.color }]}
                      placeholder={t.notePlaceholder}
                      placeholderTextColor="#8E8E93"
                      value={tc(item.notes)}
                      onChangeText={(text) => updateShoppingItemNotes(item.id, text)}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>
        ) : (
          /* Pantry Inventory Content */
          <View style={styles.stockSection}>
            <Text style={[styles.sectionTitle, textStyle]}>{t.digitalStockList}</Text>
            <Text style={[styles.sectionSubtitle, secondaryTextStyle]}>
              {t.stockSubtitle}
            </Text>

            <View style={styles.stockList}>
              {Object.values(stock).map((item) => {
                const isLow = item.quantity < item.minAlertThreshold;
                return (
                  <View key={item.name} style={cardStyle}>
                    <View style={styles.stockRow}>
                      <View style={{ flex: 1 }}>
                        <View style={styles.stockNameRow}>
                          <Text style={[styles.stockName, textStyle]}>{tc(item.name)}</Text>
                          {isLow && (
                            <View style={styles.lowStockBadge}>
                              <Text style={styles.lowStockBadgeText}>{t.lowStock}</Text>
                            </View>
                          )}
                        </View>
                        <Text style={[styles.stockThresholdText, secondaryTextStyle]}>
                          {t.criticalLimit}: {item.minAlertThreshold} {tc(item.unit)}
                        </Text>
                      </View>

                      {/* Manual adjust +/- buttons */}
                      <View style={styles.adjustContainer}>
                        <Pressable
                          style={styles.adjustBtn}
                          onPress={() => updateStockQuantity(item.name, Math.max(0, item.quantity - (item.unit === 'g' || item.unit === 'ml' ? 100 : 1)))}
                        >
                          <Ionicons name="remove" size={16} color="#007AFF" />
                        </Pressable>

                        <Text style={[styles.stockQuantityText, textStyle, isLow && { color: '#FF9500', fontWeight: '700' }]}>
                          {item.quantity} <Text style={styles.unitText}>{tc(item.unit)}</Text>
                        </Text>

                        <Pressable
                          style={styles.adjustBtn}
                          onPress={() => updateStockQuantity(item.name, item.quantity + (item.unit === 'g' || item.unit === 'ml' ? 100 : 1))}
                        >
                          <Ionicons name="add" size={16} color="#007AFF" />
                        </Pressable>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabSelectorContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
    paddingVertical: Spacing.three,
  },
  activeTabBtn: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  contentContainer: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: Spacing.four,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
    marginBottom: Spacing.two,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  budgetLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  budgetAmount: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 2,
  },
  limitText: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  resetBtn: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: 8,
  },
  resetBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
  },
  spendAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    backgroundColor: '#FFEBEE',
    padding: Spacing.two,
    borderRadius: 8,
    marginTop: Spacing.three,
  },
  spendAlertText: {
    color: '#D32F2F',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: Spacing.three,
    marginBottom: Spacing.three,
  },
  sectionSubtitle: {
    fontSize: 13,
    marginBottom: Spacing.four,
    lineHeight: 18,
  },
  shoppingList: {
    gap: Spacing.two,
  },
  shoppingItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  checkboxContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  itemSubName: {
    fontSize: 12,
    marginTop: 2,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.08)',
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: 8,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#007AFF',
  },
  editPriceForm: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  editPriceInput: {
    width: 60,
    height: 32,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 6,
    textAlign: 'center',
    fontSize: 13,
    padding: 0,
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.two,
    height: 36,
    borderRadius: 8,
    marginTop: Spacing.three,
  },
  notesInput: {
    flex: 1,
    fontSize: 12,
    padding: 0,
  },
  stockSection: {
    width: '100%',
  },
  stockList: {
    gap: Spacing.two,
  },
  stockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stockNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  stockName: {
    fontSize: 15,
    fontWeight: '600',
  },
  lowStockBadge: {
    backgroundColor: '#FFE0B2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  lowStockBadgeText: {
    color: '#E65100',
    fontSize: 9,
    fontWeight: '700',
  },
  stockThresholdText: {
    fontSize: 12,
    marginTop: 2,
  },
  adjustContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  adjustBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stockQuantityText: {
    fontSize: 14,
    fontWeight: '600',
    minWidth: 50,
    textAlign: 'center',
  },
  unitText: {
    fontSize: 11,
    color: '#8E8E93',
    fontWeight: '500',
  },
  shoppingSection: {
    width: '100%',
  },
});
