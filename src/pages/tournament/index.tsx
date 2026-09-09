import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { tournamentService } from '../../service/tournament.service';

interface Tournament {
	tournamentId: string;
	name: string;
	hostId: string;
	participants: string[];
	size: number;
	currentRound: number;
	totalRounds: number;
	brackets: any[];
	status: 'waiting' | 'in_progress' | 'completed';
	winner?: string;
}

// ── Tournament Lobby ────────────────────────────────────
export const TournamentLobby = () => {
	const navigate = useNavigate();
	const [tournaments, setTournaments] = useState<Tournament[]>([]);
	const [loading, setLoading] = useState(true);
	const [creating, setCreating] = useState(false);
	const [newName, setNewName] = useState('');
	const [newSize, setNewSize] = useState<4 | 8 | 16>(4);

	useEffect(() => {
		tournamentService.listTournaments()
			.then(setTournaments)
			.catch(() => {})
			.finally(() => setLoading(false));
	}, []);

	const handleCreate = async () => {
		if (!newName.trim()) { toast.error('Enter a tournament name'); return; }
		setCreating(true);
		try {
			const t = await tournamentService.create(newName, newSize);
			toast.success('Tournament created!');
			navigate(`/tournament/${t.tournamentId}`);
		} catch {
			toast.error('Failed to create tournament');
		} finally {
			setCreating(false);
		}
	};

	const handleJoin = async (tournamentId: string) => {
		try {
			await tournamentService.join(tournamentId);
			toast.success('Joined!');
			navigate(`/tournament/${tournamentId}`);
		} catch (err: any) {
			toast.error(err.message || 'Failed to join');
		}
	};

	return (
		<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='w-full max-w-2xl mx-auto p-6'>
			<div className='flex items-center justify-between mb-6'>
				<h1 className="text-3xl font-bold " style={{color:'var(--text-primary)'}}>🏆 Tournaments</h1>
				<button onClick={() => navigate('/')} className="px-4 py-2 text-sm " style={{color:'var(--text-primary)'}}>← Back</button>
			</div>

			{/* Create new */}
			<div className='p-4 glass rounded-xl mb-6'>
				<h3 className="text-lg font-bold " style={{color:'var(--text-primary)'}}>Create Tournament</h3>
				<div className='flex gap-3 items-end'>
					<div className='flex-1'>
						<label className="block text-sm " style={{color:'var(--text-primary)'}}>Name</label>
						<input
							value={newName}
							onChange={(e) => setNewName(e.target.value)}
							placeholder='My Tournament'
							className="w-full px-3 py-2 rounded-lg glass " style={{color:'var(--text-primary)'}}
						/>
					</div>
					<div>
						<label className="block text-sm " style={{color:'var(--text-primary)'}}>Size</label>
						<select
							value={newSize}
							onChange={(e) => setNewSize(Number(e.target.value) as 4 | 8 | 16)}
							className="px-3 py-2 rounded-lg glass " style={{color:'var(--text-primary)'}}>
							<option value={4}>4 Players</option>
							<option value={8}>8 Players</option>
							<option value={16}>16 Players</option>
						</select>
					</div>
					<button
						onClick={handleCreate}
						disabled={creating}
						className="px-4 py-2  " style={{color:'var(--text-primary)'}}>
						Create
					</button>
				</div>
			</div>

			{/* Existing tournaments */}
			<h3 className="text-lg font-bold " style={{color:'var(--text-primary)'}}>Open Tournaments</h3>
			{loading ? (
				<p className="" style={{color:'var(--text-primary)'}}>Loading...</p>
			) : tournaments.filter((t) => t.status === 'waiting').length === 0 ? (
				<p className="" style={{color:'var(--text-primary)'}}>No open tournaments. Create one!</p>
			) : (
				<div className='space-y-3'>
					{tournaments.filter((t) => t.status === 'waiting').map((t) => (
						<div key={t.tournamentId} className='p-4 glass rounded-xl flex justify-between items-center'>
							<div>
								<p className="font-bold " style={{color:'var(--text-primary)'}}>{t.name}</p>
								<p className="text-sm " style={{color:'var(--text-primary)'}}>{t.participants.length}/{t.size} players</p>
							</div>
							<button
								onClick={() => handleJoin(t.tournamentId)}
								className="px-4 py-2  " style={{color:'var(--text-primary)'}}>
								Join
							</button>
						</div>
					))}
				</div>
			)}

			{/* Recent completed */}
			{tournaments.filter((t) => t.status === 'completed').length > 0 && (
				<>
					<h3 className="text-lg font-bold " style={{color:'var(--text-primary)'}}>Recent Results</h3>
					<div className='space-y-3'>
						{tournaments.filter((t) => t.status === 'completed').slice(0, 5).map((t) => (
							<div key={t.tournamentId} className='p-4 glass rounded-xl opacity-60'>
								<p className="font-bold " style={{color:'var(--text-primary)'}}>{t.name}</p>
								<p className='text-sm text-yellow-400'>👑 Winner: {t.winner?.slice(0, 8)}...</p>
							</div>
						))}
					</div>
				</>
			)}
		</motion.div>
	);
};

