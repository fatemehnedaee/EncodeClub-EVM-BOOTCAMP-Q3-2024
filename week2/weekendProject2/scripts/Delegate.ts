import { createPublicClient, http, createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { abi } from "../artifacts/contracts/Ballot.sol/Ballot.json";
import { sepolia } from "viem/chains";
import * as dotenv from "dotenv";
dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const senderPrivateKey = process.env.SENDER_PRIVATE_KEY || "";

async function main() {

// Reitrive parameters  
const parameters = process.argv.slice(2);
if (!parameters || parameters.length < 2)
  throw new Error("Parameters not provided");
const contractAddress = parameters[0] as `0x${string}`;
if (!contractAddress) throw new Error("Contract address not provided");
if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
  throw new Error("Invalid contract address");
const delegatAddress = parameters[1] as `0x${string}`;
if (!delegatAddress) throw new Error("Voter address not provided");
if (!/^0x[a-fA-F0-9]{40}$/.test(delegatAddress))
  throw new Error("Invalid voter address");

// Create wallet client
const account = privateKeyToAccount(`0x${senderPrivateKey}`);
const sender = createWalletClient({
  account,
  chain: sepolia,
  transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });
  
// Send transaction on user confirmation
console.log(`Is this address ${sender.account.address} delegate to ${delegatAddress} ? (y/n)`);
process.stdin.on("data", async function (d) {
  if(d.toString().trim().toLowerCase() != "n"){
    // Intract with deployed contract and delegate a address
    const hash = await sender.writeContract({
      address: contractAddress,
      abi,
      functionName: "delegate",
      args: [delegatAddress],
    });
    console.log("Transaction hash:", hash);
    console.log("Waiting for confirmations...");
    const publicClient = createPublicClient({
      chain: sepolia,
      transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
    });
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    if(receipt.status) {
      console.log("Transaction confirmed");
    }else {
      console.log("Transaction failed");
    }
  } else {
    console.log("Operation cancelled");
  }
  process.exit();
})
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});