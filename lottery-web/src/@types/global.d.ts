import { providers } from 'ethers';

type Event = {
  (ev: 'chainChanged', cb: (val: string) => void): void;
  (ev: 'accountsChanged', cb: (accounts: string[]) => void): void;
};

declare global {
  interface Window {
    ethereum?: providers.ExternalProvider & {
      on: Event;
      removeListener: Event;
    };
  }
}
