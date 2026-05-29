import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DuesMonth({ month, dues }) {
  return (
    <View style={styles.container}>
      <Text>{month}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 8 },
});
