import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Modal, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useDisaster } from '../../context/DisasterContext';

const AdminDashboard = ({ onLogout }) => {
    try {
        const contextData = useDisaster();
        console.log('AdminDashboard context data:', contextData);
        
        const { pendingReports = [], approvedReports = [], rejectedReports = [], allReportsCount = 0, approveReport, rejectReport, refreshData } = contextData;
        const [selectedSeverity, setSelectedSeverity] = useState('High');
        const [selectedReportId, setSelectedReportId] = useState(null);
        const [showSeverityModal, setShowSeverityModal] = useState(false);
        const [showRejectModal, setShowRejectModal] = useState(false);
        const [rejectReason, setRejectReason] = useState('');

        const SEVERITY_LEVELS = ['Critical', 'High', 'Medium', 'Low'];
        
        console.log('AdminDashboard render - pendingReports:', pendingReports.length, 'approved:', approvedReports.length);

        // Refresh data when screen comes into focus
        useEffect(() => {
            console.log('AdminDashboard mounted/focused - refreshing data');
            if (refreshData) {
                refreshData();
            }
        }, [refreshData]);

        const handleApproveWithSeverity = (id) => {
            console.log('Opening severity modal for report:', id);
            setSelectedReportId(id);
            setSelectedSeverity('High');
            setShowSeverityModal(true);
        };

        const confirmApprove = async () => {
            console.log('Confirming approval for:', selectedReportId, 'with severity:', selectedSeverity);
            setShowSeverityModal(false);
            if (approveReport) {
                await approveReport(selectedReportId, selectedSeverity);
            }
            // Refresh data after approval
            if (refreshData) {
                setTimeout(() => refreshData(), 500);
            }
        };

        const handleReject = (id) => {
            console.log('Opening reject modal for report:', id);
            setSelectedReportId(id);
            setRejectReason('Insufficient information');
            setShowRejectModal(true);
        };

        const confirmReject = async () => {
            console.log('Confirming rejection for:', selectedReportId, 'with reason:', rejectReason);
            setShowRejectModal(false);
            if (rejectReport) {
                await rejectReport(selectedReportId, rejectReason || 'Rejected by admin');
            }
            // Refresh data after rejection
            if (refreshData) {
                setTimeout(() => refreshData(), 500);
            }
        };

        const getStatusColor = (status) => {
            switch (status) {
                case 'Approved':
                    return COLORS.safety;
                case 'Rejected':
                    return COLORS.danger;
                case 'Pending':
                    return COLORS.warning;
                default:
                    return COLORS.gray;
            }
        };

        const getSeverityColor = (severity) => {
            switch (severity) {
                case 'Critical':
                    return COLORS.danger;
                case 'High':
                    return '#FF7043';
                case 'Medium':
                    return COLORS.warning;
                case 'Low':
                    return '#4CAF50';
                default:
                    return COLORS.gray;
            }
        };

        return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Admin Panel</Text>
                <TouchableOpacity onPress={onLogout}>
                    <Ionicons name="log-out-outline" size={24} color={COLORS.white} />
                </TouchableOpacity>
            </View>

            {/* Stats Grid */}
            <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                    <Ionicons name="document-text" size={28} color={COLORS.primary} />
                    <Text style={styles.statNumber}>{allReportsCount}</Text>
                    <Text style={styles.statLabel}>Total</Text>
                </View>
                <View style={styles.statCard}>
                    <Ionicons name="time" size={28} color={COLORS.warning} />
                    <Text style={styles.statNumber}>{pendingReports.length}</Text>
                    <Text style={styles.statLabel}>Pending</Text>
                </View>
                <View style={styles.statCard}>
                    <Ionicons name="checkmark-circle" size={28} color={COLORS.safety} />
                    <Text style={styles.statNumber}>{approvedReports.length}</Text>
                    <Text style={styles.statLabel}>Approved</Text>
                </View>
                <View style={styles.statCard}>
                    <Ionicons name="close-circle" size={28} color={COLORS.danger} />
                    <Text style={styles.statNumber}>{rejectedReports.length}</Text>
                    <Text style={styles.statLabel}>Rejected</Text>
                </View>
            </View>

            {/* Pending Reports Section */}
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Pending Reports ({pendingReports.length})</Text>
                {pendingReports.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="checkmark-done-all" size={48} color={COLORS.gray} />
                        <Text style={styles.emptyText}>All caught up! No pending reports.</Text>
                    </View>
                ) : (
                    <FlatList
                        scrollEnabled={false}
                        data={pendingReports}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.logItem}>
                                <View style={{ flex: 1 }}>
                                    <View style={styles.typeRow}>
                                        <Text style={styles.logTitle}>{item.type} Report</Text>
                                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                                            <Text style={styles.statusText}>{item.status}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.logMeta}>{item.location} • {item.time}</Text>
                                    <Text style={styles.logDesc}>{item.description}</Text>
                                </View>
                                <View style={styles.actions}>
                                    <TouchableOpacity 
                                        onPress={() => handleApproveWithSeverity(item.id)} 
                                        style={styles.approveBtn}
                                    >
                                        <Ionicons name="checkmark" size={20} color="white" />
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        onPress={() => handleReject(item.id)} 
                                        style={styles.rejectBtn}
                                    >
                                        <Ionicons name="close" size={20} color="white" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                        contentContainerStyle={styles.list}
                    />
                )}
            </View>

            {/* Severity Selection Modal */}
            <Modal
                visible={showSeverityModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowSeverityModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select Severity Level</Text>
                        {SEVERITY_LEVELS.map((level) => (
                            <TouchableOpacity
                                key={level}
                                style={[
                                    styles.severityOption,
                                    selectedSeverity === level && { backgroundColor: getSeverityColor(level) }
                                ]}
                                onPress={() => setSelectedSeverity(level)}
                            >
                                <View style={[styles.severityDot, { backgroundColor: getSeverityColor(level) }]} />
                                <Text style={[styles.severityText, selectedSeverity === level && { color: COLORS.white }]}>
                                    {level} Severity
                                </Text>
                            </TouchableOpacity>
                        ))}
                        <View style={styles.modalButtons}>
                            <TouchableOpacity 
                                onPress={() => setShowSeverityModal(false)}
                                style={styles.cancelButton}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={confirmApprove}
                                style={styles.confirmButton}
                            >
                                <Text style={styles.buttonText}>Approve</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Rejection Reason Modal */}
            <Modal
                visible={showRejectModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowRejectModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Rejection Reason</Text>
                        <ScrollView style={styles.reasonOptions}>
                            {[
                                'Insufficient information',
                                'Duplicate report',
                                'False alarm',
                                'Invalid location',
                                'Other'
                            ].map((reason) => (
                                <TouchableOpacity
                                    key={reason}
                                    style={[
                                        styles.reasonOption,
                                        rejectReason === reason && styles.reasonOptionSelected
                                    ]}
                                    onPress={() => setRejectReason(reason)}
                                >
                                    <Ionicons 
                                        name={rejectReason === reason ? "radio-button-on" : "radio-button-off"} 
                                        size={20} 
                                        color={rejectReason === reason ? COLORS.primary : COLORS.gray}
                                    />
                                    <Text style={styles.reasonText}>{reason}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <TextInput
                            style={styles.customReasonInput}
                            placeholder="Or enter custom reason..."
                            placeholderTextColor={COLORS.gray}
                            value={rejectReason}
                            onChangeText={setRejectReason}
                            multiline
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity 
                                onPress={() => setShowRejectModal(false)}
                                style={styles.cancelButton}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={confirmReject}
                                style={styles.confirmButton}
                            >
                                <Text style={styles.buttonText}>Reject</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
    } catch (error) {
        console.error('AdminDashboard error:', error);
        return (
            <SafeAreaView style={styles.container}>
                <Text>Error loading admin panel: {error.message}</Text>
            </SafeAreaView>
        );
    }
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: SIZES.padding, 
        backgroundColor: COLORS.secondary 
    },
    headerTitle: { fontSize: SIZES.h2, fontWeight: 'bold', color: COLORS.white },
    
    statsGrid: { 
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        padding: SIZES.padding / 2,
        justifyContent: 'space-around'
    },
    statCard: {
        width: '48%',
        backgroundColor: COLORS.white,
        borderRadius: SIZES.radius,
        padding: SIZES.padding,
        marginBottom: SIZES.padding,
        alignItems: 'center',
        elevation: 2
    },
    statNumber: { fontSize: 24, fontWeight: 'bold', color: COLORS.text, marginVertical: 4 },
    statLabel: { fontSize: 12, color: COLORS.gray },
    
    sectionContainer: { flex: 1, paddingHorizontal: SIZES.padding },
    sectionTitle: { fontSize: SIZES.h3, fontWeight: 'bold', marginBottom: 12, color: COLORS.text },
    list: { paddingBottom: SIZES.padding },
    
    logItem: {
        backgroundColor: COLORS.white, 
        padding: 16, 
        borderRadius: SIZES.radius, 
        marginBottom: 12,
        borderLeftWidth: 4, 
        borderLeftColor: COLORS.warning, 
        flexDirection: 'row', 
        alignItems: 'flex-start'
    },
    typeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
    statusText: { color: COLORS.white, fontSize: 10, fontWeight: 'bold' },
    logTitle: { fontWeight: 'bold', fontSize: 16, color: COLORS.text, flex: 1 },
    logMeta: { color: COLORS.gray, marginTop: 4, fontSize: 12 },
    logDesc: { color: COLORS.text, marginTop: 4, fontStyle: 'italic', fontSize: 13 },
    
    actions: { flexDirection: 'row', marginLeft: 10 },
    approveBtn: { backgroundColor: COLORS.safety, padding: 8, borderRadius: 20, marginRight: 8 },
    rejectBtn: { backgroundColor: COLORS.danger, padding: 8, borderRadius: 20 },
    
    emptyState: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        paddingVertical: 40
    },
    emptyText: { color: COLORS.gray, fontSize: 14, marginTop: 12 },
    
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: COLORS.white,
        borderRadius: SIZES.radius,
        padding: SIZES.padding,
        width: '85%',
        maxHeight: '80%',
    },
    modalTitle: { fontSize: SIZES.h3, fontWeight: 'bold', marginBottom: 16, color: COLORS.text },
    
    severityOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: SIZES.radius,
        marginBottom: 8,
        borderWidth: 2,
        borderColor: COLORS.lightGray
    },
    severityDot: { width: 12, height: 12, borderRadius: 6, marginRight: 12 },
    severityText: { fontSize: 14, fontWeight: '500', color: COLORS.text },
    
    reasonOptions: { maxHeight: 150, marginBottom: 12 },
    reasonOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray
    },
    reasonOptionSelected: { backgroundColor: 'rgba(255,87,51,0.1)' },
    reasonText: { fontSize: 14, marginLeft: 12, color: COLORS.text },
    
    customReasonInput: {
        borderWidth: 1,
        borderColor: COLORS.lightGray,
        borderRadius: SIZES.radius,
        padding: 12,
        marginBottom: 16,
        color: COLORS.text,
        maxHeight: 100
    },
    
    modalButtons: { flexDirection: 'row', justifyContent: 'space-around', gap: 12 },
    cancelButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: SIZES.radius,
        backgroundColor: COLORS.lightGray,
        alignItems: 'center'
    },
    confirmButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: SIZES.radius,
        backgroundColor: COLORS.primary,
        alignItems: 'center'
    },
    buttonText: { color: COLORS.white, fontWeight: 'bold', fontSize: 14 }
});

export default AdminDashboard;
