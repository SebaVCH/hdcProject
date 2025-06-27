import React, { useRef, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region, Circle } from 'react-native-maps';


type RiskMarker = {
  latitude: number;
  longitude: number;
  description: string;
};

type HelpMarker = {
  latitude: number;
  longitude: number;
  description: string;
};

type Props = {
  riskMarkers?: RiskMarker[];
  helpMarkers?: HelpMarker[];
  onMapPress?: (coord: { latitude: number; longitude: number }) => void;
};


export default function MapComponent({
  riskMarkers = [],
  helpMarkers = [],
  onMapPress,
}: Props) {
  const initialRegion: Region = {
    latitude: -29.9533,
    longitude: -71.3391,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState(initialRegion);

  const handleZoom = (zoomIn: boolean) => {
    const factor = zoomIn ? 0.5 : 2;
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
        zoomEnabled
        scrollEnabled
        showsUserLocation
        showsMyLocationButton
        onPress={(e) => {
          if (onMapPress) onMapPress(e.nativeEvent.coordinate);
        }}
      >
        {riskMarkers.map((risk, index) => (
          <React.Fragment key={`risk-${index}`}>
            <Marker
              coordinate={{
                latitude: risk.latitude,
                longitude: risk.longitude,
              }}
              pinColor="red"
              title="Riesgo"
              description={risk.description}
            />
            <Circle
              center={{
                latitude: risk.latitude,
                longitude: risk.longitude,
              }}
              radius={80}
              strokeColor="rgba(255, 0, 0, 0.6)"
              fillColor="rgba(255, 0, 0, 0.2)"
            />
          </React.Fragment>
        ))}

        {helpMarkers.map((help, index) => (
          <React.Fragment key={`help-${index}`}>
            <Marker
              coordinate={{
                latitude: help.latitude,
                longitude: help.longitude,
              }}
              pinColor="lightgreen"
              title="Punto de Ayuda"
              description={help.description}
            />
            <Circle
              center={{
                latitude: help.latitude,
                longitude: help.longitude,
              }}
              radius={80}
              strokeColor="rgba(0, 255, 0, 0.6)"
              fillColor="rgba(0, 255, 0, 0.2)"
            />
          </React.Fragment>
        ))}
      </MapView>

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
