import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import rock from '../../assets/images/icon-rock.svg';
import paper from '../../assets/images/icon-paper.svg';
import scissors from '../../assets/images/icon-scissors.svg';
import { useMycontext } from '../../context';
import { timeAttackService } from '../../service/timeAttack.service';
import { rockPaperScissors } from '../../types';

const GAME_DURATION = 60; // seconds
const BONUS_THRESHOLD = 2000; // ms — bonus for moves faster than this

type GameState = 'idle' | 'playing' | 'finished';

export const TimeAttackPage = () => {
	const navigate = useNavigate();
	const { playSound } = useMycontext();

	const [gameState, setGameState] = useState<GameState>('idle');
	const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
	const [score, setScore] = useState(0);
	const [rounds, setRounds] = useState(0);
	const [bonusPoints, setBonusPoints] = useState(0);
	const [reactionTimes, setReactionTimes] = useState<number[]>([]);
	const [showCpuMove, setShowCpuMove] = useState<string | null>(null);
	const [showResult, setShowResult] = useState<'win' | 'loss' | 'tie' | null>(null);
	const [personalBest, setPersonalBest] = useState<number | null>(null);

	const roundStartTime = useRef<number>(0);
	const timerRef = useRef<ReturnType<typeof setInterval>>();
	const resultTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

	// Fetch personal best on mount
	useEffect(() => {
		timeAttackService.getPersonalBest().then((data) => {
			if (data?.score) setPersonalBest(data.score);
		}).catch(() => {});
	}, []);

	// Timer countdown
	useEffect(() => {
		if (gameState !== 'playing') return;
		timerRef.current = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev <= 1) {
					clearInterval(timerRef.current);
					endGame();
					return 0;
				}
				return prev - 1;
			});
		}, 1000);
		return () => clearInterval(timerRef.current);
	}, [gameState]);

	const endGame = useCallback(() => {
		setGameState('finished');
		clearInterval(timerRef.current);
		clearTimeout(resultTimeoutRef.current);

		// Submit to backend
		const avgReaction = reactionTimes.length > 0
			? reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length
			: 0;

		timeAttackService.submit({
			score,
			totalRounds: rounds,
			avgReactionTime: Math.round(avgReaction),
			reactionTimes,
			bonusPoints,
		}).catch(() => {});

		if (score > (personalBest || 0)) {
			toast.success('🎉 New Personal Best!');
		}
	}, [score, rounds, reactionTimes, bonusPoints, personalBest]);

	const startGame = () => {
		setGameState('playing');
		setTimeLeft(GAME_DURATION);
		setScore(0);
		setRounds(0);
		setBonusPoints(0);
		setReactionTimes([]);
		setShowCpuMove(null);
		setShowResult(null);
		roundStartTime.current = Date.now();
	};

	const getCPUMove = (): rockPaperScissors => {
		const moves: rockPaperScissors[] = ['Rock', 'Paper', 'Scissors'];
		return moves[Math.floor(Math.random() * moves.length)];
	};

	const determineWinner = (player: rockPaperScissors, cpu: rockPaperScissors): 'win' | 'loss' | 'tie' => {
		if (player === cpu) return 'tie';
		if ((player === 'Rock' && cpu === 'Scissors') || (player === 'Scissors' && cpu === 'Paper') || (player === 'Paper' && cpu === 'Rock')) return 'win';
		return 'loss';
	};

	const handleMove = (playerMove: rockPaperScissors) => {
		if (gameState !== 'playing') return;

		const reactionTime = Date.now() - roundStartTime.current;
		const cpuMove = getCPUMove();
		const result = determineWinner(playerMove, cpuMove);

		// Calculate points
		let points = 0;
		if (result === 'win') {
			points = 2;
			// Bonus for fast reaction
			if (reactionTime < BONUS_THRESHOLD) {
				points += 1;
				setBonusPoints((prev) => prev + 1);
			}
			playSound('win');
		} else if (result === 'loss') {
			points = -1;
			playSound('lose');
		} else {
			playSound('tie');
		}

		setScore((prev) => prev + points);
		setRounds((prev) => prev + 1);
		setReactionTimes((prev) => [...prev, reactionTime]);
		setShowCpuMove(cpuMove);
		setShowResult(result);

		// Briefly show the CPU move, then start next round timer
		clearTimeout(resultTimeoutRef.current);
		resultTimeoutRef.current = setTimeout(() => {
			setShowCpuMove(null);
			setShowResult(null);
			roundStartTime.current = Date.now();
		}, 800);
	};

	// Idle state
	if (gameState === 'idle') {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className='w-full max-w-lg mx-auto p-6 flex flex-col items-center gap-6'>
				<h1 className='text-4xl font-bold '>⏱️ Time Attack</h1>
				<p className='/70 text-center'>
					60 seconds on the clock! Make as many moves as you can.
					<br />
					Fast reactions earn bonus points!
				</p>

				{personalBest !== null && (
					<p className='text-yellow-400 font-bold'>👑 Personal Best: {personalBest}</p>
				)}

				<button
					onClick={startGame}
					className='px-8 py-4 text-xl font-bold   rounded-xl hover:bg-green-700 transition transform hover:scale-105'>
					🚀 Start Game
				</button>

				<button
					onClick={() => navigate('/')}
					className='px-4 py-2 text-sm /60 hover: transition'>
					← Back to Main Menu
				</button>
			</motion.div>
		);
	}

	// Finished state
	if (gameState === 'finished') {
		const avgReaction = reactionTimes.length > 0
			? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
			: 0;

		return (
			<motion.div
				initial={{ scale: 0.8, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				className='w-full max-w-lg mx-auto p-6 flex flex-col items-center gap-6 text-center'>
				<h1 className='text-4xl font-bold '>⏱️ Time's Up!</h1>

				<div className='p-6 bg-white/10 rounded-2xl w-full'>
					<p className='text-6xl font-bold text-yellow-400'>{score}</p>
					<p className='/70 mt-2'>Final Score</p>
				</div>

				<div className='grid grid-cols-3 gap-4 w-full text-center'>
					<div className='p-3 bg-white/5 rounded-lg'>
						<p className='text-2xl font-bold '>{rounds}</p>
						<p className='text-xs /50'>Rounds</p>
					</div>
					<div className='p-3 bg-white/5 rounded-lg'>
						<p className='text-2xl font-bold text-green-400'>+{bonusPoints}</p>
						<p className='text-xs /50'>Bonus</p>
					</div>
					<div className='p-3 bg-white/5 rounded-lg'>
						<p className='text-2xl font-bold text-blue-400'>{avgReaction < 1000 ? avgReaction + 'ms' : (avgReaction / 1000).toFixed(1) + 's'}</p>
						<p className='text-xs /50'>Avg Speed</p>
					</div>
				</div>

				<div className='flex gap-4'>
					<button
						onClick={startGame}
						className='px-8 py-3 text-lg font-bold   rounded-lg hover:bg-green-700 transition transform hover:scale-105'>
						Play Again
					</button>
					<button
						onClick={() => navigate('/')}
						className='px-8 py-3 text-lg font-bold   rounded-lg hover:bg-blue-700 transition transform hover:scale-105'>
						Main Menu
					</button>
				</div>
			</motion.div>
		);
	}

	// Playing state
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className='w-full max-w-lg mx-auto p-6 flex flex-col items-center gap-6'>
			{/* Timer & Score bar */}
			<div className='w-full flex justify-between items-center'>
				<div className={`text-4xl font-bold ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : ''}`}>
					⏱️ {timeLeft}s
				</div>
				<div className='text-3xl font-bold text-yellow-400'>{score}</div>
			</div>

			{/* Progress bar */}
			<div className='w-full h-2 bg-white/10 rounded-full overflow-hidden'>
				<motion.div
					className={`h-full rounded-full ${timeLeft <= 10 ? 'bg-red-500' : 'bg-green-500'}`}
					animate={{ width: `${(timeLeft / GAME_DURATION) * 100}%` }}
					transition={{ duration: 0.5 }}
				/>
			</div>

			{/* CPU Move Display */}
			{showCpuMove && (
				<motion.div
					initial={{ scale: 0 }}
					animate={{ scale: 1 }}
					className='flex flex-col items-center gap-2'>
					<p className=' text-sm'>CPU played:</p>
					<div className={`border-[16px] rounded-[50%] p-4 bg-white/80 ${
						showCpuMove === 'Rock' ? 'border-red-600' : showCpuMove === 'Paper' ? 'border-blue-600' : 'border-yellow-600'
					}`}>
						<img src={showCpuMove === 'Rock' ? rock : showCpuMove === 'Paper' ? paper : scissors} className='w-10 pointer-events-none' alt={showCpuMove} />
					</div>
					<p className={`text-lg font-bold ${showResult === 'win' ? 'text-green-400' : showResult === 'loss' ? 'text-red-400' : 'text-yellow-400'}`}>
						{showResult === 'win' ? '✅ Win +2' : showResult === 'loss' ? '❌ Loss -1' : '🤝 Tie 0'}
					</p>
				</motion.div>
			)}

			{/* Move buttons */}
			<div className='flex gap-8 items-center'>
				<motion.button
					whileTap={{ scale: 0.85 }}
					onClick={() => handleMove('Rock')}
					className={`border-red-600 border-[20px] rounded-[50%] p-6 bg-white/80 hover:shadow-2xl transition-all focus:outline-none focus:ring-4 focus:ring-red-400 cursor-pointer`}
					aria-label='Rock'>
					<img src={rock} alt='rock' className='w-12 pointer-events-none' />
				</motion.button>

				<motion.button
					whileTap={{ scale: 0.85 }}
					onClick={() => handleMove('Paper')}
					className={`border-blue-600 border-[20px] rounded-[50%] p-6 bg-white/80 hover:shadow-2xl transition-all focus:outline-none focus:ring-4 focus:ring-blue-400 cursor-pointer`}
					aria-label='Paper'>
					<img src={paper} alt='paper' className='w-12 pointer-events-none' />
				</motion.button>

				<motion.button
					whileTap={{ scale: 0.85 }}
					onClick={() => handleMove('Scissors')}
					className={`border-yellow-600 border-[20px] rounded-[50%] p-6 bg-white/80 hover:shadow-2xl transition-all focus:outline-none focus:ring-4 focus:ring-yellow-400 cursor-pointer`}
					aria-label='Scissors'>
					<img src={scissors} alt='scissors' className='w-12 pointer-events-none' />
				</motion.button>
			</div>

			<p className='/40 text-sm'>React fast! Under 2s = +1 bonus point</p>
		</motion.div>
	);
};
