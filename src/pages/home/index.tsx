import { Outlet } from 'react-router-dom';

import { MobileMenu } from '../../components/mobileMenu';
import Rules from '../../components/rules';
import { Score } from '../../components/score';
import { SessionStats } from '../../components/sessionStats';
import { Settings } from '../../components/settings';
import { useMycontext } from '../../context';
import { Modal } from '../../modal';

export const Home = () => {
	const {
		dispatch,
		state: { viewRules, theme },
	} = useMycontext();

	// Theme classes
	const themeClasses = {
		dark: 'bg-gradient-to-br from-gray-900 to-purple-900',
		light: 'bg-gradient-to-br from-blue-200 to-purple-200',
		retro: 'bg-gradient-to-br from-green-900 via-black to-green-900',
	};

	return (
		<main
			className={`relative flex flex-col w-full h-screen gap-24 lg:gap-10 transition-colors duration-500 ${themeClasses[theme]} ${
				viewRules ? 'brightness-50' : 'brightness-100'
			}`}>
			<Score />
			<Outlet />

			<button
				type="button"
				onClick={() => dispatch({ type: 'view_rules_open', payload: { open: true } })}
				className="absolute p-3 text-sm font-bold tracking-widest text-white border-2 border-white/50 rounded-lg bottom-6 right-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white hidden md:block"
				aria-label="Open rules">
				RULES
			</button>

			{/* Desktop panels */}
			<div className="hidden md:block">
				<Settings />
				<SessionStats />
			</div>

			{/* Mobile menu */}
			<MobileMenu />

			{/* Rules modal */}
			{viewRules && <Modal element={<Rules />} />}
		</main>
	);
};
