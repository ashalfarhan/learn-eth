import { CheckIcon } from '@chakra-ui/icons';
import { Tr, Td, Button } from '@chakra-ui/react';
import { ethers } from 'ethers';
import { useState } from 'react';
import { CampaignRequest } from '@app/types';
import { formatAddress } from '@app/utils';

type RequestRowProps = {
  request: CampaignRequest;
  id: string;
  approversCount: number;
  isManager: boolean;
  onApprove: (id: string) => Promise<void>;
  onFinalize: (id: string) => Promise<void>;
};

export const RequestRow = ({
  request,
  id,
  approversCount,
  isManager,
  onApprove,
  onFinalize,
}: RequestRowProps) => {
  const [loading, setLoading] = useState(false);
  const wrapCall = (fn: (id: string) => Promise<void>) => {
    return async () => {
      setLoading(true);
      await fn(id);
      setLoading(false);
    };
  };
  return (
    <Tr>
      <Td>{id}</Td>
      <Td>{request.description}</Td>
      <Td>{ethers.utils.formatEther(request.value)}</Td>
      <Td>{formatAddress(request.recipient)}</Td>
      <Td>
        {request.approvalCount.toNumber()}/{approversCount}
      </Td>
      <Td>
        {isManager ? (
          <Button
            onClick={wrapCall(onFinalize)}
            isLoading={loading}
            disabled={request.complete}
          >
            🚀&nbsp;&nbsp;Finalize
          </Button>
        ) : (
          <Button
            colorScheme="teal"
            leftIcon={<CheckIcon />}
            onClick={wrapCall(onApprove)}
            isLoading={loading}
            disabled={request.complete}
          >
            Approve
          </Button>
        )}
      </Td>
    </Tr>
  );
};
