import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useDisaster } from '../../context/DisasterContext';

const AdminDashboard = ({ onLogout }) => {
    const { pendingReports, approveReport, rejectReport } = useDisaster();

    const handleApprove = (id) => {
        Alert.alert('Confirm', 'Approve this report? It will be sent to Rescue Teams and Public Alerts.', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Approve', onPress: () => approveReport(id) }
        ]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Admin Panel</Text>
                <TouchableOpacity onPress={onLogout}>
                    <Ionicons name="log-out-outline" size={24} color={COLORS.white} />
                </TouchableOpacity>
            </View>

            {/* Grid Stats omitted to save space, focus on Workflow */}

            <Text style={styles.sectionTitle}>Pending Reports ({pendingReports.length})</Text>
            <FlatList
                data={pendingReports}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.logItem}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.logTitle}>{item.type} Report</Text>
                            <Text style={styles.logMeta}>{item.location} • {item.time}</Text>
                            <Text style={styles.logDesc}>{item.description}</Text>
                        </View>
                        <View style={styles.actions}>
                            <TouchableOpacity onPress={() => handleApprove(item.id)} style={styles.approveBtn}>
                                <Ionicons name="checkmark" size={20} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => rejectReport(item.id)} style={styles.rejectBtn}>
                                <Ionicons name="close" size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                contentContainerStyle={styles.list}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SIZES.padding, backgroundColor: COLORS.secondary },
    headerTitle: { fontSize: SIZES.h2, fontWeight: 'bold', color: COLORS.white },
    sectionTitle: { fontSize: SIZES.h3, fontWeight: 'bold', paddingHorizontal: SIZES.padding, marginTop: 10, marginBottom: 10 },
    list: { padding: SIZES.padding },
    logItem: {
        backgroundColor: COLORS.white, padding: 16, borderRadius: SIZES.radius, marginBottom: 12,
        borderLeftWidth: 4, borderLeftColor: COLORS.warning, flexDirection: 'row', alignItems: 'center'
    },
    logTitle: { fontWeight: 'bold', fontSize: 16, color: COLORS.text },
    logMeta: { color: COLORS.gray, marginTop: 4, fontSize: 12 },
    logDesc: { color: COLORS.text, marginTop: 4, fontStyle: 'italic' },
    actions: { flexDirection: 'row', marginLeft: 10 },
    approveBtn: { backgroundColor: COLORS.safety, padding: 8, borderRadius: 20, marginRight: 8 },
    rejectBtn: { backgroundColor: COLORS.danger, padding: 8, borderRadius: 20 }
});

export default AdminDashboard;
