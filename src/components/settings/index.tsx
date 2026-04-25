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
				<div className="flex flex-col gap-5">
					<h3 className="text-xl font-bold text-center">⚙️ Settings</h3>

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
					<button
						onClick={() => {
							playSound('click');
							dispatch({ type: 'toggle_sound' });
						}}
						className="w-full px-4 py-3 text-sm !text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">
						{state.soundEnabled ? '🔊 Sound On' : '🔇 Sound Off'}
					</button>

					{/* Reset Game */}
					<button
						onClick={() => {
							playSound('click');
							setShowResetConfirm(true);
						}}
						className="w-full px-4 py-3 text-sm !text-white bg-red-600 rounded-lg hover:bg-red-700 transition">
						🔄 Reset Game
					</button>

					{/* Session Stats Summary */}
					<div className="pt-4 border-t border-white/20">
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
			</div>
		);
	}

	return (
		<>
			<motion.div
				initial={{ opacity: 0, x: -100 }}
				animate={{ opacity: 1, x: 0 }}
				exit={{ opacity: 0, x: -100 }}
				className="fixed left-4 top-4 bottom-4 bg-black/50 backdrop-blur-md rounded-2xl p-5 shadow-2xl z-40 min-w-[200px] hidden md:flex flex-col">
				<div className="flex flex-col gap-3 h-full overflow-y-auto">
					<h3 className="text-lg font-bold text-white text-center">⚙️ Settings</h3>

					{/* Match Type */}
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
					<div className="mt-6 flex flex-col gap-6">
						<button
							onClick={() => {
								playSound('click');
								dispatch({ type: 'toggle_sound' });
							}}
							className="w-full px-3 py-2 text-sm !text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">
							{state.soundEnabled ? '🔊 Sound On' : '🔇 Sound Off'}
						</button>

						{/* Reset Game */}
						<button
							onClick={() => {
								playSound('click');
								setShowResetConfirm(true);
							}}
							className="w-full px-3 py-2 text-sm !text-white bg-red-600 rounded-lg hover:bg-red-700 transition">
							🔄 Reset Game
						</button>
					</div>

					{/* Session Stats Summary */}
					<div className="pt-3 border-t border-white/20">
						<div className="text-xs text-white/70 text-center">
							<p>Session Stats</p>
							<p className="mt-1">
								🏆 {state.sessionStats.wins}W - {state.sessionStats.losses}L - {state.sessionStats.ties}T
							</p>
							{state.sessionStats.currentStreak > 0 && <p className="text-green-400 text-xs mt-1">🔥 Streak: {state.sessionStats.currentStreak}</p>}
						</div>
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
