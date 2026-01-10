import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

const MOCK_ALERTS = [
    { id: '1', title: 'Heavy Rain Warning', severity: 'medium', location: 'Downtown', time: '10 mins ago', desc: 'Expect heavy rainfall in the next hour. Seek shelter.' },
    { id: '2', title: 'Earthquake Alert', severity: 'high', location: 'City Center', time: '2 mins ago', desc: 'Magnitude 5.4 earthquake detected. Drop, Cover, and Hold On.' },
    { id: '3', title: 'Flood Watch', severity: 'low', location: 'Riverside', time: '1 hour ago', desc: 'River levels rising. Monitor local news.' },
];

const AlertCard = ({ item }) => {
    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Ionicons
                    name="warning"
                    size={24}
                    color={item.severity === 'high' ? COLORS.danger : (item.severity === 'medium' ? COLORS.warning : COLORS.safety)}
                />
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardTime}>{item.time}</Text>
            </View>
            <Text style={styles.cardLocation}>📍 {item.location}</Text>
            <Text style={styles.cardDesc}>{item.desc}</Text>

            <TouchableOpacity
                style={styles.shareButton}
                onPress={() => Share.share({ message: `⚠️ DISASTER ALERT: ${item.title} at ${item.location}. ${item.desc}` })}
            >
                <Ionicons name="share-social" size={16} color={COLORS.white} />
                <Text style={styles.shareText}>Share Alert</Text>
            </TouchableOpacity>
        </View>
    );
};

import { useDisaster } from '../context/DisasterContext';

const AlertsScreen = () => {
    const { approvedReports } = useDisaster();

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Active Alerts</Text>
            <FlatList
                data={approvedReports}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <AlertCard item={item} />}
                contentContainerStyle={styles.list}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: { fontSize: SIZES.h1, fontWeight: 'bold', padding: SIZES.padding, color: COLORS.text, backgroundColor: COLORS.white },
    list: { padding: SIZES.padding },
    card: { backgroundColor: COLORS.white, borderRadius: SIZES.radius, padding: SIZES.padding, marginBottom: 16, elevation: 3 },
    cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    cardTitle: { fontSize: SIZES.h3, fontWeight: 'bold', flex: 1, marginLeft: 8 },
    cardTime: { fontSize: 12, color: COLORS.gray },
    cardLocation: { color: COLORS.secondary, marginBottom: 8, fontWeight: '600' },
    cardDesc: { color: COLORS.gray, marginBottom: 12 },
    shareButton: {
        flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start',
        backgroundColor: COLORS.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20
    },
    shareText: { color: COLORS.white, fontWeight: 'bold', fontSize: 12, marginLeft: 6 }
});

export default AlertsScreen;
