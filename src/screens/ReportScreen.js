import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useDisaster } from '../context/DisasterContext';

const DISASTER_TYPES = [
    { id: 'fire', label: 'Fire', icon: 'flame' },
    { id: 'flood', label: 'Flood', icon: 'water' },
    { id: 'earthquake', label: 'Earthquake', icon: 'earth' },
    { id: 'accident', label: 'Accident', icon: 'medical' },
    { id: 'other', label: 'Other', icon: 'alert-circle' },
];

const ReportScreen = ({ navigation }) => {
    const { addReport } = useDisaster();
    const [selectedType, setSelectedType] = useState(null);
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState(null);
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [image, setImage] = useState(null);

    useEffect(() => {
        (async () => {
            setLoadingLocation(true);
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permission Denied', 'Permission to access location was denied');
                    setLoadingLocation(false);
                    return;
                }

                let location = await Location.getCurrentPositionAsync({});
                setLocation(location);
            } catch (error) {
                console.log(error);
                // Fallback mock location if emulator/web fails
                setLocation({ coords: { latitude: 33.6844, longitude: 73.0479 } });
            } finally {
                setLoadingLocation(false);
            }
        })();
    }, []);

    const pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled) {
                setImage(result.assets[0].uri);
            }
        } catch (error) {
            Alert.alert('Error', 'Could not pick image');
        }
    };

    const takePhoto = async () => {
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission needed', 'Camera permission is required');
                return;
            }

            let result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled) {
                setImage(result.assets[0].uri);
            }
        } catch (error) {
            Alert.alert('Error', 'Could not open camera');
        }
    };

    const handleSubmit = () => {
        if (!selectedType) {
            Alert.alert('Missing Info', 'Please select a disaster type.');
            return;
        }

        const newReport = {
            type: selectedType.label,
            description: description,
            location: location
                ? `${location.coords.latitude.toFixed(4)}, ${location.coords.longitude.toFixed(4)}`
                : 'Unknown Location',
            image: image,
            status: 'Pending'
        };

        addReport(newReport);

        Alert.alert(
            'Report Submitted',
            `Your report for ${selectedType.label} has been sent to the admin for approval!`
        );

        // Reset form
        setSelectedType(null);
        setDescription('');
        setImage(null);
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.header}>Report Disaster</Text>

                {/* 1. Location Section */}
                <View style={styles.section}>
                    <Text style={styles.label}>Location</Text>
                    <View style={styles.locationBox}>
                        <Ionicons name="location" size={24} color={COLORS.primary} />
                        {loadingLocation ? (
                            <ActivityIndicator size="small" color={COLORS.primary} style={{ marginLeft: 10 }} />
                        ) : (
                            <Text style={styles.locationText}>
                                {location
                                    ? `Lat: ${location.coords.latitude.toFixed(4)}, Long: ${location.coords.longitude.toFixed(4)}`
                                    : 'Fetching Location...'}
                            </Text>
                        )}
                    </View>
                </View>

                {/* 2. Type Section */}
                <View style={styles.section}>
                    <Text style={styles.label}>Disaster Type</Text>
                    <View style={styles.typeGrid}>
                        {DISASTER_TYPES.map((type) => (
                            <TouchableOpacity
                                key={type.id}
                                style={[styles.typeButton, selectedType?.id === type.id && styles.typeButtonActive]}
                                onPress={() => setSelectedType(type)}
                            >
                                <Ionicons
                                    name={type.icon}
                                    size={30}
                                    color={selectedType?.id === type.id ? COLORS.white : COLORS.gray}
                                />
                                <Text style={[styles.typeText, selectedType?.id === type.id && styles.typeTextActive]}>
                                    {type.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* 3. Media Section */}
                <View style={styles.section}>
                    <Text style={styles.label}>Evidence (Optional)</Text>
                    <View style={styles.mediaRow}>
                        <TouchableOpacity style={styles.mediaButton} onPress={takePhoto}>
                            <Ionicons name="camera" size={24} color={COLORS.secondary} />
                            <Text style={styles.mediaButtonText}>Camera</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.mediaButton} onPress={pickImage}>
                            <Ionicons name="images" size={24} color={COLORS.secondary} />
                            <Text style={styles.mediaButtonText}>Gallery</Text>
                        </TouchableOpacity>
                    </View>
                    {image && (
                        <View style={styles.imagePreviewContainer}>
                            <Image source={{ uri: image }} style={styles.imagePreview} />
                            <TouchableOpacity style={styles.removeImage} onPress={() => setImage(null)}>
                                <Ionicons name="close-circle" size={24} color={COLORS.danger} />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {/* 4. Description Section */}
                <View style={styles.section}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Describe the situation (e.g. fire spreading, blocked road)"
                        multiline
                        numberOfLines={4}
                        value={description}
                        onChangeText={setDescription}
                    />
                </View>

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitText}>SUBMIT REPORT</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    scroll: { padding: SIZES.padding },
    header: { fontSize: SIZES.h1, fontWeight: 'bold', color: COLORS.text, marginBottom: 20 },
    section: { marginBottom: 24 },
    label: { fontSize: SIZES.h3, fontWeight: 'bold', color: COLORS.text, marginBottom: 12 },

    locationBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, padding: 16, borderRadius: SIZES.radius, elevation: 1 },
    locationText: { marginLeft: 10, color: COLORS.gray, fontWeight: '600' },

    typeGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    typeButton: {
        width: '30%', backgroundColor: COLORS.white, borderRadius: SIZES.radius,
        padding: 16, alignItems: 'center', marginBottom: 12, elevation: 1
    },
    typeButtonActive: { backgroundColor: COLORS.primary },
    typeText: { fontSize: 12, marginTop: 8, color: COLORS.gray, fontWeight: '600' },
    typeTextActive: { color: COLORS.white },

    mediaRow: { flexDirection: 'row', marginBottom: 12 },
    mediaButton: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white,
        padding: 12, borderRadius: SIZES.radius, marginRight: 12, elevation: 1
    },
    mediaButtonText: { marginLeft: 8, color: COLORS.secondary, fontWeight: 'bold' },

    imagePreviewContainer: { position: 'relative', marginTop: 10 },
    imagePreview: { width: '100%', height: 200, borderRadius: SIZES.radius },
    removeImage: { position: 'absolute', top: 10, right: 10, backgroundColor: 'white', borderRadius: 12 },

    input: {
        backgroundColor: COLORS.white, borderRadius: SIZES.radius, padding: 16,
        textAlignVertical: 'top', elevation: 1, fontSize: 16
    },

    submitButton: {
        backgroundColor: COLORS.danger, padding: 18, borderRadius: SIZES.radius,
        alignItems: 'center', elevation: 3, marginBottom: 40
    },
    submitText: { color: COLORS.white, fontWeight: 'bold', fontSize: 18 }
});

export default ReportScreen;
