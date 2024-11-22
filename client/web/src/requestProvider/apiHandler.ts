import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import useStore from '../components/store/zustand'
import { useError } from './errorContext'

const useApi = () => {
    const { setError } = useError();
    const {getAccessToken} = useStore()
    const url = process.env.REACT_APP_API_URL
    const baseURL = url
    
    
    const api = axios.create({
        baseURL: baseURL,
    });

    api.interceptors.request.use(
        (config) => {
            const token = getAccessToken()
            config.headers['Authorization'] = `Bearer ${token}`
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    api.interceptors.response.use(
        (response: AxiosResponse) => {
            return response;
        },
        (error) => {
            return Promise.reject(error);
        }
    );



    const request = async <T>(config: AxiosRequestConfig): Promise<T | null> => {
        try {
            const response: AxiosResponse<T> = await api.request(config);
            return response.data;
        } catch (error: any) {
            const message = error.response?.data;
            if (message) {
                setError(message);
            } else {
                setError('Oops, something went wrong')
            }
            setTimeout(() => {
                setError('')
            }, 2000);
            
            return null;
        }
    };

    return request;
};

export default useApi;
