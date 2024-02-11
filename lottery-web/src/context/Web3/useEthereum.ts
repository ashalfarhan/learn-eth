import { ethers, BrowserProvider, type JsonRpcSigner } from 'ethers';
import { useState, useRef, useEffect } from 'react';

const { ethereum } = window;

export const useEthereum = () => {
  const [account, setAccount] = useState('');
  const provider = useRef<BrowserProvider>();
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
    if (!ethereum) return;

    const init = async () => {
      const _provider = new BrowserProvider(ethereum);
      signer.current = await _provider.getSigner();
      provider.current = _provider;
    };

    const handleAccountChange = (accs: string[]) => {
      setAccount(accs[0]);
    };

    const handleChainChange = (chain: string) => {
      if (chain !== '0x4') {
        alert('Please use Rinkeby testnet');
      }
    };

    void init();
    ethereum.on('accountsChanged', handleAccountChange);
    ethereum.on('chainChanged', handleChainChange);
    return () => {
      ethereum.removeListener('accountsChanged', handleAccountChange);
      ethereum.removeListener('chainChanged', handleChainChange);
    };
  }, []);

  useEffect(() => {
    const init = async () => {
      if (!provider.current) return;
      signer.current = await provider.current.getSigner();
    };
    init();
  }, [account]);

  return { account, signer: signer.current, provider: provider.current };
};
