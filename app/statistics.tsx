import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useProfileStats } from '@/hooks/useApi';
import Typography from '@/components/Typography';
import { ThemedView } from '@/components/ThemedView';
import Streak from '@/components/Streak';
import Button from '@/components/Button';
import Header from '@/components/Header';
import StatBox from '@/components/StatBox';

const StatSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <ThemedView style={styles.sectionContainer}>
    <Typography style={styles.sectionTitle} size="lg">
      {title}
    </Typography>
    <ThemedView style={styles.statsGrid}>{children}</ThemedView>
  </ThemedView>
);

export default function StatisticsScreen() {
  const router = useRouter();
  const { data: stats, isLoading } = useProfileStats();

  return (
    <ThemedView style={styles.container}>
      <Header title="Статистика" onBackPress={() => router.back()} />
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        overScrollMode="never"
      >
        {isLoading ? (
          <Typography>Загрузка...</Typography>
        ) : stats ? (
          <>
            <StatSection title="Общие">
              <StatBox
                title="Уровень"
                value={stats.general.level}
                style={styles.statBox}
              />
              <StatBox
                title="Очки"
                value={stats.general.points}
                style={styles.statBox}
              />
              <StatBox
                title="Написано слов"
                value={stats.general.totalWordsWritten}
                style={styles.statBox}
              />
              <StatBox
                title="Очки до след. уровня"
                value={`${stats.general.maxLevelPoints}`}
                style={styles.statBox}
              />
            </StatSection>

            <StatSection title="Словарь">
              <StatBox
                title="Добавлено слов"
                value={stats.dictionary.totalWordsAdded}
                style={styles.statBox}
              />
              <StatBox
                title="Повторения"
                value={stats.dictionary.totalIntervalRepeats}
                style={styles.statBox}
              />
              <StatBox
                title="Выучено слов"
                value={stats.dictionary.totalWordsLearned}
                style={styles.statBox}
              />
              <StatBox
                title="Текущий словарь"
                value={stats.dictionary.currentWordCount}
                style={styles.statBox}
              />
            </StatSection>

            <StatSection title="Тексты">
              <StatBox
                title="Прочитано текстов"
                value={stats.search.totalTextsRead}
                style={styles.statBox}
              />
            </StatSection>

            <StatSection title="Чат">
              <StatBox
                title="Начато чатов"
                value={stats.chat.totalChatsStarted}
                style={styles.statBox}
              />
              <StatBox
                title="Отправлено сообщений"
                value={stats.chat.totalMessagesSent}
                style={styles.statBox}
              />
              <StatBox
                title="Идеальных сообщений"
                value={stats.chat.totalPerfectMessages}
                style={styles.statBox}
              />
            </StatSection>

            <StatSection title="Задания">
              <StatBox
                title="Вставка слов"
                value={stats.tasks.totalInsertWordTasks}
                style={styles.statBox}
              />
              <StatBox
                title="Вопрос-ответ"
                value={stats.tasks.totalQuestionAnswerTasks}
                style={styles.statBox}
              />
              <StatBox
                title="Написание текста"
                value={stats.tasks.totalWriteTextTasks}
                style={styles.statBox}
              />
            </StatSection>

            <ThemedView style={styles.streakSection}>
              <Typography style={styles.sectionTitle}>Серия</Typography>
              <ThemedView style={styles.streakContainer}>
                <Streak
                  streak={stats.streak.currentStreakDays}
                  maxTriangles={30}
                />
              </ThemedView>
              <ThemedView style={styles.streakInfo}>
                <StatBox
                  title="Задания сегодня"
                  value={stats.streak.tasksDoneToday}
                  style={styles.statBox}
                />
                <StatBox
                  title="Макс. заданий в день"
                  value={stats.streak.maxTasksPerDay}
                  style={styles.statBox}
                />
                <StatBox
                  title="Текущая серия"
                  value={`${stats.streak.currentStreakDays} дней`}
                  style={styles.statBox}
                />
                <StatBox
                  title="Рекордная серия"
                  value={`${stats.streak.maxStreakDays} дней`}
                  style={styles.statBox}
                />
              </ThemedView>
            </ThemedView>

            <Button
              title="Вернуться в профиль"
              onPress={() => router.back()}
              style={styles.backButton}
            />
          </>
        ) : (
          <Typography>Failed to load statistics.</Typography>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  sectionContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 10,
  },
  sectionTitle: {
    marginVertical: 12,
    width: '100%',
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statBox: {
    width: '48%',
  },
  streakSection: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  streakInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  backButton: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  streakContainer: {
    alignItems: 'center',
  },
});
