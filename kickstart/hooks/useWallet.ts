import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import {
  NoEthereumProviderError,
  UserRejectedRequestError,
} from '@web3-react/injected-connector';
import { useCallback } from 'react';
import { injected } from '@app/utils';
import { useToastApp } from './useToastApp';

export const useWallet = () => {
  const { activate, deactivate } = useWeb3React();
  const toast = useToastApp();

  const login = useCallback(() => {
    activate(injected, error => {
      if (error instanceof UnsupportedChainIdError) {
        toast({
          title: 'Unsupported Network',
          description:
            'Your wallet not connected to the network that we support (Rinkeby)',
          status: 'error',
        });
        return;
      }

      if (error instanceof NoEthereumProviderError) {
        toast({
          description: "Looks like you don't have an ethereum wallet installed",
          status: 'error',
        });
        return;
      }

      if (error instanceof UserRejectedRequestError) {
        toast({
          title: 'Authorization Error',
          description: 'Please authorize to access your account',
          status: 'error',
        });
      }
    });
  }, [toast, activate]);

  const logout = () => {
    deactivate();
  };

  return { login, logout };
};
