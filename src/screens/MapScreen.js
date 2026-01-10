import React from 'react';
import { View, StyleSheet, Dimensions, Platform, Text } from 'react-native';
// Only import MapView on native to avoid web crashes if not configured
let MapView, Marker;
if (Platform.OS !== 'web') {
    MapView = require('react-native-maps').default;
    Marker = require('react-native-maps').Marker;
}

import { COLORS } from '../constants/theme';

const MapScreen = () => {
    if (Platform.OS === 'web') {
        return (
            <View style={styles.container}>
                <Text style={styles.webText}>Map View is not fully supported on Web yet.</Text>
                <Text style={styles.webText}>Check on iOS/Android.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 37.78825,
                    longitude: -122.4324,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                <Marker
                    coordinate={{ latitude: 37.78825, longitude: -122.4324 }}
                    title="You are here"
                    description="Current safe location"
                    pinColor={COLORS.primary}
                />
                <Marker
                    coordinate={{ latitude: 37.79825, longitude: -122.4424 }}
                    title="Shelter A"
                    description="Capacity: High"
                    pinColor={COLORS.safety}
                />
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' },
    map: { width: Dimensions.get('window').width, height: Dimensions.get('window').height },
    webText: { fontSize: 18, color: COLORS.text, marginBottom: 10 }
});

export default MapScreen;
