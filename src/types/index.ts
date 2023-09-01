// import { Dispatch, SetStateAction } from 'react';

type Rock = 'Rock';
type Paper = 'Paper';
type Scissors = 'Scissors';
type rockPaperScissors = Rock | Paper | Scissors;
type userPicked = rockPaperScissors | 'play';
type housePicked = rockPaperScissors | 'play';
export type choices = [Rock, Paper, Scissors];
// context State Types
export type contextActions = { type: 'user_picked'; payload: { userPicked: rockPaperScissors; housePicked: rockPaperScissors; score: number } };

export interface State {
	score: number;
	userPicked: userPicked;
	housePicked: housePicked;
}

export interface context {
	state: State;
}

export type ReducerType = (state: State, action: contextActions) => State;
