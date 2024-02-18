import { BrowserProvider, type JsonRpcSigner } from 'ethers';
import { useState, useRef, useEffect } from 'react';

const { ethereum } = window;

export const useEthereum = () => {
  const [account, setAccount] = useState('');
  const provider = useRef<BrowserProvider>();
  const signer = useRef<JsonRpcSigner>();

  useEffect(() => {
    if (!ethereum) return;

    const init = async () => {
      const _provider = new BrowserProvider(ethereum);
      provider.current = _provider;
      const _signer = await _provider.getSigner();
      signer.current = _signer;
      setAccount(_signer.address);
    };

    const handleAccountChange = async () => {
      if (!provider.current) return;
      const _signer = await provider.current.getSigner();
      signer.current = _signer;
      setAccount(_signer.address);
    };

    void init();
    ethereum.on('accountsChanged', handleAccountChange);
    ethereum.on('chainChanged', init);
    return () => {
      ethereum.removeListener('accountsChanged', handleAccountChange);
      ethereum.removeListener('chainChanged', init);
    };
  }, []);

  return { account, signer: signer.current, provider: provider.current };
};
