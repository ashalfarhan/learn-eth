import { useWeb3React } from '@web3-react/core';
import { useMemo } from 'react';
import {
  getCampaignContract,
  getCampaignFactoryContract,
  getProviderOrSigner,
} from '@app/utils';

export const useCampaignFactoryContract = () => {
  const { library, account } = useWeb3React();
  return useMemo(
    () => getCampaignFactoryContract(getProviderOrSigner(library, account)),
    [library, account]
  );
};

export const useCampaignContract = (address: string) => {
  const { library, account } = useWeb3React();
  return useMemo(() => {
    return getCampaignContract(address, getProviderOrSigner(library, account));
  }, [library, address, account]);
};
