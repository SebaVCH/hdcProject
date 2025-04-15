// src/screens/InitialScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { NavigationProp } from '@react-navigation/native';

interface InitialScreenProps {
  navigation: NavigationProp<any>;
}

const InitialScreen = ({ navigation }: InitialScreenProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a RED CALLE</Text>
      <Button title="Iniciar" onPress={() => navigation.navigate('Login')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
});

export default InitialScreen;