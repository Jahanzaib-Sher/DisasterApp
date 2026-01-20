import React, { useState } from 'react';
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

const TaskCard = ({ item, onAccept, onComplete, isActive, isCompleted }) => {
    const getSeverityColor = (severity) => {
        switch (severity?.toLowerCase()) {
            case 'critical': return COLORS.danger;
            case 'high': return '#FF7043';
            case 'medium': return COLORS.warning;
            case 'low': return COLORS.safety;
            default: return COLORS.warning;
        }
    };

    return (
        <View style={[styles.card, { borderLeftColor: getSeverityColor(item.severity) }]}>
            <View style={styles.cardHeader}>
                <View style={[styles.badge, { backgroundColor: getSeverityColor(item.severity) }]}>
                    <Text style={styles.badgeText}>{item.severity || 'High'}</Text>
                </View>
                <Text style={[
                    styles.status, 
                    { 
                        color: isActive ? COLORS.safety : isCompleted ? COLORS.gray : COLORS.warning 
                    }
                ]}>
                    {isActive ? '🔴 Active' : isCompleted ? '✅ Completed' : 'Approved'}
                </Text>
            </View>
            <Text style={styles.type}>{item.type} Emergency</Text>
            <Text style={styles.location}>📍 {item.location}</Text>
            <Text style={styles.description}>{item.description}</Text>
            
            <View style={styles.actionContainer}>
                {!isActive && !isCompleted && (
                    <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => onAccept(item.id)}
                    >
                        <Ionicons name="checkmark-circle" size={16} color={COLORS.white} style={{ marginRight: 6 }} />
                        <Text style={styles.actionText}>ACCEPT MISSION</Text>
                    </TouchableOpacity>
                )}
                
                {isActive && (
                    <TouchableOpacity 
                        style={[styles.actionButton, { backgroundColor: COLORS.safety }]}
                        onPress={() => onComplete(item.id)}
                    >
                        <Ionicons name="checkmark-done-all" size={16} color={COLORS.white} style={{ marginRight: 6 }} />
                        <Text style={styles.actionText}>MARK COMPLETED</Text>
                    </TouchableOpacity>
                )}
                
                {isCompleted && (
                    <View style={[styles.actionButton, { backgroundColor: COLORS.gray }]}>
                        <Ionicons name="checkmark-done-all" size={16} color={COLORS.white} style={{ marginRight: 6 }} />
                        <Text style={styles.actionText}>COMPLETED</Text>
                    </View>
                )}
            </View>
        </View>
    );
};

const RescueDashboard = ({ onLogout }) => {
    const { approvedReports, activeMissions, completedMissions, acceptMission, completeMission } = useDisaster();
    const [activeTab, setActiveTab] = useState('available');

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
                    <Text style={styles.statNumber}>{activeMissions.length}</Text>
                    <Text style={styles.statLabel}>Active</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statNumber}>{approvedReports.length}</Text>
                    <Text style={styles.statLabel}>Available</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statNumber}>{completedMissions.length}</Text>
                    <Text style={styles.statLabel}>Completed</Text>
                </View>
            </View>

            {/* Tab Navigation */}
            <View style={styles.tabContainer}>
                <TouchableOpacity 
                    style={[styles.tab, activeTab === 'available' && styles.activeTab]}
                    onPress={() => setActiveTab('available')}
                >
                    <Ionicons name="list" size={18} color={activeTab === 'available' ? COLORS.white : COLORS.gray} />
                    <Text style={[styles.tabText, activeTab === 'available' && styles.activeTabText]}>
                        Available ({approvedReports.length})
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.tab, activeTab === 'active' && styles.activeTab]}
                    onPress={() => setActiveTab('active')}
                >
                    <Ionicons name="flash" size={18} color={activeTab === 'active' ? COLORS.white : COLORS.gray} />
                    <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
                        Active ({activeMissions.length})
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
                    onPress={() => setActiveTab('completed')}
                >
                    <Ionicons name="checkmark-done" size={18} color={activeTab === 'completed' ? COLORS.white : COLORS.gray} />
                    <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
                        Completed ({completedMissions.length})
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Mission List */}
            {activeTab === 'available' && (
                <FlatList
                    data={approvedReports}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <TaskCard 
                            item={item} 
                            onAccept={acceptMission}
                            onComplete={() => {}}
                            isActive={false}
                            isCompleted={false}
                        />
                    )}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Ionicons name="checkmark-done-all" size={48} color={COLORS.gray} />
                            <Text style={styles.emptyText}>No available missions</Text>
                        </View>
                    }
                />
            )}

            {activeTab === 'active' && (
                <FlatList
                    data={activeMissions}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <TaskCard 
                            item={item} 
                            onAccept={() => {}}
                            onComplete={completeMission}
                            isActive={true}
                            isCompleted={false}
                        />
                    )}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Ionicons name="alert-circle-outline" size={48} color={COLORS.gray} />
                            <Text style={styles.emptyText}>No active missions</Text>
                        </View>
                    }
                />
            )}

            {activeTab === 'completed' && (
                <FlatList
                    data={completedMissions}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <TaskCard 
                            item={item} 
                            onAccept={() => {}}
                            onComplete={() => {}}
                            isActive={false}
                            isCompleted={true}
                        />
                    )}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Ionicons name="checkmark-circle-outline" size={48} color={COLORS.gray} />
                            <Text style={styles.emptyText}>No completed missions yet</Text>
                        </View>
                    }
                />
            )}
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
    
    // Tab Navigation
    tabContainer: { 
        flexDirection: 'row', 
        paddingHorizontal: SIZES.padding / 2, 
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
        backgroundColor: COLORS.white
    },
    tab: { 
        flex: 1, 
        paddingVertical: 10, 
        marginHorizontal: 4,
        borderRadius: SIZES.radius,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    activeTab: { 
        backgroundColor: COLORS.safety,
    },
    tabText: { 
        fontSize: 11, 
        color: COLORS.gray,
        marginLeft: 6,
        fontWeight: '600'
    },
    activeTabText: { 
        color: COLORS.white 
    },
    
    sectionTitle: { fontSize: SIZES.h3, fontWeight: 'bold', paddingHorizontal: SIZES.padding, marginTop: 10, marginBottom: 10 },
    list: { padding: SIZES.padding },
    
    // Mission Card
    card: { 
        backgroundColor: COLORS.white, 
        borderRadius: SIZES.radius, 
        padding: 16, 
        marginBottom: 16, 
        elevation: 2,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.warning
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
    badgeText: { color: COLORS.white, fontSize: 10, fontWeight: 'bold' },
    status: { color: COLORS.gray, fontSize: 12, fontWeight: '600' },
    type: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 4 },
    location: { color: COLORS.secondary, marginBottom: 8 },
    description: { color: COLORS.gray, marginBottom: 12, fontSize: 13, fontStyle: 'italic' },
    
    actionContainer: { flexDirection: 'row', gap: 8 },
    actionButton: { 
        flex: 1,
        backgroundColor: COLORS.warning, 
        padding: 12, 
        borderRadius: SIZES.radius, 
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    actionText: { color: COLORS.white, fontWeight: 'bold', fontSize: 12 },
    
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60
    },
    emptyText: {
        color: COLORS.gray,
        fontSize: 14,
        marginTop: 12
    }
});

export default RescueDashboard;
