import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootStack';

const rawUrl = Constants.expoConfig?.extra?.EXPO_PUBLIC_URL_BACKEND || '';
const backendUrl = Platform.OS === 'android' ? rawUrl.replace('localhost', '10.0.2.2') : rawUrl;

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'History'>;

export default function HistoryScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        const res = await axios.get(`${backendUrl}/route`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRoutes(res.data.message || []);
      } catch (error) {
        console.error('Error al obtener las rutas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  const renderItem = ({ item }: any) => (
    <View style={styles.routeItem}>
      <Text style={styles.description}>📍 {item.description}</Text>
      <Text style={styles.detail}>Fecha: {new Date(item.date_created).toLocaleString()}</Text>
      <Text style={styles.detail}>Código: {item.invite_code || 'N/A'}</Text>
      <Text style={styles.detail}>Estado: {item.status}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de Rutas</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <FlatList
          data={routes}
          keyExtractor={(item: any) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.backText}>Volver al Inicio</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  routeItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  description: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  detail: {
    fontSize: 14,
    color: '#555',
  },
  backButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    color: '#4682B4',
    fontWeight: 'bold',
  },
});