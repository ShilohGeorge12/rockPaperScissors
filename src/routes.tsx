import { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Home } from './pages/home';
import Round from './components/round';
import { LoadingComponent } from './components/loading';
const Result = lazy(() => import('./components/result'));

export function AllRoutes() {
	const location = useLocation();
	return (
		<Routes
			location={location}
			key={location.pathname}>
			<Route
				path='/'
				element={<Home />}>
				<Route
					index
					element={<Round />}
				/>
				<Route
					path='results'
					element={
						<Suspense fallback={<LoadingComponent />}>
							<Result />
						</Suspense>
					}
				/>
			</Route>
		</Routes>
	);
}
