import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AllRoutes } from './routes';

function App() {
	return (
		<main className='flex flex-col w-full h-screen gap-8 overflow-hidden animate-bg-color-animation font-BarlowSemiCondensed'>
			<Router>
				<AllRoutes />
			</Router>
			<ToastContainer
				position='bottom-center'
				autoClose={1500}
				hideProgressBar={false}
				newestOnTop
				closeOnClick
				rtl={false}
				pauseOnFocusLoss={false}
				draggable
				pauseOnHover={false}
				theme='colored'
				limit={3}
			/>
		</main>
	);
}

export default App;
