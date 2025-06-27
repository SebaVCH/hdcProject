import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
  TextInput,
  Modal,
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
  const [filter, setFilter] = useState<'day' | 'week' | 'month' | 'all'>('all');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<any>(null);
  const [editedDescription, setEditedDescription] = useState('');
  const [editedStatus, setEditedStatus] = useState('');
  const [userId, setUserId] = useState('');
  const [showOnlyMine, setShowOnlyMine] = useState(true); // ✅ Por defecto: solo mis rutas
  const [expandedRoutes, setExpandedRoutes] = useState<{ [key: string]: boolean }>({});
  const [helpPointsByRoute, setHelpPointsByRoute] = useState<{ [key: string]: any[] }>({});

  useEffect(() => {
    const init = async () => {
      const id = await AsyncStorage.getItem('userId');
      setUserId(id || '');
      fetchRoutes();
    };
    init();
  }, []);

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

  const fetchPeopleHelped = async (routeId: string) => {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    const res = await axios.get(`${backendUrl}/helping-point`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const filtered = res.data.message.filter(
      (point: any) => point.route_id === routeId
    );
    setHelpPointsByRoute(prev => ({ ...prev, [routeId]: filtered }));
  } catch (error) {
    console.error('Error al obtener personas ayudadas:', error);
  }
};

  const applyFilter = () => {
    const now = new Date();

    const filtered = routes.filter((route: any) => {
      const routeDate = new Date(route.date_created);

      const dateMatch =
        filter === 'day'
          ? routeDate.toDateString() === now.toDateString()
          : filter === 'week'
          ? (() => {
              const oneWeekAgo = new Date(now);
              oneWeekAgo.setDate(now.getDate() - 7);
              return routeDate >= oneWeekAgo && routeDate <= now;
            })()
          : filter === 'month'
          ? routeDate.getMonth() === now.getMonth() &&
            routeDate.getFullYear() === now.getFullYear()
          : true;

      const isMine =
        !showOnlyMine || route.route_leader === userId || route.route_leader?._id === userId;

      return dateMatch && isMine;
    });

    return filtered.sort(
      (a: any, b: any) =>
        new Date(b.date_created).getTime() - new Date(a.date_created).getTime()
    );
  };

  const toggleExpand = (routeId: string) => {
  const alreadyExpanded = expandedRoutes[routeId];
  if (!alreadyExpanded && !helpPointsByRoute[routeId]) {
    fetchPeopleHelped(routeId);
  }
  setExpandedRoutes(prev => ({ ...prev, [routeId]: !alreadyExpanded }));
};

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      await axios.put(
        `${backendUrl}/route/${selectedRoute._id}`,
        {
          description: editedDescription,
          status: editedStatus,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEditModalVisible(false);
      setSelectedRoute(null);
      await fetchRoutes();
    } catch (error) {
      console.error('Error al guardar cambios:', error);
    }
  };

  const renderItem = ({ item }: any) => (
  <View style={styles.routeItem}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <Text style={styles.description}>📍 {item.description}</Text>
      <TouchableOpacity
        onPress={() => {
          setSelectedRoute(item);
          setEditedDescription(item.description);
          setEditedStatus(item.status);
          setEditModalVisible(true);
        }}
      >
        <Text style={styles.options}>⋯</Text>
      </TouchableOpacity>
    </View>
    <Text style={styles.detail}>
      Fecha: {new Date(item.date_created).toLocaleString()}
    </Text>
    <Text style={styles.detail}>Código: {item.invite_code || 'N/A'}</Text>
    <Text style={styles.detail}>Estado: {item.status}</Text>

    {/* 🔽 FLECHA PARA EXPANDIR / COLAPSAR */}
    <TouchableOpacity onPress={() => toggleExpand(item._id)}>
      <Text style={{ color: '#4682B4', marginTop: 5 }}>
        {expandedRoutes[item._id] ? '▲ Ocultar personas registradas' : '▼ Ver personas registradas'}
      </Text>
    </TouchableOpacity>

    {/* 👥 PERSONAS REGISTRADAS */}
    {expandedRoutes[item._id] && helpPointsByRoute[item._id]?.length > 0 && (
      <View style={{ marginTop: 10 }}>
        {helpPointsByRoute[item._id].map((point, index) => (
          <View key={index} style={{ paddingLeft: 10, marginBottom: 5 }}>
            <Text style={{ fontSize: 13 }}>👤 Edad: {point.people_helped.age} | Género: {point.people_helped.gender}</Text>
            <Text style={{ fontSize: 12, color: '#666' }}>
              Fecha: {new Date(point.date_register).toLocaleString()}
            </Text>
          </View>
        ))}
      </View>
    )}

    {expandedRoutes[item._id] && helpPointsByRoute[item._id]?.length === 0 && (
      <Text style={{ fontSize: 13, fontStyle: 'italic', color: '#999', marginTop: 5 }}>
        No hay personas registradas en esta ruta.
      </Text>
    )}
  </View>
);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de Rutas</Text>

      <View style={styles.filterContainer}>
        {['day', 'week', 'month', 'all'].map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.filterButton, filter === option && styles.filterButtonActive]}
            onPress={() => setFilter(option as any)}
          >
            <Text style={{ color: filter === option ? '#fff' : '#000' }}>
              {option === 'day'
                ? 'Hoy'
                : option === 'week'
                ? 'Esta semana'
                : option === 'month'
                ? 'Este mes'
                : 'Todas'}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[styles.filterButton, showOnlyMine && styles.filterButtonActive]}
          onPress={() => setShowOnlyMine(!showOnlyMine)}
        >
          <Text style={{ color: showOnlyMine ? '#fff' : '#000' }}>
            Mis rutas
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <FlatList
          data={applyFilter()}
          keyExtractor={(item: any) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.backText}>Volver al Inicio</Text>
      </TouchableOpacity>

      {/* Modal de edición */}
      {selectedRoute && (
        <Modal visible={editModalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Editar Ruta</Text>
              <TextInput
                style={styles.input}
                value={editedDescription}
                onChangeText={setEditedDescription}
                placeholder="Descripción"
              />
              <TextInput
                style={styles.input}
                value={editedStatus}
                onChangeText={setEditedStatus}
                placeholder="Estado"
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity onPress={handleSave}>
                  <Text style={styles.saveButton}>Guardar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                  <Text style={styles.cancelButton}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
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
    marginBottom: 10,
    textAlign: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
    flexWrap: 'wrap',
  },
  filterButton: {
    borderWidth: 1,
    borderColor: '#000',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginHorizontal: 5,
    marginBottom: 5,
  },
  filterButtonActive: {
    backgroundColor: '#000',
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
  options: {
    fontSize: 24,
    paddingHorizontal: 10,
    color: '#555',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginVertical: 5,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  saveButton: {
    color: 'green',
    fontWeight: 'bold',
  },
  cancelButton: {
    color: 'red',
    fontWeight: 'bold',
  },
});
