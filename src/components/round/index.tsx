import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import triangle from '../../assets/images/bg-triangle.svg';
import paper from '../../assets/images/icon-paper.svg';
import rock from '../../assets/images/icon-rock.svg';
import scissors from '../../assets/images/icon-scissors.svg';
import { useMycontext } from '../../context';
import { rockPaperScissors } from '../../types';
import { generateCPUMove, getDifficultyDescription, getEstimatedWinRate } from '../../engine/aiEngine';

const DIFFICULTY_LABELS = {
	easy: { icon: '😊', label: 'Easy', color: '#22c55e' },
	medium: { icon: '🤔', label: 'Medium', color: '#eab308' },
	hard: { icon: '😈', label: 'Hard', color: '#ef4444' },
};

export default function Round() {
	const {
		dispatch,
		state: { difficulty, matchType, playerWins, cpuWins, gameHistory, powerUp },
		playSound,
	} = useMycontext();
	const naviTo = useNavigate();

	const determineWinner = (player: rockPaperScissors, cpu: rockPaperScissors): 'win' | 'loss' | 'tie' => {
		if (player === cpu) return 'tie';
		if ((player === 'Rock' && cpu === 'Scissors') || (player === 'Scissors' && cpu === 'Paper') || (player === 'Paper' && cpu === 'Rock')) {
			return 'win';
		}
		return 'loss';
	};

	const calculatePoints = (result: 'win' | 'loss' | 'tie'): number => {
		const multiplier = powerUp.active && powerUp.type === 'doublePoints' ? 2 : 1;
		const basePoints = difficulty === 'hard' ? 3 : difficulty === 'medium' ? 2 : 1;
		if (result === 'win') return basePoints * multiplier;
		if (result === 'loss') return -basePoints * multiplier;
		return 0;
	};

	const handleMove = (userPicked: rockPaperScissors) => {
		playSound('click');
		const housePicked = generateCPUMove(difficulty, gameHistory);
		const result = determineWinner(userPicked, housePicked);
		const pointsEarned = calculatePoints(result);

		// Play result sound
		if (result === 'win') playSound('win');
		else if (result === 'loss') playSound('lose');
		else playSound('tie');

		dispatch({
			type: 'user_picked',
			payload: { userPicked, housePicked, pointsEarned },
		});

		naviTo('/game/results');
	};

	const diff = DIFFICULTY_LABELS[difficulty];

	// Check if best-of series is complete
	if (matchType !== 'single') {
		const neededWins = matchType === 'bestOf3' ? 2 : 3;
		if (playerWins === neededWins || cpuWins === neededWins) {
			return (
				<motion.div
					initial={{ scale: 0 }}
					animate={{ scale: 1 }}
					className='flex-1 flex flex-col items-center justify-center'>
					<h2 className='mb-4 text-2xl md:text-4xl font-bold text-center' style={{ color: 'var(--text-primary)' }}>{playerWins === neededWins ? '🏆 You Win the Match! 🏆' : '💀 CPU Wins the Match! 💀'}</h2>
					<p className='mb-6 text-lg md:text-xl' style={{ color: 'var(--text-secondary)' }}>
						Match: {playerWins} - {cpuWins}
					</p>
					<button
						onClick={() => {
							dispatch({ type: 'reset_game' });
							naviTo('/game');
						}}
						className='glass rounded-xl px-8 py-3 text-lg font-bold transition-all hover:scale-105' style={{ color: 'var(--text-primary)' }}>
						Play Again
					</button>
				</motion.div>
			);
		}
	}

	return (
		<motion.section
			className='w-full flex-1 flex items-center justify-center relative px-4'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.5 }}>
			{/* Power-up indicator */}
			{powerUp.active && (
				<motion.div
					initial={{ scale: 0 }}
					animate={{ scale: 1 }}
					className="absolute top-2 left-1/2 transform -translate-x-1/2 z-10 px-4 py-2 rounded-full font-bold text-sm"
					style={{ background: 'var(--accent-primary)', color: 'var(--text-primary)' }}>
					⚡ DOUBLE POINTS ACTIVE! ⚡
				</motion.div>
			)}

			<div className='relative w-64 md:w-72'>
				<img
					src={triangle}
					alt="triangle"
					className="w-full"
				/>

				{/* Paper Button */}
				<motion.button
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.95 }}
					onClick={() => handleMove('Paper')}
					className="absolute border-[#4361ee] -top-12 -left-6 border-[20px] rounded-[50%] p-6 bg-white/80 hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#4361ee]/50 cursor-pointer"
					aria-label="Choose Paper">
					<img
						src={paper}
						alt="paper"
						className="w-12 pointer-events-none"
					/>
				</motion.button>

				{/* Rock Button */}
				<motion.button
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.95 }}
					onClick={() => handleMove('Rock')}
					className="absolute border-[#e63946] bottom-0 right-1/4 border-[20px] rounded-[50%] p-6 bg-white/80 hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#e63946]/50 cursor-pointer"
					aria-label="Choose Rock">
					<img
						src={rock}
						alt="rock"
						className="w-12 pointer-events-none"
					/>
				</motion.button>

				{/* Scissors Button */}
				<motion.button
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.95 }}
					onClick={() => handleMove('Scissors')}
					className="absolute border-[#fca311] -top-12 -right-6 border-[20px] rounded-[50%] p-6 bg-white/80 hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#fca311]/50 cursor-pointer"
					aria-label="Choose Scissors">
					<img
						src={scissors}
						alt="scissors"
						className="w-12 pointer-events-none"
					/>
				</motion.button>
			</div>

			{/* Game info overlay */}
			<div className='absolute bottom-4 left-4 right-4 flex items-center justify-between'>
				{/* Match score */}
				{matchType !== 'single' && (
					<div className='text-sm glass rounded-full px-3 py-1' style={{ color: 'var(--text-secondary)' }}>
						Match: {playerWins} - {cpuWins}
					</div>
				)}

				{/* Difficulty badge */}
				<div
					className='glass rounded-full px-3 py-1 flex items-center gap-2 text-sm font-medium'
					style={{ color: diff.color }}
					title={getDifficultyDescription(difficulty)}>
					<span>{diff.icon}</span>
					<span>{diff.label}</span>
					<span className='text-xs opacity-60'>Win {getEstimatedWinRate(difficulty)}</span>
				</div>
			</div>
		</motion.section>
	);
}
