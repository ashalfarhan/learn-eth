import { AddIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Heading,
  List,
  ListItem,
  VStack,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCampaignFactoryContract } from '@app/hooks';

const Home = () => {
  const [campaigns, setCampaigns] = useState<string[]>([]);
  const campaignFactory = useCampaignFactoryContract();
  useEffect(() => {
    campaignFactory.getCampaigns().then(setCampaigns);
  }, [campaignFactory]);
  return (
    <Box p="8">
      <Heading size="lg">Open Campaigns</Heading>
      <Flex py="4" gap="8">
        <List flex="1" spacing="4">
          {campaigns.map(campaign => (
            <ListItem
              p="4"
              shadow="2xl"
              border="1px"
              rounded="lg"
              key={campaign}
            >
              <VStack spacing="4" align="start">
                <Heading size="md">{campaign}</Heading>
                <Link href={`/campaigns/${campaign}`} passHref>
                  <Button variant="link" colorScheme="blue" as="a">
                    View Details
                  </Button>
                </Link>
              </VStack>
            </ListItem>
          ))}
        </List>
        <Link href="/campaigns/new" passHref>
          <Button leftIcon={<AddIcon />} colorScheme="blue" as="a">
            Create Campaign
          </Button>
        </Link>
      </Flex>
    </Box>
  );
};

export default Home;
