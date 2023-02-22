import { Brand, Place, Product, Provider } from "./interfaces";
import axiosInstance from "./lib/axios";

export const getApiProducts = async (search: string, signal?: AbortSignal) => {
  const { data } = await axiosInstance.get<Product[]>(`/products?search=${search}`, { signal });
  return data;
};

export const getApiProduct = async (id: number, signal?: AbortSignal) => {
  const response = await axiosInstance.get<Product>(`/products/${id}`, { signal });
  return response.data;
};

export const createApiProduct = async (data: any) => {
  const response = await axiosInstance.post<Product>('/products', data);
  return response.data;
};

export const updateApiProduct = async (id: number, data: any) => {
  const response = await axiosInstance.put<Product>(`/products/${id}`, data);
  return response.data;
};

export const deleteApiProduct = async (id: number) => {
  const response = await axiosInstance.delete<Product>(`/products/${id}`);
  return response.data;
};


// places section
export const getApiPlaces = async (search: string, signal?: AbortSignal) => {
  const { data } = await axiosInstance.get<Place[]>(`/places?search=${search}`, { signal });
  return data;
};

export const getApiPlace = async (id: number, signal?: AbortSignal) => {
  const response = await axiosInstance.get<Place>(`/places/${id}`, { signal });
  return response.data;
};

export const createApiPlace = async (data: any) => {
  const response = await axiosInstance.post<Place>('/places', data);
  return response.data;
};

export const updateApiPlace = async (id: number, data: any) => {
  const response = await axiosInstance.put<Place>(`/places/${id}`, data);
  return response.data;
};

export const deleteApiPlace = async (id: number) => {
  const response = await axiosInstance.delete<Place>(`/places/${id}`);
  return response.data;
};


// providers section
export const getApiProviders = async (search: string, signal?: AbortSignal) => {
  const { data } = await axiosInstance.get<Provider[]>(`/providers?search=${search}`, { signal });
  return data;
};

export const getApiProvider = async (id: number, signal?: AbortSignal) => {
  const response = await axiosInstance.get<Provider>(`/providers/${id}`, { signal });
  return response.data;
};

export const createApiProvide = async (data: any) => {
  const response = await axiosInstance.post<Provider>('/providers', data);
  return response.data;
};

export const updateApiProvider = async (id: number, data: any) => {
  const response = await axiosInstance.put<Provider>(`/providers/${id}`, data);
  return response.data;
};

export const deleteApiProvider = async (id: number) => {
  const response = await axiosInstance.delete<Provider>(`/providers/${id}`);
  return response.data;
};

// brands section
export const getApiBrands = async (search: string, signal?: AbortSignal) => {
  const { data } = await axiosInstance.get<Brand[]>(`/brands?search=${search}`, { signal });
  return data;
};

export const getApiBrand = async (id: number, signal?: AbortSignal) => {
  const response = await axiosInstance.get<Brand>(`/brands/${id}`, { signal });
  return response.data;
};

export const createApiBrand = async (data: any) => {
  const response = await axiosInstance.post<Brand>('/brands', data);
  return response.data;
};

export const updateApiBrand = async (id: number, data: any) => {
  const response = await axiosInstance.put<Brand>(`/brands/${id}`, data);
  return response.data;
};

export const deleteApiBrand = async (id: number) => {
  const response = await axiosInstance.delete<Brand>(`/brands/${id}`);
  return response.data;
};
