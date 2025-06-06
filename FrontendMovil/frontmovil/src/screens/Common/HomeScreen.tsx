import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  Modal,
  TextInput,
  Alert as RNAlert,
  ScrollView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootStack';
import MapComponent from '../../components/MapComponent';
import { useFocusEffect } from '@react-navigation/native';

const rawUrl = Constants.expoConfig?.extra?.EXPO_PUBLIC_URL_BACKEND || '';
const backendUrl = Platform.OS === 'android' ? rawUrl.replace('localhost', '10.0.2.2') : rawUrl;

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation }: Props) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [mapFullScreen, setMapFullScreen] = useState(false);
  const [alertText, setAlertText] = useState('');
  const [alertLog, setAlertLog] = useState<string[]>([]);
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-screenWidth)).current;
  const [riskMarkers, setRiskMarkers] = useState<{ latitude: number; longitude: number; description: string }[]>([]);
  const [riskMode, setRiskMode] = useState(false);
  const [riskModalVisible, setRiskModalVisible] = useState(false);
  const [riskDescription, setRiskDescription] = useState('');

  const toggleMenu = () => {
    const toValue = menuVisible ? -screenWidth : 0;
    setMenuVisible(!menuVisible);
    Animated.timing(slideAnim, {
      toValue,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  };

  const fetchAlerts = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const res = await axios.get(`${backendUrl}/notification`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const alertsArray = res.data.alerts || [];
      const userName = await AsyncStorage.getItem('userName');
      const formatted = alertsArray.map((a: any) => `${userName || 'Usuario'}: ${a.description}`);
      setAlertLog(formatted.reverse());
    } catch (err) {
      console.error('Error al obtener alertas:', err);
    }
  };

  const fetchRisks = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const res = await axios.get(`${backendUrl}/risk`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const risksArray = Array.isArray(res.data.message) ? res.data.message : [];
      const formatted = risksArray.map((r: any) => ({
        latitude: r.coords[0],
        longitude: r.coords[1],
        description: r.description || 'Riesgo sin descripción',
      }));
      setRiskMarkers(formatted);
    } catch (err) {
      console.error('Error al obtener riesgos:', err);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchAlerts();
      fetchRisks();
    }, [])
  );

  const handleSendAlert = async () => {
    if (alertText.trim().length < 5) {
      RNAlert.alert('Aviso demasiado corto', 'Escribe al menos 10 caracteres.');
      return;
    }
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const userId = await AsyncStorage.getItem('userId');
      const userName = await AsyncStorage.getItem('userName');
      await axios.post(`${backendUrl}/notification`, {
        description: alertText,
        author_id: userId,
        send_email: false,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAlertLog((prev) => [`${userName || 'Usuario'}: ${alertText}`, ...prev]);
      setAlertText('');
      setAlertModalVisible(false);
      RNAlert.alert('Aviso enviado');
    } catch (error) {
      RNAlert.alert('Error', 'No se pudo enviar el aviso');
    }
  };

  const menuOptions = [
    { label: 'Perfil', route: 'Profile' },
    { label: 'Eventos', route: 'Event' },
    { label: 'Rutas', route: 'Route' },
    { label: 'Historial', route: 'History' },
    { label: 'Usuarios', route: 'Users' },
  ];

  const handleNavigate = (route: keyof RootStackParamList) => {
    toggleMenu();
    navigation.navigate(route);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('accessToken');
    toggleMenu();
    navigation.reset({ index: 0, routes: [{ name: 'Initial' }] });
  };

  const handleMapPress = async (coord: { latitude: number; longitude: number }) => {
    if (!riskMode) return;
    setRiskMode(false);
    setRiskMarkers((prev) => [...prev, { ...coord, description: riskDescription }]);
    try {
      const token = await AsyncStorage.getItem('accessToken');
      await axios.post(`${backendUrl}/risk`, {
        coords: [coord.latitude, coord.longitude],
        description: riskDescription,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      RNAlert.alert('Riesgo añadido correctamente');
      setRiskDescription('');
    } catch (err) {
      console.error(err);
      RNAlert.alert('Error', 'No se pudo guardar el riesgo');
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.sidebar, { left: slideAnim }]}>...
        {menuOptions.map((option) => (
          <TouchableOpacity
            key={option.route}
            style={styles.menuItem}
            onPress={() => handleNavigate(option.route as keyof RootStackParamList)}
          >
            <Text style={styles.menuItemText}>{option.label}</Text>
          </TouchableOpacity>
        ))}
        <View style={styles.separator} />
        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <Text style={[styles.menuItemText, { color: 'red' }]}>Cerrar sesión</Text>
        </TouchableOpacity>
      </Animated.View>

      <TouchableOpacity style={styles.menuIconContainer} onPress={toggleMenu}>
        <Icon name="bars" size={24} color="#000" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.alertToggleButton} onPress={() => setAlertModalVisible(true)}>
        <Text style={styles.alertToggleButtonText}>Abrir Avisos</Text>
      </TouchableOpacity>

      <View style={styles.mapWrapper}>
        <MapComponent
          key={riskMarkers.map(r => `${r.latitude}-${r.longitude}`).join(',')}
          onMapPress={handleMapPress}
          riskMarkers={riskMarkers}
        />
        <TouchableOpacity style={styles.expandButton} onPress={() => setMapFullScreen(true)}>
          <Icon name="arrows-alt" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.addMarkerButton} onPress={() => setRiskModalVisible(true)}>
        <Icon name="plus" size={20} color="#fff" />
      </TouchableOpacity>

      <Modal visible={riskModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Añadir riesgo</Text>
            <Text style={{ marginBottom: 5 }}>Descripción:</Text>
            <TextInput
              style={styles.alertInput}
              placeholder="Describe brevemente el riesgo..."
              value={riskDescription}
              onChangeText={setRiskDescription}
              multiline
            />
            <TouchableOpacity
              onPress={() => {
                if (riskDescription.trim().length < 5) {
                  RNAlert.alert('Descripción muy corta', 'Escribe al menos 5 caracteres.');
                  return;
                }
                setRiskMode(true);
                setRiskModalVisible(false);
              }}
              style={styles.sendButton}
            >
              <Text style={styles.sendButtonText}>Seleccionar ubicación en el mapa</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setRiskModalVisible(false)} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={mapFullScreen} animationType="fade">
        <TouchableOpacity style={styles.fullscreenCloseButton} onPress={() => setMapFullScreen(false)}>
          <Icon name="close" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.fullscreenMap}>
          <MapComponent
            key={riskMarkers.map(r => `${r.latitude}-${r.longitude}`).join(',')}
            onMapPress={handleMapPress}
            riskMarkers={riskMarkers}
          />
        </View>
      </Modal>

      <Modal visible={alertModalVisible} animationType="slide">
        <ScrollView contentContainerStyle={styles.alertModalContainer}>
          <Text style={styles.alertTitle}>Avisos</Text>
          <View style={styles.alertLog}>
            {alertLog.map((msg, i) => (
              <Text key={i} style={styles.alertMsg}>{msg}</Text>
            ))}
          </View>
          <TextInput
            style={styles.alertInput}
            placeholder="Escribe un aviso importante..."
            multiline
            numberOfLines={4}
            value={alertText}
            onChangeText={setAlertText}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSendAlert}>
            <Text style={styles.sendButtonText}>Enviar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setAlertModalVisible(false)}>
            <Text style={styles.cancelButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    justifyContent: 'flex-end',
  },
  alertToggleButton: {
    backgroundColor: '#222',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  alertToggleButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  alertModalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  alertTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  alertInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    minHeight: 80,
    backgroundColor: '#f9f9f9',
    marginTop: 10,
  },
  sendButton: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
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
  alertLog: {
    marginTop: 10,
    maxHeight: 200,
  },
  alertMsg: {
    fontSize: 14,
    marginVertical: 4,
    color: '#333',
  },
  menuIconContainer: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  mapWrapper: {
    height: screenHeight * 0.75,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  fullscreenMap: {
    flex: 1,
  },
  fullscreenCloseButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    backgroundColor: '#000',
    padding: 8,
    borderRadius: 30,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 250,
    backgroundColor: '#f0f0f0',
    paddingTop: 80,
    paddingHorizontal: 20,
    zIndex: 20,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 15,
  },
  menuItemText: {
    fontSize: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  expandButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 30,
    zIndex: 5,
  },
  addMarkerButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 30,
    zIndex: 5,
  },
  modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'center',
  alignItems: 'center',
},
modalBox: {
  backgroundColor: '#fff',
  borderRadius: 10,
  padding: 20,
  width: '85%',
},
modalTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 10,
},
});