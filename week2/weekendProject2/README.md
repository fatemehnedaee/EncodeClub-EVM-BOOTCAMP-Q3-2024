# Weekend Project 2
- Develop and run scripts for “Ballot.sol” within your group to give voting rights, casting votes, delegating votes and querying results  
- Write a report with each function execution and the transaction hash, if successful, or the revert reason, if failed  
- Submit your weekend project by filling the form provided in Discord  
- Submit your code in a github repository in the form  

## Ballot Contract

This contract demonstrates several Solidity features by implementing a voting system.   
The contract creator, acting as the chairperson, grants voting rights to individual addresses.  
Voters can either cast their vote directly or delegate it to someone they trust. After voting concludes, can identified the option with the most votes.  

Try running some of the following tasks:  

1. **success** Deployed `Ballot.sol` contract on Sepolia testnet
    - [Deploy Script](https://github.com/fatemehnedaee/EncodeClub-EVM-BOOTCAMP-Q3-2024/blob/main/week2/weekendProject2/scripts/DeployWithViem.ts)  
    - Txn Hash:  
        > 0xbefecfae3bb432ce8743ccd3f1f19b3c2d7b11c5e559689be5bdff368bf39938 
    - Contract Address:  
        > 0xb3bcbe6f728d64a1157c4b0436facd34b77f9cf8
    - Proposals:  
        1. > index: 0  
            name: 'uniswap'  
        2. > index: 1  
            name: 'pancakeswap'  
        3. > index: 2  
            name: 'syncswap'  
        
<br/>

2. Call `giveRightToVote` Function
    - [GiveRightToVote Script](https://github.com/fatemehnedaee/EncodeClub-EVM-BOOTCAMP-Q3-2024/blob/main/week2/weekendProject2/scripts/GiveRightToVote.ts) 
    - **Success** When we called this function by owner.
        - Txn Hash:  
            > 0x18276726edda91900d2297383f484fe655c4d0cff163358aed3f2a757e7f68d8 

    - **Fail** 
        - When we called this function by non-owner.
        - When the voter already voted.
        - When voter have right to vote.
 
<br/>

3. Call `delegate` Function
    - [Delegate Script](https://github.com/fatemehnedaee/EncodeClub-EVM-BOOTCAMP-Q3-2024/blob/main/week2/weekendProject2/scripts/Delegate.ts)
    - **Success**  
        - Txn Hash:  
            > 0x7cc55da8c16dc0c4480e37b6cf5ec12928242db001061f884e3feda7e2fae90d

    - **Fail** 
        - When sender have no right to vote.
        - When sender already voted.
        - When Self-delegation is disallowed.  
        - When delegatee have no right to vote.
 
<br/>

4. Call `vote` Function
    - [CastVote Script](https://github.com/fatemehnedaee/EncodeClub-EVM-BOOTCAMP-Q3-2024/blob/main/week2/weekendProject2/scripts/CastVote.ts)
    - **Success**  
        - Txn Hash:  
            > 0xa3d2eea7b18c203d183f321e98067a43563b78e8a9d3441f751db073a3f01697  

    - **Fail** 
        - When sender have no right to vote.
        - When sender already voted.  
 
<br/>

5. Intract with `VoterStatus` Script
    - This script receives a wallet address and returns status of it 
    - [VoterStatus Script](https://github.com/fatemehnedaee/EncodeClub-EVM-BOOTCAMP-Q3-2024/blob/main/week2/weekendProject2/scripts/VoterStatus.ts) 
        > Voter is 0x2A058DBED4C8D81598Fb164bf080b4Eea10960C6:  
            weight: 1  
            voted: true  
            delegate: 0x7679DB61BF2b5B2B0A410c8E8ec3eaA0B95665B5  
            vote: uniswap  
 
<br/>

6. Intract with `ProposalStatus` Script
    - This script receives a index proposal and returns status of it  
    - [ProposalStatus Script](https://github.com/fatemehnedaee/EncodeClub-EVM-BOOTCAMP-Q3-2024/blob/main/week2/weekendProject2/scripts/ProposalStatus.ts) 
        1. > Proposal0:  
            Name: uniswap  
            Vote Count: 1  
        2. > Proposal1:  
            Name: pancakeswap  
            Vote Count: 2    
        3. > Proposal2:  
            Name: syncswap  
            Vote Count: 0      


