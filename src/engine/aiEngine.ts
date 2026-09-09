import type { rockPaperScissors, GameHistoryEntry, Difficulty } from '../types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface MoveFrequency {
	Rock: number;
	Paper: number;
	Scissors: number;
}

// The three game moves for easy iteration
const MOVES: rockPaperScissors[] = ['Rock', 'Paper', 'Scissors'];

// What beats each move
const BEATS: Record<rockPaperScissors, rockPaperScissors> = {
	Rock: 'Paper',
	Paper: 'Scissors',
	Scissors: 'Rock',
};

// What each move beats
const BEATEN_BY: Record<rockPaperScissors, rockPaperScissors> = {
	Rock: 'Scissors',
	Paper: 'Rock',
	Scissors: 'Paper',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Count how often each move appears in a list */
function countMoves(moves: rockPaperScissors[]): MoveFrequency {
	const freq: MoveFrequency = { Rock: 0, Paper: 0, Scissors: 0 };
	for (const m of moves) freq[m]++;
	return freq;
}

/** Build a first-order Markov transition matrix: lastMove → {next → count} */
function buildTransitions(history: GameHistoryEntry[]): Record<string, Record<string, number>> {
	const trans: Record<string, Record<string, number>> = {};
	for (let i = 1; i < history.length; i++) {
		const prev = history[i - 1].playerMove;
		const next = history[i].playerMove;
		if (!trans[prev]) trans[prev] = {};
		trans[prev][next] = (trans[prev][next] || 0) + 1;
	}
	return trans;
}

/** Build a second-order Markov transition: (prev2, prev1) → {next → count} */
function buildTransitions2(history: GameHistoryEntry[]): Record<string, Record<string, number>> {
	const trans: Record<string, Record<string, number>> = {};
	for (let i = 2; i < history.length; i++) {
		const key = `${history[i - 2].playerMove},${history[i - 1].playerMove}`;
		const next = history[i].playerMove;
		if (!trans[key]) trans[key] = {};
		trans[key][next] = (trans[key][next] || 0) + 1;
	}
	return trans;
}

/** Given a frequency map, return the predicted next pick (most likely) */
function predictFromFreq(freq: MoveFrequency): rockPaperScissors {
	let best: rockPaperScissors = 'Rock';
	let bestCount = -1;
	for (const m of MOVES) {
		if (freq[m] > bestCount) {
			bestCount = freq[m];
			best = m;
		}
	}
	return best;
}

/** Anti-move: picks the move that LOSES to the given move (player wins) */
function antiMove(target: rockPaperScissors): rockPaperScissors {
	return BEATEN_BY[target];
}

// ---------------------------------------------------------------------------
// Easy AI — "Forgiving Bot"
//
// Philosophy: The player should feel like a winner. The AI intentionally
// picks moves that give the player an advantage.
//
// Strategy:
//   - 40% pick the move that LOSES to the player's last move (player wins)
//   - 20% pick the same move as the player (tie)
//   - 40% pick randomly
//
// Expected player win rate: ~55-65%
// ---------------------------------------------------------------------------

function easyAI(history: GameHistoryEntry[]): rockPaperScissors {
	const lastPlayerMove = history.length > 0 ? history[history.length - 1].playerMove : null;

	// First round: just be random
	if (!lastPlayerMove) {
		return MOVES[Math.floor(Math.random() * 3)];
	}

	const roll = Math.random();

	if (roll < 0.40) {
		// LOSE to player — give them a win
		return antiMove(lastPlayerMove);
	}

	if (roll < 0.60) {
		// TIE with player
		return lastPlayerMove;
	}

	// Random (slightly biased toward losing moves)
	const freq = countMoves(history.slice(-5).map((h) => h.playerMove));
	// Pick the move that is LEAST used by the player (less likely to lose)
	return predictFromFreq({ Rock: 3 - freq.Rock, Paper: 3 - freq.Paper, Scissors: 3 - freq.Scissors });
}

// ---------------------------------------------------------------------------
// Medium AI — "Competent Strategist"
//
// Philosophy: A fair opponent that makes smart choices but isn't unbeatable.
// Uses pattern recognition and counter-strategies but leaves openings.
//
// Strategy:
//   1. Markov chain prediction from move history
//   2. 55% counter the predicted move (beat what player likely picks)
//   3. 15% anti-pattern (deliberately lose to seem less predictable)
//   4. 30% random
//
// Expected player win rate: ~40-50%
// ---------------------------------------------------------------------------

function mediumAI(history: GameHistoryEntry[]): rockPaperScissors {
	const playerMoves = history.map((h) => h.playerMove);

	if (playerMoves.length === 0) {
		return MOVES[Math.floor(Math.random() * 3)];
	}

	const lastMove = playerMoves[playerMoves.length - 1];
	const freq = countMoves(playerMoves);
	const transitions = buildTransitions(history);

	// Predict what player will pick next
	let predicted: rockPaperScissors;

	// Try Markov prediction
	if (transitions[lastMove]) {
		const nextFreq = transitions[lastMove];
		const bestNext = predictFromFreq({ Rock: nextFreq.Rock || 0, Paper: nextFreq.Paper || 0, Scissors: nextFreq.Scissors || 0 });
		predicted = bestNext;
	} else {
		// Fall back to overall frequency
		predicted = predictFromFreq(freq);
	}

	const roll = Math.random();

	if (roll < 0.55) {
		// Counter the predicted move
		return BEATS[predicted];
	}

	if (roll < 0.70 && playerMoves.length >= 3) {
		// Anti-pattern: sometimes let the player win
		return antiMove(predicted);
	}

	// Random
	return MOVES[Math.floor(Math.random() * 3)];
}

// ---------------------------------------------------------------------------
// Hard AI — "Predatory Algorithm"
//
// Philosophy: Nearly unbeatable. Uses layered pattern analysis with
// multi-time-window frequency analysis, second-order Markov chains,
// anti-streak detection, and adaptive weighting.
//
// Strategy:
//   1. Multi-window frequency analysis (last 3, 5, 10, all)
//   2. First-order + second-order Markov chains
//   3. Anti-streak / alternation detection
//   4. Positional bias (after win/loss, players tend toward specific patterns)
//   5. Dynamic weighting that increases prediction confidence over time
//   6. 75% counter predicted move, 15% strategic misdirect, 10% random
//
// Expected player win rate: ~20-30%
// ---------------------------------------------------------------------------

function hardAI(history: GameHistoryEntry[]): rockPaperScissors {
	const playerMoves = history.map((h) => h.playerMove);
	const n = playerMoves.length;

	if (n === 0) {
		// Open with Paper (beats Rock — the most intuitive first pick)
		return 'Paper';
	}

	if (n === 1) {
		// Counter the first move
		return BEATS[playerMoves[0]];
	}

	// --- Layer 1: Multi-window frequency analysis ---
	const recent3 = countMoves(playerMoves.slice(-3));
	const recent5 = countMoves(playerMoves.slice(-5));
	const recent10 = countMoves(playerMoves.slice(-10));
	const allTime = countMoves(playerMoves);

	// Weighted blend: recent moves matter more
	const blended: MoveFrequency = {
		Rock: recent3.Rock * 4 + recent5.Rock * 2 + recent10.Rock * 1 + allTime.Rock * 0.5,
		Paper: recent3.Paper * 4 + recent5.Paper * 2 + recent10.Paper * 1 + allTime.Paper * 0.5,
		Scissors: recent3.Scissors * 4 + recent5.Scissors * 2 + recent10.Scissors * 1 + allTime.Scissors * 0.5,
	};

	const freqPredicted = predictFromFreq(blended);

	// --- Layer 2: First-order Markov ---
	const trans1 = buildTransitions(history);
	let markovPredicted: rockPaperScissors = freqPredicted;
	if (trans1[playerMoves[n - 1]]) {
		markovPredicted = predictFromFreq({
			Rock: trans1[playerMoves[n - 1]].Rock || 0,
			Paper: trans1[playerMoves[n - 1]].Paper || 0,
			Scissors: trans1[playerMoves[n - 1]].Scissors || 0,
		});
	}

	// --- Layer 3: Second-order Markov ---
	const trans2 = buildTransitions2(history);
	let markov2Predicted: rockPaperScissors = markovPredicted;
	if (n >= 2) {
		const key = `${playerMoves[n - 2]},${playerMoves[n - 1]}`;
		if (trans2[key]) {
			markov2Predicted = predictFromFreq({
				Rock: trans2[key].Rock || 0,
				Paper: trans2[key].Paper || 0,
				Scissors: trans2[key].Scissors || 0,
			});
		}
	}

	// --- Layer 4: Anti-streak / alternation detection ---
	let altPredicted: rockPaperScissors | null = null;
	if (n >= 4) {
		const last4 = playerMoves.slice(-4);
		// Check if player is alternating (e.g., Rock, Scissors, Rock, Scissors)
		const isAlternating = last4[0] === last4[2] && last4[1] === last4[3] && last4[0] !== last4[1];
		if (isAlternating) {
			// Predict the next in the alternating sequence
			altPredicted = last4[2] === last4[0] ? last4[3] : last4[2];
		}
	}

	// --- Layer 5: Post-result behavioral bias ---
	// Players tend to repeat moves after a win, switch after a loss
	let resultBiased: rockPaperScissors | null = null;
	if (n >= 2) {
		const lastResult = history[n - 1].result;
		const lastPlayerMove = playerMoves[n - 1];

		if (lastResult === 'win') {
			// Player won → likely to repeat their winning move
			resultBiased = lastPlayerMove;
		} else if (lastResult === 'loss') {
			// Player lost → likely to switch to something else
			// Pick the most common move they switch to after losses
			const lossFollows: MoveFrequency = { Rock: 0, Paper: 0, Scissors: 0 };
			for (let i = 1; i < n; i++) {
				if (history[i - 1].result === 'loss') {
					lossFollows[playerMoves[i]]++;
				}
			}
			const total = lossFollows.Rock + lossFollows.Paper + lossFollows.Scissors;
			if (total > 0) {
				resultBiased = predictFromFreq(lossFollows);
			}
		}
	}

	// --- Layer 6: Convergence scoring ---
	// Score each move for how likely it is the player's next pick
	const scores: Record<rockPaperScissors, number> = { Rock: 0, Paper: 0, Scissors: 0 };

	// Frequency analysis (weight: 2)
	scores[freqPredicted] += 2;

	// First-order Markov (weight: 3)
	scores[markovPredicted] += 3;

	// Second-order Markov (weight: 4 — most specific)
	scores[markov2Predicted] += 4;

	// Anti-streak (weight: 3)
	if (altPredicted) scores[altPredicted] += 3;

	// Result bias (weight: 2)
	if (resultBiased) scores[resultBiased] += 2;

	// Find the most predicted move
	let bestMove: rockPaperScissors = 'Rock';
	let bestScore = -1;
	for (const m of MOVES) {
		if (scores[m] > bestScore) {
			bestScore = scores[m];
			bestMove = m;
		}
	}

	const roll = Math.random();

	// High confidence → counter the predicted move
	if (roll < 0.75) {
		return BEATS[bestMove];
	}

	// Strategic misdirect — sometimes go for the second-best prediction
	if (roll < 0.90 && n >= 5) {
		// Counter the second-most predicted move
		const secondBest = MOVES.filter((m) => m !== bestMove).sort(
			(a, b) => scores[b] - scores[a]
		)[0];
		return BEATS[secondBest];
	}

	// Pure random (very rare — keeps AI from being fully deterministic)
	return MOVES[Math.floor(Math.random() * 3)];
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Generate the CPU's move based on difficulty and game history.
 * This is the main entry point — call this instead of Math.random().
 */
export function generateCPUMove(difficulty: Difficulty, history: GameHistoryEntry[]): rockPaperScissors {
	switch (difficulty) {
		case 'easy':
			return easyAI(history);
		case 'hard':
			return hardAI(history);
		case 'medium':
		default:
			return mediumAI(history);
	}
}

/**
 * Get a human-readable description of the AI strategy for the current difficulty.
 * Useful for showing players what to expect.
 */
export function getDifficultyDescription(difficulty: Difficulty): string {
	switch (difficulty) {
		case 'easy':
			return 'The CPU makes generous choices — expect to win more often than not.';
		case 'medium':
			return 'The CPU learns from your patterns and adapts. Stay unpredictable!';
		case 'hard':
			return 'The CPU uses multi-layered pattern analysis. Only the most unpredictable players survive.';
	}
}

/**
 * Get a win-rate estimate for display purposes.
 */
export function getEstimatedWinRate(difficulty: Difficulty): string {
	switch (difficulty) {
		case 'easy':
			return '~60%';
		case 'medium':
			return '~45%';
		case 'hard':
			return '~25%';
	}
}
