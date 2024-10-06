const { ethers} = require("ethers");
const dotenv = require("dotenv");
dotenv.config();
const { abi, bytecode } = require("../artifacts/contracts/DutchAuction.sol/DutchAuction.json");

const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const deployerPrivateKey = process.env.PRIVATE_KEY || "";

async function main() {

    // Create a wallet client
    const provider = new ethers.JsonRpcProvider(`https://eth-holesky.g.alchemy.com/v2/${providerApiKey}`)
    const deployer = new ethers.Wallet(deployerPrivateKey, provider)
    console.log("Deployer address:", deployer.address);

    // Deploy contract
    console.log("\nDeploying DutchAuction contract on holesky");
    console.log("Waiting for confirmations...");
    const factory = new ethers.ContractFactory(abi, bytecode, deployer)
    const contract = await factory.deploy()
    console.log("DutchAuction contract deployed to:", contract.target);

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
