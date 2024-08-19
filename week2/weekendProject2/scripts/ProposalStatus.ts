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
const proposalIndex = parameters[1];
if (isNaN(Number(proposalIndex))) throw new Error("Invalid proposal index");

// Status the proposal
const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
});
console.log("Proposal selected: ");
  const proposal = (await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "proposals",
    args: [BigInt(proposalIndex)],
  })) as any[];
  const name = hexToString(proposal[0], { size: 32 });
  console.log("You are selected", name);
  console.log("Confirm? (Y/n)");

// Send transaction on user confirmation
process.stdin.on("data", async function (d) {
  if (d.toString().trim().toLowerCase() != "n") {
    console.log(` Proposal${proposalIndex}:
        Name: ${name}
        Vote Count: ${proposal[1]}`);
  } else {
    console.log("Operation cancelled");
  }
  process.exit();
});
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});