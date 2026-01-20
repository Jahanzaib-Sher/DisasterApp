import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

const MapScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Map View is not supported on Web.</Text>
            <Text style={styles.text}>Please use Android or iOS.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
    text: {
        fontSize: 18,
        color: COLORS.text,
    },
});

export default MapScreen;
