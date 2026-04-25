import { motion } from 'framer-motion';

import { useMycontext } from '../../context';

interface ConfirmationModalProps {
	title: string;
	message: string;
	onConfirm: () => void;
	onCancel: () => void;
}

export const ConfirmationModal = ({ title, message, onConfirm, onCancel }: ConfirmationModalProps) => {
	const { state } = useMycontext();

	// Dynamic theme classes
	const getModalClasses = () => {
		switch (state.theme) {
			case 'dark':
				return 'bg-gray-800 text-white';
			case 'light':
				return 'bg-white text-gray-800';
			case 'retro':
				return 'bg-green-900 text-green-300 border-2 border-green-500';
			default:
				return 'bg-gray-800 text-white';
		}
	};

	const getButtonClasses = (type: 'cancel' | 'confirm') => {
		const baseClasses = 'px-4 py-2 rounded-lg transition-colors';
		if (type === 'cancel') {
			switch (state.theme) {
				case 'dark':
					return `${baseClasses} bg-gray-600 hover:bg-gray-700 text-white`;
				case 'light':
					return `${baseClasses} bg-gray-400 hover:bg-gray-500 text-white`;
				case 'retro':
					return `${baseClasses} bg-green-700 hover:bg-green-800 text-green-300 border border-green-500`;
				default:
					return `${baseClasses} bg-gray-600 hover:bg-gray-700 text-white`;
			}
		} else {
			switch (state.theme) {
				case 'dark':
					return `${baseClasses} bg-red-600 hover:bg-red-700 text-white`;
				case 'light':
					return `${baseClasses} bg-red-500 hover:bg-red-600 text-white`;
				case 'retro':
					return `${baseClasses} bg-red-800 hover:bg-red-900 text-red-300 border border-red-500`;
				default:
					return `${baseClasses} bg-red-600 hover:bg-red-700 text-white`;
			}
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.9 }}
			onClick={(e) => e.stopPropagation()}
			className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-md rounded-2xl shadow-2xl ${getModalClasses()}`}>
			<div className="p-6">
				<h3 className="text-2xl font-bold mb-3">{title}</h3>
				<p className="mb-6 opacity-90">{message}</p>

				<div className="flex gap-3 justify-end">
					<button
						onClick={onCancel}
						className={getButtonClasses('cancel')}>
						Cancel
					</button>
					<button
						onClick={onConfirm}
						className={getButtonClasses('confirm')}>
						Reset
					</button>
				</div>
			</div>
		</motion.div>
	);
};
