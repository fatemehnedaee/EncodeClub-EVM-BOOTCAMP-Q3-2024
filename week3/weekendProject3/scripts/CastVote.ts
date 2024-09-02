import { createPublicClient, http, createWalletClient, hexToString } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { abi } from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";
import { sepolia } from "viem/chains";
import * as dotenv from "dotenv";
dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const deployerPrivateKey = process.env.PRIVATE_KEY|| "";

async function main() {

    // Reitrive parameters
    const parameters = process.argv.slice(2);
    if (!parameters || parameters.length < 3)
        throw new Error("Parameters not provided");
    const tokenizedBallotcontractAddress = parameters[0] as `0x${string}`;
    if (!tokenizedBallotcontractAddress) throw new Error("Contract address not provided");
    if (!/^0x[a-fA-F0-9]{40}$/.test(tokenizedBallotcontractAddress))
        throw new Error("Invalid contract address");
    const proposalIndex = parameters[1];
    if (isNaN(Number(proposalIndex)))
        throw new Error("Invalid proposal index");
    const voteCount = parameters[2];
    if (isNaN(Number(voteCount))) 
        throw new Error("Invalid vote count");


    // Attach the contract and check the selected option
    const publicClient = createPublicClient({
        chain: sepolia,
        transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
    });
    console.log("Proposal selected: ");
    const proposal = (await publicClient.readContract({
        address: tokenizedBallotcontractAddress,
        abi,
        functionName: "proposals",
        args: [BigInt(proposalIndex)],
    })) as any[];
    const name = hexToString(proposal[0], { size: 32 });
    console.log(`Voting ${voteCount} to proposal ${name}`);
    console.log("Confirm? (Y/n)");

    // Send transaction on user confirmation
    const account = privateKeyToAccount(`0x${deployerPrivateKey}`);
    const voter = createWalletClient({
        account,
        chain: sepolia,
        transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
    });
    process.stdin.on("data", async function (d) {
        if (d.toString().trim().toLowerCase() != "n") {
            const hash = await voter.writeContract({
                address: tokenizedBallotcontractAddress,
                abi,
                functionName: "vote",
                args: [BigInt(proposalIndex), voteCount],
            });
            console.log("Transaction hash:", hash);
            console.log("Waiting for confirmations...");
            const receipt = await publicClient.waitForTransactionReceipt({ hash });
            if (receipt.status) {
                console.log("Transaction confirm");
                console.log(`${voter.account.address} voted ${voteCount} to ${name}`)
            } else {
                console.log("Transaction fail");
            }
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