# Weekend Project 5  
Implementation details  
- Implement ownable
- Owner deploy lottery and define betting price and fee
- Owner start lottery
   - Define a block timestamp target
- Players must buy an ERC20 with ETH
- Players pay ERC20 to bet
   - Only possible before block timestamp met
- Anyone can roll the lottery
   - Only after block timestamp target is met
   - Randomness from RANDAO
- Winner receives the pooled ERC20 minus fee
- Owner can withdraw fees and restart lottery
- Players can burn ERC20 tokens and redeem ETH


## Lottery contract
A lottery smart contract is a decentralized application (dApp) built on blockchain technology that facilitates the creation and execution of a lottery system in a trustless and transparent manner.   
Participants buy a specified amount of lottery token then they can bet. This action registers them as a participant in the lottery.   
After close lottery, The smart contract uses a method to select a random winner from the pool of participants. Depending on the blockchain platform, randomness can be achieved via various techniques.  
Once a winner is selected, winner can withdraw the total prize pool.   

## Getting Startred

- Create your .env file
   ```bash
      PRIVATE_KEY=****************************************************************
      RPC_ENDPOINT_URL="https://****************************************************************"
   ```  
- Running deploy with hardhat  
   ```bash
      npx hardhat run scripts/DeploywithHardhat.ts
   ```  

- Running deploy on testnet  
   ```bash
      npx hardhat run scripts/DeploywithViem.ts --network sepolia
   ```