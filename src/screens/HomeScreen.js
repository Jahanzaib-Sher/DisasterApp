import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Linking,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';
import * as Location from 'expo-location';
import { useDisaster } from '../context/DisasterContext';

const HomeScreen = () => {
    const [status] = useState('SAFE'); // SAFE | WARNING | DANGER
    const [location, setLocation] = useState(null);
    const { addReport } = useDisaster();

    useEffect(() => {
        (async () => {
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    console.log('Location permission denied');
                    return;
                }
                let location = await Location.getCurrentPositionAsync({});
                setLocation(location);
            } catch (error) {
                console.log('Error getting location:', error);
            }
        })();
    }, []);

    const handleSOS = () => {
        console.log('🚨 SOS handleSOS called');
        console.log('Current location state:', location);
        console.log('addReport function:', typeof addReport);
        
        Alert.alert(
            '🚨 EMERGENCY SOS',
            'Are you sure you want to send an emergency alert and call rescue services?',
            [
                { 
                    text: 'Cancel', 
                    style: 'cancel' 
                },
                {
                    text: 'CALL & ALERT',
                    style: 'destructive',
                    onPress: () => {
                        console.log('User confirmed SOS, calling triggerSOS...');
                        triggerSOS();
                    },
                },
            ],
            { cancelable: true }
        );
    };

    const triggerSOS = async () => {
        try {
            console.log('🚨 SOS triggered!');

            // Create emergency report
            const sosReport = {
                type: 'Medical Emergency',
                description: 'EMERGENCY SOS - Automatic distress call triggered',
                location: location
                    ? `${location.coords.latitude.toFixed(4)}, ${location.coords.longitude.toFixed(4)}`
                    : 'Unknown Location',
                image: null,
                status: 'Pending',
                isEmergencySOS: true
            };

            console.log('Creating SOS report:', sosReport);

            // Add report to system - AWAIT this to complete before showing alert
            await addReport(sosReport);

            console.log('SOS report created successfully');

            // Show success alert
            Alert.alert(
                '✅ EMERGENCY ALERT SENT',
                `Your emergency alert has been sent to rescue services!\n\nLocation: ${sosReport.location}\n\nRescue teams are being notified.`,
                [
                    { 
                        text: 'Call 1122', 
                        onPress: () => {
                            console.log('Attempting to call 1122');
                            Linking.openURL('tel:1122').catch(err => {
                                console.log('Cannot make call on this device:', err);
                                Alert.alert('Manual Call', 'Please call 1122 manually on your phone.');
                            });
                        }
                    },
                    {
                        text: 'OK',
                        style: 'cancel'
                    }
                ],
                { cancelable: false }
            );
        } catch (error) {
            console.error('❌ SOS Error:', error);
            Alert.alert(
                '⚠️ Error Creating Alert',
                `Could not create emergency alert: ${error.message}\n\nPlease try to call 1122 directly or contact rescue services.`,
                [
                    { 
                        text: 'Call 1122', 
                        onPress: () => Linking.openURL('tel:1122').catch(err => {
                            console.log('Cannot make call:', err);
                        })
                    },
                    { text: 'OK', style: 'cancel' }
                ]
            );
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>DisasterGuard</Text>
                <View
                    style={[
                        styles.statusBadge,
                        {
                            backgroundColor:
                                status === 'SAFE' ? COLORS.safety : COLORS.danger,
                        },
                    ]}
                >
                    <Text style={styles.statusText}>{status}</Text>
                </View>
            </View>

            {/* Content */}
            <View style={styles.content}>
                <Text style={styles.subtitle}>Emergency Beacon</Text>

                <TouchableOpacity
                    style={styles.sosButton}
                    onPress={handleSOS}
                    activeOpacity={0.8}
                >
                    <View style={styles.sosInnerRing}>
                        <Text style={styles.sosText}>SOS</Text>
                    </View>
                </TouchableOpacity>

                <Text style={styles.instruction}>Tap to send emergency alert & call rescue</Text>

                <View style={styles.infoCard}>
                    <Ionicons
                        name="location-outline"
                        size={24}
                        color={COLORS.primary}
                    />
                    <View style={styles.infoTextContainer}>
                        <Text style={styles.infoTitle}>Current Location</Text>
                        <Text style={styles.infoBody}>
                            {location
                                ? `${location.coords.latitude.toFixed(4)}, ${location.coords.longitude.toFixed(4)}`
                                : 'Fetching location...'}
                        </Text>
                    </View>
                </View>

                <View style={styles.warningBox}>
                    <Ionicons name="warning" size={24} color={COLORS.danger} />
                    <View style={{ marginLeft: 12, flex: 1 }}>
                        <Text style={styles.warningTitle}>Emergency Use Only</Text>
                        <Text style={styles.warningText}>
                            SOS is for life-threatening emergencies only. Misuse may result in penalties.
                        </Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default HomeScreen;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SIZES.padding,
        backgroundColor: COLORS.white,
        elevation: 3,
    },

    headerTitle: {
        fontSize: SIZES.h2,
        fontWeight: 'bold',
        color: COLORS.text,
    },

    statusBadge: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
    },

    statusText: {
        color: COLORS.white,
        fontWeight: 'bold',
    },

    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: SIZES.padding,
    },

    subtitle: {
        fontSize: SIZES.h2,
        marginBottom: 40,
        color: COLORS.gray,
    },

    sosButton: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(255,87,51,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },

    sosInnerRing: {
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 10,
    },

    sosText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: COLORS.white,
    },

    instruction: {
        fontSize: SIZES.body,
        color: COLORS.gray,
        marginBottom: 40,
        textAlign: 'center',
    },

    infoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        padding: SIZES.padding,
        borderRadius: SIZES.radius,
        width: '100%',
        elevation: 2,
        marginBottom: 16,
    },

    infoTextContainer: {
        marginLeft: 16,
        flex: 1,
    },

    infoTitle: {
        fontSize: SIZES.h3,
        fontWeight: 'bold',
    },

    infoBody: {
        color: COLORS.gray,
        fontSize: 12,
    },

    warningBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFEBEE',
        padding: SIZES.padding,
        borderRadius: SIZES.radius,
        width: '100%',
        borderLeftWidth: 4,
        borderLeftColor: COLORS.danger,
    },

    warningTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.danger,
    },

    warningText: {
        fontSize: 12,
        color: COLORS.text,
        marginTop: 4,
    },
});
