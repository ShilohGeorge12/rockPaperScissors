import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useMycontext } from './context';

interface ModalType {
	element: JSX.Element;
}

export const Modal = ({ element }: ModalType) => {
	const { dispatch } = useMycontext();
	const Div = document.getElementById('modal') as HTMLDivElement;
	const onClose = () => dispatch({ type: 'view_rules_close', payload: { close: false } });
	const sectionRef = useRef<HTMLDivElement>(null);

	// Close on Escape key
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				onClose();
			}
		};
		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, []);

	return createPortal(
		<section
			ref={sectionRef}
			onClick={onClose}
			role='dialog'
			aria-modal='true'
			aria-label='Modal'
			className={`w-full h-screen absolute top-0 left-0 font-semibold flex items-center justify-center cursor-pointer`}>
			{element}
		</section>,
		Div
	);
};
