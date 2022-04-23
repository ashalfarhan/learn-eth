export const formatAddress = (address: unknown) => {
  if (!address || typeof address !== 'string') return '0x000...00000';
  return address.slice(0, 5) + '...' + address.slice(-5);
};
