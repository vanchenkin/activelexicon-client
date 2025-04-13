import React from 'react';
import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { useUserStats } from '@/hooks/useApi';
import Typography from '@/components/Typography';
import { ThemedView } from '@/components/ThemedView';
import Streak from '@/components/Streak';
import Button from '@/components/Button';
import Header from '../../components/Header';
import Avatar from '@/components/Avatar';
import StatBox from '@/components/StatBox';

const LanguageLevelDisplay = ({ level }: { level: string }) => (
  <ThemedView style={[styles.levelBadge, { backgroundColor: '#0099FF' }]}>
    <Typography style={{ color: 'white' }}>{level.toUpperCase()}</Typography>
  </ThemedView>
);

export default function ProfileScreen() {
  const router = useRouter();
  const { logOut } = useAuth();

  const { data: stats, isLoading: isLoadingStats } = useUserStats();
  const { user: currentUser, isLoading: isLoadingUser } = useAuth();

  const isLoading = isLoadingStats || isLoadingUser;

  const handleOpenWords = () => {
    router.push('/words');
  };

  const handleOpenFrequencyWords = () => {
    router.push('/frequency-words');
  };

  const handleOpenSettings = () => {
    router.push('/settings');
  };

  const handleOpenStats = () => {
    router.push({ pathname: '/statistics' });
  };

  const handleLogout = async () => {
    try {
      await logOut();
      router.replace('/enter');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Header
        title="Профиль"
        rightElement={
          <TouchableOpacity
            onPress={handleOpenSettings}
            style={styles.settingsButton}
          >
            <Ionicons name="settings-outline" size={24} color="#333" />
          </TouchableOpacity>
        }
      />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {isLoading ? (
          <Typography>Loading...</Typography>
        ) : (
          <>
            <ThemedView style={styles.profileHeader}>
              <ThemedView style={styles.avatarContainer}>
                <Avatar
                  avatarId={currentUser?.profile?.avatarId ?? 0}
                  size={80}
                  style={styles.avatar}
                />
                <ThemedView style={styles.userInfo}>
                  <Typography style={{ fontWeight: 'bold', fontSize: 18 }}>
                    {currentUser?.email || 'E-mail'}
                  </Typography>
                  <ThemedView style={styles.levelContainer}>
                    <LanguageLevelDisplay
                      level={currentUser?.profile?.languageLevel || 'A1'}
                    />
                    {currentUser?.profile?.calculatedLanguageLevel &&
                      currentUser.profile.calculatedLanguageLevel !==
                        currentUser.profile.languageLevel && (
                        <ThemedView style={styles.recommendedLevel}>
                          <Typography style={{ fontSize: 12 }}>
                            Рекомендовано:{' '}
                            {currentUser.profile.calculatedLanguageLevel.toUpperCase()}
                          </Typography>
                        </ThemedView>
                      )}
                  </ThemedView>
                </ThemedView>
              </ThemedView>
            </ThemedView>

            {stats && (
              <ThemedView style={styles.statsSummaryContainer}>
                <ThemedView style={styles.statsHeaderContainer}>
                  <Typography style={styles.sectionTitle}>
                    Статистика
                  </Typography>
                  <TouchableOpacity onPress={handleOpenStats}>
                    <Typography style={styles.seeAllLink}>Подробнее</Typography>
                  </TouchableOpacity>
                </ThemedView>

                <ThemedView style={styles.summaryStatsContainer}>
                  <StatBox
                    title="Уровень"
                    value={stats.general.level}
                    style={{ width: '31%' }}
                  />
                  <StatBox
                    title="XP"
                    value={stats.general.points}
                    style={{ width: '31%' }}
                  />
                  <StatBox
                    title="Слов добавлено"
                    value={stats.dictionary.totalWordsAdded}
                    style={{ width: '31%' }}
                  />
                </ThemedView>

                <ThemedView style={styles.streakMiniContainer}>
                  <Typography style={styles.streakTitle}>Streak</Typography>
                  <Streak
                    streak={stats.streak.currentStreakDays}
                    maxTriangles={30}
                  />
                  <Typography style={styles.streakCount}>
                    {stats.streak.currentStreakDays} день
                  </Typography>
                </ThemedView>
              </ThemedView>
            )}

            <ThemedView style={styles.buttonContainer}>
              <Button
                title="Мой словарь"
                onPress={handleOpenWords}
                variant="primary"
              />
              <Button
                title="Частотный словарь"
                onPress={handleOpenFrequencyWords}
                variant="outline"
              />
              <Button
                title="Выйти из аккаунта"
                onPress={handleLogout}
                variant="red-outline"
              />
            </ThemedView>
          </>
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
  settingsButton: {
    paddingHorizontal: 24,
  },
  profileHeader: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 10,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginBottom: 16,
  },
  userInfo: {
    marginLeft: 16,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  levelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  recommendedLevel: {
    marginLeft: 8,
  },
  statsSummaryContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  statsHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAllLink: {
    color: '#0099FF',
    fontWeight: '500',
  },
  summaryStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  streakMiniContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  streakTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  streakCount: {
    marginTop: 8,
    fontWeight: '500',
  },
  statsButton: {
    backgroundColor: '#0099FF',
  },
  sectionContainer: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  sectionTitle: {
    marginBottom: 12,
    marginLeft: 4,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statBox: {
    width: '31%',
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    textAlign: 'center',
  },
  statValue: {
    marginTop: 8,
    fontWeight: 'bold',
    fontSize: 18,
    color: '#333',
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
    justifyContent: 'space-around',
    marginTop: 16,
  },
  buttonContainer: {
    marginHorizontal: 16,
    marginTop: 24,
    flexDirection: 'column',
    backgroundColor: 'transparent',
    gap: 8,
  },
});
