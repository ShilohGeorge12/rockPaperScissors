import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import triangle from '../../assets/images/bg-triangle.svg';
import paper from '../../assets/images/icon-paper.svg';
import rock from '../../assets/images/icon-rock.svg';
import scissors from '../../assets/images/icon-scissors.svg';
import { useMycontext } from '../../context';
import { rockPaperScissors } from '../../types';

export default function Round() {
	const {
		dispatch,
		state: { difficulty, matchType, playerWins, cpuWins, gameHistory, powerUp },
		playSound,
	} = useMycontext();
	const naviTo = useNavigate();

	const getCPUMove = (): rockPaperScissors => {
		const moves: rockPaperScissors[] = ['Rock', 'Paper', 'Scissors'];
		// Safely access gameHistory (it's now defined)
		const playerHistory = gameHistory?.map((h) => h.playerMove) || [];

		switch (difficulty) {
			case 'easy': {
				// CPU cycles through moves in order: Rock → Paper → Scissors → Rock...
				const lastCPUMove = gameHistory?.[gameHistory.length - 1]?.cpuMove;

				if (lastCPUMove === 'Rock') return 'Paper';
				if (lastCPUMove === 'Paper') return 'Scissors';
				if (lastCPUMove === 'Scissors') return 'Rock';

				// First move, start with Rock
				return 'Rock';
			}

			case 'medium': {
				if (playerHistory.length > 0 && Math.random() < 0.6) {
					const lastMove = playerHistory[playerHistory.length - 1];
					if (lastMove === 'Rock') return 'Paper';
					if (lastMove === 'Paper') return 'Scissors';
					if (lastMove === 'Scissors') return 'Rock';
				}
				return moves[Math.floor(Math.random() * moves.length)];
			}

			case 'hard': {
				if (playerHistory.length >= 3) {
					const lastThree = playerHistory.slice(-3);
					if (lastThree.every((m) => m === 'Rock')) return 'Paper';
					if (lastThree.every((m) => m === 'Paper')) return 'Scissors';
					if (lastThree.every((m) => m === 'Scissors')) return 'Rock';
				}
				return moves[Math.floor(Math.random() * moves.length)];
			}

			default:
				return moves[Math.floor(Math.random() * moves.length)];
		}
	};

	const determineWinner = (player: rockPaperScissors, cpu: rockPaperScissors): 'win' | 'loss' | 'tie' => {
		if (player === cpu) return 'tie';
		if ((player === 'Rock' && cpu === 'Scissors') || (player === 'Scissors' && cpu === 'Paper') || (player === 'Paper' && cpu === 'Rock')) {
			return 'win';
		}
		return 'loss';
	};

	const calculatePoints = (result: 'win' | 'loss' | 'tie'): number => {
		const multiplier = powerUp.active && powerUp.type === 'doublePoints' ? 2 : 1;
		if (result === 'win') return 2 * multiplier;
		if (result === 'loss') return -2 * multiplier;
		return 0;
	};

	const handleMove = (userPicked: rockPaperScissors) => {
		playSound('click');
		const housePicked = getCPUMove();
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

		naviTo('/results');
	};

	// Check if best-of series is complete
	if (matchType !== 'single') {
		const neededWins = matchType === 'bestOf3' ? 2 : 3;
		if (playerWins === neededWins || cpuWins === neededWins) {
			return (
				<motion.div
					initial={{ scale: 0 }}
					animate={{ scale: 1 }}
					className="flex flex-col items-center justify-center min-h-[60vh]">
					<h2 className="mb-4 text-4xl font-bold text-white text-center">{playerWins === neededWins ? '🏆 You Win the Match! 🏆' : '💀 CPU Wins the Match! 💀'}</h2>
					<p className="mb-6 text-xl text-white">
						Final Score: {playerWins} - {cpuWins}
					</p>
					<button
						onClick={() => {
							dispatch({ type: 'reset_game' });
							naviTo('/');
						}}
						className="px-8 py-3 text-lg font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition transform hover:scale-105">
						Play Again
					</button>
				</motion.div>
			);
		}
	}

	return (
		<motion.section
			className="w-full py-8 flex gap-2 items-center justify-center relative"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.5 }}>
			{/* Power-up indicator */}
			{powerUp.active && (
				<motion.div
					initial={{ scale: 0 }}
					animate={{ scale: 1 }}
					className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-12 bg-yellow-500 text-black px-4 py-2 rounded-full font-bold z-10">
					⚡ DOUBLE POINTS ACTIVE! ⚡
				</motion.div>
			)}

			<div className="relative w-72">
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
					className="absolute border-blue-600 -top-12 -left-6 border-[20px] rounded-[50%] p-6 bg-white/80 hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-400 cursor-pointer"
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
					className="absolute border-red-600 bottom-0 right-1/4 border-[20px] rounded-[50%] p-6 bg-white/80 hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-400 cursor-pointer"
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
					className="absolute border-yellow-600 -top-12 -right-6 border-[20px] rounded-[50%] p-6 bg-white/80 hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-yellow-400 cursor-pointer"
					aria-label="Choose Scissors">
					<img
						src={scissors}
						alt="scissors"
						className="w-12 pointer-events-none"
					/>
				</motion.button>
			</div>

			{/* Game info overlay */}
			<div className="absolute bottom-4 left-4 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
				{matchType !== 'single' && `Match: ${playerWins} - ${cpuWins}`}
			</div>

			{/* <div className="absolute bottom-4 right-4 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
				Difficulty: {difficulty === 'easy' ? '😊 Easy' : difficulty === 'medium' ? '🤔 Medium' : '😈 Hard'}
			</div> */}
		</motion.section>
	);
}
