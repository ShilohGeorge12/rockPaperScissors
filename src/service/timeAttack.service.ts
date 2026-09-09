const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class TimeAttackService {
	private async request(endpoint: string, options: RequestInit = {}) {
		const response = await fetch(`${API_URL}${endpoint}`, {
			...options,
			headers: { 'Content-Type': 'application/json', ...options.headers as Record<string, string> },
		});
		const result = (await response.json()) as { error?: string; data: any };
		if (!response.ok) throw new Error(result.error || 'TimeAttack API Error');
		return result.data;
	}

	async submit(data: {
		score: number;
		totalRounds: number;
		avgReactionTime: number;
		reactionTimes: number[];
		bonusPoints: number;
	}) {
		return this.request('/time-attack/submit', { method: 'POST', body: JSON.stringify(data) });
	}

	async getLeaderboard(limit = 10) {
		return this.request(`/time-attack/leaderboard?limit=${limit}`);
	}

	async getPersonalBest() {
		return this.request('/time-attack/personal-best');
	}
}

export const timeAttackService = new TimeAttackService();
