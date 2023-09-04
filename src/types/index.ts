// import { Dispatch, SetStateAction } from 'react';

type Rock = 'Rock';
type Paper = 'Paper';
type Scissors = 'Scissors';
type rockPaperScissors = Rock | Paper | Scissors;
type userPicked = rockPaperScissors | 'play';
type housePicked = rockPaperScissors | 'play';
export type choices = [Rock, Paper, Scissors];
// context State Types
export type contextActions =
	| { type: 'user_picked'; payload: { userPicked: rockPaperScissors; housePicked: rockPaperScissors; score: number } }
	| { type: 'view_rules_open'; payload: { open: true } }
	| { type: 'view_rules_close'; payload: { close: false } };

export interface State {
	score: number;
	userPicked: userPicked;
	housePicked: housePicked;
	viewRules: boolean;
}

export interface context {
	state: State;
}

export type ReducerType = (state: State, action: contextActions) => State;
