import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { NavigationContainer, type RouteProp } from '@react-navigation/native';
import {
  createBottomTabNavigator,
  type BottomTabNavigationOptions,
} from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';

import { FeatherIcon } from '@/components/icons/FeatherIcon';
import { HomeScreen } from '@/screens/HomeScreen';
import { PracticeScreen } from '@/screens/PracticeScreen';
import { ReaderScreen } from '@/screens/ReaderScreen';
import { TopicsScreen } from '@/screens/TopicsScreen';
import { LearningProvider } from '@/providers/LearningProvider';
import { PreferencesProvider } from '@/providers/PreferencesProvider';
import { useAppTheme, type AppTheme } from '@/theme/colors';
import type { RootTabParamList } from '@/types/navigation';

enableScreens();

const Tab = createBottomTabNavigator<RootTabParamList>();

const tabIcons: Record<keyof RootTabParamList, string> = {
  Home: 'home',
  Topics: 'layers',
  Practice: 'play-circle',
  Reader: 'book-open',
};

const buildScreenOptions =
  (theme: AppTheme) =>
  ({
    route,
  }: {
    route: RouteProp<RootTabParamList, keyof RootTabParamList>;
  }): BottomTabNavigationOptions => ({
    headerShown: false,
    tabBarHideOnKeyboard: true,
    tabBarActiveTintColor: theme.colors.accent,
    tabBarInactiveTintColor: theme.colors.textMuted,
    tabBarLabelStyle: styles.tabLabel,
    tabBarStyle: [
      styles.tabBar,
      {
        backgroundColor: theme.colors.tabBarBackground,
        borderTopColor: theme.colors.tabBarBorder,
      },
    ],
    tabBarIcon: ({ color, size }) => (
      <FeatherIcon name={tabIcons[route.name]} size={size} color={color} />
    ),
  });

const RootNavigator = () => {
  const theme = useAppTheme();
  const screenOptions = React.useMemo(() => buildScreenOptions(theme), [theme]);

  return (
    <NavigationContainer theme={theme.navigationTheme}>
      <StatusBar
        barStyle={theme.statusBarStyle}
        backgroundColor="transparent"
        translucent
      />
      <Tab.Navigator screenOptions={screenOptions}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Topics" component={TopicsScreen} />
        <Tab.Screen name="Practice" component={PracticeScreen} />
        <Tab.Screen name="Reader" component={ReaderScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const App = () => (
  <GestureHandlerRootView style={styles.root}>
    <SafeAreaProvider>
      <PreferencesProvider>
        <LearningProvider>
          <RootNavigator />
        </LearningProvider>
      </PreferencesProvider>
    </SafeAreaProvider>
  </GestureHandlerRootView>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  tabBar: {
    borderTopWidth: StyleSheet.hairlineWidth,
    height: 70,
    paddingBottom: 10,
    paddingTop: 8,
    position: 'absolute',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '800',
  },
});

export default App;
