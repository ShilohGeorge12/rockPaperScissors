import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

import { useMycontext } from '../../context';
import { saveService } from '../../service/save.service';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

// Save Modal
interface SaveModalProps {
  onClose: () => void;
}

export const SaveModal = ({ onClose }: SaveModalProps) => {
  const { state } = useMycontext();
  const [saveName, setSaveName] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const name = saveName.trim() || ('Save ' + new Date().toLocaleDateString());
      await saveService.saveGame({
        saveName: name,
        matchType: state.matchType,
        difficulty: state.difficulty,
        theme: state.theme,
        score: state.score,
        playerWins: state.playerWins,
        cpuWins: state.cpuWins,
        roundsPlayed: state.roundsPlayed,
        gameHistory: state.gameHistory,
        sessionStats: state.sessionStats,
        isActive: true,
        completed: false,
      });
      toast.success('Game saved!');
      onClose();
    } catch {
      toast.error('Failed to save game');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      onClick={(e) => e.stopPropagation()}
      className='glass-strong rounded-2xl shadow-2xl w-[90%] max-w-md p-6'>
      <h3 className='text-2xl font-display font-bold mb-4' style={{ color: 'var(--text-primary)' }}>&#x1F4BE; Save Game</h3>

      <div className='mb-4 p-4 glass rounded-xl' style={{ border: '1px solid var(--border-glass)' }}>
        <p className='text-sm' style={{ color: 'var(--text-secondary)' }}>Current Game Summary</p>
        <p className='text-lg font-bold mt-1' style={{ color: 'var(--text-primary)' }}>Score: {state.score} | Rounds: {state.roundsPlayed}</p>
        <p className='text-sm' style={{ color: 'var(--text-muted)' }}>
          {state.matchType === 'single' ? 'Single Round' : state.matchType === 'bestOf3' ? 'Best of 3' : 'Best of 5'}
          {' • '}
          {state.difficulty.charAt(0).toUpperCase() + state.difficulty.slice(1)}
        </p>
      </div>

      <Input
        label='Save Name'
        type='text'
        value={saveName}
        onChange={(e) => setSaveName(e.target.value)}
        placeholder='My save...'
        className='mb-4'
      />

      <div className='flex gap-3 justify-end'>
        <Button variant='outline' onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </motion.div>
  );
};

// Load Modal
interface LoadModalProps {
  onClose: () => void;
  onLoad: (saveData: Record<string, unknown>) => void;
}

interface SaveEntry {
  _id: string;
  saveName: string;
  score: number;
  roundsPlayed: number;
  matchType: string;
  difficulty: string;
  updatedAt: string;
}

export const LoadModal = ({ onClose, onLoad }: LoadModalProps) => {
  const [saves, setSaves] = useState<SaveEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaves = async () => {
      try {
        const data = await saveService.getSaves();
        setSaves(data);
      } catch {
        toast.error('Failed to load saves');
      } finally {
        setLoading(false);
      }
    };
    fetchSaves();
  }, []);

  const handleLoad = async (saveId: string) => {
    try {
      const data = await saveService.getSave(saveId);
      onLoad(data);
      toast.success('Game loaded!');
      onClose();
    } catch {
      toast.error('Failed to load game');
    }
  };

  const handleDelete = async (saveId: string) => {
    try {
      await saveService.deleteSave(saveId);
      setSaves(saves.filter((s) => s._id !== saveId));
      toast.success('Save deleted');
    } catch {
      toast.error('Failed to delete save');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      onClick={(e) => e.stopPropagation()}
      className='glass-strong rounded-2xl shadow-2xl w-[90%] max-w-md p-6 max-h-[80vh] flex flex-col'>
      <h3 className='text-2xl font-display font-bold mb-4' style={{ color: 'var(--text-primary)' }}>&#x1F4C2; Load Game</h3>

      <div className='flex-1 overflow-y-auto space-y-3'>
        {loading ? (
          <p className='text-center py-8' style={{ color: 'var(--text-muted)' }}>Loading saves...</p>
        ) : saves.length === 0 ? (
          <p className='text-center py-8' style={{ color: 'var(--text-muted)' }}>No saves found</p>
        ) : (
          saves.map((save) => (
            <motion.div
              key={save._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className='p-4 glass rounded-xl flex justify-between items-center'
              style={{ border: '1px solid var(--border-glass)' }}>
              <div className='flex-1 min-w-0'>
                <p className='font-bold truncate' style={{ color: 'var(--text-primary)' }}>{save.saveName}</p>
                <p className='text-sm' style={{ color: 'var(--text-secondary)' }}>
                  Score: {save.score} | Rounds: {save.roundsPlayed} | {save.difficulty}
                </p>
                <p className='text-xs' style={{ color: 'var(--text-muted)' }}>{new Date(save.updatedAt).toLocaleDateString()}</p>
              </div>
              <div className='flex gap-2 ml-3'>
                <Button size='sm' onClick={() => handleLoad(save._id)}>Load</Button>
                <Button size='sm' variant='destructive' onClick={() => handleDelete(save._id)}>Delete</Button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <Button variant='outline' onClick={onClose} className='mt-4 w-full'>Close</Button>
    </motion.div>
  );
};
