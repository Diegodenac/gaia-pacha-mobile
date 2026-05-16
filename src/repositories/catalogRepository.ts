import axios from 'axios';
import Constants from 'expo-constants';
import { Company } from '../features/customer/catalog/types';

// Dynamically get the IP address of the machine running Expo
const hostUri = Constants?.expoConfig?.hostUri;
const ip = hostUri ? hostUri.split(':')[0] : 'localhost';
const BACKEND_URL = `http://${ip}:3000`; 

export const catalogRepository = {
  async getCatalog(): Promise<Company[]> {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/catalog`);
      return response.data;
    } catch (error) {
      console.error('Error fetching catalog from backend:', error.message);
      throw error;
    }
  }
};
