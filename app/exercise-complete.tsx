import React from 'react';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';
import Typography from '../components/Typography';
import { ThemedView } from '../components/ThemedView';
import Logo from '../components/Logo';
import { useExerciseProgress } from '@/hooks/useApi';
import { useAuth } from '../context/AuthContext';
import Streak from '@/components/Streak';

export default function ExerciseCompleteScreen() {
  const router = useRouter();

  const { data: progress } = useExerciseProgress();

  const { user } = useAuth();

  const handleContinue = () => {
    router.replace('/(tabs)');
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.card} lightColor="#FFFFFF" darkColor="#1E1E1E">
        <Logo width={80} height={80} />

        <ThemedView style={styles.congratsIconContainer}>
          <Ionicons name="star" size={80} color="#FFD700" />
        </ThemedView>

        <Typography size="2xl" style={styles.title}>
          Отлично!
        </Typography>

        <Typography size="md" style={styles.subtitle}>
          Вы успешно выполнили упражнение и получили опыт
        </Typography>

        <ThemedView style={styles.rewardContainer}>
          <Typography size="lg" style={styles.rewardTitle}>
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
          <Streak streak={progress?.streak || 0} />
        </ThemedView>

        <Button title="Продолжить" onPress={handleContinue} size="large" />
      </ThemedView>
    </ThemedView>
  );
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
    marginBottom: 24,
    elevation: 2,
  },
});
