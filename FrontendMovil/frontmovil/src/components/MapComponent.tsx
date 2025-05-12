import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

type MarkerData = {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
};

type Props = {
  markers?: MarkerData[]; // Permite pasar marcadores desde HomeScreen
};

const defaultMarkers: MarkerData[] = [
   {
    id: '1',
    title: 'Mall Vivo Coquimbo',
    description: 'Ubicación inicial del mapa',
    latitude: -29.9533,
    longitude: -71.3391,
  },
];

export default function MapComponent({ markers = defaultMarkers }: Props) {
  const initialRegion = {
    latitude: -29.9533,
    longitude: -71.3391,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={marker.title}
            description={marker.description}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 300,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 10,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