// ── Tournament Bracket View ─────────────────────────────
export const TournamentView = () => {
	const navigate = useNavigate();
	const [tournament, setTournament] = useState<Tournament | null>(null);
	const [loading, setLoading] = useState(true);

	const tournamentId = window.location.pathname.split('/').pop() || '';

	useEffect(() => {
		if (!tournamentId) return;
		const fetchTournament = () => {
			tournamentService.getTournament(tournamentId)
				.then(setTournament)
				.catch(() => toast.error('Tournament not found'))
				.finally(() => setLoading(false));
		};
		fetchTournament();
		const interval = setInterval(fetchTournament, 5000);
		return () => clearInterval(interval);
	}, [tournamentId]);

	if (loading) return <p className="" style={{color:'var(--text-primary)'}}>Loading tournament...</p>;
	if (!tournament) return <p className="" style={{color:'var(--text-primary)'}}>Tournament not found</p>;

	return (
		<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='w-full max-w-3xl mx-auto p-6'>
			<div className='flex items-center justify-between mb-6'>
				<div>
					<h1 className="text-2xl font-bold " style={{color:'var(--text-primary)'}}>{tournament.name}</h1>
					<p className="" style={{color:'var(--text-primary)'}}>
						{tournament.participants.length}/{tournament.size} players • Round {tournament.currentRound}/{tournament.totalRounds} • {tournament.status}
					</p>
				</div>
				<button onClick={() => navigate('/tournament')} className="px-4 py-2 text-sm " style={{color:'var(--text-primary)'}}>← Lobby</button>
			</div>

			{tournament.status === 'waiting' && (
				<div className='text-center py-12'>
					<p className="text-2xl " style={{color:'var(--text-primary)'}}>⏳ Waiting for players...</p>
					<p className="" style={{color:'var(--text-primary)'}}>{tournament.participants.length}/{tournament.size} joined</p>
				</div>
			)}

			{tournament.status !== 'waiting' && (
				<div className='space-y-4'>
					{Array.from({ length: tournament.totalRounds }, (_, roundIdx) => {
						const round = roundIdx + 1;
						const roundMatches = tournament.brackets.filter((m: any) => m.round === round);
						return (
							<div key={round} className='p-4 glass rounded-xl'>
								<h3 className="text-sm font-bold " style={{color:'var(--text-primary)'}}>
									Round {round} {round === tournament.totalRounds ? '(Final)' : round === tournament.totalRounds - 1 ? '(Semi)' : ''}
								</h3>
								<div className='space-y-2'>
									{roundMatches.map((match: any) => (
										<div key={match.matchId} className='p-3 glass rounded-lg flex justify-between items-center'>
											<div className="flex-1 text-right " style={{color:'var(--text-primary)'}}>
												{match.player1 ? match.player1.slice(0, 8) + '...' : 'TBD'}
											</div>
											<div className="px-4 text-xs " style={{color:'var(--text-primary)'}}>VS</div>
											<div className="flex-1 text-left " style={{color:'var(--text-primary)'}}>
												{match.player2 ? match.player2.slice(0, 8) + '...' : 'TBD'}
											</div>
											{match.winner && <span className='ml-2 text-yellow-400 text-xs'>✓</span>}
										</div>
									))}
								</div>
							</div>
						);
					})}
				</div>
			)}

			{tournament.status === 'completed' && (
				<div className='text-center py-8'>
					<p className='text-4xl mb-4'>👑</p>
					<p className='text-2xl font-bold text-yellow-400'>Tournament Complete!</p>
					<p className="" style={{color:'var(--text-primary)'}}>Winner: {tournament.winner?.slice(0, 12)}...</p>
				</div>
			)}
		</motion.div>
	);
};
