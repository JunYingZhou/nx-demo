import { Config } from 'react-native-config';

export const baseURL = Config.API_URL;
console.log(Config, 'baseURL'); // Log the baseURL for verificatio

export const timeout = 5000

export const headers = {
  'Content-Type': 'application/json',
};
