import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { REQUIRED_QUIZ_ITEMS } from '@grammar/constants/learning';
import { AppBackground } from '@/components/AppBackground';
import { FeatherIcon } from '@/components/icons/FeatherIcon';
import { GlassCard } from '@/components/GlassCard';
import { useLearning } from '@/providers/LearningProvider';
import { useAppTheme } from '@/theme/colors';
import type { RootTabParamList } from '@/types/navigation';

type TopicsNavigation = BottomTabNavigationProp<RootTabParamList, 'Topics'>;

export const TopicsScreen = () => {
  const navigation = useNavigation<TopicsNavigation>();
  const theme = useAppTheme();
  const { activeSlug, progress, selectTopic, topics } = useLearning();
  const [query, setQuery] = useState('');

  const filteredTopics = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return topics;
    }

    return topics.filter(topic =>
      [topic.title, topic.level, topic.summary]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [query, topics]);

  return (
    <View style={styles.screen}>
      <AppBackground />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <FlatList
          data={filteredTopics}
          keyExtractor={item => item.slug}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            <View>
              <Text style={[styles.kicker, { color: theme.colors.accent }]}>
                Curriculum
              </Text>
              <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
                Grammar topics
              </Text>
              <View
                style={[
                  styles.searchBox,
                  {
                    backgroundColor: theme.colors.glassStrong,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <FeatherIcon
                  color={theme.colors.textMuted}
                  name="search"
                  size={18}
                />
                <TextInput
                  autoCapitalize="none"
                  onChangeText={setQuery}
                  placeholder="Search perfect, articles, modals..."
                  placeholderTextColor={theme.colors.textMuted}
                  style={[
                    styles.searchInput,
                    { color: theme.colors.textPrimary },
                  ]}
                  value={query}
                />
              </View>
            </View>
          }
          renderItem={({ item }) => {
            const topicProgress = progress[item.slug];
            const answered = Math.min(
              topicProgress?.total ?? 0,
              REQUIRED_QUIZ_ITEMS,
            );
            const selected = activeSlug === item.slug;
            const itemBackgroundColor = selected
              ? theme.colors.accent
              : theme.colors.glass;
            const itemBorderColor = selected
              ? theme.colors.accent
              : theme.colors.glassBorder;
            const levelBackgroundColor = selected
              ? 'rgba(255, 255, 255, 0.18)'
              : theme.colors.accentSoft;
            const strongTextColor = selected
              ? '#ffffff'
              : theme.colors.textPrimary;
            const softTextColor = selected
              ? '#eef2ff'
              : theme.colors.textSecondary;
            const metaTextColor = selected ? '#eef2ff' : theme.colors.textMuted;
            const levelTextColor = selected ? '#ffffff' : theme.colors.accent;

            return (
              <Pressable
                onPress={() => {
                  selectTopic(item.slug);
                  navigation.navigate('Practice');
                }}
                style={[
                  styles.topicItem,
                  {
                    backgroundColor: itemBackgroundColor,
                    borderColor: itemBorderColor,
                  },
                ]}
              >
                <View style={styles.topicTopRow}>
                  <View
                    style={[
                      styles.levelPill,
                      { backgroundColor: levelBackgroundColor },
                    ]}
                  >
                    <Text style={[styles.levelText, { color: levelTextColor }]}>
                      {item.level}
                    </Text>
                  </View>
                  <Text style={[styles.topicMeta, { color: metaTextColor }]}>
                    {topicProgress?.isCompleted
                      ? 'Complete'
                      : `${answered}/${REQUIRED_QUIZ_ITEMS}`}
                  </Text>
                </View>
                <Text style={[styles.topicTitle, { color: strongTextColor }]}>
                  {item.title}
                </Text>
                <Text
                  numberOfLines={2}
                  style={[styles.topicSummary, { color: softTextColor }]}
                >
                  {item.summary}
                </Text>
              </Pressable>
            );
          }}
          ListEmptyComponent={
            <GlassCard style={styles.emptyCard}>
              <FeatherIcon
                color={theme.colors.textMuted}
                name="filter"
                size={24}
              />
              <Text
                style={[
                  styles.emptyText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                No topics found.
              </Text>
            </GlassCard>
          }
        />
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
  listContent: {
    paddingBottom: 104,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  kicker: {
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    marginTop: 6,
  },
  searchBox: {
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
    marginTop: 18,
    paddingHorizontal: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    height: 48,
  },
  topicItem: {
    borderRadius: 22,
    borderWidth: 1,
    marginBottom: 12,
    padding: 16,
  },
  topicTopRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  levelPill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '900',
  },
  topicMeta: {
    fontSize: 12,
    fontWeight: '900',
  },
  topicTitle: {
    fontSize: 18,
    fontWeight: '900',
    marginTop: 12,
  },
  topicSummary: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
  },
  emptyCard: {
    alignItems: 'center',
    gap: 10,
    padding: 24,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '800',
  },
});
