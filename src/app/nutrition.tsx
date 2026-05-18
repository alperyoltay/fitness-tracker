import React from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../store/appStore';
import { MENU_TEMPLATES } from '../constants/mockData';
import { Meal, Ingredient } from '../types';
import { Spacing } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { ProgressBar } from '../components/ProgressBar';

export default function NutritionScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const {
    currentWeek,
    dailyCalorieTarget,
    dailyProteinTarget,
    activeMenuId,
    dailyMeals,
    selectMenu,
    toggleMeal,
  } = useAppStore();

  const todayStr = new Date().toISOString().split('T')[0];
  const todayMeals = dailyMeals[todayStr] || [];

  // Calculate consumed macros for progress bars
  const caloriesConsumed = todayMeals
    .filter((m: Meal) => m.completed)
    .reduce((sum: number, m: Meal) => sum + m.calories, 0);

  const proteinConsumed = todayMeals
    .filter((m: Meal) => m.completed)
    .reduce((sum: number, m: Meal) => sum + m.protein, 0);

  const calorieProgress = caloriesConsumed / Math.max(1, dailyCalorieTarget);
  const proteinProgress = proteinConsumed / Math.max(1, dailyProteinTarget);

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
    <ScrollView
      style={containerStyle}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingTop: Spacing.four, paddingBottom: safeAreaInsets.bottom + Spacing.six }
      ]}
    >
      {/* Target Macros Display (Apple Health style details card) */}
      <View style={cardStyle}>
        <Text style={[styles.cardTitle, textStyle]}>Bugünün Makro Hedefleri</Text>
        <Text style={[styles.cardSubtitle, secondaryTextStyle]}>
          {currentWeek}. Hafta • Günlük Kalori & Protein Aşama Hedefi
        </Text>
        
        <View style={styles.macroDashboard}>
          <View style={styles.macroColumn}>
            <Text style={[styles.macroValue, { color: '#FF9500' }]}>
              {caloriesConsumed} <Text style={styles.macroUnit}>/ {dailyCalorieTarget} kcal</Text>
            </Text>
            <ProgressBar progress={calorieProgress} color="#FF9500" showPercentage={false} />
            <Text style={[styles.macroLabel, secondaryTextStyle]}>Alınan Kalori</Text>
          </View>
          
          <View style={styles.macroColumn}>
            <Text style={[styles.macroValue, { color: '#34C759' }]}>
              {proteinConsumed} <Text style={styles.macroUnit}>/ {dailyProteinTarget} g</Text>
            </Text>
            <ProgressBar progress={proteinProgress} color="#34C759" showPercentage={false} />
            <Text style={[styles.macroLabel, secondaryTextStyle]}>Alınan Protein</Text>
          </View>
        </View>
      </View>

      {/* Menu Template Selection */}
      <Text style={[styles.sectionTitle, textStyle]}>Günlük Menü Şablonu Seçin</Text>
      <View style={styles.menuSelector}>
        {MENU_TEMPLATES.map((menu) => {
          const isSelected = menu.id === activeMenuId;
          return (
            <Pressable
              key={menu.id}
              onPress={() => selectMenu(menu.id)}
              style={[
                styles.menuOptionBtn,
                {
                  backgroundColor: isSelected
                    ? '#007AFF'
                    : (isDark ? '#1C1C1E' : '#FFFFFF'),
                  borderColor: isSelected
                    ? '#007AFF'
                    : (isDark ? '#2C2C2E' : '#E5E5EA')
                }
              ]}
            >
              <Ionicons
                name={menu.id === 'tavuklu' ? 'egg-outline' : menu.id === 'ton_balikli' ? 'fish-outline' : 'leaf-outline'}
                size={18}
                color={isSelected ? '#FFFFFF' : '#007AFF'}
                style={{ marginBottom: Spacing.one }}
              />
              <Text
                style={[
                  styles.menuOptionText,
                  {
                    color: isSelected ? '#FFFFFF' : (isDark ? '#FFFFFF' : '#1C1C1E'),
                    fontWeight: isSelected ? '700' : '500'
                  }
                ]}
              >
                {menu.name.split(' ')[0]}
              </Text>
              <Text
                style={[
                  styles.menuOptionSubtext,
                  { color: isSelected ? '#E0F2FE' : '#8E8E93' }
                ]}
              >
                {menu.totalCalories} kcal
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Meal Checklist */}
      <Text style={[styles.sectionTitle, textStyle]}>Öğün Kontrol Listesi</Text>
      <View style={styles.mealsList}>
        {todayMeals.length === 0 ? (
          <View style={[cardStyle, { alignItems: 'center', paddingVertical: Spacing.four }]}>
            <Text style={[styles.emptyMealsText, secondaryTextStyle]}>
              Lütfen yukarıdan bir menü seçin.
            </Text>
          </View>
        ) : (
          todayMeals.map((meal: Meal, index: number) => (
            <View key={meal.name + index} style={cardStyle}>
              <View style={styles.mealHeader}>
                <Pressable
                  onPress={() => toggleMeal(index, !meal.completed)}
                  style={styles.checkboxContainer}
                >
                  <View
                    style={[
                      styles.checkbox,
                      {
                        borderColor: meal.completed ? '#34C759' : '#C7C7CC',
                        backgroundColor: meal.completed ? '#34C759' : 'transparent'
                      }
                    ]}
                  >
                    {meal.completed && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                  </View>
                </Pressable>

                <View style={styles.mealMeta}>
                  <Text
                    style={[
                      styles.mealName,
                      textStyle,
                      meal.completed && styles.completedText
                    ]}
                  >
                    {meal.name}
                  </Text>
                  <Text style={[styles.mealSpecs, secondaryTextStyle]}>
                    {meal.calories} kcal • {meal.protein}g Protein
                  </Text>
                </View>
              </View>

              <Text style={[styles.mealDescription, secondaryTextStyle]}>
                {meal.description}
              </Text>

              {/* Display ingredients that will deduct from stock */}
              <View style={[styles.ingredientsPanel, { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' }]}>
                <Text style={[styles.ingredientsTitle, textStyle]}>
                  Stoktan düşecek malzemeler:
                </Text>
                <View style={styles.ingredientsRow}>
                  {meal.ingredients.map((ing: Ingredient, idx: number) => (
                    <View key={ing.name + idx} style={styles.ingredientTag}>
                      <Text style={styles.ingredientTagText}>
                        {ing.name} ({ing.amount})
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Spacing.four,
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
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardSubtitle: {
    fontSize: 12,
    marginTop: 2,
    marginBottom: Spacing.three,
  },
  macroDashboard: {
    flexDirection: 'row',
    gap: Spacing.four,
    marginTop: Spacing.one,
  },
  macroColumn: {
    flex: 1,
  },
  macroValue: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  macroUnit: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8E8E93',
  },
  macroLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: Spacing.four,
    marginBottom: Spacing.three,
  },
  menuSelector: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  menuOptionBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 14,
    padding: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
    height: 90,
  },
  menuOptionText: {
    fontSize: 13,
    marginTop: 2,
  },
  menuOptionSubtext: {
    fontSize: 10,
    marginTop: 2,
  },
  mealsList: {
    gap: Spacing.three,
  },
  mealHeader: {
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
  mealMeta: {
    flex: 1,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '600',
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  mealSpecs: {
    fontSize: 12,
    marginTop: 2,
  },
  mealDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginVertical: Spacing.two,
  },
  ingredientsPanel: {
    padding: Spacing.two,
    borderRadius: 8,
    marginTop: Spacing.one,
  },
  ingredientsTitle: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: Spacing.one,
  },
  ingredientsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  ingredientTag: {
    backgroundColor: 'rgba(0, 122, 255, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ingredientTagText: {
    fontSize: 10,
    color: '#007AFF',
    fontWeight: '600',
  },
  emptyMealsText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
});
