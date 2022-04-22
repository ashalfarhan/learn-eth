import { useState } from 'react';
import type { Web3ContextValue } from '../context';

type DrawWinnerProps = {
  pickWinner: () => Promise<void>;
} & Pick<Web3ContextValue, 'playersCount'>;

export const DrawWinner = ({ pickWinner, playersCount }: DrawWinnerProps) => {
  const [state, setState] = useState({
    error: '',
    message: '',
  });

  const handlePickWinner = async () => {
    try {
      await pickWinner();
      setState(prev => ({
        ...prev,
        message: 'A winner has been picked!',
        error: '',
      }));
    } catch (error) {
      console.error('Failed to draw winner', error);
      setState(prev => ({
        ...prev,
        error: error?.error?.message ?? "Something wen't wrong, check console",
        message: '',
      }));
    }
  };

  return (
    <div>
      <h4>Ready to pick a winner?</h4>
      <button onClick={handlePickWinner} disabled={playersCount <= 0}>
        Pick a winner!
      </button>
      <hr />
      {state.error && (
        <span style={{ color: 'red' }}>{'❌ ' + state.error}</span>
      )}
      {state.message && <span>{'☑️ ' + state.message}</span>}
    </div>
  );
};
