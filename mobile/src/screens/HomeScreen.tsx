import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { REQUIRED_QUIZ_ITEMS } from '@grammar/constants/learning';
import { AppBackground } from '@/components/AppBackground';
import { FeatherIcon } from '@/components/icons/FeatherIcon';
import { GlassCard } from '@/components/GlassCard';
import { MetricBadge } from '@/components/MetricBadge';
import { useLearning } from '@/providers/LearningProvider';
import { usePreferences } from '@/providers/PreferencesProvider';
import { useAppTheme } from '@/theme/colors';
import type { RootTabParamList } from '@/types/navigation';
import grammachoLogo from '@/assets/grammacho-logo.png';

type HomeNavigation = BottomTabNavigationProp<RootTabParamList, 'Home'>;

export const HomeScreen = () => {
  const navigation = useNavigation<HomeNavigation>();
  const theme = useAppTheme();
  const { themeMode, toggleTheme } = usePreferences();
  const { activeTopic, progressForActiveTopic, topics, totals } = useLearning();
  const recentTopics = topics.slice(0, 4);
  const answered = Math.min(
    progressForActiveTopic?.total ?? 0,
    REQUIRED_QUIZ_ITEMS,
  );

  return (
    <View style={styles.screen}>
      <AppBackground />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.brandRow}>
              <View
                style={[
                  styles.brandMark,
                  { backgroundColor: theme.colors.surface },
                ]}
              >
                <Image
                  accessibilityIgnoresInvertColors
                  source={grammachoLogo}
                  style={styles.brandLogo}
                />
              </View>
              <View>
                <Text
                  style={[styles.kicker, { color: theme.colors.textMuted }]}
                >
                  Practice first
                </Text>
                <Text
                  style={[styles.title, { color: theme.colors.textPrimary }]}
                >
                  Grammacho
                </Text>
              </View>
            </View>
            <Pressable
              accessibilityLabel="Toggle theme"
              onPress={toggleTheme}
              style={[
                styles.iconButton,
                {
                  backgroundColor: theme.colors.glassStrong,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <FeatherIcon
                color={theme.colors.textPrimary}
                name={themeMode === 'Light' ? 'moon' : 'sun'}
                size={19}
              />
            </Pressable>
          </View>

          <GlassCard style={styles.heroCard}>
            <Text style={[styles.heroEyebrow, { color: theme.colors.accent }]}>
              CEFR grammar trainer
            </Text>
            <Text
              style={[styles.heroTitle, { color: theme.colors.textPrimary }]}
            >
              Tiny lessons, focused practice.
            </Text>
            <Text
              style={[styles.heroCopy, { color: theme.colors.textSecondary }]}
            >
              Move through the same grammar curriculum as the web app with a
              calm mobile flow.
            </Text>
            <View style={styles.metricRow}>
              <MetricBadge label="Done" value={totals.completedTopics} />
              <MetricBadge label="Answers" value={totals.totalAnswers} />
              <MetricBadge label="Accuracy" value={`${totals.accuracy}%`} />
            </View>
          </GlassCard>

          {activeTopic ? (
            <GlassCard style={styles.topicCard}>
              <View style={styles.topicHeader}>
                <View
                  style={[
                    styles.levelPill,
                    { backgroundColor: theme.colors.accentSoft },
                  ]}
                >
                  <Text
                    style={[styles.levelText, { color: theme.colors.accent }]}
                  >
                    {activeTopic.level}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.topicStatus,
                    { color: theme.colors.textMuted },
                  ]}
                >
                  {progressForActiveTopic?.isCompleted
                    ? 'Complete'
                    : `${answered}/${REQUIRED_QUIZ_ITEMS} answered`}
                </Text>
              </View>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: theme.colors.textPrimary },
                ]}
              >
                {activeTopic.title}
              </Text>
              <Text
                style={[
                  styles.topicSummary,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {activeTopic.summary}
              </Text>
              <View style={styles.actionRow}>
                <Pressable
                  onPress={() => navigation.navigate('Practice')}
                  style={[
                    styles.primaryButton,
                    { backgroundColor: theme.colors.accent },
                  ]}
                >
                  <FeatherIcon
                    color={theme.colors.textInverse}
                    name="play-circle"
                    size={18}
                  />
                  <Text
                    style={[
                      styles.primaryButtonText,
                      { color: theme.colors.textInverse },
                    ]}
                  >
                    Practice
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => navigation.navigate('Reader')}
                  style={[
                    styles.secondaryButton,
                    { borderColor: theme.colors.borderStrong },
                  ]}
                >
                  <FeatherIcon
                    color={theme.colors.accent}
                    name="book-open"
                    size={18}
                  />
                  <Text
                    style={[
                      styles.secondaryButtonText,
                      { color: theme.colors.accent },
                    ]}
                  >
                    Read
                  </Text>
                </Pressable>
              </View>
            </GlassCard>
          ) : null}

          <View style={styles.sectionHeader}>
            <Text
              style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}
            >
              Start points
            </Text>
            <Pressable onPress={() => navigation.navigate('Topics')}>
              <Text style={[styles.linkText, { color: theme.colors.accent }]}>
                All topics
              </Text>
            </Pressable>
          </View>
          {recentTopics.map(topic => (
            <Pressable
              key={topic.slug}
              onPress={() => navigation.navigate('Topics')}
              style={[
                styles.topicRow,
                {
                  backgroundColor: theme.colors.glass,
                  borderColor: theme.colors.glassBorder,
                },
              ]}
            >
              <View
                style={[
                  styles.smallLevel,
                  { backgroundColor: theme.colors.accentSoft },
                ]}
              >
                <Text
                  style={[
                    styles.smallLevelText,
                    { color: theme.colors.accent },
                  ]}
                >
                  {topic.level}
                </Text>
              </View>
              <View style={styles.topicRowText}>
                <Text
                  style={[
                    styles.topicRowTitle,
                    { color: theme.colors.textPrimary },
                  ]}
                >
                  {topic.title}
                </Text>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.topicRowSummary,
                    { color: theme.colors.textMuted },
                  ]}
                >
                  {topic.summary}
                </Text>
              </View>
              <FeatherIcon
                color={theme.colors.textMuted}
                name="chevron-right"
                size={18}
              />
            </Pressable>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    paddingBottom: 104,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  brandRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  brandMark: {
    alignItems: 'center',
    borderRadius: 18,
    height: 46,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 46,
  },
  brandLogo: {
    height: 46,
    width: 46,
  },
  kicker: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
  },
  iconButton: {
    alignItems: 'center',
    borderRadius: 15,
    borderWidth: 1,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  heroCard: {
    padding: 22,
  },
  heroEyebrow: {
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '900',
    lineHeight: 37,
    marginTop: 8,
  },
  heroCopy: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
  },
  metricRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 18,
  },
  topicCard: {
    marginTop: 16,
    padding: 20,
  },
  topicHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  levelPill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '900',
  },
  topicStatus: {
    fontSize: 12,
    fontWeight: '800',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
  },
  topicSummary: {
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  primaryButton: {
    alignItems: 'center',
    borderRadius: 18,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 13,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '900',
  },
  secondaryButton: {
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 13,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '900',
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 24,
  },
  linkText: {
    fontSize: 13,
    fontWeight: '900',
  },
  topicRow: {
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
    padding: 14,
  },
  smallLevel: {
    alignItems: 'center',
    borderRadius: 14,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  smallLevelText: {
    fontSize: 12,
    fontWeight: '900',
  },
  topicRowText: {
    flex: 1,
  },
  topicRowTitle: {
    fontSize: 15,
    fontWeight: '900',
  },
  topicRowSummary: {
    fontSize: 12,
    marginTop: 3,
  },
});
