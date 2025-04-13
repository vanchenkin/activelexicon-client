import React from 'react';
import { StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';
import Typography from '../components/Typography';
import { ThemedView } from '../components/ThemedView';
import Logo from '../components/Logo';
import { useProfileStats } from '@/hooks/useApi';
import Streak from '../components/Streak';

export default function ExerciseCompleteScreen() {
  const router = useRouter();
  const { gainedXP = '100', initialXP = '0' } = useLocalSearchParams();
  const xpGained = parseInt(gainedXP as string, 10);
  const startXP = parseInt(initialXP as string, 10);
  const currentXP = startXP + xpGained;

  const { data: profileStats } = useProfileStats();

  const handleFinish = () => {
    router.replace('/');
  };

  const handleContinue = () => {
    router.replace('/exercise');
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.card} lightColor="#FFFFFF" darkColor="#1E1E1E">
        <Logo size={0.5} />

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
            +{xpGained} XP
          </Typography>
          <Typography size="sm" style={styles.rewardSubtitle}>
            {startXP} XP → {currentXP} XP
          </Typography>
          <Typography size="sm" style={styles.rewardSubtitle}>
            Ваш уровень: {profileStats?.general?.level || 0}
          </Typography>
          <ThemedView style={styles.progressBar}>
            <ThemedView
              style={[
                styles.progressFill,
                {
                  width: `${
                    ((profileStats?.general?.points || 0) % 1000) / 10
                  }%`,
                },
              ]}
            />
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.streakContainer}>
          <Streak
            streak={profileStats?.streak?.currentStreakDays || 0}
            showLabel
          />
        </ThemedView>

        <ThemedView style={styles.buttonContainer}>
          <Button
            title="Завершить"
            onPress={handleFinish}
            style={{ ...styles.button, marginLeft: 10 }}
            variant="secondary"
          />
          <Button
            title="Продолжить"
            onPress={handleContinue}
            style={styles.button}
          />
        </ThemedView>
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
    flexDirection: 'column',
    justifyContent: 'space-around',
    padding: 24,
    paddingVertical: 64,
  },
  congratsIconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    width: '100%',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#555',
    marginBottom: 40,
    width: '100%',
    textAlign: 'center',
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
    marginVertical: 16,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    flex: 1,
  },
});
