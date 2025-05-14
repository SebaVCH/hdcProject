import React, { useRef, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';

type MarkerData = {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
};

type Props = {
  markers?: MarkerData[];
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
  const initialRegion: Region = {
    latitude: -29.9533,
    longitude: -71.3391,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState(initialRegion);

  const handleZoom = (zoomIn: boolean) => {
    const factor = zoomIn ? 0.5 : 2; // 0.5 = zoom in, 2 = zoom out
    const newRegion: Region = {
      ...region,
      latitudeDelta: region.latitudeDelta * factor,
      longitudeDelta: region.longitudeDelta * factor,
    };
    setRegion(newRegion);
    mapRef.current?.animateToRegion(newRegion, 300);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={region}
        zoomEnabled={true}
        scrollEnabled={true}
        showsUserLocation={true}
        showsMyLocationButton={true}
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

      {/* Botones de zoom */}
      <View style={styles.zoomControls}>
        <TouchableOpacity style={styles.zoomButton} onPress={() => handleZoom(true)}>
          <Text style={styles.zoomText}>＋</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.zoomButton} onPress={() => handleZoom(false)}>
          <Text style={styles.zoomText}>−</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  zoomControls: {
    position: 'absolute',
    right: 10,
    bottom: 20,
    flexDirection: 'column',
  },
  zoomButton: {
    backgroundColor: '#fff',
    borderRadius: 25,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  zoomText: {
    fontSize: 24,
    color: '#000',
    fontWeight: 'bold',
  },
});
