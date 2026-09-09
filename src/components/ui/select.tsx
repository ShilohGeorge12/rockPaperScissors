import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/utils';

interface SelectOption {
  value: string;
  label: string;
  emoji?: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  label?: string;
  className?: string;
  placeholder?: string;
}

const Select = ({ value, onChange, options, label, className, placeholder }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={cn('w-full relative', className)} ref={selectRef}>
      {label && (
        <label
          className='block text-sm font-medium mb-1.5'
          style={{ color: 'var(--text-secondary)' }}>
          {label}
        </label>
      )}

      <button
        type='button'
        onClick={() => setIsOpen(!isOpen)}
        className='w-full flex items-center justify-between h-11 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200'
        style={{
          background: 'var(--bg-glass)',
          color: selectedOption ? 'var(--text-primary)' : 'var(--text-muted)',
          border: '1px solid var(--border-glass)',
        }}>
        <span>
          {selectedOption?.emoji && selectedOption.emoji + ' '}
          {selectedOption?.label || placeholder || 'Select...'}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className='text-xs opacity-60'>
          ▼
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className='absolute z-50 w-full mt-1 rounded-xl overflow-hidden'
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-glass)',
              boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
            }}>
            {options.map((option) => (
              <button
                key={option.value}
                type='button'
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full px-4 py-2.5 text-left text-sm font-medium transition-colors',
                  option.value === value
                    ? 'font-bold'
                    : 'hover:opacity-80'
                )}
                style={{
                  color: option.value === value ? 'var(--accent-primary)' : 'var(--text-primary)',
                  background: option.value === value ? 'var(--bg-glass)' : 'transparent',
                }}>
                {option.emoji && option.emoji + ' '}
                {option.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { Select };
