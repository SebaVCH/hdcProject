import React, { useState, useRef, useEffect } from 'react';
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
    const res = await axios.get(`${backendUrl}/alert`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("📦 Respuesta de /alert:", res.data);

    const alertsArray = res.data.alerts || [];
    const userName = await AsyncStorage.getItem('userName');

    const formatted = alertsArray.map((a: any) => `${userName || 'Usuario'}: ${a.description}`);
    setAlertLog(formatted.reverse());
  } catch (err) {
    console.error('Error al obtener alertas:', err);
  }
};

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleSendAlert = async () => {
    if (alertText.trim().length < 10) {
      RNAlert.alert('Aviso demasiado corto', 'Escribe al menos 10 caracteres.');
      return;
    }
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const userName = await AsyncStorage.getItem('userName');

      await axios.post(
        `${backendUrl}/alert`,
        { description: alertText },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAlertLog((prev) => [`${userName || 'Usuario'}: ${alertText}`, ...prev]);
      setAlertText('');
      setAlertModalVisible(false);
      RNAlert.alert('Aviso enviado');
    } catch (error) {
      console.error('Error al enviar alerta:', error);
      RNAlert.alert('Error', 'No se pudo enviar el aviso');
    }
  };

  const menuOptions = [
    { label: 'Perfil', route: 'Profile' },
    { label: 'Actividades', route: 'Activities' },
    { label: 'Planificar', route: 'Plan' },
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

      <TouchableOpacity
        style={styles.alertToggleButton}
        onPress={() => setAlertModalVisible(true)}
      >
        <Text style={styles.alertToggleButtonText}>Abrir Avisos</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.mapWrapper}
        onPress={() => setMapFullScreen(true)}
        activeOpacity={0.95}
      >
        <MapComponent />
      </TouchableOpacity>

      <Modal visible={mapFullScreen} animationType="fade">
        <TouchableOpacity
          style={styles.fullscreenCloseButton}
          onPress={() => setMapFullScreen(false)}
        >
          <Icon name="close" size={28} color="#fff" />
        </TouchableOpacity>
        <View style={styles.fullscreenMap}>
          <MapComponent />
        </View>
      </Modal>

      <Modal visible={alertModalVisible} animationType="slide">
        <View style={styles.alertModalContainer}>
          <Text style={styles.alertTitle}>Avisos</Text>

          <ScrollView style={styles.alertLog}>
            {alertLog.map((msg, i) => (
              <Text key={i} style={styles.alertMsg}>{msg}</Text>
            ))}
          </ScrollView>

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

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setAlertModalVisible(false)}
          >
            <Text style={styles.cancelButtonText}>Cerrar</Text>
          </TouchableOpacity>
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
});