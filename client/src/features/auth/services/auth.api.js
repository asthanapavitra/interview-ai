import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}`,
  withCredentials: true,
});
export async function registerUser(registerData) {
  try {
    const response = await api.post("/api/auth/register", registerData);
  
    return response.data;
  } catch (err) {
    console.log(err.message);
  }
}

export async function loginUser(loginData) {
  try {
    const response = await api.post("/api/auth/login", loginData);

    return response.data;
  } catch (err) {
    console.log(err.message);
  }
}

export async function logoutUser() {
  try {
    const response = await api.get("/api/auth/logout");
    
    return response.data;
  } catch (err) {
    console.log(err.message);
  }
}
export async function getProfile() {
  try {
    const response = await api.get("/api/auth/get-profile");
    return response.data;
  } catch (err) {
    console.log(err.message);
  }
}
