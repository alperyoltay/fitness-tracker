import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Platform, Vibration } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../store/appStore';
import { TrainingDay, Exercise } from '../types';
import { Spacing } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { useLanguage } from '../i18n/LanguageContext';

export default function WorkoutScreen() {
  const { t, tc } = useLanguage();
  const safeAreaInsets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const {
    currentWeek,
    isDeloadWeek,
    workouts,
    activeDay,
    toggleExercise,
  } = useAppStore();

  // Set local state for active workout day selection
  const [selectedDay, setSelectedDay] = useState<TrainingDay>(activeDay);

  // Active Timer state
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [timerMax, setTimerMax] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(null);
  
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-expand current day on load
  useEffect(() => {
    // Determine today's day of week
    const dayIndex = new Date().getDay();
    const days = [
      TrainingDay.PAZAR,
      TrainingDay.PAZARTESI,
      TrainingDay.SALI,
      TrainingDay.CARSAMBA,
      TrainingDay.PERSEMBE,
      TrainingDay.CUMA,
      TrainingDay.CUMARTESI
    ];
    setSelectedDay(days[dayIndex]);
  }, []);

  // Timer countdown engine
  useEffect(() => {
    if (timerActive && timerSeconds > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            // Timer finished
            setTimerActive(false);
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
            triggerVibrationAlert();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [timerActive, timerSeconds]);

  const triggerVibrationAlert = () => {
    if (Platform.OS !== 'web') {
      Vibration.vibrate([0, 500, 200, 500]);
    } else {
      // Custom soft web notification or beep
      const synth = window.speechSynthesis;
      if (synth) {
        const utterance = new SpeechSynthesisUtterance(t.restFinishedSpeech);
        utterance.lang = t.locale;
        synth.speak(utterance);
      } else {
        alert(t.restFinishedAlert);
      }
    }
  };

  const startTimer = (exercise: Exercise) => {
    setActiveExerciseId(exercise.id);
    setTimerSeconds(exercise.restSeconds);
    setTimerMax(exercise.restSeconds);
    setTimerActive(true);
  };

  const toggleTimer = () => {
    setTimerActive(!timerActive);
  };

  const resetTimer = () => {
    setTimerSeconds(timerMax);
    setTimerActive(false);
  };

  const closeTimer = () => {
    setTimerActive(false);
    setTimerSeconds(0);
    setActiveExerciseId(null);
  };

  // Get active workout
  const workoutKey = `${currentWeek}_${selectedDay}`;
  const currentWorkout = workouts[workoutKey];

  // Colors
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
      {/* Horizontal Day Selector */}
      <View style={[styles.daySelectorContainer, { borderBottomColor: isDark ? '#2C2C2E' : '#E5E5EA' }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daySelector}>
          {Object.values(TrainingDay).map((day) => {
            const isSelected = day === selectedDay;
            return (
              <Pressable
                key={day}
                onPress={() => setSelectedDay(day)}
                style={[
                  styles.dayButton,
                  {
                    borderBottomColor: isSelected ? '#007AFF' : 'transparent',
                  }
                ]}
              >
                <Text
                  style={[
                    styles.dayButtonText,
                    {
                      color: isSelected ? '#007AFF' : (isDark ? '#8E8E93' : '#60646C'),
                      fontWeight: isSelected ? '700' : '500'
                    }
                  ]}
                >
                  {tc(day)}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Main Content Area */}
      <ScrollView
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: safeAreaInsets.bottom + Spacing.six + (timerSeconds > 0 ? 100 : 0) }
        ]}
      >
        {/* Workout Meta */}
        <View style={styles.workoutMeta}>
          <Text style={[styles.workoutDayName, textStyle]}>{tc(selectedDay)}</Text>
          <Text style={[styles.workoutRoutineName, secondaryTextStyle]}>
            {currentWorkout ? tc(currentWorkout.name) : t.restAndRecovery}
          </Text>
        </View>

        {/* Exercises List */}
        {!currentWorkout || currentWorkout.exercises.length === 0 ? (
          <View style={[cardStyle, styles.restCard]}>
            <Ionicons name="sunny-outline" size={48} color="#FF9500" />
            <Text style={[styles.restTitle, textStyle]}>{t.activeRestDay}</Text>
            <Text style={[styles.restSubtitle, secondaryTextStyle]}>
              {t.activeRestText}
            </Text>
          </View>
        ) : (
          <View style={styles.exercisesList}>
            {currentWorkout.exercises.map((ex) => (
              <View key={ex.id} style={cardStyle}>
                <View style={styles.exerciseHeader}>
                  {/* Custom Checkbox */}
                  <Pressable
                    onPress={() => toggleExercise(selectedDay, ex.id)}
                    style={styles.checkboxContainer}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        {
                          borderColor: ex.completed ? '#34C759' : '#C7C7CC',
                          backgroundColor: ex.completed ? '#34C759' : 'transparent'
                        }
                      ]}
                    >
                      {ex.completed && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
                    </View>
                  </Pressable>

                  {/* Exercise Title & Details */}
                  <View style={styles.exerciseMeta}>
                    <Text
                      style={[
                        styles.exerciseName,
                        textStyle,
                        ex.completed && styles.completedText
                      ]}
                    >
                      {tc(ex.name)}
                    </Text>
                    <Text style={[styles.exerciseSpecs, secondaryTextStyle]}>
                      {t.sets(ex.sets, tc(ex.reps))}
                      {ex.isCompound && ex.targetWeightKg !== undefined && (
                        <Text style={{ color: '#007AFF', fontWeight: '700' }}>
                          {" "}• {ex.targetWeightKg} kg
                        </Text>
                      )}
                    </Text>
                  </View>
                </View>

                {/* Description */}
                <Text style={[styles.exerciseDescription, secondaryTextStyle]}>
                  {tc(ex.description)}
                </Text>

                {/* Rest & Timer Button */}
                {ex.restSeconds > 0 && (
                  <View style={styles.exerciseActions}>
                    <Pressable
                      style={[
                        styles.timerButton,
                        { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' }
                      ]}
                      onPress={() => startTimer(ex)}
                    >
                      <Ionicons name="timer-outline" size={16} color="#007AFF" />
                      <Text style={styles.timerButtonText}>
                        {t.restSeconds(ex.restSeconds)}
                      </Text>
                    </Pressable>
                    
                    {ex.isCompound && (
                      <View style={styles.compoundBadge}>
                        <Text style={styles.compoundBadgeText}>{t.compoundMove}</Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Persistent Digital Timer Panel (Notion style, clean docked panel) */}
      {timerSeconds > 0 && (
        <View
          style={[
            styles.timerDockPanel,
            {
              backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
              borderTopColor: isDark ? '#2C2C2E' : '#E5E5EA',
              paddingBottom: safeAreaInsets.bottom + Spacing.two
            }
          ]}
        >
          <View style={styles.timerDockHeader}>
            <Text style={[styles.timerDockTitle, textStyle]}>{t.restTimer}</Text>
            <Pressable onPress={closeTimer}>
              <Ionicons name="close-circle" size={24} color="#8E8E93" />
            </Pressable>
          </View>

          <View style={styles.timerDockMain}>
            {/* Active digital count */}
            <Text style={[styles.digitalCountdown, { color: timerSeconds < 10 ? '#FF3B30' : '#007AFF' }]}>
              00:{timerSeconds.toString().padStart(2, '0')}
            </Text>

            {/* Play, Pause & Reset */}
            <View style={styles.timerControls}>
              <Pressable
                style={[styles.timerControlBtn, { backgroundColor: '#F2F2F7' }]}
                onPress={toggleTimer}
              >
                <Ionicons
                  name={timerActive ? 'pause' : 'play'}
                  size={20}
                  color="#007AFF"
                />
              </Pressable>

              <Pressable
                style={[styles.timerControlBtn, { backgroundColor: '#F2F2F7' }]}
                onPress={resetTimer}
              >
                <Ionicons name="refresh" size={20} color="#60646C" />
              </Pressable>
            </View>
          </View>

          {/* Simple thin progress bar representing elapsed time */}
          <View style={styles.timerProgressTrack}>
            <View
              style={[
                styles.timerProgressFill,
                {
                  width: `${(timerSeconds / timerMax) * 100}%`,
                  backgroundColor: timerSeconds < 10 ? '#FF3B30' : '#34C759'
                }
              ]}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  daySelectorContainer: {
    borderBottomWidth: 1,
  },
  daySelector: {
    flexDirection: 'row',
    paddingVertical: Spacing.one,
  },
  dayButton: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderBottomWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayButtonText: {
    fontSize: 14,
    textTransform: 'uppercase',
  },
  contentContainer: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
  },
  workoutMeta: {
    marginVertical: Spacing.three,
  },
  workoutDayName: {
    fontSize: 22,
    fontWeight: '700',
  },
  workoutRoutineName: {
    fontSize: 14,
    marginTop: 2,
  },
  exercisesList: {
    gap: Spacing.three,
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
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  checkboxContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseMeta: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  exerciseSpecs: {
    fontSize: 13,
    marginTop: 2,
  },
  exerciseDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: Spacing.two,
    marginBottom: Spacing.two,
  },
  exerciseActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.one,
  },
  timerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: 8,
  },
  timerButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
  },
  compoundBadge: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
    borderRadius: 6,
  },
  compoundBadgeText: {
    color: '#0369A1',
    fontSize: 10,
    fontWeight: '700',
  },
  restCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.six,
    gap: Spacing.three,
  },
  restTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  restSubtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: Spacing.four,
  },
  timerDockPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  timerDockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  timerDockTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  timerDockMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  digitalCountdown: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  timerControls: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  timerControlBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerProgressTrack: {
    width: '100%',
    height: 4,
    backgroundColor: '#E5E5EA',
    borderRadius: 2,
    overflow: 'hidden',
  },
  timerProgressFill: {
    height: 4,
  },
});
