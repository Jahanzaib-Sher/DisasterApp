import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';

const ReportCard = ({ report, onApprove, onReject, status = 'pending' }) => {
    const getStatusColor = (reportStatus) => {
        switch (reportStatus) {
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

    const getStatusIcon = (reportStatus) => {
        switch (reportStatus) {
            case 'Approved':
                return 'checkmark-circle';
            case 'Rejected':
                return 'close-circle';
            case 'Pending':
                return 'time';
            default:
                return 'help-circle';
        }
    };

    return (
        <View style={[styles.card, { borderLeftColor: getStatusColor(report.status) }]}>
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Ionicons name="alert-circle" size={20} color={COLORS.primary} />
                    <Text style={styles.title}>{report.type} Report</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(report.status) }]}>
                    <Ionicons name={getStatusIcon(report.status)} size={12} color={COLORS.white} />
                    <Text style={styles.statusText}>{report.status}</Text>
                </View>
            </View>

            <Text style={styles.location}>📍 {report.location}</Text>
            <Text style={styles.description}>{report.description}</Text>

            {report.severity && (
                <View style={styles.severityContainer}>
                    <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(report.severity) }]}>
                        <Text style={styles.severityText}>{report.severity} Severity</Text>
                    </View>
                </View>
            )}

            {report.rejectionReason && (
                <View style={styles.rejectionContainer}>
                    <Text style={styles.rejectionLabel}>Reason:</Text>
                    <Text style={styles.rejectionReason}>{report.rejectionReason}</Text>
                </View>
            )}

            <Text style={styles.timestamp}>{report.time}</Text>

            {status === 'pending' && onApprove && onReject && (
                <View style={styles.actions}>
                    <TouchableOpacity 
                        onPress={() => onReject(report.id)} 
                        style={[styles.actionButton, styles.rejectButton]}
                    >
                        <Ionicons name="close" size={16} color={COLORS.white} />
                        <Text style={styles.actionText}>Reject</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => onApprove(report.id)} 
                        style={[styles.actionButton, styles.approveButton]}
                    >
                        <Ionicons name="checkmark" size={16} color={COLORS.white} />
                        <Text style={styles.actionText}>Approve</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.white,
        borderRadius: SIZES.radius,
        padding: SIZES.padding,
        marginBottom: 12,
        borderLeftWidth: 4,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
        marginLeft: 8,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: COLORS.white,
        fontSize: 10,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    location: {
        fontSize: 12,
        color: COLORS.gray,
        marginVertical: 4,
    },
    description: {
        fontSize: 13,
        color: COLORS.text,
        fontStyle: 'italic',
        marginVertical: 4,
    },
    severityContainer: {
        marginVertical: 8,
    },
    severityBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    severityText: {
        color: COLORS.white,
        fontSize: 11,
        fontWeight: 'bold',
    },
    rejectionContainer: {
        backgroundColor: '#FFEBEE',
        borderLeftWidth: 3,
        borderLeftColor: COLORS.danger,
        padding: 8,
        borderRadius: 4,
        marginVertical: 8,
    },
    rejectionLabel: {
        fontSize: 11,
        fontWeight: 'bold',
        color: COLORS.danger,
    },
    rejectionReason: {
        fontSize: 12,
        color: COLORS.text,
        marginTop: 2,
    },
    timestamp: {
        fontSize: 11,
        color: COLORS.gray,
        marginTop: 8,
    },
    actions: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 12,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        borderRadius: 6,
    },
    approveButton: {
        backgroundColor: COLORS.safety,
    },
    rejectButton: {
        backgroundColor: COLORS.danger,
    },
    actionText: {
        color: COLORS.white,
        fontWeight: '600',
        fontSize: 12,
        marginLeft: 4,
    },
});

export default ReportCard;
