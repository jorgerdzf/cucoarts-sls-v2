import axios from 'axios';
import { apiEndpoint } from '../../constants/settings';
import { headers } from '../../constants/headers';

export const getRandomArt = async () => {
    const url = `${apiEndpoint}art` || '';
    const options = {
        headers: headers,
      };
    try {
        const response = await axios.get(url, options);
        return response;
    } catch (error) {
        throw error;
    }
}