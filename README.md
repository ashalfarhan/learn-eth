# Ethereum and Solidity

![Build and Test](https://github.com/ashalfarhan/learn-eth/actions/workflows/CI.yml/badge.svg)

> This is my repository to learn Ethereum, and Solidity Smart Contract

## Preview

- `lottery` https://haans-lottery.surge.sh

## Workspaces

This project is managed by [yarn workspace](https://classic.yarnpkg.com/lang/en/docs/workspaces/) to optimize dependency between different package

List of workspaces:

- `inbox` A simple Smart Contract for getting started.
- `lottery` A simple Lottery system that uses Smart Contract to manage winner, manager, and contibutors.
- `lottery-web` A web interface for interacting with `lottery` Contract.
- `kickstart` A clone of [Kickstarter](https://www.kickstarter.com/) but managed by Smart Contract to track where the money goes. This package contains Solidity and Next.js codebase.

## Getting started

- Clone this repo
  ```shell
  git clone https://github.com/ashalfarhan/learn-eth.git
  ```
- Install all required dependency
  ```shell
  yarn
  ```
- Make sure that the current version of this repo doesn't break

  ```shell
  # Build all the contracts to generate artifacts before test
  yarn inbox build
  yarn lottery build
  yarn kickstart build:contract

  # Run test for all packages
  yarn workspaces run test
  ```

- Note that `lottery` and `lottery-web` doesn't sync the artifacts, meaning when you change some of the Solidity Contract in `lottery` and compile to generate artifacts (ABI and bytecode), the `lottery-web` wouldn't reference the latest ABI, so you need to copy the generated ABI to `lottery-web/src/abi.json`.

Additional steps for `kickstart`:

- You need to have `NEXT_PUBLIC_INFURA_PROJECT_ID` env variable somewhere when developing the `kickstart` package, this will be used for the fallback provider (JsonRPC).

## Deployment

Each contract (except for `inbox`) have their dedicated `deploy` script located in the `scripts` directory. But is requires you to provide infura project id and project secret, also your wallet private key to deploy the contract.

> Note: Keep in mind that the deployment and other config should be set to the rinkeby testnet

- After you have your infura project id and project secret, place them to .env

  ```shell
  # Example for lottery contract
  touch .env
  echo "INFURA_PROJECT_ID = '<paste_project_id_here>'" >> .env
  echo "INFURA_PROJECT_SECRET = '<paste_project_secret_here>'" >> .env
  echo "MANAGER_PRIVATE_KEY = '<paste_exported_wallet_private_key_here>'" >> .env
  ```

- Then you can run the deploy script
  ```shell
  # Example for lottery contract
  yarn deploy
  ```
- If deployment success, the output of the above command should be something like this
  ```shell
  Contract address: 0x0000000000000000
  Deployment success with transaction hash: 0x0000000000000000
  ```
- Copy the contract address and save them somewhere to interact with that contract in the web interface, optionally to verify the deployment you can check the transaction hash in rinkeby etherscan.

- Make sure to copy and paste the deployed contract address to the relative web interface.

  For `lottery` contract

  ```ts
  // lottery-web/src/constants.ts
  export const LOTTERY_CONTRACT_ADDRESS = '<paste_contract_address_here>';
  ```

  For `kickstart` contract

  ```ts
  // kickstart/utils/contract.ts
  const CAMPAIGN_FACTORY_ADDRESS = '<paste_contract_address_here>';

  export function getCampaignFactoryContract(
    signer: Signer | Provider = getProvider()
  ) {
    return new Contract(
      CAMPAIGN_FACTORY_ADDRESS,
      CampaignFactoryAbi,
      signer
    ) as CampaignFactory;
  }
  ```

## Resources

- Average Time Taken in seconds for a block in order to be included to the Ethereum blockchain https://etherscan.io/chart/blocktime
- Visualization and/or playground about Blockchain https://andersbrownworth.com/blockchain/hash
- Ether converter
  - https://etherconverter.online
  - https://eth-converter.com
- Rinkeby faucet
  - https://faucets.chain.link/rinkeby
