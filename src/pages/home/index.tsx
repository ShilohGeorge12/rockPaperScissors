import { Outlet } from 'react-router-dom';
import { Score } from '../../components/score';

export const Home = () => {
	return (
		<main className='relative flex flex-col w-full h-screen gap-24 lg:gap-10'>
			<Score />
			<Outlet />
			<button
				type='button'
				className='absolute p-2 text-sm font-bold tracking-widest text-white border-2 border-gray-400 rounded-lg bottom-6 right-10'>
				RULES
			</button>
		</main>
	);
};
