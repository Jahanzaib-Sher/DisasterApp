import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Alert, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (role) => {
        // Mock Login Logic
        onLogin(role);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.logoContainer}>
                    <Ionicons name="shield-checkmark" size={80} color={COLORS.primary} />
                    <Text style={styles.title}>DisasterGuard</Text>
                    <Text style={styles.subtitle}>Unified Disaster Management</Text>
                </View>

                <View style={styles.form}>
                    <Text style={styles.sectionTitle}>Select Role to Login (Mock)</Text>

                    <TouchableOpacity style={styles.roleButton} onPress={() => handleLogin('public')}>
                        <Ionicons name="people" size={24} color={COLORS.white} />
                        <Text style={styles.roleText}>Public User</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.roleButton, { backgroundColor: COLORS.safety }]} onPress={() => handleLogin('rescue')}>
                        <Ionicons name="medkit" size={24} color={COLORS.white} />
                        <Text style={styles.roleText}>Rescue Team</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.roleButton, { backgroundColor: COLORS.secondary }]} onPress={() => handleLogin('admin')}>
                        <Ionicons name="settings" size={24} color={COLORS.white} />
                        <Text style={styles.roleText}>Administrator</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    content: { flex: 1, justifyContent: 'center', padding: SIZES.padding * 2 },
    logoContainer: { alignItems: 'center', marginBottom: 50 },
    title: { fontSize: 32, fontWeight: 'bold', color: COLORS.text, marginTop: 10 },
    subtitle: { fontSize: 16, color: COLORS.gray },
    form: { width: '100%' },
    sectionTitle: { textAlign: 'center', marginBottom: 20, color: COLORS.gray },
    roleButton: {
        flexDirection: 'row', backgroundColor: COLORS.primary, padding: 16, borderRadius: SIZES.radius,
        alignItems: 'center', justifyContent: 'center', marginBottom: 16, elevation: 2
    },
    roleText: { color: COLORS.white, fontWeight: 'bold', fontSize: 18, marginLeft: 10 }
});

export default LoginScreen;
