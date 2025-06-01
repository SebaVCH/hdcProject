import jwt_decode from 'jwt-decode';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';

const rawUrl = Constants.expoConfig?.extra?.EXPO_PUBLIC_URL_BACKEND || '';
const backendUrl = Platform.OS === 'android' ? rawUrl.replace('localhost', '10.0.2.2') : rawUrl;

type LoginScreenProps = {
  navigation: NavigationProp<any>;
};

const authenticate = async (
  email: string,
  password: string
): Promise<{ accessToken: string } | null> => {
  try {
    console.log('🔍 Backend URL:', backendUrl);
    const response = await axios.post(`${backendUrl}/login`, {
      email,
      password,
    });

    const token = response.data.token;
    console.log('✅ TOKEN RECIBIDO DEL BACKEND:', token);

    if (!token) return null;

    return { accessToken: token };
  } catch (error: any) {
    return null;
  }
};

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
  setLoading(true);
  const tokens = await authenticate(email,password);
  setLoading(false);

  if (tokens?.accessToken) {
    try {
      const decoded: any = jwt_decode(tokens.accessToken); // 👈 decodifica el JWT
      const userId = decoded.user_id;

      await AsyncStorage.setItem('accessToken', tokens.accessToken);
      await AsyncStorage.setItem('userId', userId);

      console.log("✅ ID del usuario decodificado:", userId);
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error al guardar datos en AsyncStorage', error);
    }
  } else {
    Alert.alert('Error', 'Credenciales inválidas');
  }
};

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Icon name="user-circle" size={80} color="#000" />
        <Text style={styles.title}>Iniciar Sesión</Text>

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <View style={styles.buttonsH}>
          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Cargando...' : 'Ingresar'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000',
    marginVertical: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#000',
  },
  button: {
    backgroundColor: '#000',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonsH: {
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
  },
});
