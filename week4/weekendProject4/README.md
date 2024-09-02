# Weekend Project 4
- Complete the projects together with your group  
- Create a voting dApp to cast votes, delegate and query results on chain  
- Request voting tokens to be minted using the API  
- (bonus) Store a list of recent votes in the backend and display that on frontend  
- (bonus) Use an oracle to fetch off-chain data  
   - Use an oracle to fetch information from a data source of your preference  
   - Use the data fetched to create the proposals in the constructor of the ballot  

## Voting dApp integration guidelines
- Build the frontend using Scaffold ETH 2 as a base  
- Build the backend using NestJS to provide the Mint method  
   - Implement a single POST method  
      - Request voting tokens from API  
- Use these tokens to interact with the tokenized ballot  
- All other interactions must be made directly on-chain  

## Voting-Dapp
In this dapp, users gain voting power based on the number of tokens they hold and can vote on proposals. The ballot contract grants voting rights based on a predefined target block number. 
- Users can see token Information and vote power based on minted token.
- Users can see their vote power based on minted token, also can delegate their vote power to another user.  
- Users with the MINTER_ROLE can mint token. Additional members with the MINTER_ROLE can be added after deployment using the     token contract's functions; however, only individuals with the DEFAULT_ADMIN_ROLE have the authority to perform this action.  
- Users can see their past vote Power based on the target block number, Only voters who have been given voting rights can cast vote, based on the target block number(BlockNumber before creating a proposal).  
- Users can see result proposals.  

## Getting Startred

- Create your .env file
   ```bash
      PRIVATE_KEY=****************************************************************
      RPC_ENDPOINT_URL="https://****************************************************************"
      TOKEN_ADDRESS="0xe8e5e16e46023ddb687a6e037168bd39f8d7e362"
      BALLOT_ADDRESS="0x34fa53e700da231781f64b48b22373f1db92d359"
   ```  
- Running Backend  
   ```bash
      cd backend/project-name
      npm install
      npm run start:dev
   ```  

- Running Frontend  
   ```bash
      cd frontend/scaffold-eth-2
      yarn install
      yarn start
   ```
    


