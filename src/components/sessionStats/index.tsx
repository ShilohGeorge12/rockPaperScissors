import { motion } from 'framer-motion';

import { useMycontext } from '../../context';

interface SessionStatsProps {
	isMobile?: boolean;
}

export const SessionStats = ({ isMobile = false }: SessionStatsProps) => {
	const { state } = useMycontext();
	const { sessionStats, powerUp } = state;

	const totalGames = sessionStats.wins + sessionStats.losses + sessionStats.ties;
	const winRate = totalGames > 0 ? ((sessionStats.wins / totalGames) * 100).toFixed(1) : '0';

	if (isMobile) {
		return (
			<div className='w-full'>
				<h3 className='mb-4 text-xl font-display font-bold text-center' style={{ color: 'var(--text-primary)' }}>Session Stats</h3>

				<div className='space-y-3'>
					<div className='flex justify-between items-center p-3 glass rounded-lg' style={{ border: '1px solid var(--border-glass)' }}>
						<span style={{ color: 'var(--text-secondary)' }}>Total Games:</span>
						<span className='font-bold text-xl' style={{ color: 'var(--text-primary)' }}>{totalGames}</span>
					</div>

					<div className='flex justify-between items-center p-3 glass rounded-lg' style={{ border: '1px solid var(--border-glass)' }}>
						<span style={{ color: 'var(--text-secondary)' }}>Win Rate:</span>
						<span className={'font-bold text-xl ' + (parseFloat(winRate) >= 50 ? 'text-green-500' : 'text-red-500')}>{winRate}%</span>
					</div>

					<div className='flex justify-between items-center p-3 glass rounded-lg' style={{ border: '1px solid var(--border-glass)' }}>
						<span style={{ color: 'var(--text-secondary)' }}>W/L/T:</span>
						<span className='font-bold text-xl' style={{ color: 'var(--text-primary)' }}>
							{sessionStats.wins}/{sessionStats.losses}/{sessionStats.ties}
						</span>
					</div>

					<div className='flex justify-between items-center p-3 glass rounded-lg' style={{ border: '1px solid var(--border-glass)' }}>
						<span style={{ color: 'var(--text-secondary)' }}>Current Streak:</span>
						<span className={'font-bold text-xl ' + (sessionStats.currentStreak > 0 ? 'text-green-500' : 'text-yellow-500')}>
							{sessionStats.currentStreak > 0 ? 'Streak: ' + sessionStats.currentStreak : 'Streak: 0'}
						</span>
					</div>

					<div className='flex justify-between items-center p-3 glass rounded-lg' style={{ border: '1px solid var(--border-glass)' }}>
						<span style={{ color: 'var(--text-secondary)' }}>Best Streak:</span>
						<span className='font-bold text-xl text-yellow-500'>Best: {sessionStats.bestStreak}</span>
					</div>

					{/* Last 5 Results */}
					<div className='p-3 glass rounded-lg' style={{ border: '1px solid var(--border-glass)' }}>
						<p className='mb-2 text-sm' style={{ color: 'var(--text-secondary)' }}>Last 5 Results:</p>
						<div className='flex gap-2'>
							{sessionStats.lastFiveResults.map((result, i) => (
								<motion.span
									key={i}
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									transition={{ delay: i * 0.1 }}
									className={result === 'win' ? 'flex-1 h-12 flex items-center justify-center rounded-lg text-lg font-bold bg-green-500' : result === 'loss' ? 'flex-1 h-12 flex items-center justify-center rounded-lg text-lg font-bold bg-red-500' : 'flex-1 h-12 flex items-center justify-center rounded-lg text-lg font-bold bg-yellow-500'}>
									{result === 'win' ? 'W' : result === 'loss' ? 'L' : 'T'}
								</motion.span>
							))}
						</div>
					</div>

					{/* Power-up indicator */}
					{powerUp.active && (
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							className='p-3 rounded-lg text-center'
							style={{ background: 'rgba(234,179,8,0.2)', border: '1px solid rgba(234,179,8,0.4)' }}>
							<span className='text-yellow-300 font-bold'>DOUBLE POINTS ACTIVE!</span>
						</motion.div>
					)}
				</div>
			</div>
		);
	}

	// Desktop version
	return (
		<motion.div
			initial={{ opacity: 0, x: 100 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: 100 }}
			className='fixed right-4 top-1/2 transform -translate-y-1/2 rounded-2xl p-4 shadow-2xl z-40 min-w-[200px] hidden md:block glass-strong'>
			<h3 className='mb-3 text-lg font-display font-bold text-center' style={{ color: 'var(--text-primary)' }}>Session Stats</h3>

			<div className='space-y-2 text-sm' style={{ color: 'var(--text-secondary)' }}>
				<div className='flex justify-between'>
					<span>Games:</span>
					<span className='font-bold' style={{ color: 'var(--text-primary)' }}>{totalGames}</span>
				</div>

				<div className='flex justify-between'>
					<span>Win Rate:</span>
					<span className={'font-bold ' + (parseFloat(winRate) >= 50 ? 'text-green-400' : 'text-red-400')}>{winRate}%</span>
				</div>

				<div className='flex justify-between'>
					<span>W/L/T:</span>
					<span style={{ color: 'var(--text-primary)' }}>
						{sessionStats.wins}/{sessionStats.losses}/{sessionStats.ties}
					</span>
				</div>

				<div className='flex justify-between'>
					<span>Streak:</span>
					<span className={'font-bold ' + (sessionStats.currentStreak > 0 ? 'text-green-400' : 'text-yellow-400')}>
						{sessionStats.currentStreak > 0 ? 'Streak: ' + sessionStats.currentStreak : 'Streak: 0'}
					</span>
				</div>

				<div className='flex justify-between'>
					<span>Best Streak:</span>
					<span className='font-bold text-yellow-400'>Best: {sessionStats.bestStreak}</span>
				</div>

				{/* Last 5 Results */}
				<div className='pt-2 mt-2' style={{ borderTop: '1px solid var(--border-glass)' }}>
					<p className='mb-1 text-xs' style={{ color: 'var(--text-muted)' }}>Last 5:</p>
					<div className='flex gap-1'>
						{sessionStats.lastFiveResults.map((result, i) => (
							<motion.span
								key={i}
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								transition={{ delay: i * 0.1 }}
								className={result === 'win' ? 'w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold bg-green-500' : result === 'loss' ? 'w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold bg-red-500' : 'w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold bg-yellow-500'}>
								{result === 'win' ? 'W' : result === 'loss' ? 'L' : 'T'}
							</motion.span>
						))}
					</div>
				</div>

				{/* Power-up indicator */}
				{powerUp.active && (
					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						className='mt-2 p-2 rounded-lg text-center'
						style={{ background: 'rgba(234,179,8,0.2)' }}>
						<span className='text-yellow-300 text-xs font-bold'>Power-Up Active!</span>
					</motion.div>
				)}
			</div>
		</motion.div>
	);
};
