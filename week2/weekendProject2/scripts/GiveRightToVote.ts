import { createPublicClient, http, createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { abi } from "../artifacts/contracts/Ballot.sol/Ballot.json";
import { sepolia } from "viem/chains";
import * as dotenv from "dotenv";
dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const deployerPrivateKey = process.env.PRIVATE_KEY || "";

async function main() {

  // Reitrive parameters
  const parameters = process.argv.slice(2);
  if (!parameters || parameters.length < 2)
    throw new Error("Parameters not provided");
  const contractAddress = parameters[0] as `0x${string}`;
  if (!contractAddress) throw new Error("Contract address not provided");
  if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
    throw new Error("Invalid contract address");
  const voterAddress = parameters[1] as `0x${string}`;
  if (!voterAddress) throw new Error("Voter address not provided");
  if (!/^0x[a-fA-F0-9]{40}$/.test(voterAddress))
    throw new Error("Invalid voter address");

  // Intract with deployed contract and Give rights to vote to a address
  console.log("Give right to vote to: ", parameters[1] as `0x${string}`);
  const account = privateKeyToAccount(`0x${deployerPrivateKey}`);
  const deployer = createWalletClient({
    account,
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });
  const hash = await deployer.writeContract({
    address: contractAddress,
    abi,
    functionName: "giveRightToVote",
    args: [voterAddress],
  });

  // Get receipt transaction with a public client
  console.log("Transaction hash:", hash);
  console.log("Waiting for confirmations...");
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  if (receipt.status) {
    console.log("Transaction confirmed");
  } else {
    console.log("Transaction failed");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});