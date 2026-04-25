const API_URL = import.meta.env.VITE_API_URL;

class StatsService {
	private sessionId: string | null = null;

	constructor() {
		// Only use session ID for identification, not for game state
		this.sessionId = this.getSessionId();
	}

	private getSessionId(): string | null {
		// Try to get existing session ID from memory only
		return this.sessionId || localStorage.getItem('rps_session_id');
	}

	private setSessionId(id: string) {
		this.sessionId = id;
		// Store ONLY the session identifier, not game state
		localStorage.setItem('rps_session_id', id);
	}

	private async request(endpoint: string, options: RequestInit = {}) {
		const response = await fetch(`${API_URL}${endpoint}`, {
			...options,
			headers: {
				'Content-Type': 'application/json',
				...(this.sessionId && { 'X-Session-Id': this.sessionId }),
				...options.headers,
			},
		});

		// Capture new session ID from response headers
		const newSessionId = response.headers.get('X-Session-Id');
		if (newSessionId && !this.sessionId) {
			this.setSessionId(newSessionId);
		}

		if (!response.ok) {
			const error = (await response.json()) as any;
			throw new Error(error.error || 'API Error');
		}

		const result = (await response.json()) as any;
		return result.data;
	}

	async getStats() {
		return this.request('/stats');
	}

	async updateStats(result: 'win' | 'loss' | 'tie', playerMove: string, pointsEarned: number) {
		return this.request('/stats/update', {
			method: 'POST',
			body: JSON.stringify({ result, playerMove, pointsEarned }),
		});
	}

	async resetStats() {
		return this.request('/stats/reset', { method: 'POST' });
	}

	async getLeaderboard(limit: number = 10) {
		return this.request(`/stats/leaderboard?limit=${limit}`);
	}
}

export const statsService = new StatsService();
