import React from 'react';
import ReactDOM from 'react-dom/client';
import { ContextProvider } from './context/index.tsx';
import { AnimatePresence } from 'framer-motion';
import App from './App.tsx';
import './index.css';
import 'react-toastify/ReactToastify.min.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<AnimatePresence mode='wait'>
			<ContextProvider>
				<App />
			</ContextProvider>
		</AnimatePresence>
	</React.StrictMode>
);
