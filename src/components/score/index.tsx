import { useMycontext } from '../../context';

export const Score = () => {
	const {
		state: { score },
	} = useMycontext();
	return (
		<section className='w-full p-5 flex items-center justify-between min-h-[20vh] mx-auto border-[3px] border-gray-400 rounded-2xl mt-14 md:w-2/5'>
			<div className='text-3xl tracking-wide text-white'>
				<p>ROCK</p>
				<p>PAPER</p>
				<p>SCISSORS</p>
			</div>
			<div className='flex flex-col items-center justify-center w-1/3 py-3 bg-white/90 rounded-xl'>
				<p className='text-xl tracking-widest text-blue-700 text-bold'>SCORE</p>
				<p className='text-6xl tracking-wide text-gray-600 text-bold'>{score}</p>
			</div>
		</section>
	);
};
