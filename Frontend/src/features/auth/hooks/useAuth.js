import { login, register, getMe, logout } from "../services/auth.api";
import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { useEffect } from "react";


export const useAuth = () => {
    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context

    async function handleRegister({ username, email, password }) {
        setLoading(true);
        try {
            const data = await register({ username, email, password });
            setUser(data.user);
            return data;
        } finally {
            setLoading(false);
        }
    }

    async function handleLogin({ username, email, password }) {
        setLoading(true);
        try {
            const data = await login({ username, email, password });
            setUser(data.user);
            return data;
        } finally {
            setLoading(false);
        }
    }

    async function handleGetMe() {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setLoading(false);
                return;
            }
            const data = await getMe();
            setUser(data.user);
        } catch (error) {
            console.error("Auth verification failed", error);
            setUser(null);
            localStorage.removeItem("token");
        } finally {
            setLoading(false);
        }
    }

    async function handleLogout() {
        setLoading(true);
        try {
            await logout();
            setUser(null);
            localStorage.removeItem("token");
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            setLoading(false);
        }
    }



    return ({
        user, loading, handleRegister, handleLogin, handleLogout, handleGetMe
    })
}