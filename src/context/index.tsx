import { ReactNode, createContext, useContext, useReducer } from 'react';
import { ReducerType, State, contextActions } from '../types';

const initState: State = {
	housePicked: 'Rock',
	userPicked: 'Rock',
	score: 0,
};

const MyContextState = createContext({
	state: initState,
	dispatch(_val: contextActions) {},
});

const reducer: ReducerType = (state, action) => {
	switch (action.type) {
		case 'house_Paper':
			return { ...state, housePicked: action.payload.housePicked };
		case 'house_Scissors':
			return { ...state, housePicked: action.payload.housePicked };
		case 'house_rock':
			return { ...state, housePicked: action.payload.housePicked };
		case 'user_Paper':
			return { ...state, userPicked: action.payload.userPicked };
		case 'user_Scissors':
			return { ...state, userPicked: action.payload.userPicked };
		default:
			return state;
	}
};

export const ContextProvider = ({ children }: { children: ReactNode }) => {
	const [state, dispatch] = useReducer(reducer, initState);
	return <MyContextState.Provider value={{ state, dispatch }}>{children}</MyContextState.Provider>;
};

export const context = () => useContext(MyContextState);
