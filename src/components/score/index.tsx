import { motion } from 'framer-motion';

import { useMycontext } from '../../context';

export const Score = () => {
	const {
		state: { score, sessionStats, powerUp },
	} = useMycontext();

	const displayScore = typeof score === 'number' && !isNaN(score) ? score : 0;

	return (
		<motion.section
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, ease: 'easeOut' }}
			className='w-[92%] md:w-[480px] mx-auto mt-4 md:mt-6'>
			<div className='glass rounded-2xl p-4 md:p-5 flex items-center justify-between'>
				{/* Logo */}
				<div className='flex flex-col leading-none'>
					<motion.p
						className='text-2xl md:text-3xl font-display font-bold tracking-tight'
						style={{ color: 'var(--text-primary)' }}>
						ROCK
					</motion.p>
					<motion.p
						className='text-2xl md:text-3xl font-display font-bold tracking-tight'
						style={{ color: 'var(--text-primary)' }}>
						PAPER
					</motion.p>
					<motion.p
						className='text-2xl md:text-3xl font-display font-bold tracking-tight'
						style={{ color: 'var(--text-primary)' }}>
						SCISSORS
					</motion.p>
				</div>

				{/* Score Display */}
				<div className='relative flex flex-col items-center justify-center'>
					<div
						className='absolute inset-0 rounded-xl opacity-30 blur-xl'
						style={{ background: 'var(--accent-primary)' }}
					/>
					<div
						className='relative px-6 py-2 md:px-8 md:py-3 rounded-xl'
						style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)' }}>
						<p
							className='text-xs md:text-sm font-bold tracking-[0.2em] uppercase'
							style={{ color: 'var(--accent-primary)' }}>
							SCORE
						</p>
						<motion.p
							key={displayScore}
							initial={{ scale: 1.3, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							transition={{ type: 'spring', stiffness: 300, damping: 15 }}
							className='text-4xl md:text-5xl font-display font-bold'
							style={{ color: 'var(--text-primary)' }}>
							{displayScore}
						</motion.p>
					</div>
				</div>

				{/* Quick Stats */}
				<div className='flex flex-col items-end gap-1'>
					{sessionStats.currentStreak > 0 && (
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							className='flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold'
							style={{
								background: 'rgba(46, 213, 115, 0.15)',
								color: '#2ed573',
								border: '1px solid rgba(46, 213, 115, 0.3)',
							}}>
							🔥 {sessionStats.currentStreak}
						</motion.div>
					)}
					<div className='flex items-center gap-2 text-xs' style={{ color: 'var(--text-muted)' }}>
						<span className='text-green-400'>{sessionStats.wins}W</span>
						<span className='text-red-400'>{sessionStats.losses}L</span>
						<span className='text-yellow-400'>{sessionStats.ties}T</span>
					</div>
					{powerUp.active && (
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							className='flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold'
							style={{
								background: 'rgba(255, 215, 0, 0.15)',
								color: '#ffd700',
								border: '1px solid rgba(255, 215, 0, 0.3)',
							}}>
							⚡ x2
						</motion.div>
					)}
				</div>
			</div>
		</motion.section>
	);
};
