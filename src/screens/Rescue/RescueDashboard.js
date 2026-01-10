import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useDisaster } from '../../context/DisasterContext';

const URGENT_TASKS = [
    { id: '1', type: 'Fire', location: 'Sector F-7, Islamabad', status: 'Pending', severity: 'High' },
    { id: '2', type: 'Flood', location: 'Rawal Dam Area', status: 'In Progress', severity: 'Critical' },
    { id: '3', type: 'Medical', location: 'Blue Area', status: 'Pending', severity: 'Medium' },
];

const TaskCard = ({ item }) => (
    <View style={styles.card}>
        <View style={styles.cardHeader}>
            <View style={[styles.badge, { backgroundColor: item.severity === 'Critical' ? COLORS.danger : COLORS.warning }]}>
                <Text style={styles.badgeText}>{item.severity}</Text>
            </View>
            <Text style={styles.status}>{item.status}</Text>
        </View>
        <Text style={styles.type}>{item.type} Emergency</Text>
        <Text style={styles.location}>📍 {item.location}</Text>
        <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>ACCEPT MISSION</Text>
        </TouchableOpacity>
    </View>
);

const RescueDashboard = ({ onLogout }) => {
    const { approvedReports } = useDisaster();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Rescue Command</Text>
                <TouchableOpacity onPress={onLogout}>
                    <Ionicons name="log-out-outline" size={24} color={COLORS.white} />
                </TouchableOpacity>
            </View>

            <View style={styles.statsRow}>
                <View style={styles.statBox}>
                    <Text style={styles.statNumber}>{approvedReports.length}</Text>
                    <Text style={styles.statLabel}>Active</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statNumber}>5</Text>
                    <Text style={styles.statLabel}>Pending</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statNumber}>38</Text>
                    <Text style={styles.statLabel}>Resolved</Text>
                </View>
            </View>

            <Text style={styles.sectionTitle}>Urgent Missions (Approved Reports)</Text>
            <FlatList
                data={approvedReports}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <TaskCard item={item} />}
                contentContainerStyle={styles.list}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SIZES.padding, backgroundColor: COLORS.safety },
    headerTitle: { fontSize: SIZES.h2, fontWeight: 'bold', color: COLORS.white },
    statsRow: { flexDirection: 'row', padding: SIZES.padding, justifyContent: 'space-between' },
    statBox: { backgroundColor: COLORS.white, width: '30%', padding: 16, borderRadius: SIZES.radius, alignItems: 'center', elevation: 2 },
    statNumber: { fontSize: 24, fontWeight: 'bold', color: COLORS.safety },
    statLabel: { color: COLORS.gray, fontSize: 12 },
    sectionTitle: { fontSize: SIZES.h3, fontWeight: 'bold', paddingHorizontal: SIZES.padding, marginTop: 10, marginBottom: 10 },
    list: { padding: SIZES.padding },
    card: { backgroundColor: COLORS.white, borderRadius: SIZES.radius, padding: 16, marginBottom: 16, elevation: 2 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
    badgeText: { color: COLORS.white, fontSize: 10, fontWeight: 'bold' },
    status: { color: COLORS.gray, fontSize: 12, fontWeight: '600' },
    type: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 4 },
    location: { color: COLORS.secondary, marginBottom: 12 },
    actionButton: { backgroundColor: COLORS.safety, padding: 12, borderRadius: SIZES.radius, alignItems: 'center' },
    actionText: { color: COLORS.white, fontWeight: 'bold' }
});

export default RescueDashboard;
