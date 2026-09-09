import { IoIosClose } from 'react-icons/io';
import { useMycontext } from '../../context';
import rulesImage from '../../assets/images/image-rules.svg';
import { motion } from 'framer-motion';

export default function Rules() {
  const { dispatch } = useMycontext();
  return (
    <motion.section
      className='w-[95%] md:w-2/3 lg:w-1/3 p-6 glass-strong rounded-2xl flex flex-col items-center gap-4 cursor-default'
      onClick={(e) => e.stopPropagation()}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}>
      <div className='flex items-center justify-between w-full'>
        <p className='text-2xl font-display font-bold' style={{ color: 'var(--text-primary)' }}>RULES</p>
        <button
          type='button'
          className='w-10 h-10 rounded-xl flex items-center justify-center text-2xl transition-all hover:scale-110'
          style={{ color: 'var(--text-muted)' }}
          onClick={() => dispatch({ type: 'view_rules_close', payload: { close: false } })}>
          <IoIosClose />
        </button>
      </div>
      <div className='w-full flex flex-col gap-2 items-center justify-center'>
        <img src={rulesImage} title='Rules' alt='Rules' className='w-4/5' />
      </div>
    </motion.section>
  );
}
