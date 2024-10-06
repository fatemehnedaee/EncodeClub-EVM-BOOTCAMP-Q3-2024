const hre = require("hardhat");

async function main() {

    // Deploye token contract
    const MyToken = await hre.ethers.deployContract("MyToken");
    await MyToken.waitForDeployment();
    console.log(`MyToken deployed to ${MyToken.target} on hardhat`);

    // Deploy dutchAction contract
    const DutchAuction = await hre.ethers.deployContract("DutchAuction");
    await DutchAuction.waitForDeployment();
    console.log(`DutchAuction deployed to ${DutchAuction.target} on hardhat`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});