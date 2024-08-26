import { createPublicClient, http } from "viem";
import { abi } from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";
import { sepolia } from "viem/chains";
import * as dotenv from "dotenv";
dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";

async function main() {

    // Reitrive parameters
    const parameters = process.argv.slice(2);
    if (!parameters || parameters.length < 2)
        throw new Error("Parameters not provided");
    const tokenizedBallotcontractAddress = parameters[0] as `0x${string}`;
    if (!tokenizedBallotcontractAddress) throw new Error("Contract address not provided");
    if (!/^0x[a-fA-F0-9]{40}$/.test(tokenizedBallotcontractAddress))
        throw new Error("Invalid contract address");
    const voterAddress = parameters[1] as `0x${string}`;
    if (!voterAddress) throw new Error("Minter address not provided");
    if (!/^0x[a-fA-F0-9]{40}$/.test(voterAddress))
        throw new Error("Invalid minter address");

    // Creae public client 
    const publicClient = createPublicClient({
        chain: sepolia,
        transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
    });
    const blockNumber = await publicClient.getBlockNumber();
    console.log("Last block number:", blockNumber);

    // Intract with deployed contract and get vote power
    const votePower = (await publicClient.readContract({
        address: tokenizedBallotcontractAddress,
        abi,
        functionName: "getVotPower",
        args: [voterAddress],
    })) as any[];
    console.log(`This address ${voterAddress} has ${votePower} vote power.`)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});