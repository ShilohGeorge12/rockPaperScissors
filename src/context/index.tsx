import { createContext, ReactNode, useContext, useEffect, useReducer, useRef } from 'react';

import {
    contextActions, GameHistoryEntry, GameResult, ReducerType, rockPaperScissors, SessionStats,
    State
} from '../types';

// Helper function to determine winner
const determineWinner = (player: rockPaperScissors, cpu: rockPaperScissors): GameResult => {
	if (player === cpu) return 'tie';
	if ((player === 'Rock' && cpu === 'Scissors') || (player === 'Scissors' && cpu === 'Paper') || (player === 'Paper' && cpu === 'Rock')) {
		return 'win';
	}
	return 'loss';
};

// Update session stats
const updateSessionStats = (currentStats: SessionStats, result: GameResult, move: rockPaperScissors): SessionStats => {
	const newStats = { ...currentStats };

	// Update basic stats
	if (result === 'win') {
		newStats.wins++;
		newStats.currentStreak++;
		newStats.bestStreak = Math.max(newStats.bestStreak, newStats.currentStreak);
	} else if (result === 'loss') {
		newStats.losses++;
		newStats.currentStreak = 0;
	} else {
		newStats.ties++;
	}

	// Update last five results
	newStats.lastFiveResults = [...newStats.lastFiveResults.slice(-4), result];

	// Update move stats
	const moveKey = move;
	newStats.moveStats[moveKey].usage++;
	if (result === 'win') newStats.moveStats[moveKey].wins++;
	if (result === 'loss') newStats.moveStats[moveKey].losses++;
	if (result === 'tie') newStats.moveStats[moveKey].ties++;

	return newStats;
};

// Initial state
const initState: State = {
	housePicked: 'play',
	userPicked: 'play',
	score: 0,
	viewRules: false,
	matchType: 'single',
	difficulty: 'medium',
	theme: 'dark',
	soundEnabled: true,
	playerWins: 0,
	cpuWins: 0,
	roundsPlayed: 0,
	powerUp: { type: null, active: false, roundsLeft: 0 },
	sessionStats: {
		wins: 0,
		losses: 0,
		ties: 0,
		currentStreak: 0,
		bestStreak: 0,
		lastFiveResults: [],
		moveStats: {
			Rock: { wins: 0, losses: 0, ties: 0, usage: 0 },
			Paper: { wins: 0, losses: 0, ties: 0, usage: 0 },
			Scissors: { wins: 0, losses: 0, ties: 0, usage: 0 },
		},
	},
	gameHistory: [],
};

// Reducer
const reducer: ReducerType = (state, action) => {
	switch (action.type) {
		case 'user_picked': {
			const { userPicked, housePicked, pointsEarned } = action.payload;

			// ENSURE pointsEarned is a number
			const safePoints = typeof pointsEarned === 'number' && !isNaN(pointsEarned) ? pointsEarned : 0;

			const result = determineWinner(userPicked, housePicked);
			const newScore = state.score + safePoints;

			// Update match wins for best-of series
			let newPlayerWins = state.playerWins;
			let newCpuWins = state.cpuWins;

			if (result === 'win') newPlayerWins++;
			if (result === 'loss') newCpuWins++;

			// Update session stats
			const updatedStats = updateSessionStats(state.sessionStats, result, userPicked);

			// Check for power-up award (every 3 wins)
			let newPowerUp = { ...state.powerUp };
			if (updatedStats.wins > 0 && updatedStats.wins % 3 === 0 && !state.powerUp.active) {
				newPowerUp = { type: 'doublePoints', active: true, roundsLeft: 1 };
			}

			// Decrement power-up rounds if active
			if (state.powerUp.active && state.powerUp.roundsLeft > 0) {
				newPowerUp = {
					...state.powerUp,
					roundsLeft: state.powerUp.roundsLeft - 1,
					active: state.powerUp.roundsLeft - 1 > 0,
				};
			}

			// Create history entry
			const newHistoryEntry: GameHistoryEntry = {
				round: state.roundsPlayed + 1,
				playerMove: userPicked,
				cpuMove: housePicked,
				result: result,
				pointsChange: safePoints,
				timestamp: new Date(),
			};

			return {
				...state,
				userPicked,
				housePicked,
				score: newScore,
				playerWins: newPlayerWins,
				cpuWins: newCpuWins,
				roundsPlayed: state.roundsPlayed + 1,
				sessionStats: updatedStats,
				powerUp: newPowerUp,
				gameHistory: [...state.gameHistory, newHistoryEntry], // ADD THIS
			};
		}

		case 'set_match_type':
			return { ...state, matchType: action.payload, playerWins: 0, cpuWins: 0, roundsPlayed: 0, gameHistory: [] };

		case 'set_difficulty':
			return { ...state, difficulty: action.payload };

		case 'set_theme':
			return { ...state, theme: action.payload };

		case 'toggle_sound':
			return { ...state, soundEnabled: !state.soundEnabled };

		case 'reset_game':
			return {
				...initState,
				theme: state.theme,
				soundEnabled: state.soundEnabled,
				difficulty: state.difficulty,
				matchType: state.matchType,
			};

		case 'award_power_up':
			return {
				...state,
				powerUp: { type: action.payload, active: true, roundsLeft: 1 },
			};

		case 'use_power_up':
			return {
				...state,
				powerUp: { type: null, active: false, roundsLeft: 0 },
			};

		case 'view_rules_open':
			return { ...state, viewRules: action.payload.open };

		case 'view_rules_close':
			return { ...state, viewRules: action.payload.close };

		default:
			return state;
	}
};

// Context
const MyContextState = createContext({
	state: initState,
	dispatch: (_val: contextActions) => {},
	playSound: (_type: 'win' | 'lose' | 'tie' | 'click') => {},
});

export const ContextProvider = ({ children }: { children: ReactNode }) => {
	const [state, dispatch] = useReducer(reducer, initState);
	const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

	// Initialize sounds
	useEffect(() => {
		if (typeof window !== 'undefined') {
			audioRefs.current = {
				win: new Audio('/sounds/win.mp3'),
				lose: new Audio('/sounds/lose.mp3'),
				tie: new Audio('/sounds/tie.mp3'),
				click: new Audio('/sounds/click.mp3'),
			};

			Object.values(audioRefs.current).forEach((audio) => {
				audio.volume = 0.5;
			});
		}
	}, []);

	const playSound = (type: 'win' | 'lose' | 'tie' | 'click') => {
		if (state.soundEnabled && audioRefs.current[type]) {
			audioRefs.current[type].currentTime = 0;
			audioRefs.current[type].play().catch((e) => console.log('Audio play failed:', e));
		}
	};

	return <MyContextState.Provider value={{ state, dispatch, playSound }}>{children}</MyContextState.Provider>;
};

export const useMycontext = () => useContext(MyContextState);
