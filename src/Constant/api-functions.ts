import axios from "axios";
import { apiBaseUrl } from "./config";

const axiosAPI = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

const axiosAPIFormData = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

export async function apiPostReq(
  path: string,
  body: object,
  formData: boolean = false
): Promise<any> {
  try {
    if (formData) {
      const response = await axiosAPIFormData.post(path, body);
      return response.data;
    } else {
      const response = await axiosAPI.post(path, body);
      return response.data;
    }
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

export const checkIfLoggedIn = async (): Promise<any> => {
  return await apiGetReq("auth/verify", {});
};

const setAccessToken = (token: string) => {
  document.cookie = `access_token=${token}; path=/; max-age=3600; Secure; SameSite=Strict`;
};

// user
export const loginRequest = async (
  password: string,
  email?: string,
  nickname?: string
) => {
  const { accessToken } = await apiPostReq(
    "auth/login",
    { email, password, nickname },
    false
  );
  if (accessToken) {
    setAccessToken(accessToken);
  }
};

export const logoutRequest = async () => {
  try {
    await apiPostReq("auth/logout", {}, true);
    localStorage.removeItem("accessToken");
    sessionStorage.removeItem("selectedMenu");
  } catch (error) {
    console.error("Logout failed", error);
  }
};

export const registerRequest = async (
  password: string,
  email: string,
  nickname: string
) => {
  await apiPostReq("auth/register", { nickname, email, password }, false);
};

export const verifyEmailRequest = async (token: string) => {
  await apiPostReq(`auth/verify-email/${token}`, {}, false);
};