import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootStack';
import { Modal } from 'react-native';

export default function EventScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedDate, setSelectedDate] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventTime, setEventTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [eventDescription, setEventDescription] = useState('');
  const [markedDates, setMarkedDates] = useState<{ [date: string]: { marked: boolean; dotColor?: string; selected?: boolean; selectedColor?: string } }>({});
  const [eventsForSelectedDate, setEventsForSelectedDate] = useState<any[]>([]);
  const [showEventModal, setShowEventModal] = useState(false);

    const handleDatePress = async (date: string) => {
    setSelectedDate(date);
    try {
        const stored = await AsyncStorage.getItem('events');
        const events = stored ? JSON.parse(stored) : [];
        const filtered = events.filter((e: any) => e.date === date);
        setEventsForSelectedDate(filtered);
        setShowEventModal(true);
    } catch (err) {
        console.error('Error al obtener eventos del día:', err);
    }
    };

    const loadMarkedDates = async () => {
    try {
        const stored = await AsyncStorage.getItem('events');
        const events = stored ? JSON.parse(stored) : [];

        const newMarked: { [date: string]: { marked: boolean; dotColor: string } } = {};
        events.forEach((event: any) => {
        newMarked[event.date] = { marked: true, dotColor: '#000' };
        });

        // Marcar también el día seleccionado si corresponde
        if (selectedDate) {
        newMarked[selectedDate] = {
            ...(newMarked[selectedDate] || {}),
            selected: true,
            selectedColor: '#000',
        };
        }

            setMarkedDates(newMarked);
        } catch (err) {
            console.error('Error al cargar eventos:', err);
        }
        };

    useEffect(() => {
    loadMarkedDates();
    }, [selectedDate]);

    const handleCreateEvent = async () => {
    if (!eventName || !selectedDate) {
        Alert.alert('Faltan datos', 'Debes ingresar nombre y fecha del evento.');
        return;
    }

    const newEvent = {
        name: eventName,
        date: selectedDate,
        time: eventTime.toLocaleTimeString(),
        description: eventDescription,
    };

    try {
        const existing = await AsyncStorage.getItem('events');
        const events = existing ? JSON.parse(existing) : [];
        events.push(newEvent);
        await AsyncStorage.setItem('events', JSON.stringify(events));

        Alert.alert('Evento guardado', 'El evento ha sido guardado exitosamente.');

        setEventName('');
        setEventDescription('');
        setSelectedDate('');

        await loadMarkedDates(); // 🔁 Vuelve a cargar fechas marcadas
    } catch (error) {
        console.error('Error al guardar evento', error);
        Alert.alert('Error', 'No se pudo guardar el evento.');
    }
    };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Calendario de Eventos</Text>

      <Calendar
        onDayPress={(day) => handleDatePress(day.dateString)}
        markedDates={markedDates}
        style={styles.calendar}
      />

      <View style={styles.formSection}>
        <TextInput
          placeholder="Nombre del evento"
          value={eventName}
          onChangeText={setEventName}
          style={styles.input}
        />

        <TouchableOpacity
          onPress={() => setShowTimePicker(true)}
          style={styles.timeButton}
        >
          <Text style={styles.timeButtonText}>Seleccionar hora</Text>
        </TouchableOpacity>
        <Text style={styles.selectedTime}>Hora: {eventTime.toLocaleTimeString()}</Text>

        {showTimePicker && (
          <DateTimePicker
            value={eventTime}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={(event, selected) => {
              if (selected) {
                setEventTime(selected);
              }
              setShowTimePicker(false);
            }}
          />
        )}

        <TextInput
          placeholder="Descripción"
          value={eventDescription}
          onChangeText={setEventDescription}
          multiline
          numberOfLines={3}
          style={[styles.input, { height: 70 }]}
        />

        <TouchableOpacity style={styles.createButton} onPress={handleCreateEvent}>
          <Text style={styles.createButtonText}>Crear Evento</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.backButtonText}>Volver al Inicio</Text>
      </TouchableOpacity>
      <Modal
        visible={showEventModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEventModal(false)}
        >
        <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Eventos del {selectedDate}</Text>
            {eventsForSelectedDate.length > 0 ? (
                eventsForSelectedDate.map((event, index) => (
                <View key={index} style={styles.modalEventBox}>
                    <Text style={{ fontWeight: 'bold' }}>{event.name}</Text>
                    <Text>🕒 {event.time}</Text>
                    <Text>📝 {event.description}</Text>
                </View>
                ))
            ) : (
                <Text style={{ textAlign: 'center' }}>No hay eventos.</Text>
            )}
            <TouchableOpacity
                onPress={() => setShowEventModal(false)}
                style={styles.modalCloseButton}
            >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Cerrar</Text>
            </TouchableOpacity>
            </View>
        </View>
        </Modal>
    </ScrollView>
    
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  calendar: {
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  formSection: {
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  timeButton: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 5,
  },
  timeButtonText: {
    color: '#fff',
  },
  selectedTime: {
    marginBottom: 10,
    fontSize: 16,
  },
  createButton: {
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  backButton: {
    alignSelf: 'center',
    marginTop: 20,
    padding: 10,
  },
  backButtonText: {
    color: '#4682B4',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'center',
  alignItems: 'center',
},
modalContainer: {
  backgroundColor: '#fff',
  padding: 20,
  borderRadius: 10,
  width: '85%',
  maxHeight: '80%',
},
modalTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 10,
  textAlign: 'center',
},
modalEventBox: {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  padding: 10,
  marginBottom: 10,
},
modalCloseButton: {
  backgroundColor: '#000',
  padding: 10,
  borderRadius: 8,
  alignItems: 'center',
  marginTop: 10,
},
});