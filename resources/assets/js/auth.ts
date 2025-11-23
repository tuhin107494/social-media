import axios from "axios";
import { User } from "./types";

const SESSION_KEY = "app_user_session_v1";

// Create axios instance
const api = axios.create({
    baseURL: "/api",
    headers: { Accept: "application/json" },
});


function saveSession(user: User) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function getSession(): User | null {
    try {
        return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    } catch {
        return null;
    }
}

export function logoutUser() {
    const session = getSession();
    if (session?.token) {
        api.post("/logout").catch(() => { });
    }
    localStorage.removeItem(SESSION_KEY);
}

// ---- Add token to requests automatically ----
api.interceptors.request.use((config) => {
    const session = getSession();
    if (session?.token) {
        config.headers.Authorization = `Bearer ${session.token}`;
    }
    return config;
});

// ---- Extract readable backend errors ----
function extractError(err: any) {
    if (err.response?.data) {
        const { message, errors } = err.response.data;
        return message || (errors ? Object.values(errors).flat().join(" ") : "Request failed");
    }
    return "Network error";
}

// ---- Auth functions ----
export async function loginUser(email: string, password: string): Promise<User> {
    try {
        const { data } = await api.post("/login", { email, password });

        const user: User = {
            id: data.user?.id,
            email: data.user?.email,
            name: `${data.user?.first_name || ""} ${data.user?.last_name || ""}`.trim(),
            token: data.token || data.accessToken,
        };

        saveSession(user);
        return user;
    } catch (err: any) {
        throw new Error(extractError(err));
    }
}

export async function registerUser(payload: {
    first_name?: string;
    last_name?: string;
    email: string;
    password: string;
    confirm: string;
}) {
    try {
        const { data } = await api.post("/register", payload);

        const user: User = {
            id: data.user?.id,
            email: data.user?.email,
            name: `${payload.first_name || ""} ${payload.last_name || ""}`.trim(),
            token: data.token,
        };

        saveSession(user);
        return user;
    } catch (err: any) {
        throw new Error(extractError(err));
    }
}

// ---- Authenticated fetch replacement ----
export function authFetch(url: string, config = {}) {
    return api(url, config);
}

export default { loginUser, registerUser, getSession, logoutUser, authFetch };
