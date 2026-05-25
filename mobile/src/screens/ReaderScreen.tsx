import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { REQUIRED_QUIZ_ITEMS } from '@grammar/constants/learning';
import { AppBackground } from '@/components/AppBackground';
import { GlassCard } from '@/components/GlassCard';
import { useLearning } from '@/providers/LearningProvider';
import { useAppTheme } from '@/theme/colors';

export const ReaderScreen = () => {
  const theme = useAppTheme();
  const { activeTopic, progressForActiveTopic } = useLearning();
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
          {activeTopic ? (
            <>
              <GlassCard style={styles.summaryCard}>
                <View style={styles.summaryTopRow}>
                  <Text style={[styles.kicker, { color: theme.colors.accent }]}>
                    {activeTopic.level} grammar
                  </Text>
                  <Text
                    style={[
                      styles.statusText,
                      { color: theme.colors.textMuted },
                    ]}
                  >
                    {progressForActiveTopic?.isCompleted
                      ? 'Complete'
                      : `${answered}/${REQUIRED_QUIZ_ITEMS}`}
                  </Text>
                </View>
                <Text
                  style={[styles.title, { color: theme.colors.textPrimary }]}
                >
                  {activeTopic.title}
                </Text>
                <Text
                  style={[
                    styles.summary,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  {activeTopic.summary}
                </Text>
              </GlassCard>

              <View style={styles.sectionBlock}>
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: theme.colors.textPrimary },
                  ]}
                >
                  Study focus
                </Text>
                <Text
                  style={[
                    styles.bodyText,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  {activeTopic.guidance}
                </Text>
                <View style={styles.goalList}>
                  {activeTopic.learningGoals.map(goal => (
                    <View
                      key={goal}
                      style={[
                        styles.goalPill,
                        { backgroundColor: theme.colors.accentSoft },
                      ]}
                    >
                      <Text
                        style={[
                          styles.goalText,
                          { color: theme.colors.accent },
                        ]}
                      >
                        {goal}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.sectionBlock}>
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: theme.colors.textPrimary },
                  ]}
                >
                  Rules
                </Text>
                {activeTopic.rules.map(rule => (
                  <GlassCard
                    key={rule.title}
                    elevated={false}
                    style={styles.ruleCard}
                  >
                    <Text
                      style={[
                        styles.ruleTitle,
                        { color: theme.colors.textPrimary },
                      ]}
                    >
                      {rule.title}
                    </Text>
                    <Text
                      style={[
                        styles.bodyText,
                        { color: theme.colors.textSecondary },
                      ]}
                    >
                      {rule.explanation}
                    </Text>
                    <View style={styles.examplesList}>
                      {rule.examples.map(example => (
                        <Text
                          key={example}
                          style={[
                            styles.exampleText,
                            {
                              color: theme.colors.textPrimary,
                              backgroundColor: theme.colors.surfaceMuted,
                            },
                          ]}
                        >
                          {example}
                        </Text>
                      ))}
                    </View>
                    {rule.commonMistakes?.length ? (
                      <View
                        style={[
                          styles.mistakeBox,
                          { backgroundColor: theme.colors.accentSoft },
                        ]}
                      >
                        <Text
                          style={[
                            styles.mistakeTitle,
                            { color: theme.colors.warning },
                          ]}
                        >
                          Common mistake
                        </Text>
                        {rule.commonMistakes.map(mistake => (
                          <Text
                            key={mistake}
                            style={[
                              styles.mistakeText,
                              { color: theme.colors.textSecondary },
                            ]}
                          >
                            {mistake}
                          </Text>
                        ))}
                      </View>
                    ) : null}
                  </GlassCard>
                ))}
              </View>

              <View style={styles.sectionBlock}>
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: theme.colors.textPrimary },
                  ]}
                >
                  Practice tips
                </Text>
                {activeTopic.tips.map(tip => (
                  <View
                    key={tip}
                    style={[
                      styles.tipRow,
                      {
                        backgroundColor: theme.colors.glass,
                        borderColor: theme.colors.glassBorder,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.tipText,
                        { color: theme.colors.textSecondary },
                      ]}
                    >
                      {tip}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          ) : (
            <GlassCard style={styles.summaryCard}>
              <Text
                style={[styles.bodyText, { color: theme.colors.textSecondary }]}
              >
                No grammar topic is selected.
              </Text>
            </GlassCard>
          )}
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
  summaryCard: {
    padding: 22,
  },
  summaryTopRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  kicker: {
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '900',
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    lineHeight: 36,
    marginTop: 12,
  },
  summary: {
    fontSize: 15,
    lineHeight: 23,
    marginTop: 10,
  },
  sectionBlock: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: '900',
    marginBottom: 12,
  },
  bodyText: {
    fontSize: 15,
    lineHeight: 23,
  },
  goalList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },
  goalPill: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  goalText: {
    fontSize: 13,
    fontWeight: '900',
  },
  ruleCard: {
    marginBottom: 12,
    padding: 18,
  },
  ruleTitle: {
    fontSize: 17,
    fontWeight: '900',
    marginBottom: 8,
  },
  examplesList: {
    gap: 8,
    marginTop: 12,
  },
  exampleText: {
    borderRadius: 16,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    padding: 12,
  },
  mistakeBox: {
    borderRadius: 16,
    marginTop: 12,
    padding: 12,
  },
  mistakeTitle: {
    fontSize: 13,
    fontWeight: '900',
    marginBottom: 4,
  },
  mistakeText: {
    fontSize: 13,
    lineHeight: 19,
  },
  tipRow: {
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 9,
    padding: 14,
  },
  tipText: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
});
