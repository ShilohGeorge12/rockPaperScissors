import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { useMycontext } from '../../context';
import { Difficulty } from '../../types';

const features = [
	{ icon: '🎮', title: 'Classic Game', desc: 'Rock Paper Scissors vs CPU', path: '/game', gradient: 'from-purple-600/20 to-indigo-600/20', border: 'rgba(139, 92, 246, 0.3)' },
	{ icon: '⏱️', title: 'Time Attack', desc: '60s speed challenge', path: '/time-attack', gradient: 'from-green-600/20 to-emerald-600/20', border: 'rgba(34, 197, 94, 0.3)' },
	{ icon: '👥', title: 'Multiplayer', desc: 'Real-time 1v1 with friends', path: '/multiplayer', gradient: 'from-blue-600/20 to-cyan-600/20', border: 'rgba(59, 130, 246, 0.3)' },
	{ icon: '🏆', title: 'Tournament', desc: 'Bracket elimination', path: '/tournament', gradient: 'from-yellow-600/20 to-orange-600/20', border: 'rgba(234, 179, 8, 0.3)' },
	{ icon: '🏅', title: 'Achievements', desc: 'Unlock badges and prove your skill', path: '/achievements', gradient: 'from-red-600/20 to-pink-600/20', border: 'rgba(239, 68, 68, 0.3)' },
];

export const LandingPage = () => {
	const navigate = useNavigate();
	const { user, isAuthenticated, logout } = useAuth();
	const { state, dispatch } = useMycontext();

	return (
		<motion.main
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className='relative flex flex-col items-center min-h-screen bg-theme-dark px-4 py-8 overflow-hidden'>
			{/* Decorative orbs */}
			<div className='orb orb-1' />
			<div className='orb orb-2' />

			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: -30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
				className='text-center mb-8 mt-8'>
				<motion.h1
					className='text-5xl md:text-7xl font-display font-bold mb-3'
					style={{ color: 'var(--text-primary)' }}>
					RPS
				</motion.h1>					<motion.p
						className='text-lg md:text-xl font-display tracking-wide mb-5'
						style={{ color: 'var(--text-secondary)' }}>
						Rock • Paper • Scissors
					</motion.p>

					{/* Difficulty Selector */}
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
						className='flex items-center gap-2'>
						{(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => {
							const opts = { easy: { icon: '😊', color: '#22c55e' }, medium: { icon: '🤔', color: '#eab308' }, hard: { icon: '😈', color: '#ef4444' } };
							const isActive = state.difficulty === d;
							return (
								<button
									key={d}
									onClick={() => dispatch({ type: 'set_difficulty', payload: d })}
									className='px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200'
									style={{
										background: isActive ? opts[d].color : 'var(--bg-glass)',
										color: isActive ? '#000' : 'var(--text-muted)',
										border: `1px solid ${isActive ? opts[d].color : 'var(--border-glass)'}`,
									}}>
									{opts[d].icon} {d}
								</button>
							);
						})}
					</motion.div>
			</motion.div>

			{/* Auth status */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.2 }}
				className='mb-8'>
				{isAuthenticated ? (
					<div className='glass rounded-2xl px-5 py-3 flex items-center gap-3'>
						<div
							className='w-10 h-10 rounded-full flex items-center justify-center font-bold text-white'
							style={{ background: 'var(--accent-primary)' }}>
							{user?.username?.[0]?.toUpperCase() || '?'}
						</div>
						<div>
							<p className='font-bold text-sm' style={{ color: 'var(--text-primary)' }}>{user?.username}</p>
							<p className='text-xs' style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
						</div>
						<button
							onClick={logout}
							className='ml-4 px-3 py-1 text-xs font-bold rounded-lg transition-colors'
							style={{ color: '#ff4757', background: 'rgba(255, 71, 87, 0.1)' }}>
							Logout
						</button>
					</div>
				) : (
					<button
						onClick={() => navigate('/auth')}
						className='glass rounded-2xl px-6 py-3 font-bold text-sm transition-all hover:scale-105'
						style={{ color: 'var(--text-primary)' }}>
						Login / Register
					</button>
				)}
			</motion.div>

			{/* Feature grid */}
			<div className='w-full max-w-md grid grid-cols-1 gap-3 mb-8'>
				{features.map((f, i) => (
					<motion.button
						key={f.path}
						initial={{ opacity: 0, x: -30 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.1 + i * 0.08 }}
						onClick={() => navigate(f.path)}
						className='glass rounded-2xl p-4 text-left transition-all duration-300 hover:scale-[1.02] btn-3d'
						style={{ borderColor: f.border }}>
						<div className='flex items-center gap-4'>
							<div className='w-12 h-12 rounded-xl flex items-center justify-center text-2xl' style={{ background: 'var(--bg-glass)' }}>
								{f.icon}
							</div>
							<div>
								<p className='font-bold text-base' style={{ color: 'var(--text-primary)' }}>{f.title}</p>
								<p className='text-sm' style={{ color: 'var(--text-secondary)' }}>{f.desc}</p>
							</div>
						</div>
					</motion.button>
				))}
			</div>

			{/* Session Stats */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.6 }}
				className='w-full max-w-md glass rounded-2xl p-4'>
				<div className='flex justify-between items-center'>
					<p className='text-sm' style={{ color: 'var(--text-muted)' }}>Session</p>
					<p className='font-bold text-sm' style={{ color: 'var(--text-primary)' }}>
						{state.sessionStats.wins}W / {state.sessionStats.losses}L / {state.sessionStats.ties}T
					</p>
				</div>
				{state.sessionStats.currentStreak > 0 && (
					<p className='text-sm mt-1 font-bold' style={{ color: '#2ed573' }}>
						🔥 {state.sessionStats.currentStreak} win streak
					</p>
				)}
			</motion.div>
		</motion.main>
	);
};
