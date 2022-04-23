import { UseToastOptions, useToast } from '@chakra-ui/react';

const toastConfig: UseToastOptions = {
  position: 'top-right',
  isClosable: true,
  variant: 'solid',
};

export const useToastApp = (options: UseToastOptions = {}) => {
  return useToast({ ...toastConfig, ...options });
};
