// src/types/index.ts - Add GameHistoryEntry and update State
export type Rock = 'Rock';
export type Paper = 'Paper';
export type Scissors = 'Scissors';
export type rockPaperScissors = Rock | Paper | Scissors;
export type userPicked = rockPaperScissors | 'play';
export type housePicked = rockPaperScissors | 'play';
export type choices = [Rock, Paper, Scissors];
export type Difficulty = 'easy' | 'medium' | 'hard';
export type MatchType = 'single' | 'bestOf3' | 'bestOf5';
export type Theme = 'dark' | 'light' | 'retro';

// Game result types
export type GameResult = 'win' | 'loss' | 'tie';

// Power-up types
export type PowerUpType = 'doublePoints' | 'shield' | 'peek' | null;

export interface PowerUp {
	type: PowerUpType;
	active: boolean;
	roundsLeft: number;
}

// ADD THIS - Game History Entry
export interface GameHistoryEntry {
	round: number;
	playerMove: rockPaperScissors;
	cpuMove: rockPaperScissors;
	result: GameResult;
	pointsChange: number;
	timestamp: Date;
}

// Context Action Types
export type contextActions =
	| { type: 'user_picked'; payload: { userPicked: rockPaperScissors; housePicked: rockPaperScissors; pointsEarned: number } }
	| { type: 'view_rules_open'; payload: { open: true } }
	| { type: 'view_rules_close'; payload: { close: false } }
	| { type: 'set_match_type'; payload: MatchType }
	| { type: 'set_difficulty'; payload: Difficulty }
	| { type: 'set_theme'; payload: Theme }
	| { type: 'toggle_sound' }
	| { type: 'reset_game' }
	| { type: 'award_power_up'; payload: PowerUpType }
	| { type: 'use_power_up' };

// Move Statistics (for current session only)
export interface MoveStats {
	wins: number;
	losses: number;
	ties: number;
	usage: number;
}

export interface SessionStats {
	wins: number;
	losses: number;
	ties: number;
	currentStreak: number;
	bestStreak: number;
	lastFiveResults: GameResult[];
	moveStats: {
		Rock: MoveStats;
		Paper: MoveStats;
		Scissors: MoveStats;
	};
}

export interface State {
	score: number;
	userPicked: userPicked;
	housePicked: housePicked;
	viewRules: boolean;
	matchType: MatchType;
	difficulty: Difficulty;
	theme: Theme;
	soundEnabled: boolean;
	playerWins: number;
	cpuWins: number;
	roundsPlayed: number;
	powerUp: PowerUp;
	sessionStats: SessionStats;
	gameHistory: GameHistoryEntry[];
	lastPointsChange: number;
	lastResult: GameResult | null;
}

export interface context {
	state: State;
}

export type ReducerType = (state: State, action: contextActions) => State;
