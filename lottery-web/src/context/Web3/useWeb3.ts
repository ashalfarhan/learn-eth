import { useContext } from 'react';
import { Web3Context } from './Web3Context';

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be called inside Web3Provider');
  }
  return context;
};
