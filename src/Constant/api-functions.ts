import axios from "axios";
import { apiBaseUrl } from "./config";

const axiosAPI = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Ensure cookies are sent with every request by default

});

const axiosAPIFormData = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "multipart/form-data",
  },
  withCredentials: true, // Ensure cookies are sent with every request by default

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
export async function apiPostReqWithCred(
  path: string,
  body: object,
  formData: boolean = false,
  withCredentials: boolean = true // Ensure cookies are sent with the request
): Promise<any> {
  try {
    const config = {
      headers: {
        'Content-Type': formData ? 'multipart/form-data' : 'application/json', // Set content type accordingly
      },
      withCredentials, // Ensures that cookies are sent along with the request
    };

    let response;
    if (formData) {
      response = await axiosAPIFormData.post(path, body, config);
    } else {
      response = await axiosAPI.post(path, body, config);
    }
    
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


// user

const setAccessToken = (token: string) => {
  document.cookie = `access_token=${token}; path=/; max-age=3600; Secure; SameSite=none`;

};
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

//logout
export const logoutRequest = async () => {
  try {
    // Perform the logout request with credentials
    const response = await apiPostReqWithCred(
      "auth/logout",  // Path to the logout endpoint
      {},             // Empty body for logout  
      false,          // Not sending FormData
      true            // Ensuring cookies are sent with the request (withCredentials: true)
    );

    // Check if the response contains a message
    if (response && response.message) {
      return response; // Return the response so it can be handled in the calling function
    }
    
    // If no specific message, consider this as a successful logout
    return { message: "Logged out successfully" };
  } catch (error) {
    console.error("Error during logout:", error);
    throw error; // Ensure the error is propagated
  }
};


export async function apiDeleteReq(path: string, params: object): Promise<any> {
  try {
    const response = await axiosAPI.delete(path, { params });
    return response.data;
  } catch (error) {
    console.error("Error in Delete request:", error);
    throw error;
  }
}
