import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import LoginScreen from '../screens/Auth/LoginScreen';
import RescueDashboard from '../screens/Rescue/RescueDashboard';
import AdminDashboard from '../screens/Admin/AdminDashboard';
import HomeScreen from '../screens/HomeScreen';
import AlertsScreen from '../screens/AlertsScreen';
import MapScreen from '../screens/MapScreen';
import GuidesScreen from '../screens/GuidesScreen';
import ReportScreen from '../screens/ReportScreen';
import ContactsScreen from '../screens/ContactsScreen';
import { COLORS } from '../constants/theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const PublicTabNavigator = ({ onLogout }) => (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
                else if (route.name === 'Alerts') iconName = focused ? 'warning' : 'warning-outline';
                else if (route.name === 'Map') iconName = focused ? 'map' : 'map-outline';
                else if (route.name === 'Report') iconName = focused ? 'megaphone' : 'megaphone-outline';
                else if (route.name === 'Guides') iconName = focused ? 'book' : 'book-outline';
                else if (route.name === 'Contacts') iconName = focused ? 'call' : 'call-outline';
                return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: COLORS.primary,
            tabBarInactiveTintColor: COLORS.gray,
        })}
    >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Alerts" component={AlertsScreen} />
        <Tab.Screen name="Map" component={MapScreen} />
        <Tab.Screen name="Report" component={ReportScreen} options={{ title: 'Report', tabBarLabel: 'Report' }} />
        <Tab.Screen name="Guides" component={GuidesScreen} />
        <Tab.Screen name="Contacts" component={ContactsScreen} />
    </Tab.Navigator>
);

const AppNavigator = () => {
    const [userRole, setUserRole] = useState(null); // null (Login), 'public', 'rescue', 'admin'

    if (!userRole) {
        return (
            <NavigationContainer>
                <LoginScreen onLogin={(role) => setUserRole(role)} />
            </NavigationContainer>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {userRole === 'public' && (
                    <Stack.Screen name="PublicApp">
                        {props => <PublicTabNavigator {...props} onLogout={() => setUserRole(null)} />}
                    </Stack.Screen>
                )}
                {userRole === 'rescue' && (
                    <Stack.Screen name="RescueApp">
                        {props => <RescueDashboard {...props} onLogout={() => setUserRole(null)} />}
                    </Stack.Screen>
                )}
                {userRole === 'admin' && (
                    <Stack.Screen name="AdminApp">
                        {props => <AdminDashboard {...props} onLogout={() => setUserRole(null)} />}
                    </Stack.Screen>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
