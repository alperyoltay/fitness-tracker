import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language, Translation, translations, translateContent, detectDeviceLanguage } from './translations';

const STORAGE_KEY = 'app_language';

interface LanguageContextValue {
  language: Language;
  t: Translation;
  tc: (text: string) => string;
  setLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  language: 'tr',
  t: translations.tr,
  tc: (text) => text,
  setLanguage: () => {},
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(detectDeviceLanguage());

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored === 'tr' || stored === 'en') setLanguageState(stored);
      })
      .catch(() => {});
  }, []);

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  }, []);

  const tc = useCallback((text: string) => translateContent(language, text), [language]);

  return (
    <LanguageContext.Provider value={{ language, t: translations[language], tc, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

export const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();
  return (
    <Pressable
      onPress={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
      style={({ pressed }) => [styles.toggle, pressed && { opacity: 0.6 }]}
      accessibilityRole="button"
      accessibilityLabel={language === 'tr' ? 'Switch to English' : 'Türkçeye geç'}
    >
      <Text style={styles.toggleText}>{language === 'tr' ? 'EN' : 'TR'}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  toggle: {
    marginRight: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  toggleText: {
    color: '#007AFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
