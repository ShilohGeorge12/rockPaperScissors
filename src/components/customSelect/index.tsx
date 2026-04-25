import { AnimatePresence, motion } from 'framer-motion';
// src/components/customSelect/index.tsx
import { useEffect, useRef, useState } from 'react';

import { useMycontext } from '../../context';

interface CustomSelectProps {
	value: string;
	onChange: (value: string) => void;
	options: { value: string; label: string; emoji?: string }[];
	label?: string;
}

export const CustomSelect = ({ value, onChange, options, label }: CustomSelectProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const selectRef = useRef<HTMLDivElement>(null);
	const { state } = useMycontext();
	const { theme } = state;

	const selectedOption = options.find((opt) => opt.value === value);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	// Get styles based on theme
	const getButtonStyles = () => {
		switch (theme) {
			case 'dark':
				return 'bg-white/20 text-white hover:bg-white/30';
			case 'light':
				return 'bg-gray-200 text-gray-900 hover:bg-gray-300';
			case 'retro':
				return 'bg-green-800/50 text-green-300 hover:bg-green-800/70 border border-green-500';
			default:
				return 'bg-white/20 text-white hover:bg-white/30';
		}
	};

	const getDropdownStyles = () => {
		switch (theme) {
			case 'dark':
				return 'bg-gray-800 border-gray-700';
			case 'light':
				return 'bg-white border-gray-200 shadow-lg';
			case 'retro':
				return 'bg-green-900 border-green-700';
			default:
				return 'bg-gray-800 border-gray-700';
		}
	};

	const getOptionStyles = (isSelected: boolean) => {
		const baseStyles = 'w-full px-4 py-2 text-left transition-colors';
		if (isSelected) {
			switch (theme) {
				case 'dark':
					return `${baseStyles} bg-purple-600 text-white`;
				case 'light':
					return `${baseStyles} bg-purple-100 text-purple-900`;
				case 'retro':
					return `${baseStyles} bg-green-700 text-green-300`;
				default:
					return `${baseStyles} bg-purple-600 text-white`;
			}
		}
		switch (theme) {
			case 'dark':
				return `${baseStyles} text-white hover:bg-white/10`;
			case 'light':
				return `${baseStyles} text-gray-900 hover:bg-gray-100`;
			case 'retro':
				return `${baseStyles} text-green-300 hover:bg-green-800`;
			default:
				return `${baseStyles} text-white hover:bg-white/10`;
		}
	};

	return (
		<div
			className="mb-4"
			ref={selectRef}>
			{label && (
				<label
					className="block text-sm mb-2"
					style={{ color: theme === 'light' ? '#374151' : 'inherit' }}>
					{label}
				</label>
			)}

			{/* Custom Select Button */}
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className={`w-full p-3 text-sm rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-between ${getButtonStyles()}`}>
				<span>
					{selectedOption?.emoji && `${selectedOption.emoji} `}
					{selectedOption?.label}
				</span>
				<motion.span
					animate={{ rotate: isOpen ? 180 : 0 }}
					transition={{ duration: 0.2 }}
					className="text-lg">
					▼
				</motion.span>
			</button>

			{/* Dropdown Options */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						transition={{ duration: 0.2 }}
						className={`absolute z-50 w-[calc(100%-2rem)] mt-1 rounded-lg border shadow-xl overflow-hidden ${getDropdownStyles()}`}
						style={{ width: selectRef.current?.offsetWidth }}>
						{options.map((option) => (
							<button
								key={option.value}
								type="button"
								onClick={() => {
									onChange(option.value);
									setIsOpen(false);
								}}
								className={getOptionStyles(option.value === value)}>
								{option.emoji && `${option.emoji} `}
								{option.label}
							</button>
						))}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};
