import paper from '../../assets/images/icon-paper.svg';
import rock from '../../assets/images/icon-rock.svg';
import scissors from '../../assets/images/icon-scissors.svg';
import triangle from '../../assets/images/bg-triangle.svg';
import { useMycontext } from '../../context';
import { useNavigate } from 'react-router-dom';
import { choices } from '../../types';

export default function Round() {
	const {
		dispatch,
		state: { score: currentScore },
	} = useMycontext();
	const naviTo = useNavigate();

	const choices: choices = ['Rock', 'Paper', 'Scissors'];

	const getRandomChoice = () => {
		const randomIndex = Math.floor(Math.random() * choices.length);
		return choices[randomIndex];
	};

	const onRock = () => {
		const housePicks = getRandomChoice();
		let score: number = 0;
		const twoPoints = 2;
		const zeroPoint = 0;
		if (housePicks === 'Paper') {
			score = currentScore === 0 ? zeroPoint : currentScore - twoPoints;
		} else if (housePicks === 'Rock') {
			score = currentScore + zeroPoint;
		} else {
			score = currentScore + twoPoints;
		}
		dispatch({ type: 'user_picked', payload: { userPicked: 'Rock', housePicked: housePicks, score: score } });
		naviTo('/results');
	};

	const onScissors = () => {
		const housePicks = getRandomChoice();
		const twoPoints = 2;
		const zeroPoint = 0;
		let score: number = 0;
		if (housePicks === 'Scissors') {
			score = currentScore + zeroPoint;
		} else if (housePicks === 'Rock') {
			score = currentScore === 0 ? zeroPoint : currentScore - twoPoints;
		} else {
			score = currentScore + twoPoints;
		}
		dispatch({ type: 'user_picked', payload: { userPicked: 'Scissors', housePicked: housePicks, score: score } });
		naviTo('/results');
	};

	const onPaper = () => {
		const result = getRandomChoice();
		let score: number = 0;
		const twoPoints = 2;
		const zeroPoint = 0;
		if (result === 'Paper') {
			score = currentScore + zeroPoint;
		} else if (result === 'Scissors') {
			score = currentScore === 0 ? zeroPoint : currentScore - twoPoints;
		} else {
			score = currentScore + twoPoints;
		}
		dispatch({ type: 'user_picked', payload: { userPicked: 'Paper', housePicked: result, score: score } });
		naviTo('/results');
	};

	return (
		<section className={`w-full py-8 flex gap-2 items-center justify-center`}>
			<div className='relative w-72'>
				<img
					src={triangle}
					alt='triangle'
					className={`w-full`}
				/>
				<button
					type='button'
					title=''
					onClick={onPaper}
					className='absolute border-blue-600 -top-12 -left-6 border-[20px] rounded-[50%] p-6 bg-white/80 duration-500 ease-in-out transition hover:scale-105'>
					<img
						src={paper}
						title='paper'
						alt='paper'
						className={'w-12'}
					/>
				</button>
				<button
					type='button'
					title='rock'
					onClick={onRock}
					className='absolute border-red-600  bottom-0 right-1/4 border-[20px] rounded-[50%] p-6 bg-white/80 duration-500 ease-in-out transition hover:scale-105'>
					<img
						src={rock}
						title='rock'
						alt='rock'
						className={'w-12'}
					/>
				</button>
				<button
					type='button'
					title='scissors'
					onClick={onScissors}
					className='absolute border-yellow-600 -top-12 -right-6 border-[20px] rounded-[50%] p-6 bg-white/80 duration-500 ease-in-out transition hover:scale-105'>
					<img
						src={scissors}
						title='scissors'
						alt='scissors'
						className={'w-12'}
					/>
				</button>
			</div>
		</section>
	);
}
