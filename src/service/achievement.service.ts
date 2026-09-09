const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class AchievementService {
	private async request(endpoint: string, options: RequestInit = {}) {
		const response = await fetch(`${API_URL}${endpoint}`, {
			...options,
			headers: { 'Content-Type': 'application/json', ...options.headers as Record<string, string> },
		});
		const result = (await response.json()) as { error?: string; data: any };
		if (!response.ok) throw new Error(result.error || 'Achievement API Error');
		return result.data;
	}

	async getAll() {
		return this.request('/achievements');
	}

	async checkAndUnlock() {
		return this.request('/achievements/check', { method: 'POST' });
	}

	async getStats() {
		return this.request('/achievements/stats');
	}
}

export const achievementService = new AchievementService();
