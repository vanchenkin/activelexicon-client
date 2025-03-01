import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { useUserStats, useExerciseProgress } from '@/hooks/useApi';
import { mockExerciseService } from '@/services/mockExerciseService';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { data: userStats, isLoading: isLoadingStats } = useUserStats();
  const [userLevel, setUserLevel] = useState({ current: 26, max: 27 });
  const [streak, setStreak] = useState(1);
  
  useEffect(() => {
    const loadUserProgress = async () => {
      try {
        // In a real app, you would fetch the user's actual progress
        const progress = await mockExerciseService.getUserProgress();
        setStreak(progress.streak);
      } catch (error) {
        console.error('Error loading progress:', error);
      }
    };
    
    loadUserProgress();
  }, []);
  
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
  
  const handleOpenVocabulary = () => {
    router.push('/(tabs)/words');
  };
  
  const handleLogout = async () => {
    try {
      await signOut();
      router.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Профиль</Text>
        </View>
        
        {/* User Info Card */}
        <View style={styles.card}>
          <View style={styles.userInfoContainer}>
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person-outline" size={40} color="#888" />
            </View>
            <Text style={styles.emailText}>{user?.email || 'E-mail'}</Text>
          </View>
        </View>
        
        {/* Statistics Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Статистика</Text>
          {isLoadingStats ? (
            <Text style={styles.statValue}>Загрузка...</Text>
          ) : (
            <View style={styles.statsContainer}>
              {/* Add more statistics here when available */}
            </View>
          )}
        </View>
        
        {/* Level Card */}
        <View style={styles.card}>
          <Text style={styles.levelLabel}>Ваш уровень:</Text>
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
        
        {/* Streak Card */}
        <View style={styles.card}>
          <View style={styles.streakHeader}>
            <Text style={styles.streakLabel}>Дней подряд: {streak}</Text>
            <View style={styles.streakIndicators}>
              {renderStreakIndicators()}
            </View>
          </View>
        </View>
        
        {/* Vocabulary Button */}
        <TouchableOpacity 
          style={styles.vocabularyButton}
          onPress={handleOpenVocabulary}
        >
          <Text style={styles.buttonText}>Мой словарь используемых слов</Text>
        </TouchableOpacity>
        
        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Выйти из аккаунта</Text>
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
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
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
    fontSize: 16,
    color: '#333',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '500',
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
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  levelLabel: {
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
  streakHeader: {
    marginBottom: 5,
  },
  streakLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
  },
  streakIndicators: {
    alignItems: 'flex-end',
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
  vocabularyButton: {
    backgroundColor: '#4096FE',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  logoutButton: {
    marginTop: 16,
    padding: 16,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '500',
  },
}); 