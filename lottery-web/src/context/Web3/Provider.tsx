import { ethers } from 'ethers';
import { PropsWithChildren, useState, useEffect, useMemo } from 'react';
import { Web3Context } from './Web3Context';
import { useEthereum } from './useEthereum';
import { LOTTERY_CONTRACT_ADDRESS } from '../../constants';
import abi from '../../abi.json';

export const Web3ContextProvider = (props: PropsWithChildren<{}>) => {
  const { signer, provider, account } = useEthereum();
  const [state, setState] = useState({
    manager: '',
    playersCount: 0,
    pricePool: 0n,
    message: '',
  });

  const contract = useMemo(() => {
    return new ethers.Contract(LOTTERY_CONTRACT_ADDRESS, abi, signer);
  }, [signer]);

  useEffect(() => {
    const initState = async () => {
      if (!signer || !provider) return;

      try {
        const manager = await contract.manager();
        const count = await contract.getTotalPlayers();
        const pricePool = await provider.getBalance(
          await contract.getAddress()
        );
        setState(prev => ({
          ...prev,
          manager: manager.toLowerCase(),
          playersCount: count.toNumber(),
          pricePool,
        }));
      } catch (error) {
        console.error('Failed to init lottery state:', error);
      }
    };

    initState();
  }, [contract, signer, provider]);

  const values = {
    ...state,
    account,
    contract,
  };

  return <Web3Context.Provider value={values} {...props} />;
};
