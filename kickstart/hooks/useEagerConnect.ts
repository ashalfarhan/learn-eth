import { useEffect } from 'react';
import { injected } from '@app/utils';
import { useWallet } from './useWallet';

export const useEagerConnect = () => {
  const { login } = useWallet();

  useEffect(() => {
    injected.isAuthorized().then(isAuthorized => {
      if (isAuthorized) {
        login();
      }
    });
  }, [login]);
};
