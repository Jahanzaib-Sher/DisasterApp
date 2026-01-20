import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = ({ onLogin }) => {
    const [screen, setScreen] = useState('roles'); // roles | rescue_login | admin_login | rescue_signup | admin_signup
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = (role) => {
        // Validate email and password
        if (!email.trim()) {
            Alert.alert('Error', 'Please enter email');
            return;
        }
        if (!password.trim()) {
            Alert.alert('Error', 'Please enter password');
            return;
        }
        if (email.length < 5 || !email.includes('@')) {
            Alert.alert('Error', 'Please enter valid email');
            return;
        }
        if (password.length < 4) {
            Alert.alert('Error', 'Password must be at least 4 characters');
            return;
        }

        // Mock validation - in real app, verify with backend
        Alert.alert('✅ Success', `Logged in as ${role}!`);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        onLogin(role);
    };

    const handleSignup = (role) => {
        // Validate signup fields
        if (!email.trim()) {
            Alert.alert('Error', 'Please enter email');
            return;
        }
        if (!password.trim()) {
            Alert.alert('Error', 'Please enter password');
            return;
        }
        if (!confirmPassword.trim()) {
            Alert.alert('Error', 'Please confirm password');
            return;
        }
        if (email.length < 5 || !email.includes('@')) {
            Alert.alert('Error', 'Please enter valid email');
            return;
        }
        if (password.length < 4) {
            Alert.alert('Error', 'Password must be at least 4 characters');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        // Mock validation - in real app, create account on backend
        Alert.alert('✅ Account Created', `Account created as ${role}!\nNow logging in...`);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        onLogin(role);
    };

    // Initial role selection screen
    if (screen === 'roles') {
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.logoContainer}>
                        <Ionicons name="shield-checkmark" size={80} color={COLORS.primary} />
                        <Text style={styles.title}>DisasterGuard</Text>
                        <Text style={styles.subtitle}>Unified Disaster Management</Text>
                    </View>

                    <View style={styles.form}>
                        <Text style={styles.sectionTitle}>Select Your Role</Text>

                        {/* Public User - No Login */}
                        <TouchableOpacity 
                            style={styles.roleButton} 
                            onPress={() => onLogin('public')}
                        >
                            <Ionicons name="people" size={24} color={COLORS.white} />
                            <Text style={styles.roleText}>Public User</Text>
                            <Text style={styles.roleSubtext}>No login required</Text>
                        </TouchableOpacity>

                        {/* Rescue Team - Login/Signup */}
                        <TouchableOpacity 
                            style={[styles.roleButton, { backgroundColor: COLORS.safety }]} 
                            onPress={() => setScreen('rescue_login')}
                        >
                            <Ionicons name="medkit" size={24} color={COLORS.white} />
                            <Text style={styles.roleText}>Rescue Team</Text>
                            <Text style={styles.roleSubtext}>Login or create account</Text>
                        </TouchableOpacity>

                        {/* Admin - Login/Signup */}
                        <TouchableOpacity 
                            style={[styles.roleButton, { backgroundColor: COLORS.secondary }]} 
                            onPress={() => setScreen('admin_login')}
                        >
                            <Ionicons name="settings" size={24} color={COLORS.white} />
                            <Text style={styles.roleText}>Administrator</Text>
                            <Text style={styles.roleSubtext}>Login or create account</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

    // Rescue Team Login Screen
    if (screen === 'rescue_login') {
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <TouchableOpacity onPress={() => setScreen('roles')} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={28} color={COLORS.primary} />
                        <Text style={styles.backText}>Back</Text>
                    </TouchableOpacity>

                    <View style={styles.logoContainer}>
                        <Ionicons name="medkit" size={60} color={COLORS.safety} />
                        <Text style={styles.title}>Rescue Team</Text>
                        <Text style={styles.subtitle}>Emergency Response Portal</Text>
                    </View>

                    <View style={styles.form}>
                        <Text style={styles.sectionTitle}>Login to Your Account</Text>

                        {/* Email Input */}
                        <View style={styles.inputContainer}>
                            <Ionicons name="mail" size={20} color={COLORS.gray} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                placeholderTextColor={COLORS.gray}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                            />
                        </View>

                        {/* Password Input */}
                        <View style={styles.inputContainer}>
                            <Ionicons name="lock-closed" size={20} color={COLORS.gray} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                placeholderTextColor={COLORS.gray}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color={COLORS.gray} />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity 
                            style={[styles.actionButton, { backgroundColor: COLORS.safety }]}
                            onPress={() => handleLogin('rescue')}
                        >
                            <Text style={styles.actionButtonText}>Login</Text>
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        <Text style={styles.toggleText}>Don't have an account?</Text>
                        <TouchableOpacity 
                            style={styles.toggleButton}
                            onPress={() => {
                                setScreen('rescue_signup');
                                setEmail('');
                                setPassword('');
                                setConfirmPassword('');
                            }}
                        >
                            <Text style={styles.toggleButtonText}>Create New Account</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

    // Admin Login Screen
    if (screen === 'admin_login') {
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <TouchableOpacity onPress={() => setScreen('roles')} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={28} color={COLORS.primary} />
                        <Text style={styles.backText}>Back</Text>
                    </TouchableOpacity>

                    <View style={styles.logoContainer}>
                        <Ionicons name="settings" size={60} color={COLORS.secondary} />
                        <Text style={styles.title}>Administrator</Text>
                        <Text style={styles.subtitle}>Admin Control Panel</Text>
                    </View>

                    <View style={styles.form}>
                        <Text style={styles.sectionTitle}>Login to Your Account</Text>

                        {/* Email Input */}
                        <View style={styles.inputContainer}>
                            <Ionicons name="mail" size={20} color={COLORS.gray} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                placeholderTextColor={COLORS.gray}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                            />
                        </View>

                        {/* Password Input */}
                        <View style={styles.inputContainer}>
                            <Ionicons name="lock-closed" size={20} color={COLORS.gray} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                placeholderTextColor={COLORS.gray}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color={COLORS.gray} />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity 
                            style={[styles.actionButton, { backgroundColor: COLORS.secondary }]}
                            onPress={() => handleLogin('admin')}
                        >
                            <Text style={styles.actionButtonText}>Login</Text>
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        <Text style={styles.toggleText}>Don't have an account?</Text>
                        <TouchableOpacity 
                            style={styles.toggleButton}
                            onPress={() => {
                                setScreen('admin_signup');
                                setEmail('');
                                setPassword('');
                                setConfirmPassword('');
                            }}
                        >
                            <Text style={styles.toggleButtonText}>Create New Account</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

    // Rescue Team Signup Screen
    if (screen === 'rescue_signup') {
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <TouchableOpacity onPress={() => setScreen('rescue_login')} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={28} color={COLORS.primary} />
                        <Text style={styles.backText}>Back</Text>
                    </TouchableOpacity>

                    <View style={styles.logoContainer}>
                        <Ionicons name="medkit" size={60} color={COLORS.safety} />
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Rescue Team Registration</Text>
                    </View>

                    <View style={styles.form}>
                        <Text style={styles.sectionTitle}>Sign Up New Account</Text>

                        {/* Email Input */}
                        <View style={styles.inputContainer}>
                            <Ionicons name="mail" size={20} color={COLORS.gray} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                placeholderTextColor={COLORS.gray}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                            />
                        </View>

                        {/* Password Input */}
                        <View style={styles.inputContainer}>
                            <Ionicons name="lock-closed" size={20} color={COLORS.gray} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                placeholderTextColor={COLORS.gray}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color={COLORS.gray} />
                            </TouchableOpacity>
                        </View>

                        {/* Confirm Password Input */}
                        <View style={styles.inputContainer}>
                            <Ionicons name="lock-closed" size={20} color={COLORS.gray} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Confirm Password"
                                placeholderTextColor={COLORS.gray}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showPassword}
                            />
                        </View>

                        <TouchableOpacity 
                            style={[styles.actionButton, { backgroundColor: COLORS.safety }]}
                            onPress={() => handleSignup('rescue')}
                        >
                            <Text style={styles.actionButtonText}>Create Account</Text>
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        <Text style={styles.toggleText}>Already have an account?</Text>
                        <TouchableOpacity 
                            style={styles.toggleButton}
                            onPress={() => {
                                setScreen('rescue_login');
                                setEmail('');
                                setPassword('');
                                setConfirmPassword('');
                            }}
                        >
                            <Text style={styles.toggleButtonText}>Login Here</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

    // Admin Signup Screen
    if (screen === 'admin_signup') {
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <TouchableOpacity onPress={() => setScreen('admin_login')} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={28} color={COLORS.primary} />
                        <Text style={styles.backText}>Back</Text>
                    </TouchableOpacity>

                    <View style={styles.logoContainer}>
                        <Ionicons name="settings" size={60} color={COLORS.secondary} />
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Admin Registration</Text>
                    </View>

                    <View style={styles.form}>
                        <Text style={styles.sectionTitle}>Sign Up New Account</Text>

                        {/* Email Input */}
                        <View style={styles.inputContainer}>
                            <Ionicons name="mail" size={20} color={COLORS.gray} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                placeholderTextColor={COLORS.gray}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                            />
                        </View>

                        {/* Password Input */}
                        <View style={styles.inputContainer}>
                            <Ionicons name="lock-closed" size={20} color={COLORS.gray} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                placeholderTextColor={COLORS.gray}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color={COLORS.gray} />
                            </TouchableOpacity>
                        </View>

                        {/* Confirm Password Input */}
                        <View style={styles.inputContainer}>
                            <Ionicons name="lock-closed" size={20} color={COLORS.gray} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Confirm Password"
                                placeholderTextColor={COLORS.gray}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showPassword}
                            />
                        </View>

                        <TouchableOpacity 
                            style={[styles.actionButton, { backgroundColor: COLORS.secondary }]}
                            onPress={() => handleSignup('admin')}
                        >
                            <Text style={styles.actionButtonText}>Create Account</Text>
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        <Text style={styles.toggleText}>Already have an account?</Text>
                        <TouchableOpacity 
                            style={styles.toggleButton}
                            onPress={() => {
                                setScreen('admin_login');
                                setEmail('');
                                setPassword('');
                                setConfirmPassword('');
                            }}
                        >
                            <Text style={styles.toggleButtonText}>Login Here</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: COLORS.background 
    },
    scrollContent: { 
        flexGrow: 1, 
        justifyContent: 'center', 
        padding: SIZES.padding * 2 
    },
    logoContainer: { 
        alignItems: 'center', 
        marginBottom: 40 
    },
    title: { 
        fontSize: 32, 
        fontWeight: 'bold', 
        color: COLORS.text, 
        marginTop: 15 
    },
    subtitle: { 
        fontSize: 14, 
        color: COLORS.gray,
        marginTop: 5
    },
    form: { 
        width: '100%' 
    },
    sectionTitle: { 
        textAlign: 'center', 
        marginBottom: 24, 
        color: COLORS.gray,
        fontSize: 16,
        fontWeight: '600'
    },
    roleButton: {
        flexDirection: 'row', 
        backgroundColor: COLORS.primary, 
        padding: 18, 
        borderRadius: SIZES.radius,
        alignItems: 'center', 
        justifyContent: 'flex-start', 
        marginBottom: 12, 
        elevation: 2
    },
    roleText: { 
        color: COLORS.white, 
        fontWeight: 'bold', 
        fontSize: 16, 
        marginLeft: 12,
        flex: 1
    },
    roleSubtext: {
        color: COLORS.white,
        fontSize: 12,
        opacity: 0.8
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        paddingVertical: 8
    },
    backText: {
        color: COLORS.primary,
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 4
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.lightBackground,
        borderRadius: SIZES.radius,
        paddingHorizontal: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: COLORS.border || '#e0e0e0'
    },
    inputIcon: {
        marginRight: 10
    },
    input: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 16,
        color: COLORS.text
    },
    actionButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 14,
        borderRadius: SIZES.radius,
        alignItems: 'center',
        marginTop: 12,
        marginBottom: 16,
        elevation: 2
    },
    actionButtonText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 16
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border || '#e0e0e0',
        marginVertical: 16
    },
    toggleText: {
        textAlign: 'center',
        color: COLORS.gray,
        fontSize: 14,
        marginBottom: 12
    },
    toggleButton: {
        paddingVertical: 10
    },
    toggleButtonText: {
        color: COLORS.primary,
        fontWeight: '600',
        fontSize: 14,
        textAlign: 'center'
    }
});

export default LoginScreen;
