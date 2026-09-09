const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class SaveService {
	private getToken(): string | null {
		return localStorage.getItem('rps_auth_token');
	}

	private async request(endpoint: string, options: RequestInit = {}) {
		const headers: Record<string, string> = {
			'Content-Type': 'application/json',
			...options.headers as Record<string, string>,
		};
		const token = this.getToken();
		if (token) headers['Authorization'] = `Bearer ${token}`;

		const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
		const result = (await response.json()) as { error?: string; data: any };
		if (!response.ok) throw new Error(result.error || 'Save API Error');
		return result.data;
	}

	async saveGame(saveData: any) {
		return this.request('/sessions/save', {
			method: 'POST',
			body: JSON.stringify(saveData),
		});
	}

	async getSaves() {
		return this.request('/sessions/saves');
	}

	async getSave(saveId: string) {
		return this.request(`/sessions/saves/${saveId}`);
	}

	async updateSave(saveId: string, updates: any) {
		return this.request(`/sessions/saves/${saveId}`, {
			method: 'PUT',
			body: JSON.stringify(updates),
		});
	}

	async deleteSave(saveId: string) {
		return this.request(`/sessions/saves/${saveId}`, { method: 'DELETE' });
	}
}

export const saveService = new SaveService();
