import { API_URL, APP_ENV } from '@env';

export const baseURL = API_URL;
console.log(baseURL, 'baseURL'); // Log the baseURL for verificatio

export const timeout = 500000

export const headers = {
  'Content-Type': 'application/json',
};
