import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightAddon,
  VStack,
} from '@chakra-ui/react';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useCampaignContract, useToastApp } from '@app/hooks';

export default function CreateCampaignRequest() {
  const router = useRouter();
  const { query } = router;
  const address = Array.isArray(query.address) ? '' : query.address ?? '';

  const campaign = useCampaignContract(address);
  const toast = useToastApp();
  const [loading, setLoading] = useState(false);
  const [{ description, value, recipient }, setFormState] = useState({
    value: '',
    description: '',
    recipient: '',
  });

  useEffect(() => {
    if (!router.isReady) return;

    campaign.resolvedAddress.catch(() => void router.replace('/'));
  }, [router, campaign]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormState(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const tx = await campaign.createRequest(
        description,
        ethers.utils.parseEther(value),
        recipient
      );
      await tx.wait();
      toast({
        status: 'success',
        title: 'Campaign Request creation success!',
        description: `Transaction Hash: ${tx.hash}`,
      });
      await router.push({
        pathname: '/campaigns/[address]/requests',
        query: { address },
      });
    } catch (error) {
      const message = error.error?.message ?? error.message;
      toast({
        status: 'error',
        description: message ?? "Something wen't wrong",
      });
    }
    setLoading(false);
  };

  return (
    <Box py="12" maxW="600px" mx="auto">
      <Heading size="md" mb="4" textAlign="center">
        Create a request
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing="2">
          <FormControl>
            <FormLabel>Description</FormLabel>
            <Input
              placeholder="Enter description"
              value={description}
              name="description"
              onChange={handleChange}
            />
            <FormHelperText>What this request is used for</FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel>Value</FormLabel>
            <InputGroup>
              <Input
                placeholder="Enter the amount of value"
                name="value"
                type="number"
                onChange={handleChange}
                value={value}
              />
              <InputRightAddon>ETH</InputRightAddon>
            </InputGroup>
            <FormHelperText>
              The amount of ETH to be transfered to recipient
            </FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel>Recipient</FormLabel>
            <Input
              placeholder="Enter recipient address"
              name="recipient"
              onChange={handleChange}
              value={recipient}
            />
            <FormHelperText>
              Beneficiary of the value to be transfered
            </FormHelperText>
          </FormControl>
          <Button
            type="submit"
            isLoading={loading}
            isFullWidth
            colorScheme="blue"
            disabled={!description || !recipient || !value}
          >
            Create!
          </Button>
        </VStack>
      </form>
    </Box>
  );
}
