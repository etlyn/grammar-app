import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { DimensionValue } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  PASSING_ACCURACY,
  REQUIRED_QUIZ_ITEMS,
} from '@grammar/constants/learning';
import type { QuizChoice, QuizItem } from '@grammar/types/grammar';
import { buildQuizSessionItems, cleanQuizPrompt } from '@grammar/utils/quiz';
import { AppBackground } from '@/components/AppBackground';
import { FeatherIcon } from '@/components/icons/FeatherIcon';
import { GlassCard } from '@/components/GlassCard';
import { useLearning } from '@/providers/LearningProvider';
import { useAppTheme } from '@/theme/colors';

type AnswerRecord = {
  item: QuizItem;
  selectedAnswer: QuizChoice['id'];
  isCorrect: boolean;
};

const buildSessionItems = (
  items: readonly QuizItem[],
  answeredItemIds: readonly string[] = [],
) =>
  buildQuizSessionItems({
    items,
    answeredItemIds,
    count: REQUIRED_QUIZ_ITEMS,
  });

export const PracticeScreen = () => {
  const theme = useAppTheme();
  const { activeTopic, progressForActiveTopic, recordAttempt, resetTopic } =
    useLearning();
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<QuizChoice['id'] | null>(
    null,
  );
  const [sessionComplete, setSessionComplete] = useState(false);
  const [sessionItems, setSessionItems] = useState<QuizItem[]>([]);
  const progressRef = useRef(progressForActiveTopic);

  useEffect(() => {
    progressRef.current = progressForActiveTopic;
  }, [progressForActiveTopic]);

  useEffect(() => {
    if (!activeTopic) {
      setSessionItems([]);
      return;
    }

    setSessionItems(
      buildSessionItems(
        activeTopic.quizItems,
        progressRef.current?.answeredItemIds,
      ),
    );
    setAnswers([]);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setSessionComplete(false);
  }, [activeTopic]);

  const currentItem = sessionItems[currentIndex];
  const correctAnswers = useMemo(
    () => answers.filter(answer => answer.isCorrect).length,
    [answers],
  );
  const sessionScore = answers.length
    ? Math.round((correctAnswers / answers.length) * 100)
    : 0;
  const progressWidth: DimensionValue = sessionItems.length
    ? (`${
        ((currentIndex + Number(Boolean(selectedAnswer))) /
          sessionItems.length) *
        100
      }%` as DimensionValue)
    : '0%';

  const chooseAnswer = async (choiceId: QuizChoice['id']) => {
    if (!activeTopic || !currentItem || selectedAnswer) {
      return;
    }

    const isCorrect = choiceId === currentItem.answerId;
    setSelectedAnswer(choiceId);
    setAnswers(current => [
      ...current,
      { item: currentItem, selectedAnswer: choiceId, isCorrect },
    ]);

    await recordAttempt({
      topicSlug: activeTopic.slug,
      quizItemId: currentItem.id,
      selectedAnswer: choiceId,
      correctAnswer: currentItem.answerId,
      isCorrect,
    });
  };

  const next = () => {
    setSelectedAnswer(null);

    if (currentIndex + 1 >= sessionItems.length) {
      setSessionComplete(true);
      return;
    }

    setCurrentIndex(index => index + 1);
  };

  const restart = () => {
    if (!activeTopic) {
      return;
    }

    setSessionItems(
      buildSessionItems(
        activeTopic.quizItems,
        progressForActiveTopic?.answeredItemIds,
      ),
    );
    setAnswers([]);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setSessionComplete(false);
  };

  if (!activeTopic || !currentItem) {
    return (
      <View style={styles.screen}>
        <AppBackground />
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <GlassCard style={styles.emptyCard}>
            <Text
              style={[styles.emptyText, { color: theme.colors.textSecondary }]}
            >
              No practice items are available.
            </Text>
          </GlassCard>
        </SafeAreaView>
      </View>
    );
  }

  if (sessionComplete) {
    const passed =
      answers.length >= REQUIRED_QUIZ_ITEMS && sessionScore >= PASSING_ACCURACY;

    return (
      <View style={styles.screen}>
        <AppBackground />
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <GlassCard style={styles.completeCard}>
              <FeatherIcon
                color={passed ? theme.colors.success : theme.colors.warning}
                name={passed ? 'award' : 'target'}
                size={34}
              />
              <Text
                style={[
                  styles.completeTitle,
                  { color: theme.colors.textPrimary },
                ]}
              >
                You scored {correctAnswers}/{answers.length}
              </Text>
              <Text
                style={[
                  styles.completeCopy,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {passed
                  ? 'This topic is complete.'
                  : 'Review the answers, then take another pass.'}
              </Text>
              <View style={styles.actionRow}>
                <Pressable
                  onPress={restart}
                  style={[
                    styles.primaryButton,
                    { backgroundColor: theme.colors.accent },
                  ]}
                >
                  <FeatherIcon
                    color={theme.colors.textInverse}
                    name="rotate-ccw"
                    size={18}
                  />
                  <Text
                    style={[
                      styles.primaryButtonText,
                      { color: theme.colors.textInverse },
                    ]}
                  >
                    Again
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => resetTopic(activeTopic.slug)}
                  style={[
                    styles.secondaryButton,
                    { borderColor: theme.colors.borderStrong },
                  ]}
                >
                  <Text
                    style={[
                      styles.secondaryButtonText,
                      { color: theme.colors.accent },
                    ]}
                  >
                    Reset
                  </Text>
                </Pressable>
              </View>
            </GlassCard>
            {answers.map(answer => (
              <GlassCard
                key={answer.item.id}
                elevated={false}
                style={styles.reviewCard}
              >
                <Text
                  style={[
                    styles.reviewPrompt,
                    { color: theme.colors.textPrimary },
                  ]}
                >
                  {cleanQuizPrompt(answer.item.prompt)}
                </Text>
                <Text
                  style={[
                    styles.reviewMeta,
                    {
                      color: answer.isCorrect
                        ? theme.colors.success
                        : theme.colors.danger,
                    },
                  ]}
                >
                  Your answer: {answer.selectedAnswer}. Correct answer:{' '}
                  {answer.item.answerId}.
                </Text>
                <Text
                  style={[
                    styles.reviewExplanation,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  {answer.item.explanation}
                </Text>
              </GlassCard>
            ))}
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <AppBackground />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View>
              <Text style={[styles.kicker, { color: theme.colors.accent }]}>
                {activeTopic.level} practice
              </Text>
              <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
                {activeTopic.title}
              </Text>
            </View>
            <Text style={[styles.counter, { color: theme.colors.textMuted }]}>
              {currentIndex + 1}/{sessionItems.length}
            </Text>
          </View>
          <View
            style={[
              styles.progressTrack,
              { backgroundColor: theme.colors.surfaceMuted },
            ]}
          >
            <View
              style={[
                styles.progressFill,
                { backgroundColor: theme.colors.accent, width: progressWidth },
              ]}
            />
          </View>
          <GlassCard style={styles.promptCard}>
            <Text style={[styles.prompt, { color: theme.colors.textPrimary }]}>
              {cleanQuizPrompt(currentItem.prompt)}
            </Text>
          </GlassCard>
          <View style={styles.choiceList}>
            {currentItem.choices.map(choice => {
              const isSelected = selectedAnswer === choice.id;
              const isCorrect = choice.id === currentItem.answerId;
              const showResult = Boolean(selectedAnswer);
              const borderColor =
                showResult && isCorrect
                  ? theme.colors.success
                  : isSelected
                  ? theme.colors.danger
                  : theme.colors.border;

              return (
                <Pressable
                  disabled={Boolean(selectedAnswer)}
                  key={choice.id}
                  onPress={() => chooseAnswer(choice.id)}
                  style={[
                    styles.choice,
                    {
                      backgroundColor: theme.colors.glassStrong,
                      borderColor,
                    },
                  ]}
                >
                  <View style={[styles.choiceId, { borderColor }]}>
                    <Text style={[styles.choiceIdText, { color: borderColor }]}>
                      {choice.id}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.choiceText,
                      { color: theme.colors.textPrimary },
                    ]}
                  >
                    {choice.text}
                  </Text>
                  {showResult && isCorrect ? (
                    <FeatherIcon
                      color={theme.colors.success}
                      name="check"
                      size={18}
                    />
                  ) : null}
                  {showResult && isSelected && !isCorrect ? (
                    <FeatherIcon
                      color={theme.colors.danger}
                      name="x"
                      size={18}
                    />
                  ) : null}
                </Pressable>
              );
            })}
          </View>
          {selectedAnswer ? (
            <GlassCard elevated={false} style={styles.feedbackCard}>
              <Text
                style={[
                  styles.feedbackTitle,
                  {
                    color:
                      selectedAnswer === currentItem.answerId
                        ? theme.colors.success
                        : theme.colors.danger,
                  },
                ]}
              >
                {selectedAnswer === currentItem.answerId
                  ? 'Correct'
                  : 'Not quite'}
              </Text>
              <Text
                style={[
                  styles.feedbackText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {currentItem.explanation}
              </Text>
              <Pressable
                onPress={next}
                style={[
                  styles.nextButton,
                  { backgroundColor: theme.colors.accent },
                ]}
              >
                <Text
                  style={[
                    styles.primaryButtonText,
                    { color: theme.colors.textInverse },
                  ]}
                >
                  Next
                </Text>
                <FeatherIcon
                  color={theme.colors.textInverse}
                  name="arrow-right"
                  size={18}
                />
              </Pressable>
            </GlassCard>
          ) : null}
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
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  kicker: {
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 25,
    fontWeight: '900',
    lineHeight: 31,
    marginTop: 6,
    maxWidth: 280,
  },
  counter: {
    fontSize: 13,
    fontWeight: '900',
    marginTop: 6,
  },
  progressTrack: {
    borderRadius: 999,
    height: 9,
    marginBottom: 18,
    overflow: 'hidden',
  },
  progressFill: {
    borderRadius: 999,
    height: '100%',
  },
  promptCard: {
    padding: 22,
  },
  prompt: {
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 32,
  },
  choiceList: {
    gap: 10,
    marginTop: 16,
  },
  choice: {
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 62,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  choiceId: {
    alignItems: 'center',
    borderRadius: 13,
    borderWidth: 1,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  choiceIdText: {
    fontSize: 13,
    fontWeight: '900',
  },
  choiceText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 21,
  },
  feedbackCard: {
    marginTop: 16,
    padding: 18,
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: '900',
  },
  feedbackText: {
    fontSize: 14,
    lineHeight: 21,
    marginTop: 6,
  },
  nextButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 17,
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  completeCard: {
    alignItems: 'flex-start',
    padding: 22,
  },
  completeTitle: {
    fontSize: 28,
    fontWeight: '900',
    marginTop: 12,
  },
  completeCopy: {
    fontSize: 15,
    lineHeight: 22,
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
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 13,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '900',
  },
  reviewCard: {
    marginTop: 12,
    padding: 16,
  },
  reviewPrompt: {
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 22,
  },
  reviewMeta: {
    fontSize: 13,
    fontWeight: '900',
    marginTop: 8,
  },
  reviewExplanation: {
    fontSize: 13,
    lineHeight: 20,
    marginTop: 6,
  },
  emptyCard: {
    margin: 20,
    padding: 24,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '800',
  },
});
