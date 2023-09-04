import { createPortal } from 'react-dom';
import { useMycontext } from './context';

interface ModalType {
	element: JSX.Element;
}

export const Modal = ({ element }: ModalType) => {
	const { dispatch } = useMycontext();
	const Div = document.getElementById('modal') as HTMLDivElement;
	const onClose = () => dispatch({ type: 'view_rules_close', payload: { close: false } });

	return createPortal(
		<section
			onClick={onClose}
			className={`w-full h-screen absolute top-0 left-0 font-semibold flex items-center justify-center cursor-pointer`}>
			{element}
		</section>,
		Div
	);
};
