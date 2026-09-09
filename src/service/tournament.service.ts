const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class TournamentService {
	private async request(endpoint: string, options: RequestInit = {}) {
		const response = await fetch(`${API_URL}${endpoint}`, {
			...options,
			headers: { 'Content-Type': 'application/json', ...options.headers as Record<string, string> },
		});
		const result = (await response.json()) as { error?: string; data: any };
		if (!response.ok) throw new Error(result.error || 'Tournament API Error');
		return result.data;
	}

	async create(name: string, size: 4 | 8 | 16) {
		return this.request('/tournament/create', {
			method: 'POST',
			body: JSON.stringify({ name, size }),
		});
	}

	async join(tournamentId: string) {
		return this.request(`/tournament/${tournamentId}/join`, { method: 'POST' });
	}

	async getTournament(tournamentId: string) {
		return this.request(`/tournament/${tournamentId}`);
	}

	async listTournaments() {
		return this.request('/tournament/list');
	}

	async submitMatch(tournamentId: string, matchId: string, data: {
		winner: string;
		player1Move?: string;
		player2Move?: string;
	}) {
		return this.request(`/tournament/${tournamentId}/match/${matchId}/result`, {
			method: 'POST',
			body: JSON.stringify(data),
		});
	}
}

export const tournamentService = new TournamentService();
