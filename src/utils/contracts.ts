import { ethers } from 'ethers';
import { NERO_CONTRACTS } from './nerochain';
import ArchitectDAONFTABI from '@/contracts/ArchitectDAONFT.json';
import ArchitectDAOMarketplaceABI from '@/contracts/ArchitectDAOMarketplace.json';

export class ContractService {
  private provider: ethers.providers.Web3Provider;
  private signer: ethers.Signer;

  constructor(provider: ethers.providers.Web3Provider) {
    this.provider = provider;
    this.signer = provider.getSigner();
  }

  // NFT Contract Methods
  async mintNFT(to: string, tokenURI: string, royaltyPercentage: number = 500) {
    try {
      console.log('Minting NFT with real contract:', NERO_CONTRACTS.NFT_CONTRACT);
      
      const nftContract = new ethers.Contract(
        NERO_CONTRACTS.NFT_CONTRACT,
        ArchitectDAONFTABI,
        this.signer
      );

      const tx = await nftContract.mint(to, tokenURI, royaltyPercentage);
      const receipt = await tx.wait();

      console.log('NFT minted successfully:', receipt.transactionHash);
      
      // Find the minted token ID from events
      const mintEvent = receipt.events?.find((event: any) => event.event === 'NFTMinted');
      const tokenId = mintEvent?.args?.tokenId?.toString();

      return {
        success: true,
        hash: receipt.transactionHash,
        tokenId: tokenId,
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error) {
      console.error('Failed to mint NFT:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async batchMintNFTs(to: string, tokenURIs: string[], royaltyPercentages: number[]) {
    try {
      console.log('Batch minting NFTs:', tokenURIs.length);
      
      const nftContract = new ethers.Contract(
        NERO_CONTRACTS.NFT_CONTRACT,
        ArchitectDAONFTABI,
        this.signer
      );

      const tx = await nftContract.batchMint(to, tokenURIs, royaltyPercentages);
      const receipt = await tx.wait();

      console.log('Batch mint successful:', receipt.transactionHash);
      
      return {
        success: true,
        hash: receipt.transactionHash,
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error) {
      console.error('Failed to batch mint NFTs:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getNFTInfo(tokenId: number) {
    try {
      const nftContract = new ethers.Contract(
        NERO_CONTRACTS.NFT_CONTRACT,
        ArchitectDAONFTABI,
        this.provider
      );

      const [owner, tokenURI, creator, royaltyInfo] = await Promise.all([
        nftContract.ownerOf(tokenId),
        nftContract.tokenURI(tokenId),
        nftContract.getCreator(tokenId),
        nftContract.getRoyaltyInfo(tokenId)
      ]);

      return {
        tokenId,
        owner,
        tokenURI,
        creator,
        royaltyCreator: royaltyInfo[0],
        royaltyPercentage: royaltyInfo[1].toNumber()
      };
    } catch (error) {
      console.error('Failed to get NFT info:', error);
      return null;
    }
  }

  // Marketplace Contract Methods
  async listNFT(nftContractAddress: string, tokenId: number, price: string) {
    try {
      console.log('Listing NFT on marketplace:', tokenId, price);
      
      const marketplaceContract = new ethers.Contract(
        NERO_CONTRACTS.MARKETPLACE_CONTRACT || '0x0000000000000000000000000000000000000000',
        ArchitectDAOMarketplaceABI,
        this.signer
      );

      // First approve the marketplace to transfer the NFT
      const nftContract = new ethers.Contract(
        nftContractAddress,
        ArchitectDAONFTABI,
        this.signer
      );

      // Check if approval is needed
      const isApproved = await nftContract.isApprovedForAll(
        await this.signer.getAddress(),
        marketplaceContract.address
      );

      if (!isApproved) {
        console.log('Approving marketplace to transfer NFTs...');
        const approveTx = await nftContract.setApprovalForAll(marketplaceContract.address, true);
        await approveTx.wait();
        console.log('Approval granted');
      }

      // List the NFT
      const priceInWei = ethers.utils.parseEther(price);
      const tx = await marketplaceContract.listNFT(nftContractAddress, tokenId, priceInWei);
      const receipt = await tx.wait();

      console.log('NFT listed successfully:', receipt.transactionHash);
      
      return {
        success: true,
        hash: receipt.transactionHash,
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error) {
      console.error('Failed to list NFT:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async buyNFT(listingId: number, price: string) {
    try {
      console.log('Buying NFT from listing:', listingId);
      
      const marketplaceContract = new ethers.Contract(
        NERO_CONTRACTS.MARKETPLACE_CONTRACT || '0x0000000000000000000000000000000000000000',
        ArchitectDAOMarketplaceABI,
        this.signer
      );

      const priceInWei = ethers.utils.parseEther(price);
      const tx = await marketplaceContract.buyNFT(listingId, {
        value: priceInWei
      });
      const receipt = await tx.wait();

      console.log('NFT purchased successfully:', receipt.transactionHash);
      
      return {
        success: true,
        hash: receipt.transactionHash,
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error) {
      console.error('Failed to buy NFT:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getActiveListings(offset: number = 0, limit: number = 20) {
    try {
      const marketplaceContract = new ethers.Contract(
        NERO_CONTRACTS.MARKETPLACE_CONTRACT || '0x0000000000000000000000000000000000000000',
        ArchitectDAOMarketplaceABI,
        this.provider
      );

      const listings = await marketplaceContract.getActiveListings(offset, limit);
      
      return listings.map((listing: any) => ({
        listingId: listing.listingId.toNumber(),
        nftContract: listing.nftContract,
        tokenId: listing.tokenId.toNumber(),
        seller: listing.seller,
        price: ethers.utils.formatEther(listing.price),
        active: listing.active,
        createdAt: listing.createdAt.toNumber()
      }));
    } catch (error) {
      console.error('Failed to get active listings:', error);
      return [];
    }
  }

  // Helper method to check if contracts are deployed
  async checkContractsDeployed() {
    try {
      const nftAddress = NERO_CONTRACTS.NFT_CONTRACT;
      const marketplaceAddress = NERO_CONTRACTS.MARKETPLACE_CONTRACT;

      if (!nftAddress || nftAddress === '0x1234567890123456789012345678901234567890') {
        return {
          deployed: false,
          message: 'NFT contract not deployed. Please deploy contracts first.'
        };
      }

      if (!marketplaceAddress || marketplaceAddress === '0x0000000000000000000000000000000000000000') {
        return {
          deployed: false,
          message: 'Marketplace contract not deployed. Please deploy contracts first.'
        };
      }

      // Try to call a view function to verify contracts are deployed
      const nftContract = new ethers.Contract(nftAddress, ArchitectDAONFTABI, this.provider);
      await nftContract.totalSupply();

      return {
        deployed: true,
        nftContract: nftAddress,
        marketplaceContract: marketplaceAddress
      };
    } catch (error) {
      return {
        deployed: false,
        message: 'Contracts not properly deployed or accessible.',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}