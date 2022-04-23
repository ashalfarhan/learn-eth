import { ExternalProvider } from '@ethersproject/providers';

declare global {
  export interface Window {
    ethereum?: ExternalProvider;
  }
}
