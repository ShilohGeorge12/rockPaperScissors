import { Suspense, lazy, useState } from 'react';
import { Routes, Route, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { LoadingComponent } from './components/loading';
import { useMycontext } from './context';
import { Modal } from './modal';
import { Difficulty } from './types';

// Lazy-loaded pages
const LandingPage = lazy(() => import('./pages/landing').then(m => ({ default: m.LandingPage })));
const Round = lazy(() => import('./components/round'));
const Result = lazy(() => import('./components/result'));
const Rules = lazy(() => import('./components/rules'));
const AuthPage = lazy(() => import('./pages/auth').then(m => ({ default: m.AuthPage })));
const AchievementsPage = lazy(() => import('./pages/achievements').then(m => ({ default: m.AchievementsPage })));
const TimeAttackPage = lazy(() => import('./pages/timeAttack').then(m => ({ default: m.TimeAttackPage })));
const TournamentLobby = lazy(() => import('./pages/tournament').then(m => ({ default: m.TournamentLobby })));
const TournamentView = lazy(() => import('./pages/tournament').then(m => ({ default: m.TournamentView })));
const MultiplayerLobby = lazy(() => import('./pages/multiplayer').then(m => ({ default: m.MultiplayerLobby })));

// Bottom Navigation for mobile
const BottomNav = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const tabs = [
		{ path: '/', icon: '🏠', label: 'Home' },
		{ path: '/game', icon: '🎮', label: 'Play' },
		{ path: '/time-attack', icon: '⏱️', label: 'Time' },
		{ path: '/multiplayer', icon: '👥', label: 'Multi' },
		{ path: '/achievements', icon: '🏅', label: 'Awards' },
	];

	return (
		<nav
			className='fixed bottom-0 left-0 right-0 z-50 glass-strong md:hidden'
			style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
			<div className='flex items-center justify-around px-2 py-2'>
				{tabs.map((tab) => {
					const isActive = location.pathname === tab.path ||
						(tab.path === '/game' && location.pathname.startsWith('/game'));
					return (
						<button
							key={tab.path}
							onClick={() => navigate(tab.path)}
							className='flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all duration-200 min-w-[56px]'
							style={{
								background: isActive ? 'var(--bg-glass)' : 'transparent',
								border: isActive ? '1px solid var(--border-glass)' : '1px solid transparent',
							}}>
							<span className='text-xl'>{tab.icon}</span>
							<span
								className='text-2xs font-bold'
								style={{ color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
								{tab.label}
							</span>
						</button>
				);
			})}
		</div>
	</nav>
	);
};

// Quick difficulty picker — dropdown in the top bar
const DifficultyPicker = ({ currentDifficulty, onChange }: { currentDifficulty: Difficulty; onChange: (d: Difficulty) => void }) => {
	const [open, setOpen] = useState(false);
	const current = DIFFICULTY_OPTIONS.find((d) => d.value === currentDifficulty)!;

	return (
		<div className='relative'>
			<button
				onClick={() => setOpen(!open)}
				className='flex items-center gap-1.5 px-3 py-1.5 glass rounded-full text-sm font-bold transition-all hover:scale-105'
				style={{ color: current.color }}>
				<span>{current.icon}</span>
				<span className='hidden sm:inline'>{current.label}</span>
			</button>

			<AnimatePresence>
				{open && (
					<>
						<div className='fixed inset-0 z-40' onClick={() => setOpen(false)} />
						<motion.div
							initial={{ opacity: 0, y: -8, scale: 0.95 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: -8, scale: 0.95 }}
							transition={{ duration: 0.15 }}
							className='absolute right-0 top-full mt-2 glass-strong rounded-xl overflow-hidden z-50 min-w-[140px]'>
							{DIFFICULTY_OPTIONS.map((opt) => (
								<button
									key={opt.value}
									onClick={() => { onChange(opt.value); setOpen(false); }}
									className='w-full flex items-center gap-2 px-4 py-2.5 text-sm font-bold transition-all text-left'
									style={{
										color: currentDifficulty === opt.value ? opt.color : 'var(--text-secondary)',
										background: currentDifficulty === opt.value ? 'var(--bg-glass)' : 'transparent',
									}}>
									<span>{opt.icon}</span>
									<span>{opt.label}</span>
									{currentDifficulty === opt.value && <span className='ml-auto'>✓</span>}
								</button>
							))}
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</div>
	);
};

const DIFFICULTY_OPTIONS: { value: Difficulty; label: string; icon: string; color: string }[] = [
	{ value: 'easy', label: 'Easy', icon: '😊', color: '#22c55e' },
	{ value: 'medium', label: 'Medium', icon: '🤔', color: '#eab308' },
	{ value: 'hard', label: 'Hard', icon: '😈', color: '#ef4444' },
];

// Game layout wrapper
const GameLayout = () => {
	const {
		dispatch,
		state: { viewRules, difficulty },
	} = useMycontext();
	const navigate = useNavigate();

	return (
		<motion.main
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className='relative flex flex-col w-full min-h-screen bg-theme-dark overflow-hidden'>
			{/* Decorative orbs */}
			<div className='orb orb-1' />
			<div className='orb orb-2' />

			{/* Back button */}
			<button
				onClick={() => navigate('/')}
				className='absolute top-4 left-4 z-40 flex items-center gap-1 px-3 py-1.5 glass rounded-full text-sm font-bold'
				style={{ color: 'var(--text-secondary)' }}>
				← Back
			</button>

			{/* Difficulty Picker + Rules */}
			<div className='absolute top-4 right-4 z-40 flex items-center gap-2'>
				{/* Difficulty Dropdown */}
				<DifficultyPicker
					currentDifficulty={difficulty}
					onChange={(d) => dispatch({ type: 'set_difficulty', payload: d })}
				/>
				{/* Rules button */}
				<button
					onClick={() => dispatch({ type: 'view_rules_open', payload: { open: true } })}
					className='px-3 py-1.5 glass rounded-full text-sm font-bold'
					style={{ color: 'var(--text-secondary)' }}>
					Rules
				</button>
			</div>

			<div className='flex-1 flex flex-col justify-center pb-24 md:pb-8'>
				<Suspense fallback={<LoadingComponent />}>
					<Outlet />
				</Suspense>
			</div>

			{/* Bottom Navigation */}
			<BottomNav />

			{/* Rules Modal */}
			{viewRules && (
				<Modal element={
					<Suspense fallback={<LoadingComponent />}>
						<Rules />
					</Suspense>
				} />
			)}
			</motion.main>
	);
};

export function AllRoutes() {
	const location = useLocation();
	return (
		<Routes location={location} key={location.pathname}>
			<Route path='/' element={
				<Suspense fallback={<LoadingComponent />}>
					<LandingPage />
				</Suspense>
			} />

			<Route path='/game' element={<GameLayout />}>
				<Route index element={<Suspense fallback={<LoadingComponent />}><Round /></Suspense>} />
				<Route path='results' element={<Suspense fallback={<LoadingComponent />}><Result /></Suspense>} />
			</Route>

			<Route path='/auth' element={<Suspense fallback={<LoadingComponent />}><AuthPage /></Suspense>} />
			<Route path='/time-attack' element={<Suspense fallback={<LoadingComponent />}><TimeAttackPage /></Suspense>} />
			<Route path='/multiplayer' element={<Suspense fallback={<LoadingComponent />}><MultiplayerLobby /></Suspense>} />
			<Route path='/tournament' element={<Suspense fallback={<LoadingComponent />}><TournamentLobby /></Suspense>} />
			<Route path='/tournament/:tournamentId' element={<Suspense fallback={<LoadingComponent />}><TournamentView /></Suspense>} />
			<Route path='/achievements' element={<Suspense fallback={<LoadingComponent />}><AchievementsPage /></Suspense>} />
		</Routes>
	);
}
