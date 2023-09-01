// import Result from './components/result';
// import Round from './components/round';
// import { Score } from './components/score';
// import { useMycontext } from './context';
import { BrowserRouter as Router } from 'react-router-dom';
import { AllRoutes } from './routes';

function App() {
	return (
		<main className='flex flex-col w-full h-screen gap-8 bg-gradient-to-bl from-primary-1 to-primary-2 font-BarlowSemiCondensed'>
			<Router>
				<AllRoutes />
			</Router>
			{/* <Score />
			<Outlet/> */}
			{/* {(housePicked === 'play' || userPicked === 'play') && <Round />}
			{housePicked !== 'play' && userPicked !== 'play' && <Result />} */}
		</main>
	);
}

export default App;
