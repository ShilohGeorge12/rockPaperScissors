import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

import { useMycontext } from '../../context';
import { SessionStats } from '../sessionStats';
import { Settings } from '../settings';

export const MobileMenu = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [activeTab, setActiveTab] = useState<'settings' | 'stats'>('settings');
	const { playSound } = useMycontext();

	const toggleMenu = () => {
		playSound('click');
		setIsOpen(!isOpen);
	};

	const switchTab = (tab: 'settings' | 'stats') => {
		playSound('click');
		setActiveTab(tab);
	};

	return (
		<>
			{/* Floating Action Button */}
			<motion.button
				initial={{ scale: 0 }}
				animate={{ scale: 1 }}
				whileTap={{ scale: 0.9 }}
				onClick={toggleMenu}
				className='fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl md:hidden'
				style={{ background: 'var(--accent-primary)', color: '#fff' }}
				aria-label='Toggle menu'>
				{isOpen ? 'X' : '...'}
			</motion.button>

			{/* Mobile Menu Drawer */}
			<AnimatePresence mode='wait'>
				{isOpen && (
					<>
						{/* Backdrop */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={toggleMenu}
							className='fixed inset-0 z-40 md:hidden'
							style={{ background: 'rgba(0,0,0,0.5)' }}
						/>

						{/* Drawer */}
						<motion.div
							initial={{ x: '100%' }}
							animate={{ x: 0 }}
							exit={{ x: '100%' }}
							transition={{ type: 'spring', damping: 25 }}
							className='fixed right-0 top-0 h-full w-[85%] max-w-sm shadow-2xl z-50 md:hidden flex flex-col glass-strong'>
							{/* Header */}
							<div className='flex' style={{ borderBottom: '1px solid var(--border-glass)' }}>
								<button
								onClick={() => switchTab('settings')}
								className={activeTab === 'settings' ? 'opacity-100' : 'opacity-50'}
								style={{
									color: activeTab === 'settings' ? 'var(--accent-primary)' : 'var(--text-primary)',
									borderBottom: activeTab === 'settings' ? '2px solid var(--accent-primary)' : '2px solid transparent',
								}}>
								Settings
							</button>
								<button
								onClick={() => switchTab('stats')}
								className={activeTab === 'stats' ? 'opacity-100' : 'opacity-50'}
								style={{
									color: activeTab === 'stats' ? 'var(--accent-primary)' : 'var(--text-primary)',
									borderBottom: activeTab === 'stats' ? '2px solid var(--accent-primary)' : '2px solid transparent',
								}}>
								Stats
							</button>
							</div>

							{/* Content */}
							<div className='flex-1 overflow-y-auto p-4'>
								{activeTab === 'settings' ? <Settings isMobile={true} /> : <SessionStats isMobile={true} />}
							</div>

							{/* Close button */}
							<button
								onClick={toggleMenu}
								className='m-4 p-3 rounded-lg font-bold transition text-center'
								style={{ background: 'var(--bg-glass)', color: 'var(--text-primary)', border: '1px solid var(--border-glass)' }}>
								Close Menu
							</button>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</>
	);
};
