import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';

const Logo = ({ size = 'large', showText = true }) => {
    const iconSize = size === 'large' ? 80 : size === 'medium' ? 60 : 40;
    const titleSize = size === 'large' ? 32 : size === 'medium' ? 24 : 18;
    const subtitleSize = size === 'large' ? 16 : size === 'medium' ? 14 : 12;

    return (
        <View style={styles.container}>
            {/* Shield Icon with Gradient Effect */}
            <View style={styles.iconContainer}>
                <Ionicons 
                    name="shield-checkmark" 
                    size={iconSize} 
                    color={COLORS.primary}
                />
            </View>

            {showText && (
                <View style={styles.textContainer}>
                    <Text style={[styles.title, { fontSize: titleSize }]}>
                        DisasterGuard
                    </Text>
                    <Text style={[styles.subtitle, { fontSize: subtitleSize }]}>
                        Emergency Management System
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(26, 95, 122, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    textContainer: {
        alignItems: 'center',
        marginTop: 8,
    },
    title: {
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 4,
    },
    subtitle: {
        color: COLORS.gray,
        fontWeight: '500',
    },
});

export default Logo;
