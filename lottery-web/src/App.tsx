import { ethers } from 'ethers';
import { DrawWinner, JoinForm } from './components';
import { useWeb3 } from './context';

function App() {
  const { manager, pricePool, playersCount, account } = useWeb3();
  const isManager = account === manager;
  return (
    <div>
      <h1>Welcome to a Simple Lottery Contract </h1>
      <span>
        {account
          ? '🚀 Connected with: ' +
            account.slice(0, 5) +
            '...' +
            account.slice(-4)
          : '❌ Your wallet is not connected'}
      </span>
      <p>
        This contract is managed by {manager}. There are currently{' '}
        {playersCount} people entered, competing to win{' '}
        {ethers.utils.formatEther(pricePool)} ETH.
      </p>
      <hr />
      <JoinForm />
      {isManager && <DrawWinner />}
    </div>
  );
}

export default App;
