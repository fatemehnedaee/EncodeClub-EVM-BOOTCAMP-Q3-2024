require("@nomicfoundation/hardhat-toolbox");
const dotenv = require("dotenv");
dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const deployerPrivateKey = process.env.PRIVATE_KEY || "";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  networks: {
    holesky: {
      url: `https://eth-holesky.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    }
  }
};
