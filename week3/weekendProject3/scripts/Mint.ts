import { createPublicClient, http, createWalletClient, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { abi } from "../artifacts/contracts/MyToken.sol/MyToken.json";
import { sepolia } from "viem/chains";
import * as dotenv from "dotenv";
dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const deployerPrivateKey = process.env.PRIVATE_KEY || "";

async function main() {

    // Reitrive parameters
    const parameters = process.argv.slice(2);
    if (!parameters || parameters.length < 3)
        throw new Error("Parameters not provided");
    const tokenContractAddress = parameters[0] as `0x${string}`;
    if (!tokenContractAddress) throw new Error("Contract address not provided");
    if (!/^0x[a-fA-F0-9]{40}$/.test(tokenContractAddress))
        throw new Error("Invalid contract address");
    const minterAddress = parameters[1] as `0x${string}`;
    if (!minterAddress) throw new Error("Minter address not provided");
    if (!/^0x[a-fA-F0-9]{40}$/.test(minterAddress))
        throw new Error("Invalid minter address");
    const value = parameters[2];
    if (isNaN(Number(value))) 
        throw new Error("Invalid value");

    // Creae public client 
    const publicClient = createPublicClient({
        chain: sepolia,
        transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
    });
    const blockNumber = await publicClient.getBlockNumber();
    console.log("Last block number:", blockNumber);

    // Intract with deployed contract and mint token
    console.log(`Mint ${value.toString()} MTK to ${minterAddress}`)
    const account = privateKeyToAccount(`0x${deployerPrivateKey}`);
    const minter = createWalletClient({
        account,
        chain: sepolia,
        transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
    });
    const hash = await minter.writeContract({
        address: tokenContractAddress,
        abi,
        functionName: "mint",
        args: [minterAddress, value.toString()],
    });

    // Get receipt transaction with a public client
    console.log("Transaction hash:", hash);
    console.log("Waiting for confirmations...");
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    if (receipt.status) {
        console.log("Transaction confirmed");
    } else {
        console.log("Transaction failed");
    }
    const balance = (await publicClient.readContract({
        address: tokenContractAddress,
        abi,
        functionName: "balanceOf",
        args: [minterAddress],
    })) as any[];
    console.log(`MTK balance:  ${Number(balance)}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});