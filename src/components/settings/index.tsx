import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

import { useMycontext } from '../../context';
import { Modal } from '../../modal';
import { Difficulty, MatchType, Theme } from '../../types';
import { ConfirmationModal } from '../confirmationModal';
import { CustomSelect } from '../customSelect';

interface SettingsProps {
	isMobile?: boolean;
}

export const Settings = ({ isMobile = false }: SettingsProps) => {
	const { state, dispatch, playSound } = useMycontext();
	const [showResetConfirm, setShowResetConfirm] = useState(false);

	const handleSettingChange = (setting: string, value: any) => {
		playSound('click');
		switch (setting) {
			case 'matchType':
				dispatch({ type: 'set_match_type', payload: value as MatchType });
				break;
			case 'difficulty':
				dispatch({ type: 'set_difficulty', payload: value as Difficulty });
				break;
			case 'theme':
				dispatch({ type: 'set_theme', payload: value as Theme });
				break;
		}
	};

	const handleReset = () => {
		playSound('click');
		dispatch({ type: 'reset_game' });
		setShowResetConfirm(false);
	};

	if (isMobile) {
		return (
			<div className="w-full [&_*]:text-inherit">
				{/* Remove text-white from headers - let it inherit */}
				<h3 className="mb-4 text-xl font-bold text-center">⚙️ Settings</h3>

				<CustomSelect
					label="Match Type"
					value={state.matchType}
					onChange={(value) => handleSettingChange('matchType', value)}
					options={[
						{ value: 'single', label: 'Single Round', emoji: '🎮' },
						{ value: 'bestOf3', label: 'Best of 3', emoji: '🏆' },
						{ value: 'bestOf5', label: 'Best of 5', emoji: '🏆' },
					]}
				/>

				{/* Difficulty */}
				<CustomSelect
					label="Difficulty"
					value={state.difficulty}
					onChange={(value) => handleSettingChange('difficulty', value)}
					options={[
						{ value: 'easy', label: 'Easy', emoji: '😊' },
						{ value: 'medium', label: 'Medium', emoji: '🤔' },
						{ value: 'hard', label: 'Hard', emoji: '😈' },
					]}
				/>

				{/* Theme */}
				<CustomSelect
					label="Theme"
					value={state.theme}
					onChange={(value) => handleSettingChange('theme', value)}
					options={[
						{ value: 'dark', label: 'Dark', emoji: '🌙' },
						{ value: 'light', label: 'Light', emoji: '☀️' },
						{ value: 'retro', label: 'Retro', emoji: '📺' },
					]}
				/>

				{/* Sound Toggle */}
				<div className="mb-4 !text-white">
					<button
						onClick={() => {
							playSound('click');
							dispatch({ type: 'toggle_sound' });
						}}
						className="w-full px-4 py-3 text-sm !text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">
						{state.soundEnabled ? '🔊 Sound On' : '🔇 Sound Off'}
					</button>
				</div>

				{/* Reset Game */}
				<button
					onClick={() => {
						playSound('click');
						setShowResetConfirm(true);
					}}
					className="w-full px-4 py-3 text-sm !text-white bg-red-600 rounded-lg hover:bg-red-700 transition mb-4">
					🔄 Reset Game
				</button>

				{/* Session Stats Summary */}
				<div className="mt-4 pt-4 border-t border-white/20">
					<div className="text-sm text-center opacity-70">
						<p>Session Stats</p>
						<p className="mt-2">
							🏆 {state.sessionStats.wins}W - {state.sessionStats.losses}L - {state.sessionStats.ties}T
						</p>
						{state.sessionStats.currentStreak > 0 && <p className="text-green-500 text-sm mt-2">🔥 Streak: {state.sessionStats.currentStreak}</p>}
					</div>
				</div>

				{/* Reset Confirmation Modal */}
				<AnimatePresence>
					{showResetConfirm && (
						<Modal
							element={
								<ConfirmationModal
									title="Reset Game?"
									message="This will reset your score, current match progress, and all session statistics. This action cannot be undone."
									onConfirm={handleReset}
									onCancel={() => {
										playSound('click');
										setShowResetConfirm(false);
									}}
								/>
							}
						/>
					)}
				</AnimatePresence>
			</div>
		);
	}

	return (
		<>
			<motion.div
				initial={{ opacity: 0, x: -100 }}
				animate={{ opacity: 1, x: 0 }}
				exit={{ opacity: 0, x: -100 }}
				className="fixed left-4 top-1/2 transform -translate-y-1/2 bg-black/50 backdrop-blur-md rounded-2xl p-4 shadow-2xl z-40 min-w-[180px] hidden md:block">
				<h3 className="mb-3 text-lg font-bold text-white text-center">⚙️ Settings</h3>

				<CustomSelect
					label="Match Type"
					value={state.matchType}
					onChange={(value) => handleSettingChange('matchType', value)}
					options={[
						{ value: 'single', label: 'Single Round', emoji: '🎮' },
						{ value: 'bestOf3', label: 'Best of 3', emoji: '🏆' },
						{ value: 'bestOf5', label: 'Best of 5', emoji: '🏆' },
					]}
				/>

				{/* Difficulty */}
				<CustomSelect
					label="Difficulty"
					value={state.difficulty}
					onChange={(value) => handleSettingChange('difficulty', value)}
					options={[
						{ value: 'easy', label: 'Easy', emoji: '😊' },
						{ value: 'medium', label: 'Medium', emoji: '🤔' },
						{ value: 'hard', label: 'Hard', emoji: '😈' },
					]}
				/>

				{/* Theme */}
				<CustomSelect
					label="Theme"
					value={state.theme}
					onChange={(value) => handleSettingChange('theme', value)}
					options={[
						{ value: 'dark', label: 'Dark', emoji: '🌙' },
						{ value: 'light', label: 'Light', emoji: '☀️' },
						{ value: 'retro', label: 'Retro', emoji: '📺' },
					]}
				/>

				{/* Sound Toggle */}
				<div className="mb-4">
					<button
						onClick={() => {
							playSound('click');
							dispatch({ type: 'toggle_sound' });
						}}
						className="w-full px-4 py-3 text-sm !text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">
						{state.soundEnabled ? '🔊 Sound On' : '🔇 Sound Off'}
					</button>
				</div>

				{/* Sound Toggle */}
				<div className="mb-3">
					<button
						onClick={() => {
							playSound('click');
							dispatch({ type: 'toggle_sound' });
						}}
						className="w-full px-3 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">
						{state.soundEnabled ? '🔊 Sound On' : '🔇 Sound Off'}
					</button>
				</div>

				{/* Reset Game */}
				<button
					onClick={() => {
						playSound('click');
						setShowResetConfirm(true);
					}}
					className="w-full px-3 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 transition">
					🔄 Reset Game
				</button>

				{/* Session Stats Summary */}
				<div className="mt-3 pt-3 border-t border-white/20">
					<div className="text-xs text-white/70 text-center">
						<p>Session Stats</p>
						<p className="mt-1">
							🏆 {state.sessionStats.wins}W - {state.sessionStats.losses}L - {state.sessionStats.ties}T
						</p>
						{state.sessionStats.currentStreak > 0 && <p className="text-green-400 text-xs mt-1">🔥 Streak: {state.sessionStats.currentStreak}</p>}
					</div>
				</div>
			</motion.div>

			{/* Reset Confirmation Modal */}
			<AnimatePresence>
				{showResetConfirm && (
					<Modal
						element={
							<ConfirmationModal
								title="Reset Game?"
								message="This will reset your score, current match progress, and all session statistics. This action cannot be undone."
								onConfirm={handleReset}
								onCancel={() => {
									playSound('click');
									setShowResetConfirm(false);
								}}
							/>
						}
					/>
				)}
			</AnimatePresence>
		</>
	);
};
