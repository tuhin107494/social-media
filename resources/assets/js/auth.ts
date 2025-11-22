import { User } from './types';

const SESSION_KEY = 'app_user_session_v1';

export async function loginUser(email: string, password: string): Promise<User> {
  // Try server API first, fallback to local mock
  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error('Server login failed');
    const json = await res.json();
    const user: User = { id: json.id || json.user?.id || email, email: json.email || json.user?.email || email, name: json.name || json.user?.name, token: json.token || json.accessToken };
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  } catch (err) {
    // local fallback: accept any credentials (development convenience)
    const fallback: User = { id: email, email };
    localStorage.setItem(SESSION_KEY, JSON.stringify(fallback));
    return fallback;
  }
}

export async function registerUser(payload: { firstName?: string; lastName?: string; email: string; password: string; }) {
  try {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Server register failed');
    const json = await res.json();
    const user: User = { id: json.id || payload.email, email: json.email || payload.email, name: `${payload.firstName || ''} ${payload.lastName || ''}`.trim(), token: json.token };
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  } catch (err) {
    const fallback: User = { id: payload.email, email: payload.email, name: `${payload.firstName || ''} ${payload.lastName || ''}`.trim() };
    localStorage.setItem(SESSION_KEY, JSON.stringify(fallback));
    return fallback;
  }
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
  localStorage.removeItem(SESSION_KEY);
}

export default { loginUser, registerUser, getSession, logoutUser };
