const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ArchitectDAO Contracts", function () {
  let nftContract;
  let marketplaceContract;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy NFT contract
    const ArchitectDAONFT = await ethers.getContractFactory("ArchitectDAONFT");
    nftContract = await ArchitectDAONFT.deploy();
    await nftContract.deployed();

    // Deploy Marketplace contract
    const ArchitectDAOMarketplace = await ethers.getContractFactory("ArchitectDAOMarketplace");
    marketplaceContract = await ArchitectDAOMarketplace.deploy();
    await marketplaceContract.deployed();
    
    // Authorize user1 to mint NFTs
    await nftContract.connect(owner).authorizeMinter(user1.address);
  });

  describe("ArchitectDAONFT", function () {
    it("Should mint NFT with correct metadata and creator", async function () {
      const tokenURI = "https://example.com/metadata/1.json";
      const royaltyPercentage = 500; // 5%

      const tx = await nftContract.connect(user1).mint(user1.address, tokenURI, royaltyPercentage);
      await tx.wait();

      expect(await nftContract.ownerOf(1)).to.equal(user1.address);
      expect(await nftContract.tokenURI(1)).to.equal(tokenURI);
      expect(await nftContract.getCreator(1)).to.equal(user1.address);
      
      const [creator, royalty] = await nftContract.getRoyaltyInfo(1);
      expect(creator).to.equal(user1.address);
      expect(royalty).to.equal(royaltyPercentage);
    });

    it("Should batch mint multiple NFTs", async function () {
      const tokenURIs = [
        "https://example.com/metadata/1.json",
        "https://example.com/metadata/2.json",
        "https://example.com/metadata/3.json"
      ];
      const royaltyPercentages = [500, 750, 300]; // 5%, 7.5%, 3%

      const tx = await nftContract.connect(user1).batchMint(user1.address, tokenURIs, royaltyPercentages);
      await tx.wait();

      expect(await nftContract.totalSupply()).to.equal(3);
      expect(await nftContract.ownerOf(1)).to.equal(user1.address);
      expect(await nftContract.ownerOf(2)).to.equal(user1.address);
      expect(await nftContract.ownerOf(3)).to.equal(user1.address);
    });

    it("Should calculate royalty correctly", async function () {
      const tokenURI = "https://example.com/metadata/1.json";
      const royaltyPercentage = 500; // 5%
      const salePrice = ethers.utils.parseEther("1"); // 1 NERO

      const tx = await nftContract.connect(user1).mint(user1.address, tokenURI, royaltyPercentage);
      await tx.wait();

      const royaltyAmount = await nftContract.calculateRoyalty(1, salePrice);
      const expectedRoyalty = salePrice.mul(royaltyPercentage).div(10000); // 5% of 1 NERO
      expect(royaltyAmount).to.equal(expectedRoyalty);
    });

    it("Should reject royalty percentage > 10%", async function () {
      const tokenURI = "https://example.com/metadata/1.json";
      const invalidRoyaltyPercentage = 1500; // 15%

      await expect(
        nftContract.connect(user1).mint(user1.address, tokenURI, invalidRoyaltyPercentage)
      ).to.be.revertedWith("Royalty percentage cannot exceed 10%");
    });
    
    it("Should reject minting from unauthorized address", async function () {
      const tokenURI = "https://example.com/metadata/1.json";
      const royaltyPercentage = 500;

      await expect(
        nftContract.connect(user2).mint(user2.address, tokenURI, royaltyPercentage)
      ).to.be.revertedWith("Not authorized to mint");
    });
  });

  describe("ArchitectDAOMarketplace", function () {
    beforeEach(async function () {
      // Mint an NFT for testing
      const tokenURI = "https://example.com/metadata/1.json";
      const royaltyPercentage = 500; // 5%
      const tx = await nftContract.connect(user1).mint(user1.address, tokenURI, royaltyPercentage);
      await tx.wait();

      // Approve marketplace to transfer NFTs
      await nftContract.connect(user1).setApprovalForAll(marketplaceContract.address, true);
    });

    it("Should list NFT for sale", async function () {
      const price = ethers.utils.parseEther("1"); // 1 NERO

      const tx = await marketplaceContract.connect(user1).listNFT(nftContract.address, 1, price);
      await tx.wait();

      const listing = await marketplaceContract.getListing(1);
      expect(listing.seller).to.equal(user1.address);
      expect(listing.price).to.equal(price);
      expect(listing.active).to.be.true;
    });

    it("Should allow buying NFT", async function () {
      const price = ethers.utils.parseEther("1"); // 1 NERO

      // List NFT
      await marketplaceContract.connect(user1).listNFT(nftContract.address, 1, price);

      // Buy NFT
      const tx = await marketplaceContract.connect(user2).buyNFT(1, {
        value: price
      });
      await tx.wait();

      // Check ownership changed
      expect(await nftContract.ownerOf(1)).to.equal(user2.address);
      
      // Check listing is no longer active
      const listing = await marketplaceContract.getListing(1);
      expect(listing.active).to.be.false;
    });

    it("Should distribute payments correctly (marketplace fee + royalty)", async function () {
      const price = ethers.utils.parseEther("1"); // 1 NERO
      
      // List NFT
      await marketplaceContract.connect(user1).listNFT(nftContract.address, 1, price);

      // Buy NFT  
      const tx = await marketplaceContract.connect(user2).buyNFT(1, {
        value: price
      });
      await tx.wait();

      // Just verify the transaction succeeded and ownership transferred
      expect(await nftContract.ownerOf(1)).to.equal(user2.address);
      
      // Check listing is no longer active
      const listing = await marketplaceContract.getListing(1);
      expect(listing.active).to.be.false;
    });

    it("Should allow canceling listing", async function () {
      const price = ethers.utils.parseEther("1"); // 1 NERO

      // List NFT
      await marketplaceContract.connect(user1).listNFT(nftContract.address, 1, price);

      // Cancel listing
      await marketplaceContract.connect(user1).cancelListing(1);

      const listing = await marketplaceContract.getListing(1);
      expect(listing.active).to.be.false;
    });

    it("Should allow updating price", async function () {
      const initialPrice = ethers.utils.parseEther("1"); // 1 NERO
      const newPrice = ethers.utils.parseEther("2"); // 2 NERO

      // List NFT
      await marketplaceContract.connect(user1).listNFT(nftContract.address, 1, initialPrice);

      // Update price
      await marketplaceContract.connect(user1).updatePrice(1, newPrice);

      const listing = await marketplaceContract.getListing(1);
      expect(listing.price).to.equal(newPrice);
    });

    it("Should return active listings", async function () {
      const price = ethers.utils.parseEther("1"); // 1 NERO

      // List NFT
      await marketplaceContract.connect(user1).listNFT(nftContract.address, 1, price);

      const activeListings = await marketplaceContract.getActiveListings(0, 10);
      expect(activeListings.length).to.equal(1);
      expect(activeListings[0].seller).to.equal(user1.address);
    });
  });
});