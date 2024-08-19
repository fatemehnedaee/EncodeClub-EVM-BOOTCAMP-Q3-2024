# Weekend Project 1

- Interact with “HelloWorld.sol” within your group to change message strings and change owners
- Write a report with each function execution and the transaction hash, if successful, or the revert reason, if failed

Try running some of the following tasks:

1. **success** Deployed `HelloWorld.sol` contract on Sepolia testnet
    1. > Txn Hash:  
        > 0x8a11192dcae1dc30a6ba317c5b2e8031fe95481a8ab165a85343856bb9db9f81   
    2. > Contract Address:  
        > 0x511AefbB15AE63d982c8836031e5a4DD1ba93717
        
<br/>

2. Call `setText` Function
    1. **Success** When we called this function by owner.
        - > Txn Hash:  
            > 0x25d8f2d7cade92e135081f7fd7cd499ee7e62f7186a886282007fd12e9f9f274
        - > Storage:  
            > Before: Hello World  
            > After: Hello There  

    2. **Fail** When we called this function by non-owner.
        - > Txn Hash:  
            > 0xda12fa8f7d5ce12e7096802f231d4bb58717b771994f93d4fd2e1dd8e99e0da2  
        - > Fail with error 'Caller is not the owner'  
            > We set `onlyOwner` modifier in `setText` function, So only owner can call this function.  

    3. **Success** After changed owner by `transferOwnership` function and called this function by new owner.
        - > Txn Hash:  
            > 0x0e5bae11af869e83cce90b962027e6acd4fea299a768152b74c04abfe59c4ca9
        - > Storage:  
            > Before: Hello There  
            > After: Hello  
        
<br/>

3. Call `transferOwnership` Function
     1. **Success** When we called this function by owner.
        - > Txn Hash:  
            > 0x473b776a084e068695692e5d844a4b8749ae7737932d8cf13a2dd498740c82f1
        - > Storage:  
            > Before: 0x1c15302253ed0a04787eed0c4045a789dbcd2c78 (old owner)  
            > After: 0x980ebe77b9cd41370ed0a6237abba40d34e10257 (new owner)

    2. **Fail** When we called this function by non-owner.
        - > Txn Hash:  
            > 0x40b032bb7c8a700589e8d272372103e8b9b80c9bd28100c902148aacfc21a3f4  
        - > Fail with error 'Caller is not the owner'  
            > We set `onlyOwner` modifier in `transferOwnership` function, So only owner can call this function.  
