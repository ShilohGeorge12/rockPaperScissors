import { useNavigate } from 'react-router-dom';
import paper from '../../assets/images/icon-paper.svg';
import rock from '../../assets/images/icon-rock.svg';
import scissors from '../../assets/images/icon-scissors.svg';
import { useMycontext } from '../../context';
import { ImageCaption } from '../imageCaption';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';

export default function Result() {
	const {
		state: { housePicked, userPicked, lastPointsChange, lastResult },
	} = useMycontext();
	const naviTo = useNavigate();

	const resultColor = lastPointsChange > 0 ? 'text-green-400' : lastPointsChange < 0 ? 'text-red-400' : 'text-yellow-400';
	const pointsLabel = lastPointsChange > 0 ? '+' + lastPointsChange : String(lastPointsChange);

	return (
		<motion.section
			className='w-full flex flex-col gap-5 items-center justify-center py-4'
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 1.7 }}>
			<div className='w-full lg:w-[50%] flex items-center justify-evenly text-xl tracking-widest'>
				<p style={{ color: 'var(--text-primary)' }}>You Picked</p>
				<p style={{ color: 'var(--text-primary)' }}>House Picked</p>
			</div>
			<div className='w-full lg:w-[50%] flex items-center justify-evenly'>
				{userPicked === 'Paper' && <ImageCaption src={paper} caption={userPicked} color='border-blue-600' />}
				{userPicked === 'Rock' && <ImageCaption src={rock} caption={userPicked} color='border-red-600' />}
				{userPicked === 'Scissors' && <ImageCaption src={scissors} caption={userPicked} color='border-yellow-600' />}
				{housePicked === 'Paper' && <ImageCaption src={paper} caption={housePicked} color='border-blue-600' />}
				{housePicked === 'Rock' && <ImageCaption src={rock} caption={housePicked} color='border-red-600' />}
				{housePicked === 'Scissors' && <ImageCaption src={scissors} caption={housePicked} color='border-yellow-600' />}
			</div>

			<div className='flex flex-col items-center gap-2'>
				<div className='text-3xl transition duration-500 ease-in-out hover:scale-105'>
					{lastResult === 'win' && <p style={{ color: 'var(--text-primary)' }}>You Win!</p>}
					{lastResult === 'loss' && <p style={{ color: 'var(--text-primary)' }}>House Wins!</p>}
					{lastResult === 'tie' && <p style={{ color: 'var(--text-primary)' }}>Tie Game!</p>}
				</div>
				<motion.p
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
					className={'text-xl font-bold ' + resultColor}>
					{pointsLabel} points
				</motion.p>
			</div>

			<Button onClick={() => naviTo('/game')} className='w-1/2 h-12 text-xl tracking-widest'>
				Play Again
			</Button>
		</motion.section>
	);
}
