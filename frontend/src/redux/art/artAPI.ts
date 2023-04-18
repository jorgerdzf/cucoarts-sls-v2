import axios from 'axios';
import { apiEndpoint } from '../../constants/settings';

export const getRandomArt = async () => {
    const url = `${apiEndpoint}art` || '';
    try {
        const response = await axios.get(url);
        return response;
    } catch (error) {
        throw error;
    }
}