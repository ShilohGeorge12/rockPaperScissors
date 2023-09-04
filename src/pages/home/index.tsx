import { Outlet } from 'react-router-dom';
import { Score } from '../../components/score';
import { useMycontext } from '../../context';
import { Modal } from '../../modal';
import Rules from '../../components/rules';

export const Home = () => {
	const {
		dispatch,
		state: { viewRules },
	} = useMycontext();
	return (
		<main className={`relative flex flex-col w-full h-screen gap-24 lg:gap-10 ${viewRules ? 'brightness-50' : 'brightness-100'}`}>
			<Score />
			<Outlet />
			<button
				type='button'
				onClick={() => dispatch({ type: 'view_rules_open', payload: { open: true } })}
				className='absolute p-2 text-sm font-bold tracking-widest text-white border-2 border-gray-400 rounded-lg bottom-6 right-10'>
				RULES
			</button>
			{viewRules && <Modal element={<Rules />} />}
		</main>
	);
};
