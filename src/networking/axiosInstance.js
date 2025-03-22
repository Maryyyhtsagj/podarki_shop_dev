import axios from 'axios';
import {login} from 'npm/lib/utils/auth';
import {BaseUrl} from '../constants';
import {checkTokens} from '../utils';

const axiosInstance = axios.create({
  baseURL: BaseUrl,
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  async config => {
    let token = await checkTokens();


    if (token) {
      config.headers.Authorization = `${token}`;
    }

      console.log(config.method.toUpperCase(), config.baseURL, config.url)

      return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export default axiosInstance;
