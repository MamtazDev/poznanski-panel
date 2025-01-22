import { apiBaseUrl } from "./config";
import axios from "axios";

const axiosAPI = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function apiPostReq(path: string, body: object): Promise<any> {
  try {
    const response = await axiosAPI.post(path, body);
    return response.data;
  } catch (error) {
    console.error("Error in POST request:", error);
    throw error;
  }
}

export async function apiGetReq(path: string, params: object): Promise<any> {
  try {
    const response = await axiosAPI.get(path, { params });
    return response.data;
  } catch (error) {
    // Handle error here, you can log it or throw it further
    console.error("Error in GET request:", error);
    throw error;
  }
}

export async function apiPutReq(path: string, body: object): Promise<any> {
  try {
    const response = await axiosAPI.put(path, body);
    return response.data;
  } catch (error) {
    console.error("Error in Put request:", error);
    throw error;
  }
}

export async function apiDeleteReq(path: string, params: object): Promise<any> {
  try {
    const response = await axiosAPI.delete(path, { params });
    return response.data;
  } catch (error) {
    console.error("Error in Delete request:", error);
    throw error;
  }
}
