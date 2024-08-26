import { createPublicClient, http, createWalletClient, toHex, hexToString } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import * as dotenv from "dotenv";
dotenv.config();
import { abi, bytecode } from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";

const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const deployerPrivateKey = process.env.PRIVATE_KEY || "";

async function main() {

  // Reitrive parameters
  const parameters = process.argv.slice(2);
  if (!parameters || parameters.length < 4)
    throw new Error("Parameters not provided");
  const tokenContractAddress = parameters[0];
  if (!tokenContractAddress) throw new Error("Minter address not provided");
  if (!/^0x[a-fA-F0-9]{40}$/.test(tokenContractAddress))
    throw new Error("Invalid minter address");
  const proposals = parameters.slice(1);
  if (!proposals || proposals.length < 1)
    throw new Error("Proposals not provided");

  // creat public client
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });
  const blockNumber = await publicClient.getBlockNumber();
  console.log("Last block number:", blockNumber);

  // Create a wallet client
  const account = privateKeyToAccount(`0x${deployerPrivateKey}`);
  const deployer = createWalletClient({
    account,
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });
  console.log("Deployer address:", deployer.account.address);

  // Deploy contract
  console.log("\nDeploying TokenizedBallot contract");
  const hash = await deployer.deployContract({
    abi,
    bytecode: bytecode as `0x${string}`,
    args: [
      proposals.map((prop) => toHex(prop, { size: 32 })),
      tokenContractAddress,
      BigInt(Number(blockNumber) - 1)
    ],
  });
  console.log("Transaction hash:", hash);
  console.log("Waiting for confirmations...");
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log("Ballot contract deployed to:", receipt.contractAddress);

  // Read information from deployed contract
  if (!receipt.contractAddress)
    throw new Error("Contract address not found in receipt");
  console.log("Proposals: ");
  for (let index = 0; index < proposals.length; index++) {
    const proposal = (await publicClient.readContract({
      address: receipt.contractAddress,
      abi,
      functionName: "proposals",
      args: [BigInt(index)],
    })) as any[];
    const name = hexToString(proposal[0], { size: 32 });
    console.log({ index, name, proposal });
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});