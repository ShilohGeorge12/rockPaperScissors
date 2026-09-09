import { useEffect } from 'react';
import { useMycontext } from '../../context';

export const ThemeApplier = () => {
	const { state: { theme } } = useMycontext();

	useEffect(() => {
		const root = document.documentElement;
		root.removeAttribute('data-theme');
		if (theme === 'light') root.setAttribute('data-theme', 'light');
		else if (theme === 'retro') root.setAttribute('data-theme', 'retro');
	}, [theme]);

	return null;
};
