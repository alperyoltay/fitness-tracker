import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Pressable, Platform, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../store/appStore';
import { TrainingDay, Meal } from '../types';
import { ProgressBar } from '../components/ProgressBar';
import { StockWarning } from '../components/StockWarning';
import { Spacing } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { useLanguage } from '../i18n/LanguageContext';

export default function DashboardScreen() {
  const { t, tc } = useLanguage();
  const safeAreaInsets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const {
    currentWeek,
    isDeloadWeek,
    dailyCalorieTarget,
    dailyProteinTarget,
    weightHistory,
    workouts,
    dailyMeals,
    shoppingList,
    stock,
    weeklyBudgetSpent,
    weeklyBudgetLimit,
    setWeek,
    addWeightRecord,
  } = useAppStore();

  const [weightInput, setWeightInput] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];
  const todayMeals = dailyMeals[todayStr] || [];

  // Calculate current date display in Turkish
  const getFormattedDate = () => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString(t.locale, options);
  };

  // Determine current workout completion percentage
  // Find current day based on Turkish day of week
  const getTodayTrainingDay = (): TrainingDay => {
    const dayIndex = new Date().getDay(); // 0 is Sunday, 1 is Monday...
    switch (dayIndex) {
      case 1: return TrainingDay.PAZARTESI;
      case 2: return TrainingDay.SALI;
      case 3: return TrainingDay.CARSAMBA;
      case 4: return TrainingDay.PERSEMBE;
      case 5: return TrainingDay.CUMA;
      case 6: return TrainingDay.CUMARTESI;
      default: return TrainingDay.PAZAR;
    }
  };

  const todayTrainingDay = getTodayTrainingDay();
  const todayWorkoutKey = `${currentWeek}_${todayTrainingDay}`;
  const todayWorkout = workouts[todayWorkoutKey];

  const workoutCompletion = todayWorkout
    ? todayWorkout.exercises.filter(ex => ex.completed).length / Math.max(1, todayWorkout.exercises.length)
    : 0;

  // Calculate today's macros consumed
  const caloriesConsumed = todayMeals
    .filter((m: Meal) => m.completed)
    .reduce((sum: number, m: Meal) => sum + m.calories, 0);

  const proteinConsumed = todayMeals
    .filter((m: Meal) => m.completed)
    .reduce((sum: number, m: Meal) => sum + m.protein, 0);

  const calorieProgress = caloriesConsumed / Math.max(1, dailyCalorieTarget);
  const proteinProgress = proteinConsumed / Math.max(1, dailyProteinTarget);

  // Remaining budget
  const budgetRemaining = Math.max(0, weeklyBudgetLimit - weeklyBudgetSpent);
  const budgetProgress = weeklyBudgetSpent / Math.max(1, weeklyBudgetLimit);

  // Check for critical stock items
  const lowStockItems = Object.values(stock).filter(
    item => item.quantity < item.minAlertThreshold
  );

  const handleAddWeight = () => {
    const weightNum = parseFloat(weightInput.trim());
    if (isNaN(weightNum) || weightNum <= 0) {
      if (Platform.OS === 'web') {
        alert(t.invalidWeight);
      } else {
        Alert.alert(t.error, t.invalidWeight);
      }
      return;
    }
    addWeightRecord(weightNum);
    setWeightInput('');
    if (Platform.OS === 'web') {
      alert(t.weightAdded);
    } else {
      Alert.alert(t.success, t.weightAdded);
    }
  };

  // Soft styling variables
  const containerStyle = [
    styles.scrollView,
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
      {/* Title & Today Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.dateText, secondaryTextStyle]}>{getFormattedDate()}</Text>
          <Text style={[styles.welcomeText, textStyle]}>
            {t.appTitlePrimary} <Text style={{ color: '#007AFF' }}>{t.appTitleSecondary}</Text>
          </Text>
        </View>
        
        {/* Deload Indicator */}
        {isDeloadWeek && (
          <View style={styles.deloadTag}>
            <Text style={styles.deloadTagText}>{t.deloadWeek}</Text>
          </View>
        )}
      </View>

      {/* Week Selector */}
      <Text style={[styles.sectionTitle, textStyle]}>{t.weeklyProgress}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.weekSelector}>
        {Array.from({ length: 12 }, (_, i) => i + 1).map((w) => {
          const isSelected = w === currentWeek;
          const isDeload = w % 4 === 0;
          return (
            <Pressable
              key={w}
              onPress={() => setWeek(w)}
              style={[
                styles.weekButton,
                {
                  backgroundColor: isSelected
                    ? '#007AFF'
                    : isDeload
                    ? (isDark ? '#2C1D0F' : '#FFF3E0')
                    : (isDark ? '#1C1C1E' : '#FFFFFF'),
                  borderColor: isSelected
                    ? '#007AFF'
                    : isDeload
                    ? '#FFE0B2'
                    : (isDark ? '#2C2C2E' : '#E5E5EA')
                }
              ]}
            >
              <Text
                style={[
                  styles.weekButtonText,
                  {
                    color: isSelected
                      ? '#FFFFFF'
                      : isDeload
                      ? '#E65100'
                      : (isDark ? '#FFFFFF' : '#1C1C1E'),
                    fontWeight: isSelected ? '700' : '500'
                  }
                ]}
              >
                {t.week(w)}
              </Text>
              {isDeload && (
                <Text
                  style={[
                    styles.weekButtonSubtext,
                    { color: isSelected ? '#E0F2FE' : '#F57C00' }
                  ]}
                >
                  {t.deload}
                </Text>
              )}
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Stock Warning Box */}
      <StockWarning lowStockItems={lowStockItems} />

      {/* Quick Summary Cards Grid */}
      <View style={styles.grid}>
        {/* Today's Workout Progress */}
        <View style={cardStyle}>
          <View style={styles.cardHeader}>
            <Ionicons name="fitness-outline" size={20} color="#007AFF" />
            <Text style={[styles.cardTitle, textStyle]}>{t.todayWorkout}</Text>
          </View>
          <Text style={[styles.cardSubtitle, secondaryTextStyle]}>
            {todayWorkout ? `${tc(todayWorkout.name)} (${tc(todayTrainingDay)})` : t.restDayToday}
          </Text>
          {todayWorkout ? (
            <ProgressBar progress={workoutCompletion} color="#007AFF" label={t.completionRate} />
          ) : (
            <View style={styles.restDayContainer}>
              <Text style={styles.restDayText}>{t.restDayMessage}</Text>
            </View>
          )}
        </View>

        {/* Today's Macro & Calories Progress */}
        <View style={cardStyle}>
          <View style={styles.cardHeader}>
            <Ionicons name="pie-chart-outline" size={20} color="#34C759" />
            <Text style={[styles.cardTitle, textStyle]}>{t.nutritionMacros}</Text>
          </View>
          <View style={styles.macroProgressContainer}>
            <View style={{ flex: 1 }}>
              <ProgressBar
                progress={calorieProgress}
                color="#FF9500"
                label={`${t.calories}: ${caloriesConsumed} / ${dailyCalorieTarget} kcal`}
              />
            </View>
            <View style={{ flex: 1, marginTop: Spacing.two }}>
              <ProgressBar
                progress={proteinProgress}
                color="#34C759"
                label={`${t.protein}: ${proteinConsumed} / ${dailyProteinTarget} g`}
              />
            </View>
          </View>
        </View>

        {/* Weekly Shopping Budget */}
        <View style={cardStyle}>
          <View style={styles.cardHeader}>
            <Ionicons name="cart-outline" size={20} color="#AF52DE" />
            <Text style={[styles.cardTitle, textStyle]}>{t.weeklyBudgetStatus}</Text>
          </View>
          <Text style={[styles.cardSubtitle, secondaryTextStyle]}>
            {t.spentOfLimit(weeklyBudgetSpent, weeklyBudgetLimit)}
          </Text>
          <ProgressBar progress={budgetProgress} color="#AF52DE" label={t.budgetUsage} />
          <Text style={[styles.budgetRemainingText, { color: budgetRemaining < 300 ? '#FF3B30' : '#34C759' }]}>
            {t.remainingBudget(budgetRemaining)}
          </Text>
        </View>
      </View>

      {/* Weight Tracker Section */}
      <Text style={[styles.sectionTitle, textStyle]}>{t.weightTracking}</Text>
      <View style={cardStyle}>
        <Text style={[styles.weightTitle, textStyle]}>{t.enterWeeklyWeight}</Text>
        <Text style={[styles.weightDescription, secondaryTextStyle]}>
          {t.weightDescription}
        </Text>
        
        <View style={styles.weightForm}>
          <TextInput
            style={[
              styles.weightInput,
              {
                backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7',
                borderColor: isDark ? '#3C3C3E' : '#E5E5EA',
                color: isDark ? '#FFFFFF' : '#000000'
              }
            ]}
            placeholder={t.weightPlaceholder}
            placeholderTextColor="#8E8E93"
            keyboardType="decimal-pad"
            value={weightInput}
            onChangeText={setWeightInput}
          />
          <Pressable style={styles.weightSubmitButton} onPress={handleAddWeight}>
            <Text style={styles.weightSubmitButtonText}>{t.save}</Text>
          </Pressable>
        </View>

        <Text style={[styles.historyTitle, textStyle]}>{t.weightHistory}</Text>
        {weightHistory.length === 0 ? (
          <Text style={[styles.emptyText, secondaryTextStyle]}>{t.noRecords}</Text>
        ) : (
          <View style={styles.historyList}>
            {[...weightHistory].reverse().map((record, index) => (
              <View
                key={record.date + index}
                style={[
                  styles.historyRow,
                  { borderBottomColor: isDark ? '#2C2C2E' : '#E5E5EA' }
                ]}
              >
                <Text style={[styles.historyDate, secondaryTextStyle]}>
                  {new Date(record.date).toLocaleDateString(t.locale)}
                </Text>
                <Text style={[styles.historyWeight, textStyle]}>{record.weight.toFixed(1)} kg</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Spacing.four,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.four,
  },
  dateText: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: Spacing.half,
  },
  deloadTag: {
    backgroundColor: '#FF9500',
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: 8,
  },
  deloadTagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: Spacing.four,
    marginBottom: Spacing.three,
  },
  weekSelector: {
    flexDirection: 'row',
    marginBottom: Spacing.three,
  },
  weekButton: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  weekButtonText: {
    fontSize: 14,
  },
  weekButtonSubtext: {
    fontSize: 9,
    fontWeight: '700',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  grid: {
    gap: Spacing.three,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: Spacing.four,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardSubtitle: {
    fontSize: 13,
    marginBottom: Spacing.two,
  },
  restDayContainer: {
    paddingVertical: Spacing.two,
    alignItems: 'center',
  },
  restDayText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#8E8E93',
  },
  macroProgressContainer: {
    width: '100%',
  },
  budgetRemainingText: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: Spacing.one,
  },
  weightTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing.one,
  },
  weightDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: Spacing.three,
  },
  weightForm: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginBottom: Spacing.four,
  },
  weightInput: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    fontSize: 15,
  },
  weightSubmitButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: Spacing.four,
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weightSubmitButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
  historyTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: Spacing.two,
  },
  emptyText: {
    fontSize: 13,
    fontStyle: 'italic',
  },
  historyList: {
    width: '100%',
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.two,
    borderBottomWidth: 1,
  },
  historyDate: {
    fontSize: 13,
  },
  historyWeight: {
    fontSize: 14,
    fontWeight: '600',
  },
});
