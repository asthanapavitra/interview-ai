import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import {
  loginUser,
  logoutUser,
  registerUser,
  getProfile,
  handleGoogleResponse,
} from "../services/auth.api";

export const useAuth = () => {
  const context = useContext(AuthContext);
  const { user, setUser, loading, setLoading } = context;

  const handleLogin = async (loginData) => {
    setLoading(true);
    try {
      const data = await loginUser(loginData);
      setUser(data.user);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleAuth = async (response) => {
    setLoading(true);
    try {
      const data = await handleGoogleResponse(response);
      setUser(data.user);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleRegister = async (registerData) => {
    setLoading(true);
    try {
      const data = await registerUser(registerData);
      setUser(data.user);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleLogout = async () => {
    setLoading(true);
    try {
      const data = await logoutUser();
      setUser(null);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getAndSetUser = async () => {
      try {
        const data = await getProfile();

        setUser(data.user);
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    };
    getAndSetUser();
  }, []);
  return { user, loading, handleLogin, handleRegister, handleLogout ,handleGoogleAuth};
};
