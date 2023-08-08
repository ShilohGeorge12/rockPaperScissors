interface ScoreProps {}

export const Score = ({}: ScoreProps) => {
	return (
		<section className='w-full p-5 flex items-center justify-between min-h-[20vh] mx-auto border-[3px] border-gray-500 rounded-2xl mt-14 md:w-2/5'>
			<div className='text-3xl text-white'>
				<p>ROCK</p>
				<p>PAPER</p>
				<p>SCISSORS</p>
			</div>
			<div className='flex flex-col items-center justify-center w-1/3 py-3 bg-white/80 rounded-xl'>
				<p className='text-xl tracking-widest text-blue-700 text-bold'>SCORE</p>
				<p className='text-6xl tracking-wide text-gray-600 text-bold'>12</p>
			</div>
		</section>
	);
};