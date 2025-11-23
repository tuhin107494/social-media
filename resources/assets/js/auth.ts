import axios from 'axios';
import { User } from './types';

const SESSION_KEY = 'app_user_session_v1';

function saveSession(user: Partial<{ id: string; email: string; name?: string; token?: string }>) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export async function loginUser(email: string, password: string): Promise<User> {

    try {
        const { data } = await axios.post('/api/login', { email, password }, { headers: { Accept: 'application/json' } });
        const user: User = { id: data.user?.id || data.id || email, email: data.user?.email || data.email || email, name: data.user?.name || data.name, token: data.token || data.accessToken };
        saveSession(user);
        return user;
    } catch (err: any) {
        // Network or server error
        if (err?.response && err.response.data) {
            const errJson = err.response.data;
            const errFields = errJson.errors || null;
            const errMsg = errJson.message || (errFields ? Object.values(errFields).flat().join(' ') : 'Server login failed');
            throw { message: errMsg, errors: errFields };
        }

        // network fallback
        const fallback: User = { id: email, email };
        saveSession(fallback);
        return fallback;
    }
}

export async function registerUser(payload: { first_name?: string; last_name?: string; email: string; password: string; confirm: string; }) {
    try {
        const { data } = await axios.post('/api/register', payload, { headers: { Accept: 'application/json' } });
        const user: User = { id: data.user?.id || data.id || payload.email, email: data.user?.email || data.email || payload.email, name: data.user?.name || `${payload.first_name || ''} ${payload.last_name || ''}`.trim(), token: data.token };
        saveSession(user);
        return user;
    } catch (err: any) {
        if (err?.response && err.response.data) {
            const errJson = err.response.data;
            const errFields = errJson.errors || null;
            const errMsg = errJson.message || (errFields ? Object.values(errFields).flat().join(' ') : 'Server register failed');
            throw { message: errMsg, errors: errFields };
        }

        const fallback: User = { id: payload.email, email: payload.email, name: `${payload.first_name || ''} ${payload.last_name || ''}`.trim() };
        saveSession(fallback);
        return fallback;
    }
}

export async function authFetch(input: RequestInfo, init: RequestInit = {}) {
    const sessionRaw = localStorage.getItem(SESSION_KEY);
    const session = sessionRaw ? JSON.parse(sessionRaw) : null;

    const method = (init.method || 'GET').toUpperCase();
    const headers = { ...(init.headers as Record<string, string> | undefined), Accept: 'application/json' } as Record<string, string>;
    if (session?.token) headers['Authorization'] = `Bearer ${session.token}`;

    const axiosConfig: any = { url: input as string, method: method.toLowerCase(), headers };
    if (init.body) {
        try { axiosConfig.data = JSON.parse(init.body as string); } catch (e) { axiosConfig.data = init.body; }
    }

    const response = await axios(axiosConfig);
    return response;
}

export function getSession(): User | null {
    try {
        const raw = localStorage.getItem(SESSION_KEY);
        if (!raw) return null;
        return JSON.parse(raw) as User;
    } catch (err) {
        return null;
    }
}

export function logoutUser(): void {

    try {
        const raw = localStorage.getItem(SESSION_KEY);
        const session = raw ? JSON.parse(raw) : null;
        if (session?.token) {
            axios.post('/api/logout', {}, { headers: { Authorization: `Bearer ${session.token}`, Accept: 'application/json' } }).catch(() => { });
        }
    } catch (e) {
        // ignore
    }

    localStorage.removeItem(SESSION_KEY);
}

export default { loginUser, registerUser, getSession, logoutUser, authFetch };
