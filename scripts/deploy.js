const { ethers } = require("hardhat");

async function main() {
  console.log("Starting deployment to Nero Chain...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  
  const balance = await deployer.getBalance();
  console.log("Account balance:", ethers.utils.formatEther(balance), "NERO");
  
  try {
    // Deploy NFT contract
    console.log("\n1. Deploying ArchitectDAONFT...");
    const ArchitectDAONFT = await ethers.getContractFactory("ArchitectDAONFT");
    const nftContract = await ArchitectDAONFT.deploy();
    await nftContract.deployed();
    console.log("✅ ArchitectDAONFT deployed to:", nftContract.address);
    
    // Deploy Marketplace contract
    console.log("\n2. Deploying ArchitectDAOMarketplace...");
    const ArchitectDAOMarketplace = await ethers.getContractFactory("ArchitectDAOMarketplace");
    const marketplaceContract = await ArchitectDAOMarketplace.deploy();
    await marketplaceContract.deployed();
    console.log("✅ ArchitectDAOMarketplace deployed to:", marketplaceContract.address);
    
    // Wait for a few block confirmations
    console.log("\n3. Waiting for block confirmations...");
    await nftContract.deployTransaction.wait(2);
    await marketplaceContract.deployTransaction.wait(2);
    
    console.log("\n🎉 Deployment completed successfully!");
    console.log("📝 Contract addresses:");
    console.log("   NFT Contract:", nftContract.address);
    console.log("   Marketplace Contract:", marketplaceContract.address);
    
    console.log("\n🔧 Update your .env file with these addresses:");
    console.log(`VITE_NFT_CONTRACT=${nftContract.address}`);
    console.log(`VITE_MARKETPLACE_CONTRACT=${marketplaceContract.address}`);
    
    // Test mint function to verify deployment
    console.log("\n🧪 Testing NFT mint function...");
    try {
      const testTx = await nftContract.mint(
        deployer.address, 
        "https://example.com/metadata/1.json",
        500 // 5% royalty
      );
      await testTx.wait();
      console.log("✅ Test mint successful, token minted!");
    } catch (error) {
      console.log("❌ Test mint failed:", error.message);
    }
    
  } catch (error) {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });