import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootStack';
import DateTimePicker from '@react-native-community/datetimepicker';

const rawUrl = Constants.expoConfig?.extra?.EXPO_PUBLIC_URL_BACKEND || '';
const backendUrl = Platform.OS === 'android' ? rawUrl.replace('localhost', '10.0.2.2') : rawUrl;

export default function RouteScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [description, setDescription] = useState('');
  const [team, setTeam] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreateRoute = async () => {
    if (!description.trim()) {
      Alert.alert('Error', 'Debes ingresar una descripción.');
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('accessToken');
      const userId = await AsyncStorage.getItem('userId');
    
      console.log('🔐 userId:', userId);
      
      const teamEmails = team
        .split(',')
        .map(email => email.trim())
        .filter(email => email.length > 0);

      const userRes = await axios.get(`${backendUrl}/user/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const users = userRes.data.message;
      const teamIds = users
        .filter((u: any) => teamEmails.includes(u.email))
        .map((u: any) => u._id);

      const body = {
        description,
        route_leader: userId,
        team: teamIds,
        status: 'activo',
        date_created: startDate,
      };

      const res = await axios.post(`${backendUrl}/route`, body, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const createdRoute = res.data.message;
      const inviteCode = res.data.message?.invite_code;

      console.log(res.data)
      Alert.alert('Ruta creada', `Código de invitación: ${inviteCode || 'No disponible'}`);
      setDescription('');
      setTeam('');

      navigation.navigate('FullMap', {
        routeId: createdRoute._id,
        isOngoing: true,
        codeRoute: inviteCode,
      });
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudo crear la ruta.');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (_: any, selectedDate?: Date) => {
    if (selectedDate) {
      const updated = new Date(startDate);
      updated.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      setStartDate(updated);
    }
    setShowDate(false);
  };

  const handleTimeChange = (_: any, selectedTime?: Date) => {
    if (selectedTime) {
      const updated = new Date(startDate);
      updated.setHours(selectedTime.getHours());
      updated.setMinutes(selectedTime.getMinutes());
      setStartDate(updated);
    }
    setShowTime(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Nueva Ruta</Text>

      <TextInput
        style={styles.input}
        placeholder="Descripción de la ruta"
        value={description}
        onChangeText={setDescription}
      />

      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Correos del equipo (separados por coma)"
        value={team}
        onChangeText={setTeam}
        multiline
      />

      <TouchableOpacity style={styles.input} onPress={() => setShowDate(true)}>
        <Text>📅 Fecha: {startDate.toLocaleDateString()}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.input} onPress={() => setShowTime(true)}>
        <Text>⏰ Hora: {startDate.toLocaleTimeString()}</Text>
      </TouchableOpacity>

      {showDate && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      {showTime && (
        <DateTimePicker
          value={startDate}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={handleCreateRoute} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Creando...' : 'Crear Ruta'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.cancelButtonText}>Volver al Inicio</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#000',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#4682B4',
    fontSize: 16,
  },
});