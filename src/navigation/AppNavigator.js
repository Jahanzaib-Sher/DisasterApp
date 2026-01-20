import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import LoginScreen from '../screens/Auth/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import AlertsScreen from '../screens/AlertsScreen';
import MapScreen from '../screens/MapScreen';
import GuidesScreen from '../screens/GuidesScreen';
import ReportScreen from '../screens/ReportScreen';
import ContactsScreen from '../screens/ContactsScreen';
import RescueDashboard from '../screens/Rescue/RescueDashboard';
import AdminDashboard from '../screens/Admin/AdminDashboard';
import { COLORS } from '../constants/theme';

/* ================= NAVIGATORS ================= */

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

/* ================= PUBLIC TABS ================= */

const PublicTabNavigator = ({ onLogout }) => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: true,
                headerTitle: 'DisasterGuard',
                headerStyle: { backgroundColor: COLORS.secondary },
                headerTitleStyle: {
                    color: COLORS.white,
                    fontSize: 20,
                    fontWeight: 'bold',
                },
                headerRight: () => (
                    <TouchableOpacity onPress={onLogout} style={{ marginRight: 14 }}>
                        <Ionicons
                            name="log-out-outline"
                            size={24}
                            color={COLORS.white}
                        />
                    </TouchableOpacity>
                ),
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.gray,
                tabBarLabelStyle: { fontSize: 12 },
                tabBarStyle: { height: 60 },
                tabBarIcon: ({ focused, color, size }) => {
                    let icon;

                    switch (route.name) {
                        case 'Home':
                            icon = focused ? 'home' : 'home-outline';
                            break;
                        case 'Alerts':
                            icon = focused ? 'warning' : 'warning-outline';
                            break;
                        case 'Map':
                            icon = focused ? 'map' : 'map-outline';
                            break;
                        case 'Report':
                            icon = focused ? 'megaphone' : 'megaphone-outline';
                            break;
                        case 'Guides':
                            icon = focused ? 'book' : 'book-outline';
                            break;
                        case 'Contacts':
                            icon = focused ? 'call' : 'call-outline';
                            break;
                        default:
                            icon = 'ellipse';
                    }

                    return <Ionicons name={icon} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Alerts" component={AlertsScreen} />
            <Tab.Screen name="Map" component={MapScreen} />
            <Tab.Screen name="Report" component={ReportScreen} />
            <Tab.Screen name="Guides" component={GuidesScreen} />
            <Tab.Screen name="Contacts" component={ContactsScreen} />
        </Tab.Navigator>
    );
};

/* ================= ROOT NAVIGATOR ================= */

const AppNavigator = () => {
    const [userRole, setUserRole] = useState(null); // null | public | rescue | admin

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!userRole && (
                    <Stack.Screen name="Login">
                        {(props) => (
                            <LoginScreen
                                {...props}
                                onLogin={(role) => setUserRole(role)}
                            />
                        )}
                    </Stack.Screen>
                )}

                {userRole === 'public' && (
                    <Stack.Screen name="Public">
                        {(props) => (
                            <PublicTabNavigator
                                {...props}
                                onLogout={() => setUserRole(null)}
                            />
                        )}
                    </Stack.Screen>
                )}

                {userRole === 'rescue' && (
                    <Stack.Screen name="Rescue">
                        {(props) => (
                            <RescueDashboard
                                {...props}
                                onLogout={() => setUserRole(null)}
                            />
                        )}
                    </Stack.Screen>
                )}

                {userRole === 'admin' && (
                    <Stack.Screen name="Admin">
                        {(props) => (
                            <AdminDashboard
                                {...props}
                                onLogout={() => setUserRole(null)}
                            />
                        )}
                    </Stack.Screen>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
