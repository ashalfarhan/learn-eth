import { ethers } from 'ethers';

type Event = {
  (ev: 'chainChanged', cb: (val: string) => void): void;
  (ev: 'accountsChanged', cb: (accounts: string[]) => void): void;
};

declare global {
  interface Window {
    ethereum?: ethers.Eip1193Provider & {
      on: Event;
      removeListener: Event;
    };
  }
}
