import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
  VStack,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import { useCampaignFactoryContract, useToastApp } from '@app/hooks';

export default function NewCampaign() {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const contract = useCampaignFactoryContract();
  const toast = useToastApp();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const tx = await contract.createCampaign(value);
      await tx.wait();
      toast({
        status: 'success',
        title: 'Campaign creation success!',
        description: `Transaction Hash: ${tx.hash}`,
      });
      await router.push('/');
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
      <form onSubmit={handleSubmit}>
        <VStack spacing="4">
          <FormControl>
            <FormLabel>Minimum Contribution</FormLabel>
            <InputGroup>
              <Input
                type="number"
                onChange={e => setValue(e.target.value)}
                value={value}
              />
              <InputRightAddon>wei</InputRightAddon>
            </InputGroup>
            <FormHelperText>
              This will be minimum amount for every contributor to support your
              campaign
            </FormHelperText>
          </FormControl>
          <Button
            colorScheme="blue"
            isFullWidth
            type="submit"
            isLoading={loading}
            disabled={!value}
          >
            Create!
          </Button>
        </VStack>
      </form>
    </Box>
  );
}
