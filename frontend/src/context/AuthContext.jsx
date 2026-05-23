import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("whatsapp_saas_token");
        const userData = localStorage.getItem("whatsapp_saas_user");

        if (token && userData) {
            setUser(JSON.parse(userData));
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const { data } = await axios.post("http://localhost:5000/api/auth/login", { email, password });
        localStorage.setItem("whatsapp_saas_token", data.token);
        localStorage.setItem("whatsapp_saas_user", JSON.stringify(data));
        setUser(data);
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        return data;
    };

    const register = async (name, email, password) => {
        const { data } = await axios.post("http://localhost:5000/api/auth/register", { name, email, password });
        localStorage.setItem("whatsapp_saas_token", data.token);
        localStorage.setItem("whatsapp_saas_user", JSON.stringify(data));
        setUser(data);
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        return data;
    };

    const logout = () => {
        localStorage.removeItem("whatsapp_saas_token");
        localStorage.removeItem("whatsapp_saas_user");
        setUser(null);
        delete axios.defaults.headers.common["Authorization"];
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
