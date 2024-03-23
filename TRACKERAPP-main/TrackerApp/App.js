import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import CoordinateList from './components/CoordinateList'; 
import * as Location from 'expo-location';

const App = () => {
  // Tilamuuttujat alkutilalle, nykyiselle sijainnille ja aiemmille koordinaateille
  const [initialRegion, setInitialRegion] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [pastCoordinates, setPastCoordinates] = useState([]);

  // Käsittelijä kartan painalluksille
  const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent;
    setCurrentLocation(coordinate);
  };

 // Funktio nykyisen sijainnin tallentamiselle
  const saveCoordinates = () => {
    if (currentLocation) {
      setPastCoordinates([...pastCoordinates, currentLocation]);
      setCurrentLocation(null); 
    }
  };
  // Funktio valitun koordinaatin merkitsemiselle kartalle
  const pinCoordinate = (coordinate) => {
    setCurrentLocation(coordinate);
  };

// Pyydetään käyttäjältä lupa sijaintipalveluihin
  const startLocating = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied');
        return;
      }
// Haetaan nykyinen sijainti ja asetetaan se alkutilaksi ja nykyiseksi sijainniksi
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setInitialRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      setCurrentLocation({ latitude, longitude });
    } catch (error) {
      console.error('Error getting user location:', error);
      Alert.alert('Error Failed to get user location.');
    }
  };

 // Funktio aiempien koordinaattien nollaamisell
  const resetCoordinates = () => {
    setPastCoordinates([]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adventure Tracker</Text>
      {!initialRegion && (
        <Button title="Start Locating" onPress={startLocating} />
      )}
      {initialRegion && (
        <MapView
          style={styles.map}
          initialRegion={initialRegion}
          onPress={handleMapPress}
        >
          {currentLocation && (
            <Marker
              coordinate={currentLocation}
              title="Current Location"
              pinColor="blue"
            />
          )}
        </MapView>
      )}
      {currentLocation && (
        <View style={styles.coordinatesContainer}>
          <Text>Current Location Coordinates:</Text>
          <Text>{`Latitude: ${currentLocation.latitude.toFixed(6)}`}</Text>
          <Text>{`Longitude: ${currentLocation.longitude.toFixed(6)}`}</Text>
          <Button title="Save Coordinates" onPress={saveCoordinates} />
        </View>
      )}
      <View style={styles.buttonContainer}>
        <Button title="Reset Coordinates" onPress={resetCoordinates} />
      </View>
      
      <CoordinateList pastCoordinates={pastCoordinates} pinCoordinate={pinCoordinate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginTop:20,
    marginBottom: 20,
  },
  map: {
    width: '100%',
    height: 300,
    marginBottom: 20,
  },
  coordinatesContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    marginBottom: 10,
  },
});

export default App;
