import { useEffect, useRef } from 'react';
import { useMycontext } from '../context';
import { statsService } from '../service/stats.service';

/**
 * Syncs each round's result with the backend stats API.
 * Runs on mount to load persisted stats, and after every round
 * to push the latest result to the server.
 */
export const useStatsSync = () => {
	const { state } = useMycontext();
	const prevRoundsPlayed = useRef(state.roundsPlayed);
	const isInitialMount = useRef(true);

	// On first mount, fetch persisted stats (informational / health check)
	useEffect(() => {
		statsService.getStats().catch(() => {
			// Silently fail — backend may not be running
		});
	}, []);

	// After each new round, push the result to the backend
	useEffect(() => {
		if (isInitialMount.current) {
			isInitialMount.current = false;
			prevRoundsPlayed.current = state.roundsPlayed;
			return;
		}

		if (state.roundsPlayed > prevRoundsPlayed.current && state.lastResult) {
			const lastEntry = state.gameHistory[state.gameHistory.length - 1];
			if (lastEntry) {
				statsService
					.updateStats(lastEntry.result, lastEntry.playerMove, lastEntry.pointsChange)
					.catch(() => {
						// Silently fail — stats will remain local
					});
			}
		}

		prevRoundsPlayed.current = state.roundsPlayed;
	}, [state.roundsPlayed, state.lastResult, state.gameHistory]);
};
