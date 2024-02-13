interface ImageCaptionProps {
	src: string;
	caption: string;
	color: 'border-red-600' | 'border-blue-600' | 'border-yellow-600';
}

export function ImageCaption({ src, caption, color }: ImageCaptionProps) {
	const classname = ['border-red-600', 'border-blue-600', 'border-yellow-600'];
	classname.length;
	return (
		<div className='flex flex-col items-center justify-center gap-4'>
			<div className={`${color} border-[20px] rounded-[50%] p-6 bg-white/80`}>
				<img
					src={src}
					title={caption}
					alt={caption}
					className={'w-14'}
				/>
			</div>
			<p className='text-base text-white'> {caption}</p>
		</div>
	);
}
