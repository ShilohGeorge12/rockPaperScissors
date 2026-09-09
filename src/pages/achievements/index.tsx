import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { achievementService } from '../../service/achievement.service';
import { Button } from '../../components/ui/button';

interface Achievement {
	_id: string;
	name: string;
	description: string;
	icon: string;
	condition: string;
	threshold: number;
	unlocked: boolean;
	unlockedAt: string | null;
}

export const AchievementsPage = () => {
	const [achievements, setAchievements] = useState<Achievement[]>([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchAchievements = async () => {
			try {
				const data = await achievementService.getAll();
				setAchievements(data);
				const checkResult = await achievementService.checkAndUnlock();
				if (checkResult.newlyUnlocked.length > 0) {
					for (const a of checkResult.newlyUnlocked) {
						toast.success(a.icon + ' Achievement Unlocked: ' + a.name + '!');
					}
					const updated = await achievementService.getAll();
					setAchievements(updated);
				}
			} catch {
				// Backend may not be running
			} finally {
				setLoading(false);
			}
		};
		fetchAchievements();
	}, []);

	const unlockedCount = achievements.filter((a) => a.unlocked).length;

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className='w-full max-w-2xl mx-auto p-6'>
			<div className='flex items-center justify-between mb-6'>
				<h1 className='text-3xl font-display font-bold' style={{ color: 'var(--text-primary)' }}>Achievements</h1>
				<Button variant='outline' onClick={() => navigate('/')}>Back to Game</Button>
			</div>

			<p className='mb-4' style={{ color: 'var(--text-secondary)' }}>
				{unlockedCount}/{achievements.length} Unlocked
			</p>

			{/* Progress bar */}
			<div className='w-full h-2 glass rounded-full overflow-hidden mb-6' style={{ border: '1px solid var(--border-glass)' }}>
				<motion.div
					initial={{ width: 0 }}
					animate={{ width: achievements.length > 0 ? (unlockedCount / achievements.length * 100) + '%' : '0%' }}
					transition={{ duration: 0.8, ease: 'easeOut' }}
					className='h-full rounded-full'
					style={{ background: 'var(--accent-primary)' }}
				/>
			</div>

			{loading ? (
				<p className='text-center py-8' style={{ color: 'var(--text-muted)' }}>Loading achievements...</p>
			) : (
				<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
					{achievements.map((ach, i) => (
						<motion.div
							key={ach._id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: i * 0.05 }}
							className={'p-4 rounded-xl transition ' + (ach.unlocked ? 'glass' : 'glass opacity-60')}
							style={{ border: ach.unlocked ? '1px solid rgba(234,179,8,0.4)' : '1px solid var(--border-glass)' }}>
							<div className='flex items-center gap-3'>
								<span className='text-3xl'>{ach.icon}</span>
								<div>
									<p className='font-bold' style={{ color: 'var(--text-primary)' }}>{ach.name}</p>
									<p className='text-sm' style={{ color: 'var(--text-secondary)' }}>{ach.description}</p>
									{ach.unlocked && ach.unlockedAt && (
										<p className='text-xs text-yellow-400 mt-1'>
											Unlocked {new Date(ach.unlockedAt).toLocaleDateString()}
										</p>
									)}
							</div>
							</div>
						</motion.div>
					))}
				</div>
			)}
		</motion.div>
	);
};
