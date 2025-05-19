import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootStack';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Profile'>;
};

const rawUrl = Constants.expoConfig?.extra?.EXPO_PUBLIC_URL_BACKEND || '';
const backendUrl = Platform.OS === 'android' ? rawUrl.replace('localhost', '192.168.0.8') : rawUrl;

export default function ProfileScreen({ navigation }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Obtener datos del usuario
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        console.log("🔑 TOKEN:", token);
        const res = await axios.get(`${backendUrl}/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("📦 Datos del perfil recibidos:", res.data);
        setName(res.data.user.name);
        setPhone(res.data.user.phone);
      } catch (error) {
        console.error('Error al cargar perfil:', error);
        Alert.alert('Error', 'No se pudo cargar tu perfil');
      }
    };

    loadUserProfile();
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('accessToken');

      const updateData: {
        name: string;
        phone: string;
        password?: string;
      } = {
        name,
        phone,
      };

      if (password.trim() !== '') {
        updateData.password = password;
      }

      await axios.put(`${backendUrl}/user/update`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIsEditing(false);
      setPassword('');
      Alert.alert('Éxito', 'Perfil actualizado correctamente');
    } catch (error) {
      console.error('Error al guardar perfil:', error);
      Alert.alert('Error', 'No se pudo actualizar tu perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>Mi Perfil</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Nombre:</Text>
        <TextInput
          style={[styles.input, !isEditing && styles.readOnly]}
          value={name}
          onChangeText={setName}
          editable={isEditing}
        />

        <Text style={styles.label}>Teléfono:</Text>
        <TextInput
          style={[styles.input, !isEditing && styles.readOnly]}
          value={phone}
          onChangeText={setPhone}
          editable={isEditing}
          keyboardType="phone-pad"
        />

        {isEditing && (
          <>
            <Text style={styles.label}>Nueva Contraseña:</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="(opcional)"
              secureTextEntry
            />
          </>
        )}

        <TouchableOpacity style={styles.button} onPress={isEditing ? handleSave : () => setIsEditing(true)}>
          <Text style={styles.buttonText}>{isEditing ? (loading ? 'Guardando...' : 'Guardar') : 'Editar datos'}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.homeButtonText}>Volver al Home</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 30,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 45,
    fontSize: 16,
    color: '#000',
  },
  readOnly: {
    backgroundColor: '#eee',
    color: '#888',
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 25,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  homeButton: {
    marginBottom: 40,
    alignSelf: 'center',
  },
  homeButtonText: {
    fontSize: 16,
    color: '#4682B4',
    fontWeight: 'bold',
  },
});
