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
    // Map report type to icon
    const getIcon = (type) => {
        switch (type?.toLowerCase()) {
            case 'fire': return 'flame';
            case 'flood': return 'water';
            case 'earthquake': return 'earth';
            case 'accident': return 'medical';
            default: return 'alert-circle';
        }
    };

    // Map severity to color
    const getSeverityColor = (severity) => {
        switch (severity?.toLowerCase()) {
            case 'critical': return COLORS.danger;
            case 'high': return '#FF7043';
            case 'medium': return COLORS.warning;
            case 'low': return COLORS.safety;
            default: return COLORS.primary;
        }
    };

    return (
        <View style={[styles.card, { borderLeftColor: getSeverityColor(item.severity) }]}>
            <View style={styles.cardHeader}>
                <Ionicons
                    name={getIcon(item.type)}
                    size={24}
                    color={getSeverityColor(item.severity)}
                />
                <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.cardTitle}>{item.type} Alert</Text>
                    <Text style={styles.cardTime}>{item.time}</Text>
                </View>
                <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(item.severity) }]}>
                    <Text style={styles.severityText}>{item.severity}</Text>
                </View>
            </View>
            <Text style={styles.cardLocation}>📍 {item.location}</Text>
            <Text style={styles.cardDesc}>{item.description}</Text>

            <TouchableOpacity
                style={styles.shareButton}
                onPress={() => Share.share({ message: `⚠️ DISASTER ALERT: ${item.type} at ${item.location}. ${item.description}` })}
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
    card: { 
        backgroundColor: COLORS.white, 
        borderRadius: SIZES.radius, 
        padding: SIZES.padding, 
        marginBottom: 16, 
        elevation: 3,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.primary
    },
    cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    cardTitle: { fontSize: SIZES.h3, fontWeight: 'bold', flex: 1 },
    cardTime: { fontSize: 12, color: COLORS.gray },
    severityBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
    severityText: { color: COLORS.white, fontSize: 10, fontWeight: 'bold' },
    cardLocation: { color: COLORS.secondary, marginBottom: 8, fontWeight: '600' },
    cardDesc: { color: COLORS.gray, marginBottom: 12 },
    shareButton: {
        flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start',
        backgroundColor: COLORS.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20
    },
    shareText: { color: COLORS.white, fontWeight: 'bold', fontSize: 12, marginLeft: 6 }
});

export default AlertsScreen;
