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
  const [alertText, setAlertText] = useState('');
  const [alertLog, setAlertLog] = useState<string[]>([]);
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-screenWidth)).current;
  const [riskMarkers, setRiskMarkers] = useState<{ latitude: number; longitude: number; description: string }[]>([]);
  const [helpMarkers, setHelpMarkers] = useState<{ latitude: number; longitude: number; description: string }[]>([]);
  const [joinRouteVisible, setJoinRouteVisible] = useState(false);
  const [invitationCode, setInvitationCode] = useState('');

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

  const fetchHelpPoints = async () => {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    const res = await axios.get(`${backendUrl}/helping-point`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const helpArray = Array.isArray(res.data.message) ? res.data.message : [];
    const formatted = helpArray.map((h: any) => ({
      latitude: h.coords[0],
      longitude: h.coords[1],
      description: 'Punto de ayuda',
    }));
    setHelpMarkers(formatted);
  } catch (err) {
    console.error('Error al obtener puntos de ayuda:', err);
  }
};

  useFocusEffect(
    React.useCallback(() => {
      fetchAlerts();
      fetchRisks();
      fetchHelpPoints();
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

  return (
    <View style={styles.container}>
            {menuVisible && (
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={toggleMenu}>
          <View />
        </TouchableOpacity>
      )}

      <Animated.View style={[styles.sidebar, { left: slideAnim }]}>
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

      <TouchableOpacity style={[styles.alertToggleButton, { backgroundColor: '#4682B4' }]} onPress={() => setJoinRouteVisible(true)}>
        <Text style={styles.alertToggleButtonText}>Unirse a Ruta</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.alertToggleButton} onPress={() => setAlertModalVisible(true)}>
        <Text style={styles.alertToggleButtonText}>Abrir Avisos</Text>
      </TouchableOpacity>

      <View style={styles.mapWrapper}>
        <MapComponent
          key={[...riskMarkers, ...helpMarkers].map(m => `${m.latitude}-${m.longitude}`).join(',')}
          riskMarkers={riskMarkers}
          helpMarkers={helpMarkers}
        />
      </View>

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

      <Modal visible={joinRouteVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.alertTitle}>Unirse a una Ruta</Text>
            <TextInput
              style={styles.alertInput}
              placeholder="Código de invitación"
              value={invitationCode}
              onChangeText={setInvitationCode}
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={async () => {
                try {
                  const token = await AsyncStorage.getItem('accessToken');
                  const res = await axios.get(`${backendUrl}/route/code/${invitationCode}`, {
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  if (res.data?.message) {
                    setJoinRouteVisible(false);
                    setInvitationCode('');
                    navigation.navigate('FullMap', { routeId: res.data.message._id });
                  } else {
                    RNAlert.alert('Error', 'Código inválido o ruta no encontrada');
                  }
                } catch (error) {
                  RNAlert.alert('Error', 'No se pudo encontrar la ruta');
                }
              }}
            >
              <Text style={styles.sendButtonText}>Unirse</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setJoinRouteVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    zIndex: 30, // ← AUMENTA este valor
    backgroundColor: '#fff', // opcional para visibilidad
    padding: 8,               // opcional para más área táctil
    borderRadius: 20,         // opcional para que se vea circular
    elevation: 10,            // para Android
  },
  mapWrapper: {
    height: screenHeight * 0.75,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
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
  modalOverlay: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalBox: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  overlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  width: screenWidth,
  height: screenHeight,
  backgroundColor: 'rgba(0, 0, 0, 0.2)',
  zIndex: 15,
},
});
