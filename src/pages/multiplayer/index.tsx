import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { toast } from 'react-toastify';

import rock from '../../assets/images/icon-rock.svg';
import paper from '../../assets/images/icon-paper.svg';
import scissors from '../../assets/images/icon-scissors.svg';

type RoomState = 'lobby' | 'waiting' | 'playing' | 'finished';
type MatchMode = 'bestOf3' | 'bestOf5';

interface Room {
	roomId: string;
	hostId: string;
	guestId: string | null;
	hostName: string;
	guestName: string | null;
	matchMode: MatchMode;
	hostWins: number;
	guestWins: number;
	neededWins: number;
	currentRound: number;
	status: string;
}

interface RoundResult {
	round: number;
	hostMove: string;
	guestMove: string;
	winner: 'player1' | 'player2' | 'tie';
	hostWins: number;
	guestWins: number;
}

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

// ── Lobby ───────────────────────────────────────────────
export const MultiplayerLobby = () => {
	const navigate = useNavigate();

	const socketRef = useRef<Socket | null>(null);

	const [roomState, setRoomState] = useState<RoomState>('lobby');
	const [playerName, setPlayerName] = useState('');
	const [roomId, setRoomId] = useState('');
	const [matchMode, setMatchMode] = useState<MatchMode>('bestOf3');
	const [room, setRoom] = useState<Room | null>(null);
	const [lastResult, setLastResult] = useState<RoundResult | null>(null);
	const [myMove, setMyMove] = useState<string | null>(null);

	const [isHost, setIsHost] = useState(false);
	const [winnerName, setWinnerName] = useState<string | null>(null);

	useEffect(() => {
		const socket = io(SOCKET_URL);
		socketRef.current = socket;

		socket.on('room_created', ({ roomId: id, room: r }) => {
			setRoom(r);
			setRoomState('waiting');
			setIsHost(true);
			setRoomId(id);
			toast.info(`Room ${id} created! Share the code with a friend.`);
		});

		socket.on('room_joined', ({ room: r }) => {
			setRoom(r);
			setRoomState('playing');
			setIsHost(false);
		});

		socket.on('game_start', ({ room: r }) => {
			setRoom(r);
			setRoomState('playing');
			setLastResult(null);
			setMyMove(null);
		});

		socket.on('round_result', (result: RoundResult) => {
			setLastResult(result);
			setMyMove(null);
		});

		socket.on('game_over', ({ winnerName: name }) => {
			setWinnerName(name);
			setRoomState('finished');
		});

		socket.on('opponent_left', ({ leaverName }) => {
			toast.warning(`${leaverName} left the game`);
			setRoomState('lobby');
			setRoom(null);
		});

		socket.on('error', ({ message }) => {
			toast.error(message);
		});

		return () => { socket.disconnect(); };
	}, []);

	const createRoom = () => {
		if (!playerName.trim()) { toast.error('Enter your name'); return; }
		socketRef.current?.emit('create_room', { playerName, matchMode });
	};

	const joinRoom = () => {
		if (!playerName.trim()) { toast.error('Enter your name'); return; }
		if (!roomId.trim()) { toast.error('Enter room code'); return; }
		socketRef.current?.emit('join_room', { roomId: roomId.toUpperCase(), playerName });
	};

	const makeMove = (move: string) => {
		setMyMove(move);
		socketRef.current?.emit('make_move', { move });
	};

	const rematch = () => {
		socketRef.current?.emit('rematch');
		setWinnerName(null);
	};

	const leaveRoom = () => {
		socketRef.current?.emit('leave_room');
		setRoomState('lobby');
		setRoom(null);
	};

	// ── Lobby UI ──
	if (roomState === 'lobby') {
		return (
			<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='w-full max-w-md mx-auto p-6 flex flex-col gap-6'>
				<h1 className="text-3xl font-bold " style={{ color: 'var(--text-primary)' }}>🎮 Multiplayer</h1>
				<p className="" style={{ color: 'var(--text-primary)' }}>Challenge a friend in real-time!</p>

				<div>
					<label className="block text-sm " style={{ color: 'var(--text-primary)' }}>Your Name</label>
					<input
						value={playerName}
						onChange={(e) => setPlayerName(e.target.value)}
						placeholder='Enter your name'
						className="w-full px-4 py-3 rounded-lg glass " style={{ color: 'var(--text-primary)' }}
					/>
				</div>

				<div>
					<label className="block text-sm " style={{ color: 'var(--text-primary)' }}>Match Mode</label>
					<select
						value={matchMode}
						onChange={(e) => setMatchMode(e.target.value as MatchMode)}
						className="w-full px-4 py-3 rounded-lg glass " style={{ color: 'var(--text-primary)' }}>
						<option value='bestOf3'>Best of 3</option>
						<option value='bestOf5'>Best of 5</option>
					</select>
				</div>

				<button onClick={createRoom} className="w-full py-3 text-lg font-bold " style={{ color: 'var(--text-primary)' }}>
					Create Room
				</button>

				<div className='flex items-center gap-3'>
					<div className='h-px flex-1 bg-white/20' />
					<span className="" style={{ color: 'var(--text-primary)' }}>or join existing</span>
					<div className='h-px flex-1 bg-white/20' />
				</div>

				<div className='flex gap-3'>
					<input
						value={roomId}
						onChange={(e) => setRoomId(e.target.value.toUpperCase())}
						placeholder='Room Code'
						maxLength={6}
						className="flex-1 px-4 py-3 rounded-lg glass " style={{ color: 'var(--text-primary)' }}
					/>
					<button onClick={joinRoom} className="px-6 py-3 font-bold " style={{ color: 'var(--text-primary)' }}>
						Join
					</button>
				</div>

				<button onClick={() => navigate('/')} className="" style={{ color: 'var(--text-primary)' }}>← Back to Main Menu</button>
			</motion.div>
		);
	}

	// ── Waiting UI ──
	if (roomState === 'waiting' && room) {
		return (
			<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='w-full max-w-md mx-auto p-6 flex flex-col items-center gap-6'>
				<h1 className="text-3xl font-bold " style={{ color: 'var(--text-primary)' }}>🏠 Room Created</h1>
				<div className='p-6 glass rounded-2xl text-center w-full'>
					<p className="" style={{ color: 'var(--text-primary)' }}>Share this code:</p>
					<p className='text-5xl font-bold text-yellow-400 tracking-[0.3em]'>{room.roomId}</p>
				</div>
				<p className="" style={{ color: 'var(--text-primary)' }}>Waiting for opponent...</p>
				<button onClick={leaveRoom} className='px-4 py-2 text-sm text-red-400 hover:text-red-300 transition'>Cancel & Leave</button>
			</motion.div>
		);
	}

	// ── Playing UI ──
	if ((roomState === 'playing' || roomState === 'finished') && room) {
		const opponentName = isHost ? (room.guestName || 'Opponent') : room.hostName;
		const myWins = isHost ? room.hostWins : room.guestWins;
		const oppWins = isHost ? room.guestWins : room.hostWins;

		return (
			<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='w-full max-w-lg mx-auto p-6 flex flex-col items-center gap-6'>
				{/* Scoreboard */}
				<div className='w-full flex justify-between items-center text-center'>
					<div>
						<p className="text-lg font-bold " style={{ color: 'var(--text-primary)' }}>You</p>
						<p className='text-3xl font-bold text-green-400'>{myWins}</p>
					</div>
					<div>
						<p className="text-sm " style={{ color: 'var(--text-primary)' }}>Round {room.currentRound}</p>
						<p className="text-xs " style={{ color: 'var(--text-primary)' }}>{room.matchMode === 'bestOf5' ? 'Best of 5' : 'Best of 3'}</p>
					</div>
					<div>
						<p className="text-lg font-bold " style={{ color: 'var(--text-primary)' }}>{opponentName}</p>
						<p className='text-3xl font-bold text-red-400'>{oppWins}</p>
					</div>
				</div>

				{/* Last round result */}
				{lastResult && (
					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						className='p-4 glass rounded-xl text-center'>
						<p className="" style={{ color: 'var(--text-primary)' }}>Last Round</p>
						<p className="" style={{ color: 'var(--text-primary)' }}>
							{lastResult.hostMove} vs {lastResult.guestMove}
						</p>
						<p className={`font-bold ${lastResult.winner === 'player1' === isHost ? 'text-green-400' : lastResult.winner === 'tie' ? 'text-yellow-400' : 'text-red-400'}`}>
							{lastResult.winner === 'tie' ? 'Tie!' : (lastResult.winner === 'player1' === isHost ? 'You won!' : 'Opponent won!')}
						</p>
					</motion.div>
				)}

				{/* Game Over */}
				{roomState === 'finished' && winnerName && (
					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						className='p-6 bg-yellow-500/20 rounded-2xl text-center w-full'>
						<p className='text-4xl mb-2'>🏆</p>
						<p className="text-2xl font-bold " style={{ color: 'var(--text-primary)' }}>
							{winnerName === playerName ? 'You Win!' : `${winnerName} Wins!`}
						</p>
						<div className='flex gap-4 mt-4 justify-center'>
							<button onClick={rematch} className="px-6 py-2  " style={{ color: 'var(--text-primary)' }}>Rematch</button>
							<button onClick={leaveRoom} className="px-6 py-2  " style={{ color: 'var(--text-primary)' }}>Leave</button>
						</div>
					</motion.div>
				)}

				{/* Move buttons */}
				{roomState === 'playing' && !myMove && (
					<div className='flex gap-6'>
						<motion.button whileTap={{ scale: 0.85 }} onClick={() => makeMove('Rock')}
							className='border-red-600 border-[16px] rounded-[50%] p-5 bg-white/80 hover:shadow-2xl transition-all focus:outline-none focus:ring-4 focus:ring-red-400 cursor-pointer'>
							<img src={rock} alt='rock' className='w-10 pointer-events-none' />
						</motion.button>
						<motion.button whileTap={{ scale: 0.85 }} onClick={() => makeMove('Paper')}
							className='border-blue-600 border-[16px] rounded-[50%] p-5 bg-white/80 hover:shadow-2xl transition-all focus:outline-none focus:ring-4 focus:ring-blue-400 cursor-pointer'>
							<img src={paper} alt='paper' className='w-10 pointer-events-none' />
						</motion.button>
						<motion.button whileTap={{ scale: 0.85 }} onClick={() => makeMove('Scissors')}
							className='border-yellow-600 border-[16px] rounded-[50%] p-5 bg-white/80 hover:shadow-2xl transition-all focus:outline-none focus:ring-4 focus:ring-yellow-400 cursor-pointer'>
							<img src={scissors} alt='scissors' className='w-10 pointer-events-none' />
						</motion.button>
					</div>
				)}

				{myMove && roomState === 'playing' && (
					<p className="" style={{ color: 'var(--text-primary)' }}>Waiting for opponent...</p>
				)}
			</motion.div>
		);
	}

	return null;
};
