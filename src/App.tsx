import { BrowserRouter as Router } from 'react-router-dom';
import { AllRoutes } from './routes';

function App() {
	// <main className='flex flex-col w-full h-screen gap-8 overflow-hidden animate-text bg-gradient-to-bl from-primary-1 to-primary-2 font-BarlowSemiCondensed'>
	return (
		<main className='flex flex-col w-full h-screen gap-8 overflow-hidden animate-bg-color-animation font-BarlowSemiCondensed'>
			<Router>
				<AllRoutes />
			</Router>
		</main>
	);
}

export default App;
