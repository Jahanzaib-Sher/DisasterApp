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
            console.log('📝 Submitting report to:', `${API_URL}/api/reports`, newReport);
            
            const response = await fetch(`${API_URL}/api/reports`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newReport),
            });
            
            console.log('📡 Response status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Response not OK:', errorText);
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }
            
            const savedReport = await response.json();
            console.log('✅ Report saved:', savedReport);
            setReports(prev => [savedReport, ...prev]);
        } catch (error) {
            console.error('❌ Failed to submit report:', error);
            Alert.alert('Error', `Could not submit report: ${error.message}`);
        }
    };

    // Admin: Approve Report
    const approveReport = async (id, severity = 'High') => {
        try {
            console.log('Approving report', id, 'severity:', severity);

            const response = await fetch(`${API_URL}/api/reports/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    status: 'Approved', 
                    severity,
                    approvedAt: new Date().toISOString()
                }),
            });

            console.log('Approve response status:', response.status);
            const result = await response.json().catch(() => null);
            console.log('Approve response:', result);

            if (response.ok) {
                // Update local state immediately with the response
                const updatedReport = result?.report || {
                    id,
                    status: 'Approved',
                    severity,
                    approvedAt: new Date().toISOString()
                };
                
                setReports(prev => {
                    const newReports = prev.map(report =>
                        report.id === id ? { ...report, ...updatedReport } : report
                    );
                    console.log('Updated reports after approval:', newReports);
                    return newReports;
                });
                
                Alert.alert('✅ Success', 'Report approved! Sent to Rescue Teams & Public Alerts.');
            } else {
                console.error('Approve failed:', result);
                Alert.alert("❌ Error", result?.message || "Approval failed on server.");
            }
        } catch (error) {
            console.error('Failed to approve report:', error);
            Alert.alert("⚠️ Connection Error", "Could not reach server. Check if backend is running.");
        }
    };


    // Admin: Reject Report
    const rejectReport = async (id, reason = 'Insufficient information') => {
        try {
            console.log('Rejecting report', id, 'reason:', reason);
            const response = await fetch(`${API_URL}/api/reports/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    status: 'Rejected',
                    rejectionReason: reason,
                    rejectedAt: new Date().toISOString()
                }),
            });

            console.log('Reject response status:', response.status);
            const result = await response.json().catch(() => null);
            console.log('Reject response:', result);

            if (response.ok) {
                // Update local state immediately with the response
                const updatedReport = result?.report || {
                    id,
                    status: 'Rejected',
                    rejectionReason: reason,
                    rejectedAt: new Date().toISOString()
                };

                setReports(prev => {
                    const newReports = prev.map(report =>
                        report.id === id ? { ...report, ...updatedReport } : report
                    );
                    console.log('Updated reports after rejection:', newReports);
                    return newReports;
                });
                
                Alert.alert('✅ Rejected', `Report rejected: ${reason}`);
            } else {
                console.error('Reject failed:', result || 'No response body');
                Alert.alert('❌ Error', result?.message || 'Failed to reject report.');
            }
        } catch (error) {
            console.error('Failed to reject report:', error);
            Alert.alert('⚠️ Connection Error', 'Could not reach server. Check if backend is running.');
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

    // Rescue: Accept Mission
    const acceptMission = async (id) => {
        try {
            console.log('Accepting mission', id);
            const response = await fetch(`${API_URL}/api/reports/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    missionStatus: 'Active',
                    acceptedAt: new Date().toISOString()
                }),
            });

            console.log('Accept mission response status:', response.status);
            const result = await response.json().catch(() => null);
            console.log('Accept mission response:', result);

            if (response.ok) {
                const updatedReport = result?.report || {
                    id,
                    missionStatus: 'Active',
                    acceptedAt: new Date().toISOString()
                };
                
                setReports(prev => {
                    const newReports = prev.map(report =>
                        report.id === id ? { ...report, ...updatedReport } : report
                    );
                    console.log('Updated reports after mission accepted:', newReports);
                    return newReports;
                });
                
                Alert.alert('✅ Mission Accepted', 'Mission is now active. Begin rescue operations.');
            } else {
                console.error('Accept mission failed:', result);
                Alert.alert("❌ Error", result?.message || "Failed to accept mission.");
            }
        } catch (error) {
            console.error('Failed to accept mission:', error);
            Alert.alert("⚠️ Connection Error", "Could not reach server. Check if backend is running.");
        }
    };

    // Rescue: Complete Mission
    const completeMission = async (id) => {
        try {
            console.log('Completing mission', id);
            const response = await fetch(`${API_URL}/api/reports/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    missionStatus: 'Completed',
                    completedAt: new Date().toISOString()
                }),
            });

            console.log('Complete mission response status:', response.status);
            const result = await response.json().catch(() => null);
            console.log('Complete mission response:', result);

            if (response.ok) {
                const updatedReport = result?.report || {
                    id,
                    missionStatus: 'Completed',
                    completedAt: new Date().toISOString()
                };
                
                setReports(prev => {
                    const newReports = prev.map(report =>
                        report.id === id ? { ...report, ...updatedReport } : report
                    );
                    console.log('Updated reports after mission completed:', newReports);
                    return newReports;
                });
                
                Alert.alert('✅ Mission Completed', 'Great work! Mission marked as complete.');
            } else {
                console.error('Complete mission failed:', result);
                Alert.alert("❌ Error", result?.message || "Failed to complete mission.");
            }
        } catch (error) {
            console.error('Failed to complete mission:', error);
            Alert.alert("⚠️ Connection Error", "Could not reach server. Check if backend is running.");
        }
    };

    // Derived State for Screens
    const pendingReports = reports.filter(r => r.status === 'Pending');
    const approvedReports = reports.filter(r => r.status === 'Approved' && r.missionStatus !== 'Active' && r.missionStatus !== 'Completed');
    const activeMissions = reports.filter(r => r.missionStatus === 'Active');
    const completedMissions = reports.filter(r => r.missionStatus === 'Completed');
    const rejectedReports = reports.filter(r => r.status === 'Rejected');
    const allReportsCount = reports.length;

    return (
        <DisasterContext.Provider value={{
            reports,
            pendingReports,
            approvedReports,
            activeMissions,
            completedMissions,
            rejectedReports,
            allReportsCount,
            contacts,
            addReport,
            approveReport,
            rejectReport,
            acceptMission,
            completeMission,
            addContact,
            refreshData: () => { fetchReports(); fetchContacts(); }
        }}>
            {children}
        </DisasterContext.Provider>
    );
};

export const useDisaster = () => useContext(DisasterContext);
