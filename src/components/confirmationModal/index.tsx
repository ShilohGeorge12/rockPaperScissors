import { motion } from 'framer-motion';
import { Button } from '../ui/button';

interface ConfirmationModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal = ({ title, message, onConfirm, onCancel }: ConfirmationModalProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      onClick={(e) => e.stopPropagation()}
      className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-md rounded-2xl shadow-2xl glass-strong'
      style={{ background: 'var(--bg-secondary)' }}>
      <div className='p-6'>
        <h3 className='text-2xl font-display font-bold mb-3' style={{ color: 'var(--text-primary)' }}>{title}</h3>
        <p className='mb-6' style={{ color: 'var(--text-secondary)' }}>{message}</p>
        <div className='flex gap-3 justify-end'>
          <Button variant='outline' onClick={onCancel}>Cancel</Button>
          <Button variant='destructive' onClick={onConfirm}>Confirm</Button>
        </div>
      </div>
    </motion.div>
  );
};
