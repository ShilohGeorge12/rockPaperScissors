import { useNavigate } from 'react-router-dom';
import paper from '../../assets/images/icon-paper.svg';
import rock from '../../assets/images/icon-rock.svg';
import scissors from '../../assets/images/icon-scissors.svg';
import { useMycontext } from '../../context';

export default function Result() {
	const {
		state: { housePicked, userPicked },
	} = useMycontext();
	const naviTo = useNavigate();
	console.log({ housePicked, userPicked });

	return (
		<section className={`w-full flex flex-col gap-5 items-center justify-center py-4`}>
			<div className='w-[50%] flex items-center justify-evenly text-xl tracking-widest text-white'>
				<p className='text'>You Picked</p>
				<p className=''>House Picked</p>
			</div>
			<div className='w-[50%] flex items-center justify-evenly'>
				{userPicked === 'Paper' && (
					<div className='flex flex-col items-center justify-center gap-4'>
						<div className=' border-blue-600  border-[20px] rounded-[50%] p-6 bg-white/80'>
							<img
								src={paper}
								title='paper'
								alt='paper'
								className={'w-12'}
							/>
						</div>
						<p className='text-base text-white'>{userPicked}</p>
					</div>
				)}
				{userPicked === 'Rock' && (
					<div className='flex flex-col items-center justify-center gap-4'>
						<div className='border-red-600 border-[20px] rounded-[50%] p-6 bg-white/80'>
							<img
								src={rock}
								title='rock'
								alt='rock'
								className={'w-12'}
							/>
						</div>
						<p className='text-base text-white'>{userPicked}</p>
					</div>
				)}
				{userPicked === 'Scissors' && (
					<div className='flex flex-col items-center justify-center gap-4'>
						<div className=' border-yellow-600 border-[20px] rounded-[50%] p-6 bg-white/80'>
							<img
								src={scissors}
								title='scissors'
								alt='scissors'
								className={'w-16'}
							/>
						</div>
						<p className='text-base text-white'>{userPicked}</p>
					</div>
				)}
				{housePicked === 'Paper' && (
					<div className='flex flex-col items-center justify-center gap-4'>
						<div className=' border-blue-600 border-[20px] rounded-[50%] p-6 bg-white/80'>
							<img
								src={paper}
								title='paper'
								alt='paper'
								className={'w-16'}
							/>
						</div>
						<p className='text-base text-white'>{housePicked}</p>
					</div>
				)}
				{housePicked === 'Rock' && (
					<div className='flex flex-col items-center justify-center gap-4'>
						<div className=' border-red-600 border-[20px] rounded-[50%] p-6 bg-white/80'>
							<img
								src={rock}
								title='rock'
								alt='rock'
								className={'w-16'}
							/>
						</div>
						<p className='text-base text-white'> {housePicked}</p>
					</div>
				)}
				{housePicked === 'Scissors' && (
					<div className='flex flex-col items-center justify-center gap-4'>
						<div className=' border-yellow-600 border-[20px] rounded-[50%] p-6 bg-white/80'>
							<img
								src={scissors}
								title='scissors'
								alt='scissors'
								className={'w-16'}
							/>
						</div>
						<p className='text-base text-white'> {housePicked}</p>
					</div>
				)}
			</div>
			<div className='text-xl text-white transition duration-500 ease-in-out hover:scale-105'>
				{userPicked === 'Paper' && housePicked === 'Scissors' && <p>House Wins 😞</p>}
				{userPicked === 'Scissors' && housePicked === 'Paper' && <p>You Wins 🎉</p>}
				{userPicked === 'Rock' && housePicked === 'Paper' && <p>House Wins 😞</p>}
				{userPicked === 'Paper' && housePicked === 'Rock' && <p>You Wins 🎉</p>}
				{userPicked === 'Scissors' && housePicked === 'Rock' && <p>House Wins 😞</p>}
				{userPicked === 'Rock' && housePicked === 'Scissors' && <p>You Wins 🎉</p>}
				{userPicked === 'Rock' && housePicked === 'Rock' && <p>Tie Game 🤝</p>}
				{userPicked === 'Scissors' && housePicked === 'Scissors' && <p>Tie Game 🤝</p>}
				{userPicked === 'Paper' && housePicked === 'Paper' && <p>Tie Game 🤝</p>}
			</div>

			<button
				type='button'
				name={`Play Again!`}
				className={`w-1/4 h-12 bg-white rounded-lg transition duration-500 ease-in-out hover:scale-110 text-primary-1 text-xl tracking-widest`}
				onClick={() => naviTo('/')}>
				Play Again
			</button>
		</section>
	);
}
