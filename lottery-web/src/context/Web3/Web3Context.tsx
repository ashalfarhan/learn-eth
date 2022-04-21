import { BigNumber, ethers } from 'ethers';
import { createContext } from 'react';

export type Web3ContextValue = {
  account: string;
  manager: string;
  playersCount: number;
  pricePool: BigNumber;
  contract: ethers.Contract;
};

export const Web3Context = createContext<Web3ContextValue | null>(null);
