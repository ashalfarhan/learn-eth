import { CheckIcon, CopyIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  SimpleGrid,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  useClipboard,
} from '@chakra-ui/react';
import { BigNumber, ethers } from 'ethers';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { ContributeForm } from '@app/components';
import { useCampaignContract, useToastApp } from '@app/hooks';
import { formatAddress } from '@app/utils';

function CampaignDetail() {
  const router = useRouter();
  const { query } = router;
  const address = Array.isArray(query.address) ? '' : query.address ?? '';

  const campaign = useCampaignContract(address);
  const toast = useToastApp();
  const [state, setState] = useState({
    manager: '',
    minimumContribution: BigNumber.from(0),
    balance: BigNumber.from(0),
    requestCount: BigNumber.from(0),
    approversCount: BigNumber.from(0),
  });
  const { onCopy, hasCopied } = useClipboard(state.manager);
  const fetchState = useCallback(async () => {
    try {
      const [
        minimumContribution,
        balance,
        requestCount,
        approversCount,
        manager,
      ] = await campaign.getSummary();
      setState({
        approversCount,
        balance,
        manager,
        minimumContribution,
        requestCount,
      });
    } catch (error) {
      console.error('Failed to fetchState', error);
    }
  }, [campaign]);

  useEffect(() => {
    if (!router.isReady) return;

    campaign.resolvedAddress
      .then(fetchState)
      .catch(() => void router.replace('/'));
  }, [fetchState, router, campaign]);

  const handleSubmit = async ({ value }: { value: string }) => {
    try {
      const tx = await campaign.contribute({
        value: ethers.utils.parseEther(value),
      });
      await tx.wait();
      toast({
        status: 'success',
        title: 'Contribute success!',
        description: `Transaction Hash: ${tx.hash}`,
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
    <Box p="4">
      <Heading>Campaign Details</Heading>
      <Flex gap="8">
        <Box flex="55%">
          <SimpleGrid columns={2} gap="12px" mt="4">
            <Stat border="1px" p="6" rounded="lg">
              <StatNumber>
                {formatAddress(state.manager)}
                <IconButton
                  ml="2"
                  size="sm"
                  aria-label="Copy Address"
                  onClick={onCopy}
                  icon={hasCopied ? <CheckIcon /> : <CopyIcon />}
                />
              </StatNumber>
              <StatLabel fontWeight="bold" color="gray.400" fontSize="16">
                Manager
              </StatLabel>
              <StatHelpText>
                The manager create this campaign and can create requests to
                withdraw money
              </StatHelpText>
            </Stat>
            <Stat border="1px" p="6" rounded="lg">
              <StatNumber>{state.minimumContribution.toNumber()}</StatNumber>
              <StatLabel fontWeight="bold" color="gray.400" fontSize="16">
                Minimum Contribution (wei)
              </StatLabel>
              <StatHelpText>
                You must contribute at least this much wei to become an approver
              </StatHelpText>
            </Stat>
            <Stat border="1px" p="6" rounded="lg">
              <StatNumber>{state.requestCount.toNumber()}</StatNumber>
              <StatLabel fontWeight="bold" color="gray.400" fontSize="16">
                Number of Requests
              </StatLabel>
              <StatHelpText>
                A request tries to withdraw money from the contract. Requests
                must be approved by approvers
              </StatHelpText>
            </Stat>
            <Stat border="1px" p="6" rounded="lg">
              <StatNumber>{state.approversCount.toNumber()}</StatNumber>
              <StatLabel fontWeight="bold" color="gray.400" fontSize="16">
                Number of Approvers
              </StatLabel>
              <StatHelpText>
                Number of people who have already donated to this campaign
              </StatHelpText>
            </Stat>
            <Stat border="1px" p="6" rounded="lg">
              <StatNumber>{ethers.utils.formatEther(state.balance)}</StatNumber>
              <StatLabel fontWeight="bold" color="gray.400" fontSize="16">
                Campaign Balance (ether)
              </StatLabel>
              <StatHelpText>
                The balance is how much money this campaign has left to spend.
              </StatHelpText>
            </Stat>
          </SimpleGrid>
          <Link
            href={{
              pathname: '/campaigns/[address]/requests',
              query: { address },
            }}
            passHref
          >
            <Button isFullWidth mt="4" colorScheme="cyan" as="a">
              View Requests
            </Button>
          </Link>
        </Box>
        <ContributeForm onSubmit={handleSubmit} />
      </Flex>
    </Box>
  );
}

export default CampaignDetail;
