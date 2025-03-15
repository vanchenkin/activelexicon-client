import React from 'react';
import { StyleSheet, View } from 'react-native';
import Typography from './Typography';
import { ThemedView } from './ThemedView';
import BackButton from './BackButton';

type HeaderProps = {
  title: string;
  onBackPress?: () => void;
  rightElement?: React.ReactNode;
};

export default function Header({
  title,
  onBackPress,
  rightElement,
}: HeaderProps) {
  return (
    <ThemedView style={styles.header}>
      {onBackPress ? (
        <BackButton onPress={onBackPress} />
      ) : (
        <View style={styles.placeholder} />
      )}
      <Typography style={styles.headerTitle}>{title}</Typography>
      {rightElement}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 36,
    paddingBottom: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  headerTitle: {
    fontSize: 18,
    textAlign: 'center',
    width: '100%',
    flex: 1,
  },
  placeholder: {
    width: 36,
    height: 36,
  },
});
