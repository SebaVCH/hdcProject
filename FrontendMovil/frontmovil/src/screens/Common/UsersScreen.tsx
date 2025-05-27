import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootStack';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Users'>;
};

const rawUrl = Constants.expoConfig?.extra?.EXPO_PUBLIC_URL_BACKEND || '';
const backendUrl = Platform.OS === 'android' ? rawUrl.replace('localhost', '10.0.2.2') : rawUrl;

export default function UsersScreen({ navigation }: Props) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registerModalVisible, setRegisterModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const fetchUsers = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const res = await axios.get(`${backendUrl}/user/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("📦 Respuesta de /user/:", res.data);
      setUsers(res.data.message);
    } catch (err) {
      console.error('Error al obtener usuarios:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterUser = async () => {
    if (!email || !password || !name || !phone) {
      Alert.alert('Faltan datos');
      return;
    }
    try {
      const res = await axios.post(`${backendUrl}/register`, {
        name,
        email,
        password,
        phone,
      });
      Alert.alert('Usuario registrado correctamente');
      setRegisterModalVisible(false);
      setName('');
      setEmail('');
      setPhone('');
      setPassword('');
      fetchUsers();
    } catch (err) {
      console.error('Error al registrar usuario:', err);
      Alert.alert('Error al registrar usuario');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const renderItem = ({ item }: { item: any }) => {
    if (!item.name && !item.email && !item.phone) return null;
    return (
      <View style={styles.userCard}>
        <Text style={styles.name}>{item.name || 'Sin nombre'}</Text>
        <Text style={styles.email}>{item.email || 'Sin correo'}</Text>
        <Text style={styles.phone}>{item.phone || 'Sin teléfono'}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Usuarios Registrados</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
        />
      )}

      <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.homeButtonText}>Volver al Home</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.fabButton} onPress={() => setRegisterModalVisible(true)}>
        <Icon name="plus" size={24} color="#fff" />
      </TouchableOpacity>

      <Modal visible={registerModalVisible} animationType="slide">
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Nuevo Usuario</Text>

          <TextInput style={styles.input} placeholder="Nombre" value={name} onChangeText={setName} />
          <TextInput style={styles.input} placeholder="Correo" value={email} onChangeText={setEmail} keyboardType="email-address" />
          <TextInput style={styles.input} placeholder="Teléfono" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          <TextInput style={styles.input} placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />

          <TouchableOpacity style={styles.sendButton} onPress={handleRegisterUser}>
            <Text style={styles.sendButtonText}>Registrar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={() => setRegisterModalVisible(false)}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  userCard: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  email: {
    fontSize: 14,
    color: '#555',
  },
  phone: {
    fontSize: 14,
    color: '#555',
  },
  homeButton: {
    marginTop: 20,
    marginBottom: 30,
    alignSelf: 'center',
  },
  homeButtonText: {
    fontSize: 16,
    color: '#4682B4',
    fontWeight: 'bold',
  },
  fabButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#000',
    width: 55,
    height: 55,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  modalContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  sendButton: {
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#4682B4',
    fontSize: 16,
    fontWeight: 'bold',
  },
});