import { Injectable } from '@nestjs/common';
import { Address, createPublicClient, createWalletClient, http, hexToString } from 'viem';
import { sepolia } from "viem/chains";
import { privateKeyToAccount } from 'viem/accounts';
import * as tokenJson from "./assets/MyToken.json";
import * as ballotJson from "./assets/TokenizedBallot.json";

@Injectable()
export class AppService {
  publicClient;
  walletClient;

  constructor() {
    this.publicClient = createPublicClient({
      chain: sepolia,
      transport: http(process.env.RPC_ENDPOINT_URL),
    });

    const account = privateKeyToAccount(`0x${process.env.PRIVATE_KEY}`);
    this.walletClient = createWalletClient({
      account,
      chain: sepolia,
      transport: http(process.env.RPC_ENDPOINT_URL)
    });
  }

  getTokenContractAddress(): Address {
    return process.env.TOKEN_ADDRESS as Address;
  }

  getBallotContractAddress() {
    return process.env.BALLOT_ADDRESS as Address;
  }

  async getTokenName(): Promise<string> {
    const name = await this.publicClient.readContract({
      address: this.getTokenContractAddress(),
      abi: tokenJson.abi,
      functionName: "name"
    });
    return name as string;
  }

  async getTotalSupply() {
    const totalSupplyBN = await this.publicClient.readContract({
      address: this.getTokenContractAddress(),
      abi: tokenJson.abi,
      functionName: "totalSupply"
    });
    const totalSupply = Number(totalSupplyBN);
    return totalSupply;
  }

  async getTokenBalance(address: string) {
    const balanceBN = await this.publicClient.readContract({
      address: this.getTokenContractAddress(),
      abi: tokenJson.abi,
      functionName: "balanceOf",
      args: [address],
    });
    const balance = Number(balanceBN);
    return balance;
  }

  async getTransactionReceipt(hash: string) {
    const receiptObject = await this.publicClient.waitForTransactionReceipt({
      hash: hash
    });
    return receiptObject;
  }

  getServerWalletAddress(): string {
    return this.walletClient.account.address;
  }

  async checkMinterRole(address: string): Promise<boolean> {
    const MINTER_ROLE = "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6";
    // const MINTER_ROLE =  await this.publicClient.readContract({
    //   address: this.getTokenContractAddress(),
    //   abi: tokenJson.abi,
    //   functionName: 'MINTER_ROLE'
    // });
    const hasRole = await this.publicClient.readContract({
      address: this.getTokenContractAddress(),
      abi: tokenJson.abi,
      functionName: 'hasRole',
      args: [MINTER_ROLE, address],
    });
    return hasRole;
  }

  async mintTokens(address: any, amount: any) {
    const mintHash = await this.walletClient.writeContract({
      address: this.getTokenContractAddress(),
      abi: tokenJson.abi,
      functionName: "mint",
      args: [address, amount],
    });
    if (await this.getTransactionReceipt(mintHash)) {
      console.log(mintHash)
      return {
        status: true,
        txHash: mintHash,
      }
    } else {
      return {
        status: false,
      };
    }

  }

  async getProposals() {
    // In Ballot contract should add three poroposal
    const proposals = [];
    for (let i = 0; i < 3; i++) {
      const proposal = await this.publicClient.readContract({
        address: this.getBallotContractAddress(),
        abi: ballotJson.abi,
        functionName: "proposals",
        args: [i],
      });
      proposal[0] = hexToString(proposal[0], { size: 32 });
      proposal[1] = Number(proposal[1]);
      proposals.push(proposal);
    }
    return proposals;
  }

}