import { createContext, useState, useEffect } from "react";
import { getMe } from "./services/auth.api";

export const AuthContext = createContext()


export const AuthProvider = ({ children }) => {

    const [ user, setUser ] = useState(null)
    const [ loading, setLoading ] = useState(true)

    useEffect(() => {
        const verifyAuth = async () => {
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
        };
        verifyAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading }} >
            {children}
        </AuthContext.Provider>
    )

}