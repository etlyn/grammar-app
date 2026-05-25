import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { ThemeMode } from '@/theme/colors';

interface PreferencesContextValue {
  hydrated: boolean;
  themeMode: ThemeMode;
  toggleTheme: () => void;
}

const THEME_MODE_KEY = 'grammacho:theme-mode';

const PreferencesContext = createContext<PreferencesContextValue>({
  hydrated: false,
  themeMode: 'Light',
  toggleTheme: () => undefined,
});

export const PreferencesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>('Light');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const hydrate = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(THEME_MODE_KEY);

        if (!isMounted) {
          return;
        }

        if (storedTheme === 'Light' || storedTheme === 'Dark') {
          setThemeMode(storedTheme);
        }
      } catch (error) {
        console.warn('Failed to hydrate preferences', error);
      } finally {
        if (isMounted) {
          setHydrated(true);
        }
      }
    };

    hydrate();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    AsyncStorage.setItem(THEME_MODE_KEY, themeMode).catch(error => {
      console.warn('Failed to store theme preference', error);
    });
  }, [hydrated, themeMode]);

  const toggleTheme = useCallback(() => {
    setThemeMode(current => (current === 'Light' ? 'Dark' : 'Light'));
  }, []);

  const value = useMemo(
    () => ({
      hydrated,
      themeMode,
      toggleTheme,
    }),
    [hydrated, themeMode, toggleTheme],
  );

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => useContext(PreferencesContext);
