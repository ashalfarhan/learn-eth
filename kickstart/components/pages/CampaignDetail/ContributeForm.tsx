import {
  Input,
  FormControl,
  FormHelperText,
  FormLabel,
  InputGroup,
  InputRightAddon,
  Button,
} from '@chakra-ui/react';
import { FormEvent, useState } from 'react';

type ContrubuteFormProps = {
  onSubmit: ({ value }: { value: string }) => Promise<void>;
};

export function ContributeForm({ onSubmit }: ContrubuteFormProps) {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit({ value });
    setLoading(false);
  };
  return (
    <form onSubmit={handleSubmit}>
      <FormControl mt="2">
        <FormLabel>Amount to Contribute</FormLabel>
        <InputGroup>
          <Input
            type="number"
            onChange={e => setValue(e.target.value)}
            value={value}
          />
          <InputRightAddon>ETH</InputRightAddon>
        </InputGroup>
        <FormHelperText>
          This will be the amount that you will give to this campaign
        </FormHelperText>
      </FormControl>
      <Button
        mt="2"
        colorScheme="yellow"
        type="submit"
        isLoading={loading}
        disabled={!value}
      >
        Contribute!
      </Button>
    </form>
  );
}
