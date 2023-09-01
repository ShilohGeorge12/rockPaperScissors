import { ReactNode, createContext, useContext, useReducer } from 'react';
import { ReducerType, State, contextActions } from '../types';

const initState: State = {
	housePicked: 'play',
	userPicked: 'play',
	score: 0,
};

const MyContextState = createContext({
	state: initState,
	dispatch(_val: contextActions) {},
});

const reducer: ReducerType = (state, action) => {
	switch (action.type) {
		case 'user_picked':
			return { ...state, userPicked: action.payload.userPicked, housePicked: action.payload.housePicked, score: action.payload.score };
		default:
			return state;
	}
};

export const ContextProvider = ({ children }: { children: ReactNode }) => {
	const [state, dispatch] = useReducer(reducer, initState);
	return <MyContextState.Provider value={{ state, dispatch }}>{children}</MyContextState.Provider>;
};

export const useMycontext = () => useContext(MyContextState);
