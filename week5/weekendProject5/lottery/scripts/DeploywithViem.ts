import { createPublicClient, http, createWalletClient, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import * as dotenv from "dotenv";
dotenv.config();
import { abi, bytecode } from "../artifacts/contracts/Lottery.sol/Lottery.json";

const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const deployerPrivateKey = process.env.PRIVATE_KEY || "";

async function main() {

    const BET_PRICE = "1";
    const BET_FEE = "0.2";
    const TOKEN_RATIO = 1n;

    const publicClient = createPublicClient({
        chain: sepolia,
        transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
    });

    // Create a wallet client
    const account = privateKeyToAccount(`0x${deployerPrivateKey}`);
    const deployer = createWalletClient({
        account,
        chain: sepolia,
        transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
    });
    console.log("Deployer address:", deployer.account.address);

    // Deploy contract
    console.log("\nDeploying Lottery contract");
    const hash = await deployer.deployContract({
        abi,
        bytecode: bytecode as `0x${string}`,
        args: ["LotteryToken", "LT0", TOKEN_RATIO, parseEther(BET_PRICE), parseEther(BET_FEE)],
    });
    console.log("Transaction hash:", hash);
    console.log("Waiting for confirmations...");
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    console.log("Lottery contract deployed to:", receipt.contractAddress);

    // Read token address from contract
    const tokenAddress = await publicClient.readContract({
        address: receipt.contractAddress as `0x${string}`,
        abi: abi,
        functionName: "paymentToken",
    })
    console.log("Lottery token contract deployed to:", tokenAddress);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
