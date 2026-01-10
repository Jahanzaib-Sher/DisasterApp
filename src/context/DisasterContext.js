import React, { createContext, useState, useContext, useEffect } from 'react';
import { Alert } from 'react-native';
import API_URL from '../constants/config';

const DisasterContext = createContext();

export const DisasterProvider = ({ children }) => {
    // 1. Reports State
    const [reports, setReports] = useState([]);

    // 2. Contacts State
    const [contacts, setContacts] = useState([]);

    // Load Data on Mount
    useEffect(() => {
        fetchReports();
        fetchContacts();
    }, []);

    const fetchReports = async () => {
        try {
            const response = await fetch(`${API_URL}/api/reports`);
            const data = await response.json();
            setReports(data);
        } catch (error) {
            console.error('Failed to fetch reports:', error);
            // Optional: Alert.alert("Connection Error", "Ensure the backend server is running.");
        }
    };

    const fetchContacts = async () => {
        try {
            const response = await fetch(`${API_URL}/api/contacts`);
            const data = await response.json();
            setContacts(data);
        } catch (error) {
            console.error('Failed to fetch contacts:', error);
        }
    };

    // 3. Actions

    // User: Submit Report
    const addReport = async (newReport) => {
        try {
            const response = await fetch(`${API_URL}/api/reports`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newReport),
            });
            const savedReport = await response.json();
            setReports(prev => [savedReport, ...prev]);
        } catch (error) {
            console.error('Failed to submit report:', error);
            Alert.alert('Error', 'Could not submit report. Check connection.');
        }
    };

    // Admin: Approve Report
    const approveReport = async (id, severity = 'High') => {
        try {
            const response = await fetch(`${API_URL}/api/reports/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'Approved', severity }),
            });

            if (response.ok) {
                setReports(prev => prev.map(report =>
                    report.id === id ? { ...report, status: 'Approved', severity } : report
                ));
            } else {
                const errText = await response.text();
                console.error('Approve failed:', errText);
                Alert.alert("Error", "Server failed to approve. Check server logs.");
            }
        } catch (error) {
            console.error('Failed to approve report:', error);
            Alert.alert("Connection Error", "Could not reach server.");
        }
    };

    // Admin: Reject Report
    const rejectReport = async (id) => {
        try {
            const response = await fetch(`${API_URL}/api/reports/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'Rejected' }),
            });

            if (response.ok) {
                setReports(prev => prev.map(report =>
                    report.id === id ? { ...report, status: 'Rejected' } : report
                ));
            }
        } catch (error) {
            console.error('Failed to reject report:', error);
        }
    };

    // User: Add Contact
    const addContact = async (name, phone, relation) => {
        try {
            const response = await fetch(`${API_URL}/api/contacts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, phone, relation }),
            });
            const savedContact = await response.json();
            setContacts(prev => [...prev, savedContact]);
        } catch (error) {
            console.error('Failed to add contact:', error);
            Alert.alert('Error', 'Could not save contact.');
        }
    };

    // Derived State for Screens
    const pendingReports = reports.filter(r => r.status === 'Pending');
    const approvedReports = reports.filter(r => r.status === 'Approved'); // Visible to Rescue & Public Alerts

    return (
        <DisasterContext.Provider value={{
            reports,
            pendingReports,
            approvedReports,
            contacts,
            addReport,
            approveReport,
            rejectReport,
            addContact,
            refreshData: () => { fetchReports(); fetchContacts(); } // Helper to manually refresh
        }}>
            {children}
        </DisasterContext.Provider>
    );
};

export const useDisaster = () => useContext(DisasterContext);
