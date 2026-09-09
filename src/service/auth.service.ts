interface User {
	id: string;
	username: string;
	email: string;
	avatar: string;
	createdAt: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const CURRENT_USER_KEY = 'rps_current_user';

class AuthService {
	private token: string | null = null;
	private user: User | null = null;

	constructor() {
		this.token = localStorage.getItem('rps_auth_token');
		this.user = JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || 'null') as User | null;
	}

	getToken(): string | null {
		return this.token;
	}

	isAuthenticated(): boolean {
		return !!this.token && !!this.user;
	}

	getCurrentUser(): User | null {
		return this.user;
	}

	private setSession(token: string, user: User) {
		this.token = token;
		this.user = user;
		localStorage.setItem('rps_auth_token', token);
		localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
	}

	clearToken() {
		this.token = null;
		this.user = null;
		localStorage.removeItem('rps_auth_token');
		localStorage.removeItem(CURRENT_USER_KEY);
	}

	// Keep authentication failures visible to the caller.
	private async tryBackend(endpoint: string, options: RequestInit = {}): Promise<any | null> {
		try {
			const headers: Record<string, string> = {
				'Content-Type': 'application/json',
				...(options.headers as Record<string, string>),
			};
			if (this.token) {
				headers['Authorization'] = `Bearer ${this.token}`;
			}
			const controller = new AbortController();
			const timeout = setTimeout(() => controller.abort(), 3000);
			const response = await fetch(`${API_URL}${endpoint}`, {
				...options,
				headers,
				signal: controller.signal,
			});
			clearTimeout(timeout);
			const result = (await response.json()) as { data: any; error?: string };
			if (!response.ok) {
				throw new Error(result.error || 'Authentication request failed');
			}
			return result.data;
		} catch (error) {
			if (error instanceof Error) throw error;
			throw new Error('Authentication request failed');
		}
	}

	async register(username: string, email: string, password: string): Promise<{ token: string; user: User }> {
		const data = await this.tryBackend('/auth/register', {
			method: 'POST',
			body: JSON.stringify({ username, email, password }),
		});
		this.setSession(data.token, data.user);
		return data;
	}

	async login(email: string, password: string): Promise<{ token: string; user: User }> {
		const data = await this.tryBackend('/auth/login', {
			method: 'POST',
			body: JSON.stringify({ email, password }),
		});
		this.setSession(data.token, data.user);
		return data;
	}

	async getMe(): Promise<User> {
		const user = await this.tryBackend('/auth/me');
		this.user = user;
		localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
		return user;
	}

	async updateProfile(updates: { username?: string; avatar?: string }): Promise<User> {
		const user = await this.tryBackend('/auth/profile', {
			method: 'PUT',
			body: JSON.stringify(updates),
		});
		this.user = user;
		localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
		return user;
	}
}

export const authService = new AuthService();
