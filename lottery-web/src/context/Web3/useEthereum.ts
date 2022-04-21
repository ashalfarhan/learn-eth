import { ethers } from 'ethers';
import { useState, useRef, useEffect } from 'react';
import type { JsonRpcSigner, Web3Provider } from '@ethersproject/providers';

export const useEthereum = () => {
  const { ethereum } = window;
  const [account, setAccount] = useState('');
  const provider = useRef<Web3Provider>();
  const signer = useRef<JsonRpcSigner>();

  useEffect(() => {
    if (account) return;
    const getInitialAccount = async () => {
      if (!ethereum) return;
      if (!ethereum.request) return;
      try {
        const accounts = await ethereum.request({
          method: 'eth_requestAccounts',
        });
        setAccount(accounts[0]);
      } catch (error) {
        console.error('Failed to request accounts:', error);
      }
    };

    getInitialAccount();
  }, []);

  useEffect(() => {
    if (provider.current) return;
    if (!ethereum) return;

    provider.current = new ethers.providers.Web3Provider(ethereum);
    signer.current = provider.current.getSigner();
  }, []);

  useEffect(() => {
    if (!provider.current) return;
    signer.current = provider.current.getSigner();
  }, [account]);

  useEffect(() => {
    if (!ethereum) return;

    const handleAccountChange = (accs: string[]) => {
      setAccount(accs[0]);
    };
    const handleChainChange = (chain: string) => {
      if (chain !== '0x4') {
        alert('Please use Rinkeby testnet');
      }
    };

    ethereum.on('accountsChanged', handleAccountChange);
    ethereum.on('chainChanged', handleChainChange);

    return () => {
      ethereum.removeListener('accountsChanged', handleAccountChange);
      ethereum.removeListener('chainChanged', handleChainChange);
    };
  }, []);

  return { account, signer: signer.current, provider: provider.current };
};
