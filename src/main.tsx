import './index.css';
import 'react-toastify/ReactToastify.min.css';

import { AnimatePresence } from 'framer-motion';
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App.tsx';
import { ErrorBoundary } from './components/errorBoundary';
import { ThemeApplier } from './components/themeApplier';
import { AuthProvider } from './context/authContext';
import { ContextProvider } from './context/index.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ErrorBoundary>
			<AnimatePresence mode="wait">
				<ContextProvider>
					<AuthProvider>
						<ThemeApplier />
						<App />
					</AuthProvider>
				</ContextProvider>
			</AnimatePresence>
		</ErrorBoundary>
	</React.StrictMode>
);
