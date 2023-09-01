import paper from '../../assets/images/icon-paper.svg';
import rock from '../../assets/images/icon-rock.svg';
import scissors from '../../assets/images/icon-scissors.svg';
import triangle from '../../assets/images/bg-triangle.svg';
import { useMycontext } from '../../context';
import { useNavigate } from 'react-router-dom';
// import pentagon from '../../assets/images/bg-pentagon.svg';

export default function Round() {
	const { dispatch } = useMycontext();
	const naviTo = useNavigate();

	const onRock = () => {
		dispatch({ type: 'user_picked', payload: { userPicked: 'Rock', housePicked: 'Paper' } });
		// dispatch({ type: 'user_Paper', payload: { userPicked: 'Paper' } });
		naviTo('/results');
	};

	const onScissors = () => {
		dispatch({ type: 'user_picked', payload: { userPicked: 'Scissors', housePicked: 'Rock' } });
		// dispatch({ type: 'user_rock', payload: { userPicked: 'Rock' } });
		naviTo('/results');
	};

	const onPaper = () => {
		dispatch({ type: 'user_picked', payload: { userPicked: 'Paper', housePicked: 'Scissors' } });
		// dispatch({ type: 'house_Scissors', payload: { housePicked: 'Scissors' } });
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
