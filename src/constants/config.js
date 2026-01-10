import { Platform } from 'react-native';

// Use 10.0.2.2 for Android Emulator, localhost for iOS Simulator and Web
// If running on a physical device, replace with your machine's LAN IP (e.g., http://192.168.1.5:3000)
const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

export default API_URL;
