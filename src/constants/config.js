import { Platform } from 'react-native';

const LOCAL_IP = '192.168.1.216';

const API_URL =
    Platform.OS === 'android'
        ? __DEV__
            ? 'http://10.0.2.2:3000'   // Emulator
            : `http://${LOCAL_IP}:3000` // Physical device
        : 'http://localhost:3000';

export default API_URL;
