import { AnimatePresence, motion } from 'framer-motion';
// src/components/mobileMenu/index.tsx
import { useState } from 'react';

import { useMycontext } from '../../context';
import { SessionStats } from '../sessionStats';
import { Settings } from '../settings';

export const MobileMenu = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [activeTab, setActiveTab] = useState<'settings' | 'stats'>('settings');
	const { playSound, state } = useMycontext();
	const { theme } = state;

	const toggleMenu = () => {
		playSound('click');
		setIsOpen(!isOpen);
	};

	const switchTab = (tab: 'settings' | 'stats') => {
		playSound('click');
		setActiveTab(tab);
	};

	// Dynamic drawer styles based on theme
	const getDrawerClasses = () => {
		switch (theme) {
			case 'dark':
				return 'bg-gradient-to-br from-gray-900 to-purple-900 text-white';
			case 'light':
				return 'bg-gradient-to-br from-blue-100 to-purple-100 text-gray-900';
			case 'retro':
				return 'bg-gradient-to-br from-green-900 via-black to-green-900 text-green-300';
			default:
				return 'bg-gradient-to-br from-gray-900 to-purple-900 text-white';
		}
	};

	const getButtonColorClasses = () => {
		switch (theme) {
			case 'dark':
				return 'bg-purple-600 hover:bg-purple-700';
			case 'light':
				return 'bg-purple-500 hover:bg-purple-600';
			case 'retro':
				return 'bg-green-700 hover:bg-green-800 border-2 border-green-500';
			default:
				return 'bg-purple-600 hover:bg-purple-700';
		}
	};

	const getTabClasses = (isActive: boolean) => {
		const baseClasses = 'flex-1 py-4 text-center font-bold transition';
		if (isActive) {
			switch (theme) {
				case 'dark':
					return `${baseClasses} text-purple-400 border-b-2 border-purple-400`;
				case 'light':
					return `${baseClasses} text-purple-700 border-b-2 border-purple-700`;
				case 'retro':
					return `${baseClasses} text-green-400 border-b-2 border-green-400`;
				default:
					return `${baseClasses} text-purple-400 border-b-2 border-purple-400`;
			}
		}
		switch (theme) {
			case 'dark':
				return `${baseClasses} text-white/60`;
			case 'light':
				return `${baseClasses} text-gray-600`;
			case 'retro':
				return `${baseClasses} text-green-300/60`;
			default:
				return `${baseClasses} text-white/60`;
		}
	};

	const getCloseButtonClasses = () => {
		switch (theme) {
			case 'dark':
				return 'bg-red-600 hover:bg-red-700 text-white';
			case 'light':
				return 'bg-red-500 hover:bg-red-600 text-white';
			case 'retro':
				return 'bg-red-700 hover:bg-red-800 border-2 border-red-500 text-white';
			default:
				return 'bg-red-600 hover:bg-red-700 text-white';
		}
	};

	return (
		<>
			{/* Floating Action Button */}
			<motion.button
				initial={{ scale: 0 }}
				animate={{ scale: 1 }}
				whileTap={{ scale: 0.9 }}
				onClick={toggleMenu}
				className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full ${getButtonColorClasses()} text-white shadow-lg flex items-center justify-center text-2xl md:hidden`}
				aria-label="Toggle menu">
				{isOpen ? '✕' : '⚙️'}
			</motion.button>

			{/* Mobile Menu Drawer */}
			<AnimatePresence mode="wait">
				{isOpen && (
					<>
						{/* Backdrop */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={toggleMenu}
							className="fixed inset-0 bg-black/50 z-40 md:hidden"
						/>

						{/* Drawer */}
						<motion.div
							key={theme}
							initial={{ x: '100%' }}
							animate={{ x: 0 }}
							exit={{ x: '100%' }}
							transition={{ type: 'spring', damping: 25 }}
							className={`fixed right-0 top-0 h-full w-[85%] max-w-sm ${getDrawerClasses()} shadow-2xl z-50 md:hidden flex flex-col`}>
							{/* Header */}
							<div className={`flex border-b ${theme === 'light' ? 'border-gray-300' : 'border-white/20'}`}>
								<button
									onClick={() => switchTab('settings')}
									className={getTabClasses(activeTab === 'settings')}>
									⚙️ Settings
								</button>
								<button
									onClick={() => switchTab('stats')}
									className={getTabClasses(activeTab === 'stats')}>
									📊 Stats
								</button>
							</div>

							{/* Content - Force inherit text color */}
							<div className="flex-1 overflow-y-auto p-4">{activeTab === 'settings' ? <Settings isMobile={true} /> : <SessionStats isMobile={true} />}</div>

							{/* Close button at bottom */}
							<button
								onClick={toggleMenu}
								className={`m-4 p-3 rounded-lg font-bold transition ${getCloseButtonClasses()}`}>
								Close Menu
							</button>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</>
	);
};
