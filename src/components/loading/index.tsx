import { FaSpinner } from 'react-icons/fa';

export const Spinner = () => {
	return (
		<section className='flex items-center justify-center w-full h-full'>
			<div className='text-4xl text-emerald-500 animate-spin'>
				<FaSpinner />
			</div>
		</section>
	);
};

export const LoadingComponent = () => {
	return (
		<span className='flex items-center justify-center w-full h-full text-5xl'>
			<Spinner />
		</span>
	);
};
