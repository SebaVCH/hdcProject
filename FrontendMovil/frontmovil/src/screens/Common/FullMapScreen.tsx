// FullMapScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert, Platform, Modal, TextInput
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootStack';
import MapComponent from '../../components/MapComponent';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';

const rawUrl = Constants.expoConfig?.extra?.EXPO_PUBLIC_URL_BACKEND || '';
const backendUrl = Platform.OS === 'android' ? rawUrl.replace('localhost', '10.0.2.2') : rawUrl;
const screenHeight = Dimensions.get('window').height;

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'FullMap'>;

export default function FullMapScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'FullMap'>>();
  const navigation = useNavigation<NavigationProp>();
  const { routeId, isOngoing, codeRoute } = route.params || {};

  const [riskMarkers, setRiskMarkers] = useState<any[]>([]);
  const [helpMarkers, setHelpMarkers] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [helpModalVisible, setHelpModalVisible] = useState(false);
  const [description, setDescription] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [mode, setMode] = useState<'risk' | 'help' | null>(null);

  const fetchAllMarkers = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
    
      console.log('Fetching /risk...');
      const riskRes = await axios.get(`${backendUrl}/risk`, {
        headers: { Authorization: `Bearer ${token}` },
      });
        console.log('Fetching /helppoint...');
      const helpRes = await axios.get(`${backendUrl}/helping-point`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const risks = (riskRes.data.message || []).map((r: any) => ({
        latitude: r.coords[0],
        longitude: r.coords[1],
        description: r.description,
      }));
      const helps = (helpRes.data.message || []).map((h: any) => ({
        latitude: h.coords[0],
        longitude: h.coords[1],
        description: 'Punto de ayuda',
      }));

      setRiskMarkers(risks);
      setHelpMarkers(helps);
    } catch (err) {
      console.error('Error al obtener marcadores:', err);
    }
  };

  useEffect(() => {
    fetchAllMarkers();
  }, []);

  const handleMapPress = async ({ latitude, longitude }: { latitude: number, longitude: number }) => {
    if (!mode) return; // Evita registro si no se ha seleccionado

    const token = await AsyncStorage.getItem('accessToken');

    if (mode === 'risk') {
      try {
        await axios.post(`${backendUrl}/risk`, {
          coords: [latitude, longitude],
          description,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRiskMarkers(prev => [...prev, { latitude, longitude, description }]);
        Alert.alert('Riesgo registrado');
      } catch {
        Alert.alert('Error al guardar el riesgo');
      }
    }

    if (mode === 'help') {
      try {
        const helpPoint = {
          route_id: routeId,
          coords: [latitude, longitude],
          people_helped: {
            age: age ? parseInt(age) : undefined,
            gender: gender || undefined,
          }
        };
        await axios.post(`${backendUrl}/helping-point`, helpPoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHelpMarkers(prev => [...prev, { latitude, longitude, description: 'Punto de ayuda' }]);
        Alert.alert('Atención registrada');
      } catch (err : any) {
        console.log('❌ Error al registrar atención:', err.response?.data || err.message);
        Alert.alert('Error al registrar atención');
      }
    }

    setMode(null);
    setHelpModalVisible(false);
    setModalVisible(false);
    setDescription('');
    setAge('');
    setGender('');
  };

  const handleFinishRoute = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      await axios.put(`${backendUrl}/route/${routeId}`, { status: 'cerrado' }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert('Ruta finalizada');
      navigation.navigate('Home');
    } catch {
      Alert.alert('Error al finalizar la ruta');
    }
  };

  return (
    <View style={styles.container}>
      {isOngoing && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>Ruta iniciada {codeRoute ? `(Código: ${codeRoute})` : '' }</Text>
        </View>
      )}

      <MapComponent
        onMapPress={handleMapPress}
        riskMarkers={riskMarkers}
        helpMarkers={helpMarkers}
      />

      <TouchableOpacity style={styles.finishButton} onPress={handleFinishRoute}>
        <Text style={styles.finishButtonText}>Finalizar Ruta</Text>
        <Icon name="check" size={16} color="#fff" style={{ marginLeft: 6 }} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Icon name="plus" size={20} color="#fff" />
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>¿Qué desea registrar?</Text>
            <TouchableOpacity onPress={() => {
              setMode('risk');
              setModalVisible(false);
              Alert.alert('Selecciona en el mapa el lugar del riesgo');
            }} style={styles.optionButton}>
              <Text style={styles.sendButtonText}>Registrar Riesgo</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              setMode('help');
              setModalVisible(false);
              setHelpModalVisible(true);
            }} style={styles.optionButton}>
              <Text style={styles.sendButtonText}>Registrar Atención</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={helpModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Registrar Atención</Text>
            <TextInput placeholder="Edad (opcional)" value={age} onChangeText={setAge} keyboardType="numeric" style={styles.alertInput} />
            <TextInput placeholder="Género (opcional)" value={gender} onChangeText={setGender} style={styles.alertInput} />
            <TouchableOpacity
              onPress={() => {
                setHelpModalVisible(false);
                setMode('help');
                Alert.alert('Selecciona en el mapa la ubicación del punto de ayuda');
              }}
              style={styles.optionButton}
            >
              <Text style={styles.sendButtonText}>Seleccionar en el mapa</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setHelpModalVisible(false)} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  banner: { backgroundColor: '#2E8B57', padding: 12, alignItems: 'center' },
  bannerText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  finishButton: {
    position: 'absolute', top: 50, right: 5,
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#000', paddingHorizontal: 15, paddingVertical: 10,
    borderRadius: 30, zIndex: 10,
  },
  finishButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  addButton: {
    position: 'absolute', bottom: 20, left: 20,
    backgroundColor: '#000', padding: 12, borderRadius: 30, zIndex: 10,
  },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff', borderRadius: 10, padding: 20, width: '85%',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  alertInput: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 10,
    padding: 10, fontSize: 16, marginBottom: 10,
  },
  optionButton: {
    backgroundColor: '#000', padding: 10,
    borderRadius: 8, marginVertical: 5, alignItems: 'center',
  },
  sendButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  cancelButton: { marginTop: 10, alignItems: 'center' },
  cancelButtonText: { color: '#4682B4', fontSize: 16, fontWeight: 'bold' },
});