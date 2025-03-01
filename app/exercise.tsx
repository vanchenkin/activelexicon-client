import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Dummy exercise data - would come from a real API in production
interface Exercise {
  id: string;
  type: 'fill-blank';
  text: string;
  blankIndex: number; // The word index that should be blank
  correctAnswer: string;
  contextBeforeBlank: string;
  contextAfterBlank: string;
}

// Mock exercise data
const mockExercises: Exercise[] = [
  {
    id: '1',
    type: 'fill-blank',
    text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not _____ five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
    blankIndex: 8,
    correctAnswer: 'only',
    contextBeforeBlank: 'It has survived not ',
    contextAfterBlank: ' five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.'
  },
  {
    id: '2',
    type: 'fill-blank',
    text: 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the _____ source.',
    blankIndex: 12,
    correctAnswer: 'undoubtable',
    contextBeforeBlank: 'discovered the ',
    contextAfterBlank: ' source.'
  }
];

export default function ExerciseScreen() {
  const router = useRouter();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  
  // Simulate loading exercises
  useEffect(() => {
    const loadExercises = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setExercises(mockExercises);
      } catch (error) {
        console.error('Failed to load exercises:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadExercises();
  }, []);
  
  const currentExercise = exercises[currentExerciseIndex];
  
  const handleCheckAnswer = () => {
    if (!userAnswer.trim() || isChecking) return;
    
    setIsChecking(true);
    
    // Simulate checking answer with a delay
    setTimeout(() => {
      const isAnswerCorrect = userAnswer.trim().toLowerCase() === 
        currentExercise.correctAnswer.toLowerCase();
      
      setIsCorrect(isAnswerCorrect);
      setIsChecking(false);
      
      // If correct, move to next exercise after a delay
      if (isAnswerCorrect) {
        setTimeout(() => {
          if (currentExerciseIndex < exercises.length - 1) {
            setCurrentExerciseIndex(currentExerciseIndex + 1);
            setUserAnswer('');
            setIsCorrect(null);
          } else {
            // All exercises completed - navigate to completion screen
            router.push('/exercise-complete');
          }
        }, 1500);
      }
    }, 800);
  };
  
  const handleBack = () => {
    router.back();
  };
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0099FF" />
        <Text style={styles.loadingText}>Загрузка упражнений...</Text>
      </View>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Упражнение</Text>
        <View style={styles.placeholder} />
      </View>
      
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Выполнено {currentExerciseIndex + 1} из {exercises.length} заданий до получения опыта
        </Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${((currentExerciseIndex + 1) / exercises.length) * 100}%` }
            ]} 
          />
        </View>
      </View>
      
      <ScrollView style={styles.exerciseContainer}>
        <Text style={styles.instructionText}>
          Вставьте слово, которое лучше всего подходит:
        </Text>
        
        {currentExercise && (
          <View style={styles.textContainer}>
            <Text style={styles.exerciseText}>
              {currentExercise.text.split('_____')[0]}
              <Text style={styles.blankLine}>______</Text>
              {currentExercise.text.split('_____')[1]}
            </Text>
          </View>
        )}
      </ScrollView>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        style={styles.inputContainer}
      >
        <TextInput
          style={[
            styles.input,
            isCorrect === true ? styles.correctInput : null,
            isCorrect === false ? styles.incorrectInput : null,
          ]}
          placeholder="Введите текст..."
          value={userAnswer}
          onChangeText={setUserAnswer}
          editable={isChecking === false && isCorrect !== true}
        />
        
        <TouchableOpacity 
          style={[
            styles.checkButton,
            (!userAnswer.trim() || isChecking) ? styles.disabledButton : null
          ]}
          onPress={handleCheckAnswer}
          disabled={!userAnswer.trim() || isChecking || isCorrect === true}
        >
          {isChecking ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Проверить</Text>
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#555',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 8,
  },
  placeholder: {
    width: 40,
  },
  progressContainer: {
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    margin: 16,
  },
  progressText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#DDD',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0099FF',
    borderRadius: 4,
  },
  exerciseContainer: {
    flex: 1,
    padding: 16,
  },
  instructionText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 16,
  },
  textContainer: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  exerciseText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  blankLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingHorizontal: 8,
  },
  inputContainer: {
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  correctInput: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  incorrectInput: {
    borderColor: '#F44336',
    backgroundColor: '#FFEBEE',
  },
  checkButton: {
    backgroundColor: '#0099FF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#A0D4F7',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
}); 