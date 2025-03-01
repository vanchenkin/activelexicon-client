import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';
import Typography from '../components/Typography';
import { ThemedView } from '../components/ThemedView';
import Logo from '../components/Logo';
import { useExerciseProgress } from '@/hooks/useApi';
import { useAuth } from '../context/AuthContext';

export default function ExerciseCompleteScreen() {
  const router = useRouter();

  // Use React Query to fetch the user's exercise progress
  const { data: progress, isLoading: progressLoading } = useExerciseProgress();

  // Use React Query to fetch the current user's data
  const { data: user } = useAuth();

  const handleContinue = () => {
    // Navigate back to the home screen
    router.replace('/(tabs)');
  };

  // Function to render streak triangles
  const renderStreakIndicators = () => {
    // Generate 15 triangles (3 rows of 5)
    const indicators = [];
    const streak = progress?.streak || 0;
    const filledTriangles = Math.min(streak, 15);

    for (let i = 0; i < 15; i++) {
      indicators.push(
        <Typography
          key={i}
          style={[
            styles.triangleIndicator,
            i < filledTriangles
              ? styles.filledIndicator
              : styles.emptyIndicator,
          ]}
        >
          ▲
        </Typography>
      );
    }

    return indicators;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <ThemedView style={styles.card} lightColor="#FFFFFF" darkColor="#1E1E1E">
        <Logo size={80} />

        <ThemedView style={styles.congratsIconContainer}>
          <Ionicons name="star" size={80} color="#FFD700" />
        </ThemedView>

        <Typography weight="bold" size="2xl" style={styles.title}>
          Отлично!
        </Typography>

        <Typography size="md" style={styles.subtitle}>
          Вы успешно выполнили упражнение и получили опыт
        </Typography>

        <ThemedView style={styles.rewardContainer}>
          <Typography weight="bold" size="lg" style={styles.rewardTitle}>
            +100 XP
          </Typography>
          <Typography size="sm" style={styles.rewardSubtitle}>
            Ваш уровень: {user?.profile.level || 0}/
            {user?.profile.maxLevel || 0}
          </Typography>
          <ThemedView style={styles.progressBar}>
            <ThemedView
              style={[
                styles.progressFill,
                {
                  width: `${
                    ((user?.profile.experiencePoints || 0) % 1000) / 10
                  }%`,
                },
              ]}
            />
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.streakContainer}>
          <Typography weight="bold" size="md" style={styles.streakTitle}>
            Серия: {progress?.streak || 0}{' '}
            {getStreakText(progress?.streak || 0)}
          </Typography>
          <ThemedView style={styles.streakIndicators}>
            {renderStreakIndicators()}
          </ThemedView>
        </ThemedView>

        <Button
          title="Продолжить"
          onPress={handleContinue}
          size="large"
          style={styles.continueButton}
        />
      </ThemedView>
    </SafeAreaView>
  );
}

// Helper function to get the correct streak text form in Russian
function getStreakText(streak: number) {
  if (streak === 1) return 'день';
  if (streak >= 2 && streak <= 4) return 'дня';
  return 'дней';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  card: {
    flex: 1,
    padding: 24,
  },
  congratsIconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#555',
    marginBottom: 40,
  },
  rewardContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 24,
  },
  rewardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  rewardSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  progressBar: {
    height: 10,
    backgroundColor: '#EEE',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4096FE',
    borderRadius: 5,
  },
  streakContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  streakTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  streakIndicators: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  triangleIndicator: {
    fontSize: 16,
    color: '#DDD',
    marginHorizontal: 5,
  },
  filledIndicator: {
    color: '#4096FE',
  },
  emptyIndicator: {
    color: '#DDD',
  },
  continueButton: {
    backgroundColor: '#4096FE',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 24,
    marginBottom: 24,
    alignItems: 'center',
  },
});
