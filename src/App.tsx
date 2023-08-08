import { Score } from './components/score';

function App() {
	return (
		<main className='relative flex flex-col w-full h-screen bg-gradient-to-bl from-primary-1 to-primary-2 font-BarlowSemiCondensed'>
			<Score />
			<button
				type='button'
				className='absolute p-2 text-3xl font-bold tracking-wider border-2 border-gray-400 rounded-lg bottom-6 right-10'>
				RULES
			</button>
		</main>
	);
}

export default App;
