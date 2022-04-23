import { AddIcon } from '@chakra-ui/icons';
import {
  Button,
  ButtonGroup,
  Container,
  Flex,
  IconButton,
  Text,
} from '@chakra-ui/react';
import Link from 'next/link';
import { PropsWithChildren } from 'react';

export const Layout = (props: PropsWithChildren<{}>) => {
  return (
    <Container maxW="90vw">
      <Flex
        align="center"
        justify="space-between"
        as="header"
        p="4"
        shadow="lg"
        bg="blackAlpha.500"
        rounded="xl"
      >
        <Link href="/" passHref>
          <Text fontSize="22" as="a" fontWeight="semibold">
            CrowdCoin
          </Text>
        </Link>
        <ButtonGroup isAttached>
          <Link href="/" passHref>
            <Button as="a">Campaigns</Button>
          </Link>
          <Link href="/campaigns/new" passHref>
            <IconButton aria-label="Create" icon={<AddIcon />} as="a" />
          </Link>
        </ButtonGroup>
      </Flex>
      {props.children}
    </Container>
  );
};
