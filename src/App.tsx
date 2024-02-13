import { BrowserRouter as Router } from 'react-router-dom';
import { AllRoutes } from './routes';

function App() {
	return (
		<main className='flex flex-col w-full h-screen gap-8 overflow-hidden animate-bg-color-animation font-BarlowSemiCondensed'>
			<Router>
				<AllRoutes />
			</Router>
		</main>
	);
}

export default App;
