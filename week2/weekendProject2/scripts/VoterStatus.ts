import { createPublicClient, http, hexToString } from "viem";
import { abi } from "../artifacts/contracts/Ballot.sol/Ballot.json";
import { sepolia } from "viem/chains";
import * as dotenv from "dotenv";
dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";

async function main() {

// Reitrive parameters
const parameters = process.argv.slice(2);
if (!parameters || parameters.length < 2)
  throw new Error("Parameters not provided");
const contractAddress = parameters[0] as `0x${string}`;
if (!contractAddress) throw new Error("Contract address not provided");
if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
  throw new Error("Invalid contract address");
const walletAddress = parameters[1] as `0x${string}`;
if (!walletAddress) throw new Error("Voter address not provided");
if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress))
  throw new Error("Invalid voter address");

// Status the wallet address
const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
});
  const voter = (await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "voters",
    args: [walletAddress],
  })) as any[];
  const proposal = (await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "proposals",
    args: [BigInt(voter[3])],
  })) as any[];
console.log(`Voter is ${walletAddress}:
    weight: ${voter[0]}
    voted: ${voter[1]}
    delegate: ${voter[2] == 0 ? 0 : voter[2]}
    vote: ${hexToString(proposal[0], { size: 32 })}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});