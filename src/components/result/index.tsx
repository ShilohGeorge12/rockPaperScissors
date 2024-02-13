import { useNavigate } from 'react-router-dom';
import paper from '../../assets/images/icon-paper.svg';
import rock from '../../assets/images/icon-rock.svg';
import scissors from '../../assets/images/icon-scissors.svg';
import { useMycontext } from '../../context';
import { ImageCaption } from '../imageCaption';

export default function Result() {
	const {
		state: { housePicked, userPicked },
	} = useMycontext();
	const naviTo = useNavigate();

	const userWins = <p>House Wins 😞</p>;
	const houseWins = <p>You Win 🎉</p>;
	const tieGame = <p>Tie Game 🤝</p>;

	return (
		<section className={`w-full flex flex-col gap-5 overflow-hidden items-center justify-center py-4`}>
			<div className='w-full lg:w-[50%] flex items-center justify-evenly text-xl tracking-widest text-white'>
				<p className='text'>You Picked</p>
				<p className=''>House Picked</p>
			</div>
			<div className='w-full lg:w-[50%] flex items-center justify-evenly'>
				{userPicked === 'Paper' && (
					<ImageCaption
						src={paper}
						caption={userPicked}
						color='border-blue-600'
					/>
				)}
				{userPicked === 'Rock' && (
					<ImageCaption
						src={rock}
						caption={userPicked}
						color='border-red-600'
					/>
				)}
				{userPicked === 'Scissors' && (
					<ImageCaption
						src={scissors}
						caption={userPicked}
						color='border-yellow-600'
					/>
				)}
				{housePicked === 'Paper' && (
					<ImageCaption
						src={paper}
						caption={housePicked}
						color='border-blue-600'
					/>
				)}
				{housePicked === 'Rock' && (
					<ImageCaption
						src={rock}
						caption={housePicked}
						color='border-red-600'
					/>
				)}
				{housePicked === 'Scissors' && (
					<ImageCaption
						src={scissors}
						caption={housePicked}
						color='border-yellow-600'
					/>
				)}
			</div>
			<div className='text-3xl text-white transition duration-500 ease-in-out hover:scale-105'>
				{userPicked === 'Paper' && housePicked === 'Scissors' && houseWins}
				{userPicked === 'Scissors' && housePicked === 'Paper' && userWins}
				{userPicked === 'Rock' && housePicked === 'Paper' && houseWins}
				{userPicked === 'Paper' && housePicked === 'Rock' && userWins}
				{userPicked === 'Scissors' && housePicked === 'Rock' && houseWins}
				{userPicked === 'Rock' && housePicked === 'Scissors' && userWins}
				{userPicked === 'Rock' && housePicked === 'Rock' && tieGame}
				{userPicked === 'Scissors' && housePicked === 'Scissors' && tieGame}
				{userPicked === 'Paper' && housePicked === 'Paper' && tieGame}
			</div>

			<button
				type='button'
				name={`Play Again!`}
				className={`w-1/2 h-12 bg-white rounded-lg transition duration-500 ease-in-out hover:scale-110 text-primary-1 text-xl tracking-widest`}
				onClick={() => naviTo('/')}>
				Play Again
			</button>
		</section>
	);
}
