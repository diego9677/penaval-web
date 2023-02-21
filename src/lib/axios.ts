import axios, { AxiosError } from "axios";


const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api'
});


export function initAxiosInterceptors() {

  axiosInstance.interceptors.request.use(function (config) {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers!.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  axiosInstance.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      localStorage.removeItem('token');
      // if (window.location.pathname !== '/login') {
      //   window.location.href = '/login';
      // }
      return Promise.reject(error);
    } else {
      return Promise.reject(error);
    }
  });
}

export default axiosInstance;