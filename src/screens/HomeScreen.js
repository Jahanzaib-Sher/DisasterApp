import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Linking, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';

const HomeScreen = () => {
    const [status, setStatus] = useState('SAFE'); // SAFE, WARNING, DANGER

    const handleSOS = () => {
        if (Platform.OS === 'web') {
            const confirmed = window.confirm('CONFIRM SOS\nAre you sure you want to call Rescue 1122?');
            if (confirmed) {
                Linking.openURL('tel:1122');
            }
        } else {
            Alert.alert(
                'CONFIRM SOS',
                'Are you sure you want to call Rescue 1122?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'CALL 1122',
                        style: 'destructive',
                        onPress: () => Linking.openURL('tel:1122')
                    }
                ]
            );
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>DisasterGuard</Text>
                <View style={[styles.statusBadge, { backgroundColor: status === 'SAFE' ? COLORS.safety : COLORS.danger }]}>
                    <Text style={styles.statusText}>{status}</Text>
                </View>
            </View>

            <View style={styles.content}>
                <Text style={styles.subtitle}>Emergency Beacon</Text>

                <TouchableOpacity style={styles.sosButton} onPress={handleSOS} activeOpacity={0.8}>
                    <View style={styles.sosInnerRing}>
                        <Text style={styles.sosText}>SOS</Text>
                    </View>
                </TouchableOpacity>

                <Text style={styles.instruction}>Tap to send alert</Text>

                <View style={styles.infoCard}>
                    <Ionicons name="location" size={24} color={COLORS.primary} />
                    <View style={styles.infoTextContainer}>
                        <Text style={styles.infoTitle}>Current Location</Text>
                        <Text style={styles.infoBody}>Unknown Location (Mock)</Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SIZES.padding, backgroundColor: COLORS.white, elevation: 2 },
    headerTitle: { fontSize: SIZES.h2, fontWeight: 'bold', color: COLORS.text },
    statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 16 },
    statusText: { color: COLORS.white, fontWeight: 'bold' },
    content: { flex: 1, alignItems: 'center', padding: SIZES.padding, justifyContent: 'center' },
    subtitle: { fontSize: SIZES.h2, marginBottom: 40, color: COLORS.gray },
    sosButton: {
        width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255, 87, 51, 0.2)',
        justifyContent: 'center', alignItems: 'center', marginBottom: 20
    },
    sosInnerRing: {
        width: 160, height: 160, borderRadius: 80, backgroundColor: COLORS.primary,
        justifyContent: 'center', alignItems: 'center', elevation: 10, shadowColor: COLORS.primary, shadowOpacity: 0.5, shadowRadius: 10
    },
    sosText: { fontSize: 40, fontWeight: 'bold', color: COLORS.white },
    instruction: { fontSize: SIZES.body, color: COLORS.gray, marginBottom: 40 },
    infoCard: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white,
        padding: SIZES.padding, borderRadius: SIZES.radius, width: '100%', elevation: 2
    },
    infoTextContainer: { marginLeft: 16 },
    infoTitle: { fontWeight: 'bold', fontSize: SIZES.h3 },
    infoBody: { color: COLORS.gray }
});

export default HomeScreen;
