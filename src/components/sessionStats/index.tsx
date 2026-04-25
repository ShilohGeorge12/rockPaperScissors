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

	// In SessionStats component, when isMobile={true}
	if (isMobile) {
		return (
			<div className="w-full [&_*]:!text-inherit">
				<h3 className="mb-4 text-xl font-bold text-center">📊 Session Stats</h3>

				<div className="space-y-3">
					<div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
						<span>Total Games:</span>
						<span className="font-bold text-xl">{totalGames}</span>
					</div>

					<div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
						<span>Win Rate:</span>
						<span className={`font-bold text-xl ${parseFloat(winRate) >= 50 ? 'text-green-500' : 'text-red-500'}`}>{winRate}%</span>
					</div>

					<div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
						<span>W/L/T:</span>
						<span className="font-bold text-xl">
							{sessionStats.wins}/{sessionStats.losses}/{sessionStats.ties}
						</span>
					</div>

					<div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
						<span>Current Streak:</span>
						<span className={`font-bold text-xl ${sessionStats.currentStreak > 0 ? 'text-green-500' : 'text-yellow-500'}`}>
							{sessionStats.currentStreak > 0 ? `🔥 ${sessionStats.currentStreak}` : '⚡ 0'}
						</span>
					</div>

					<div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
						<span>Best Streak:</span>
						<span className="font-bold text-xl text-yellow-500">🏆 {sessionStats.bestStreak}</span>
					</div>

					{/* Last 5 Results */}
					<div className="p-3 bg-white/10 rounded-lg">
						<p className="mb-2 text-sm">Last 5 Results:</p>
						<div className="flex gap-2">
							{sessionStats.lastFiveResults.map((result, i) => (
								<motion.span
									key={i}
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									transition={{ delay: i * 0.1 }}
									className={`flex-1 h-12 flex items-center justify-center rounded-lg text-lg font-bold ${
										result === 'win' ? 'bg-green-500 text-white' : result === 'loss' ? 'bg-red-500 text-white' : 'bg-yellow-500 text-gray-900'
									}`}>
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
							className="p-3 bg-yellow-500/30 rounded-lg text-center">
							<span className="text-yellow-300 font-bold">⚡ DOUBLE POINTS ACTIVE! ⚡</span>
						</motion.div>
					)}
				</div>
			</div>
		);
	}

	// Desktop version (fixed positioning, compact)
	return (
		<motion.div
			initial={{ opacity: 0, x: 100 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: 100 }}
			className="fixed right-4 top-1/2 transform -translate-y-1/2 bg-black/50 backdrop-blur-md rounded-2xl p-4 shadow-2xl z-40 min-w-[200px] hidden md:block">
			<h3 className="mb-3 text-lg font-bold text-white text-center">📊 Session Stats</h3>

			<div className="space-y-2 text-sm text-white">
				<div className="flex justify-between">
					<span>Games:</span>
					<span className="font-bold">{totalGames}</span>
				</div>

				<div className="flex justify-between">
					<span>Win Rate:</span>
					<span className={`font-bold ${parseFloat(winRate) >= 50 ? 'text-green-400' : 'text-red-400'}`}>{winRate}%</span>
				</div>

				<div className="flex justify-between">
					<span>W/L/T:</span>
					<span>
						{sessionStats.wins}/{sessionStats.losses}/{sessionStats.ties}
					</span>
				</div>

				<div className="flex justify-between">
					<span>Streak:</span>
					<span className={`font-bold ${sessionStats.currentStreak > 0 ? 'text-green-400' : 'text-yellow-400'}`}>
						{sessionStats.currentStreak > 0 ? `🔥 ${sessionStats.currentStreak}` : '⚡ 0'}
					</span>
				</div>

				<div className="flex justify-between">
					<span>Best Streak:</span>
					<span className="font-bold text-yellow-400">🏆 {sessionStats.bestStreak}</span>
				</div>

				{/* Last 5 Results */}
				<div className="pt-2 mt-2 border-t border-white/20">
					<p className="mb-1 text-xs">Last 5:</p>
					<div className="flex gap-1">
						{sessionStats.lastFiveResults.map((result, i) => (
							<motion.span
								key={i}
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								transition={{ delay: i * 0.1 }}
								className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
									result === 'win' ? 'bg-green-500' : result === 'loss' ? 'bg-red-500' : 'bg-yellow-500'
								}`}>
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
						className="mt-2 p-2 bg-yellow-500/30 rounded-lg text-center">
						<span className="text-yellow-300 text-xs">⚡ Power-Up Active!</span>
					</motion.div>
				)}
			</div>
		</motion.div>
	);
};
