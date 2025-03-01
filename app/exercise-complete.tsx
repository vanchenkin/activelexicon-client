import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { mockExerciseService } from '@/services/mockExerciseService';

export default function ExerciseCompleteScreen() {
  const router = useRouter();
  const [userLevel, setUserLevel] = useState({ current: 26, max: 27 });
  const [streak, setStreak] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadUserProgress = async () => {
      try {
        // In a real app, you would fetch the user's actual progress
        const progress = await mockExerciseService.getUserProgress();
        setStreak(progress.streak);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading progress:', error);
        setIsLoading(false);
      }
    };
    
    loadUserProgress();
  }, []);
  
  const handleContinue = () => {
    // Navigate back to the home screen
    router.replace('/(tabs)');
  };
  
  // Function to render streak triangles
  const renderStreakIndicators = () => {
    // Generate 15 triangles (3 rows of 5)
    const indicators = [];
    const filledTriangles = Math.min(streak, 15);
    
    for (let i = 0; i < 15; i++) {
      indicators.push(
        <Text 
          key={i} 
          style={[
            styles.triangleIndicator,
            i < filledTriangles ? styles.filledTriangle : {}
          ]}
        >
          ▲
        </Text>
      );
    }
    
    // Split into rows of 5
    const rows = [];
    for (let i = 0; i < 3; i++) {
      rows.push(
        <View key={i} style={styles.triangleRow}>
          {indicators.slice(i * 5, (i + 1) * 5)}
        </View>
      );
    }
    
    return rows;
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Получение опыта</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.congratsText}>Вы молодец!</Text>
        <Text style={styles.completedText}>Серия упражнений выполнена!</Text>
        
        <View style={styles.checkmarkContainer}>
          <Ionicons name="checkmark" size={120} color="#000" />
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.levelContainer}>
            <Text style={styles.statsLabel}>Ваш уровень:</Text>
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { width: `${(userLevel.current / userLevel.max) * 100}%` }
                ]} 
              />
            </View>
            <View style={styles.levelLabels}>
              <Text style={styles.levelValue}>{userLevel.current}</Text>
              <Text style={styles.levelValue}>{userLevel.max}</Text>
            </View>
          </View>
          
          <View style={styles.streakContainer}>
            <View style={styles.streakHeader}>
              <Text style={styles.statsLabel}>Дней подряд: {streak}</Text>
            </View>
            <View style={styles.streakIndicators}>
              {renderStreakIndicators()}
            </View>
          </View>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.continueButton}
        onPress={handleContinue}
      >
        <Text style={styles.buttonText}>Продолжить</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  congratsText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  completedText: {
    fontSize: 18,
    color: '#555',
    marginBottom: 40,
  },
  checkmarkContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  statsContainer: {
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
  levelContainer: {
    marginBottom: 20,
  },
  statsLabel: {
    fontSize: 16,
    fontWeight: '500',
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
  levelValue: {
    fontSize: 14,
    color: '#666',
  },
  streakContainer: {
    paddingTop: 10,
  },
  streakHeader: {
    marginBottom: 10,
  },
  streakIndicators: {
    alignItems: 'center',
  },
  triangleRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  triangleIndicator: {
    fontSize: 16,
    color: '#DDD',
    marginHorizontal: 5,
  },
  filledTriangle: {
    color: '#4096FE',
  },
  continueButton: {
    backgroundColor: '#4096FE',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 24,
    marginBottom: 24,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 