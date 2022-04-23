import {
  Box,
  Button,
  Flex,
  Heading,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { RequestRow } from '@app/components';
import { useCampaignContract, useToastApp } from '@app/hooks';
import { CampaignRequest } from '@app/types';

export default function CampaignRequests() {
  const router = useRouter();
  const { query } = router;
  const address = Array.isArray(query.address) ? '' : query.address ?? '';

  const campaign = useCampaignContract(address);
  const toast = useToastApp();
  const { account } = useWeb3React();
  const [requests, setRequests] = useState<CampaignRequest[]>([]);
  const [manager, setManager] = useState('');
  const [counts, setCounts] = useState({
    request: 0,
    approvers: 0,
  });
  const isManager = manager === account?.toLowerCase();
  const fetchState = useCallback(async () => {
    try {
      const reqCount = (await campaign.requestCount()).toNumber();
      const appCount = (await campaign.approversCount()).toNumber();
      const manager = await campaign.manager();
      const promises = Array(reqCount)
        .fill(null)
        .map((_, index) => campaign.requests(index));
      setRequests(await Promise.all(promises));
      setCounts({
        approvers: appCount,
        request: reqCount,
      });
      setManager(manager.toLowerCase());
    } catch (error) {
      console.error('Failed to fetchState', error);
    }
  }, [campaign]);

  useEffect(() => {
    if (!router.isReady) return;

    campaign.resolvedAddress
      .then(fetchState)
      .catch(() => void router.replace('/'));
  }, [campaign, router, fetchState]);

  const handleApprove = async (id: string) => {
    try {
      const tx = await campaign.approveRequest(id);
      await tx.wait();
      toast({
        status: 'success',
        description: 'Approve Request success!',
      });
      await fetchState();
    } catch (error) {
      const message = error.error?.message ?? error.message;
      toast({
        status: 'error',
        description: message ?? "Something wen't wrong",
      });
    }
  };

  const handleFinalize = async (id: string) => {
    try {
      const tx = await campaign.finalizeRequest(id);
      await tx.wait();
      toast({
        status: 'success',
        description: 'Finalize Request success!',
      });
      await fetchState();
    } catch (error) {
      const message = error.error?.message ?? error.message;
      toast({
        status: 'error',
        description: message ?? "Something wen't wrong",
      });
    }
  };

  return (
    <Box p="2">
      <Flex>
        <Heading flex="1" size="lg">
          Requests
        </Heading>
        {isManager && (
          <Link
            href={{
              pathname: '/campaigns/[address]/new',
              query: { address },
            }}
            passHref
          >
            <Button colorScheme="blue" as="a">
              Add Request
            </Button>
          </Link>
        )}
      </Flex>
      <TableContainer mt="4">
        <Table variant="simple">
          <TableCaption>Found {counts.request} requests.</TableCaption>
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Description</Th>
              <Th>Amount (ETH)</Th>
              <Th>Recipient</Th>
              <Th>Approval Count</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {requests.map((request, index) => (
              <RequestRow
                key={index}
                id={index + ''}
                request={request}
                approversCount={counts.approvers}
                isManager={isManager}
                onApprove={handleApprove}
                onFinalize={handleFinalize}
              />
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}
