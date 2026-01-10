import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, LayoutAnimation, Platform, UIManager, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

const GUIDES = [
    {
        id: '1',
        title: 'CPR Basics',
        category: 'Medical',
        icon: 'heart',
        image: 'https://img.icons8.com/color/480/cpr.png',
        steps: [
            { text: 'Call 911', image: 'https://img.icons8.com/color/480/emergency-call.png', fallbackIcon: 'call' },
            { text: 'Lay Flat', image: 'https://img.icons8.com/color/480/sleeping.png', fallbackIcon: 'body' },
            { text: 'Check Breath', image: 'https://img.icons8.com/color/480/hearing.png', fallbackIcon: 'ear' },
            { text: 'Compressions', image: 'https://img.icons8.com/color/480/cpr.png', fallbackIcon: 'pulse' },
            { text: 'Breaths', image: 'https://img.icons8.com/color/480/artificial-respiration.png', fallbackIcon: 'medkit' },
            { text: 'Repeat', image: 'https://img.icons8.com/color/480/ambulance.png', fallbackIcon: 'refresh' }
        ]
    },
    {
        id: '2',
        title: 'Earthquake',
        category: 'Natural Disaster',
        icon: 'earth',
        image: 'https://img.icons8.com/color/480/earthquakes.png',
        steps: [
            { text: 'Drop', image: 'https://img.icons8.com/color/480/falling-man.png', fallbackIcon: 'arrow-down-circle' },
            { text: 'Cover', image: 'https://img.icons8.com/color/480/head-protection.png', fallbackIcon: 'shield' },
            { text: 'Hold On', image: 'https://img.icons8.com/color/480/holding-hands.png', fallbackIcon: 'hand-left' },
            { text: 'No Glass', image: 'https://img.icons8.com/color/480/broken-window.png', fallbackIcon: 'alert-circle' },
        ]
    },
    {
        id: '3',
        title: 'Flood',
        category: 'Natural Disaster',
        icon: 'water',
        image: 'https://img.icons8.com/color/480/flood-car.png',
        steps: [
            { text: 'High Ground', image: 'https://img.icons8.com/color/480/climbing.png', fallbackIcon: 'arrow-up-circle' },
            { text: 'Unplug', image: 'https://img.icons8.com/color/480/unplug.png', fallbackIcon: 'flash' },
            { text: 'No Walking', image: 'https://img.icons8.com/color/480/wading.png', fallbackIcon: 'walk' },
            { text: 'Wait', image: 'https://img.icons8.com/color/480/lifebuoy.png', fallbackIcon: 'help-buoy' },
        ]
    },
    {
        id: '4',
        title: 'Fire',
        category: 'Fire',
        icon: 'flame',
        image: 'https://img.icons8.com/color/480/fire-element.png',
        steps: [
            { text: 'Crawl', image: 'https://img.icons8.com/color/480/crawling.png', fallbackIcon: 'body' },
            { text: 'Check Door', image: 'https://img.icons8.com/color/480/door.png', fallbackIcon: 'exit' },
            { text: 'Stop Drop Roll', image: 'https://img.icons8.com/color/480/tumble.png', fallbackIcon: 'refresh-circle' },
            { text: 'Escape', image: 'https://img.icons8.com/color/480/emergency-exit.png', fallbackIcon: 'log-out' },
        ]
    },
];

// New Robust Component
const ReliableImage = ({ uri, fallbackIcon, style, resizeMode }) => {
    const [error, setError] = useState(false);

    if (error) {
        return (
            <View style={[style, styles.fallbackContainer]}>
                <Ionicons name={fallbackIcon || 'image'} size={40} color={COLORS.primary} />
            </View>
        );
    }

    return (
        <Image
            source={{ uri }}
            style={style}
            resizeMode={resizeMode}
            onError={() => setError(true)}
        />
    );
};

const GuideItem = ({ item, expanded, onPress }) => {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
            {/* Header */}
            <View style={styles.headerRow}>
                <ReliableImage
                    uri={item.image}
                    fallbackIcon={item.icon}
                    style={styles.headerImageThumb}
                    resizeMode="contain"
                />
                <View style={styles.headerInfo}>
                    <Text style={styles.headerTitle}>{item.title}</Text>
                    <Text style={styles.headerCategory}>{item.category}</Text>
                </View>
                <Ionicons
                    name={expanded ? "chevron-up" : "chevron-down"}
                    size={24}
                    color={COLORS.gray}
                />
            </View>

            {expanded && (
                <View style={styles.stepsContainer}>
                    <Text style={styles.instructionLabel}>STEPS TO FOLLOW:</Text>

                    <View style={styles.gridContainer}>
                        {item.steps.map((step, index) => (
                            <View key={index} style={styles.gridItem}>
                                <Text style={styles.gridNumber}>{index + 1}</Text>

                                <View style={styles.imageWrapper}>
                                    <ReliableImage
                                        uri={step.image}
                                        fallbackIcon={step.fallbackIcon}
                                        style={styles.gridImage}
                                        resizeMode="contain"
                                    />
                                </View>

                                <Text style={styles.gridCaption}>{step.text}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}
        </TouchableOpacity>
    );
};

const GuidesScreen = () => {
    const [expandedId, setExpandedId] = useState(null);

    const toggleExpand = (id) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Safety Guides</Text>
            <FlatList
                data={GUIDES}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <GuideItem
                        item={item}
                        expanded={expandedId === item.id}
                        onPress={() => toggleExpand(item.id)}
                    />
                )}
                contentContainerStyle={styles.list}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#EFF3F6' },
    header: { fontSize: 28, fontWeight: 'bold', padding: SIZES.padding, color: COLORS.text, backgroundColor: COLORS.white },
    list: { padding: SIZES.padding },
    card: {
        backgroundColor: COLORS.white, borderRadius: 12, overflow: 'hidden',
        marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2,
        borderWidth: 1, borderColor: '#E0E0E0'
    },

    headerRow: { flexDirection: 'row', alignItems: 'center', padding: 12 },
    headerImageThumb: { width: 50, height: 50, borderRadius: 25, marginRight: 12, backgroundColor: '#f0f0f0' },

    fallbackContainer: { justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F5' },

    headerInfo: { flex: 1 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
    headerCategory: { fontSize: 13, color: COLORS.gray, marginTop: 2 },

    stepsContainer: { padding: 16, paddingTop: 0, backgroundColor: COLORS.white },
    instructionLabel: {
        fontSize: 12, fontWeight: '700', color: COLORS.gray,
        marginBottom: 16, marginTop: 8, textAlign: 'center', letterSpacing: 1
    },

    gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    gridItem: { width: '48%', marginBottom: 20, alignItems: 'center', position: 'relative' },

    gridNumber: { position: 'absolute', top: 0, left: 0, fontSize: 18, fontWeight: '900', color: COLORS.text, zIndex: 1 },

    imageWrapper: {
        width: 100, height: 100, borderRadius: 50, backgroundColor: '#FAFAFA',
        justifyContent: 'center', alignItems: 'center', marginBottom: 8, marginTop: 4,
    },
    gridImage: { width: 70, height: 70 },

    gridCaption: {
        fontSize: 12, color: COLORS.secondary, textAlign: 'center',
        fontWeight: '600', lineHeight: 16, paddingHorizontal: 4,
    }
});

export default GuidesScreen;
