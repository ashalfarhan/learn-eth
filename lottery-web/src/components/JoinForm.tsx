import { ethers } from 'ethers';
import { FormEvent, useState } from 'react';
import { useWeb3 } from '../context';

export const JoinForm = () => {
  const { contract } = useWeb3();
  const [state, setState] = useState({
    value: '',
    error: '',
    message: '',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setState(prev => ({
      ...prev,
      message: 'Waiting on transaction success...',
      error: '',
    }));

    const minVal = ethers.utils.parseEther('0.01');
    const entered = ethers.utils.parseEther(state.value);

    if (!entered.gte(minVal)) {
      setState(prev => ({
        ...prev,
        error: 'Please enter at least 0.01 ETH',
        message: '',
      }));
      return;
    }

    try {
      await contract.join({ value: entered });
      setState({
        message: 'You have been entered!',
        error: '',
        value: '',
      });
    } catch (error) {
      console.error('Failed to join', error);
      setState(prev => ({
        ...prev,
        error: error?.error?.message ?? "Something wen't wrong, check console",
        message: '',
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h4>Want to try your luck?</h4>
      <div>
        <label>Amount of ether to enter</label>
        <input
          placeholder="Min. 0.01 ETH"
          value={state.value}
          onChange={e => setState(prev => ({ ...prev, value: e.target.value }))}
        />
      </div>
      <button disabled={!state.value}>Enter</button>
      {state.error && (
        <span style={{ color: 'red' }}>{'❌ ' + state.error}</span>
      )}
      {state.message && <span>{'☑️ ' + state.message}</span>}
    </form>
  );
};
