# Weekend Project 3
- Complete the contracts together
- Develop and run scripts for “TokenizedBallot.sol” within your group to give voting tokens, delegating voting power, casting votes, checking vote power and querying results
- Write a report with each function execution and the transaction hash, if successful, or the revert reason, if failed
- Submit your weekend project by filling the form provided in Discord
- Share your code in a github repo in the submission form  

## TokenizedBallot Contract
In this contract, users gain voting power based on the number of tokens they hold and can vote on proposals. The ballot contract grants voting rights based on a predefined target block number.  

Try running some of the following tasks:  

### 1. Deploy `MyToken.sol` contract on Sepolia testnet
- > npx ts-node --files ./scripts/DeployTokenContract.ts
- [DeployTokenContract Script](https://github.com/fatemehnedaee/EncodeClub-EVM-BOOTCAMP-Q3-2024/blob/main/week3/weekendProject3/scripts/DeployTokenContract.ts)  
- Txn Hash:  
   > 0x35a94655d34bb3a48b4d8391ad009cc1693f51ce22a431cca8b6f2cce9dfe9a8 
- Contract Address:  
   > 0xe8e5e16e46023ddb687a6e037168bd39f8d7e362 
        
<br/>

### 2. Deploy `TokenizedBallot.sol` contract on Sepolia testnet
- > npx ts-node --files ./scripts/DeployTokenizedBallot.ts "tokenContractAddress" "proposal1" "proposal2" "proposal3"
- [DeployTokenizedBallot Script](https://github.com/fatemehnedaee/EncodeClub-EVM-BOOTCAMP-Q3-2024/blob/main/week3/weekendProject3/scripts/DeployTokenizedBallot.ts)  
- Txn Hash:  
   > 0x7052a103643049642fcf988ae32fcf9e9a32054fcee7c106844b9aa6506bb594 
- Contract Address:  
   > 0x34fa53e700da231781f64b48b22373f1db92d359
- Proposals:  
   1. > index: 0  
      name: 'uniswap'  
   2. > index: 1  
      name: 'pancakeswap'  
   3. > index: 2  
      name: 'syncswap'  
        
<br/>


### 3. Intract with `Mint` Script
- Users with the MINTER_ROLE can mint token. Additional members with the MINTER_ROLE can be added after deployment using the token contract's functions; however, only individuals with the DEFAULT_ADMIN_ROLE have the authority to perform this action.
- > npx ts-node --files ./scripts/Mint.ts "tokenContractAddress" "value"
- [Mint Script](https://github.com/fatemehnedaee/EncodeClub-EVM-BOOTCAMP-Q3-2024/blob/main/week3/weekendProject3/scripts/Mint.ts)     
- **Success**   
   - Txn Hash:    
     > 0x9a78a8aebce5bd74bd09ad8547b270a10bd380b88d8555d96fc2ce533eff3098  
 
<br/>

### 4. Intract with `SelfDelegate` Script
- After mint token, You should delegate yourself then you will have vote power.
- > npx ts-node --files ./scripts/SelfDelegate.ts "tokenContractAddress" "delegateAddress"  
- [SelfDelegate Script](https://github.com/fatemehnedaee/EncodeClub-EVM-BOOTCAMP-Q3-2024/blob/main/week3/weekendProject3/scripts/SelfDelegate.ts)     
- **Success**   
   - Txn Hash:    
      > 0x3e793e80a9027babb77a2d964ab4babcda1ac331144a62621c3839af569c3234  
 
<br/>

### 5. Intract with `GetVotePower` Script
- Returns the amount of votes that account had at a specific moment in the past.
- > npx ts-node --files ./scripts/GetVotePower.ts "tokenizedBallotcontractAddress" "voterAddress"  
- [GetVotePower Script](https://github.com/fatemehnedaee/EncodeClub-EVM-BOOTCAMP-Q3-2024/blob/main/week3/weekendProject3/scripts/GetVotePower.ts)     
- **Success** 
   > This address 0x249A892aDdB354E07F7F308275dFc1faae9707CB has 500 vote power.   
 
<br/>

### 6. Intract with `CastVote` Script
- Only voters who have been given voting rights can cast vote, based on the target block number.
- > npx ts-node --files ./scripts/CastVote.ts "tokenizedBallotcontractAddress" "proposalIndex" "voteCount"
- [CastVote Script](https://github.com/fatemehnedaee/EncodeClub-EVM-BOOTCAMP-Q3-2024/blob/main/week3/weekendProject3/scripts/CastVote.ts)
- **Success**   
   - Txn Hash:    
      > 0xefedd7d19519a36b2b6a56e70263721d804aeaef47bef76b87cb7a15304916e9  

<br/>

### 7. Intract with `QueryResult` Script
- Return the winner proposal  
- > npx ts-node --files ./scripts/QueryResult.ts "tokenizedBallotcontractAddress"
- [QueryResult Script](https://github.com/fatemehnedaee/EncodeClub-EVM-BOOTCAMP-Q3-2024/blob/main/week3/weekendProject3/scripts/QueryResult.ts) 
- **Success** 
   > Proposal 3: syncswap is winner with 50 vote count.        


