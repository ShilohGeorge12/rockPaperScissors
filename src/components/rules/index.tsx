import { IoIosClose } from 'react-icons/io';
import { useMycontext } from '../../context';
import rulesImage from '../../assets/images/image-rules.svg';

export default function Rules() {
	const { dispatch } = useMycontext();
	return (
		<section
			className={`w-[95%] md:w-2/3 lg:w-1/3 p-4 bg-white rounded-lg flex flex-col items-center gap-4 cursor-default`}
			onClick={(e) => e.stopPropagation()}>
			<div className='flex items-center justify-between w-full'>
				<p className='self-start text-2xl font-bold tracking-wide text-gray-600'>RULES</p>
				<button
					type='button'
					name={`Close Rules Panel`}
					className={`text-4xl text-gray-400 hover:text-red-600 duration-500 ease-in-out transition hover:scale-105`}
					onClick={() => dispatch({ type: 'view_rules_close', payload: { close: false } })}>
					<IoIosClose />
				</button>
			</div>
			<div className={`w-full flex flex-col gap-2 items-center justify-center`}>
				<img
					src={rulesImage}
					title='Rules'
					alt='Rules'
					className={'w-4/5'}
				/>
			</div>
		</section>
	);
}
