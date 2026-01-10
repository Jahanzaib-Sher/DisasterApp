import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Linking, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useDisaster } from '../context/DisasterContext';

const ContactItem = ({ item }) => (
    <View style={styles.item}>
        <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.name[0]}</Text>
        </View>
        <View style={styles.info}>
            <Text style={styles.name}>{item.name} <Text style={styles.relation}>({item.relation})</Text></Text>
            <Text style={styles.phone}>{item.phone}</Text>
        </View>
        <TouchableOpacity onPress={() => Linking.openURL(`tel:${item.phone}`)}>
            <Ionicons name="call" size={24} color={COLORS.safety} />
        </TouchableOpacity>
    </View>
);

const ContactsScreen = () => {
    const { contacts, addContact } = useDisaster();
    const [modalVisible, setModalVisible] = useState(false);
    const [newName, setNewName] = useState('');
    const [newPhone, setNewPhone] = useState('');
    const [newRelation, setNewRelation] = useState('');

    const handleAddContact = () => {
        if (!newName || !newPhone) {
            Alert.alert('Error', 'Name and Phone are required');
            return;
        }
        addContact(newName, newPhone, newRelation || 'Friend');
        setModalVisible(false);
        setNewName(''); setNewPhone(''); setNewRelation('');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.header}>Emergency Contacts</Text>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Ionicons name="add-circle" size={32} color={COLORS.primary} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={contacts}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <ContactItem item={item} />}
                contentContainerStyle={styles.list}
            />

            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add New Contact</Text>

                        <TextInput style={styles.input} placeholder="Name" value={newName} onChangeText={setNewName} />
                        <TextInput style={styles.input} placeholder="Phone Number" value={newPhone} keyboardType="phone-pad" onChangeText={setNewPhone} />
                        <TextInput style={styles.input} placeholder="Relation (e.g. Brother)" value={newRelation} onChangeText={setNewRelation} />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                                <Text style={styles.btnText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.saveBtn} onPress={handleAddContact}>
                                <Text style={[styles.btnText, { color: COLORS.white }]}>Save Contact</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SIZES.padding, backgroundColor: COLORS.white },
    header: { fontSize: SIZES.h1, fontWeight: 'bold', color: COLORS.text },
    list: { padding: SIZES.padding },
    item: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white,
        padding: SIZES.padding, borderRadius: SIZES.radius, marginBottom: 12, elevation: 1
    },
    avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.lightGray, justifyContent: 'center', alignItems: 'center' },
    avatarText: { fontWeight: 'bold', fontSize: 18, color: COLORS.gray },
    info: { flex: 1, marginLeft: 16 },
    name: { fontSize: SIZES.h3, fontWeight: 'bold', color: COLORS.text },
    relation: { fontSize: 12, fontWeight: 'normal', color: COLORS.gray },
    phone: { color: COLORS.gray },

    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
    modalContent: { backgroundColor: COLORS.white, padding: 20, borderRadius: SIZES.radius },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    input: { borderWidth: 1, borderColor: COLORS.lightGray, padding: 10, borderRadius: 8, marginBottom: 10 },
    modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
    cancelBtn: { padding: 12 },
    saveBtn: { backgroundColor: COLORS.primary, padding: 12, borderRadius: 8 },
    btnText: { fontWeight: 'bold' }
});

export default ContactsScreen;
