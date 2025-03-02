import React from 'react';
import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import Button from '../components/Button';
import { useRouter } from 'expo-router';

import Typography from '@/components/Typography';
import { ThemedView } from '@/components/ThemedView';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <ThemedView style={styles.container}>
        <Typography type="title">This screen doesn't exist.</Typography>
        <Link href="/" style={styles.link}>
          <Typography type="link">Go to home screen!</Typography>
        </Link>
        <Button title="Go Back" onPress={() => router.back()} />
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
