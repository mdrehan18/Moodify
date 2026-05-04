import api from "../../shared/api/axios";

export async function register({ email, password, username }) {
    const response = await api.post("/api/auth/register", {
        email, password, username
    });
    if (response.data.token) {
        localStorage.setItem("token", response.data.token);
    }
    return response.data;
}

export async function login({ email, username, password }) {
    const response = await api.post("/api/auth/login", {
        email, username, password
    });
    if (response.data.token) {
        localStorage.setItem("token", response.data.token);
    }
    return response.data;
}

export async function getMe() {
    const response = await api.get("/api/auth/get-me");
    return response.data;
}

export async function logout() {
    const response = await api.get("/api/auth/logout");
    localStorage.removeItem("token");
    return response.data;
}