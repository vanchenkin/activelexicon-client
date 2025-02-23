import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarStyle: {
        backgroundColor: 'white',
        height: 70,
      },
      tabBarActiveTintColor: '#007AFF',
      tabBarInactiveTintColor: '#8E8E93',
      headerShown: false,
      tabBarLabelStyle: {
        fontSize: 10,
        marginTop: 5,
        marginBottom: 5,
      },
      tabBarIconStyle: {
        marginTop: 5,
      },
      tabBarItemStyle: {
        paddingVertical: 5,
      }
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Учиться',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="school-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Слова',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Чат',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Профиль',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
