import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { useUserStats, useExerciseProgress } from '@/hooks/useApi';
import Typography from '@/components/Typography';
import { ThemedView } from '@/components/ThemedView';
import Streak from '@/components/Streak';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logOut } = useAuth();

  const { data: userStats, isLoading: isLoadingStats } = useUserStats();
  const { data: exerciseProgress, isLoading: isLoadingProgress } =
    useExerciseProgress();
  const { user: currentUser, isLoading: isLoadingUser } = useAuth();

  const handleOpenWords = () => {
    router.push('/words');
  };

  const handleOpenSettings = () => {
    router.push('/settings');
  };

  const handleLogout = async () => {
    try {
      await logOut();
      router.replace('/enter');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isLoading = isLoadingStats || isLoadingProgress || isLoadingUser;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <ThemedView style={styles.header}>
          <Typography size="lg" style={styles.headerTitle}>
            Профиль
          </Typography>
          <TouchableOpacity
            onPress={handleOpenSettings}
            style={styles.settingsButton}
          >
            <Ionicons name="settings-outline" size={24} color="#333" />
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.card}>
          <ThemedView style={styles.userInfoContainer}>
            <ThemedView style={styles.avatarPlaceholder}>
              <Ionicons name="person-outline" size={40} color="#888" />
            </ThemedView>
            <Typography style={styles.emailText}>
              {user?.email || 'E-mail'}
            </Typography>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.card}>
          <Typography weight="medium" size="lg" style={styles.cardTitle}>
            Статистика
          </Typography>
          {isLoadingStats ? (
            <ActivityIndicator size="small" color="#4096FE" />
          ) : (
            <ThemedView style={styles.statsContainer}>
              {userStats && (
                <>
                  <ThemedView style={styles.statRow}>
                    <Typography color="#666" size="sm" style={styles.statLabel}>
                      Изучено слов:
                    </Typography>
                    <Typography
                      weight="medium"
                      size="sm"
                      style={styles.statValue}
                    >
                      {userStats.learnedWords}
                    </Typography>
                  </ThemedView>

                  <ThemedView style={styles.statRow}>
                    <Typography color="#666" size="sm" style={styles.statLabel}>
                      Всего слов:
                    </Typography>
                    <Typography
                      weight="medium"
                      size="sm"
                      style={styles.statValue}
                    >
                      {userStats.totalWords}
                    </Typography>
                  </ThemedView>

                  <ThemedView style={styles.statRow}>
                    <Typography color="#666" size="sm" style={styles.statLabel}>
                      Последняя активность:
                    </Typography>
                    <Typography
                      weight="medium"
                      size="sm"
                      style={styles.statValue}
                    >
                      {userStats.lastActiveDate
                        ? new Date(
                            userStats.lastActiveDate
                          ).toLocaleDateString()
                        : 'Никогда'}
                    </Typography>
                  </ThemedView>
                </>
              )}
            </ThemedView>
          )}
        </ThemedView>

        <ThemedView style={styles.card}>
          <Typography weight="medium" size="md" style={styles.levelLabel}>
            Ваш уровень:
          </Typography>
          {isLoadingUser ? (
            <ActivityIndicator size="small" color="#4096FE" />
          ) : (
            <>
              <ThemedView style={styles.progressBarContainer}>
                <ThemedView
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${((currentUser?.profile.level || 1) / (currentUser?.profile.maxLevel || 1)) * 100}%`,
                    },
                  ]}
                />
              </ThemedView>
              <ThemedView style={styles.levelLabels}>
                <Typography color="#666" size="sm" style={styles.levelValue}>
                  {currentUser?.profile.level || 1}
                </Typography>
                <Typography color="#666" size="sm" style={styles.levelValue}>
                  {currentUser?.profile.maxLevel || 1}
                </Typography>
              </ThemedView>
            </>
          )}
        </ThemedView>

        <ThemedView style={styles.card}>
          {isLoadingProgress ? (
            <ActivityIndicator size="small" color="#4096FE" />
          ) : (
            <Streak streak={exerciseProgress?.streak || 0} />
          )}
        </ThemedView>

        <TouchableOpacity style={styles.wordsButton} onPress={handleOpenWords}>
          <Typography
            color="white"
            weight="medium"
            size="md"
            style={styles.buttonText}
          >
            Мой словарь используемых слов
          </Typography>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Typography
            color="#FF3B30"
            weight="medium"
            size="md"
            style={styles.logoutButtonText}
          >
            Выйти из аккаунта
          </Typography>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  contentContainer: {
    paddingBottom: 24,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18,
  },
  settingsButton: {
    padding: 8,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 1,
  },
  userInfoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  emailText: {
    color: '#333',
  },
  cardTitle: {
    marginBottom: 12,
  },
  statsContainer: {
    minHeight: 50,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  statLabel: {},
  statValue: {},
  levelLabel: {
    marginBottom: 10,
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: '#EEE',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4096FE',
    borderRadius: 5,
  },
  levelLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  levelValue: {},
  wordsButton: {
    backgroundColor: '#0099FF',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 12,
  },
  buttonText: {},
  logoutButton: {
    marginTop: 16,
    padding: 16,
    alignItems: 'center',
  },
  logoutButtonText: {},
});
