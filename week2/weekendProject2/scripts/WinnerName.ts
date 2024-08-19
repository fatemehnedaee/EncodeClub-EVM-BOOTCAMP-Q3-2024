import { createPublicClient, http, hexToString } from "viem";
import { abi } from "../artifacts/contracts/Ballot.sol/Ballot.json";
import { sepolia } from "viem/chains";
import * as dotenv from "dotenv";
dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";

async function main() {

// Reitrive parameters
const parameters = process.argv.slice(2);
if (!parameters || parameters.length < 1)
  throw new Error("Parameters not provided");
const contractAddress = parameters[0] as `0x${string}`;
if (!contractAddress) throw new Error("Contract address not provided");
if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
  throw new Error("Invalid contract address");

// Intract with deployed contract and reitrive winning proposal
const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
});
const winnername = (await publicClient.readContract({
  address: contractAddress,
  abi,
  functionName: "winnerName",
})) as any;
console.log(`Proposal ${hexToString(winnername, { size: 32 })} is winner`); 
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});