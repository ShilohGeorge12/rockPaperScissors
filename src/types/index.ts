// import { Dispatch, SetStateAction } from 'react';

type Rock = 'Rock';
type Paper = 'Paper';
type Scissors = 'Scissors';
type rockPaperScissors = Rock | Paper | Scissors;

// context State Types
export type contextActions =
	| { type: 'user_rock'; payload: { userPicked: Rock } }
	| { type: 'user_Paper'; payload: { userPicked: Paper } }
	| { type: 'user_Scissors'; payload: { userPicked: Scissors } }
	| { type: 'house_rock'; payload: { housePicked: Rock } }
	| { type: 'house_Paper'; payload: { housePicked: Paper } }
	| { type: 'house_Scissors'; payload: { housePicked: Scissors } };

export interface State {
	score: number;
	userPicked: rockPaperScissors;
	housePicked: rockPaperScissors;
}

export interface context {
	state: State;
}

export type ReducerType = (state: State, action: contextActions) => State;
