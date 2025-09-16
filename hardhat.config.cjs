require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");

// Load environment variables
// Remove dotenv for now - use environment variables directly

module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    nero: {
      url: process.env.VITE_NERO_RPC_URL || "https://rpc-testnet.nerochain.io",
      chainId: parseInt(process.env.VITE_NERO_CHAIN_ID) || 689,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gas: 8000000,
      gasPrice: 1500000000, // 1.5 gwei
      timeout: 60000,
      httpHeaders: {}
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};