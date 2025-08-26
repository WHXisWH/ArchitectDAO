// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./ArchitectDAONFT.sol";

contract ArchitectDAOMarketplace is ReentrancyGuard, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _listingIdCounter;
    
    // Marketplace fee percentage in basis points (e.g., 250 = 2.5%)
    uint256 public marketplaceFeePercentage = 250; // 2.5% default fee
    
    struct Listing {
        uint256 listingId;
        address nftContract;
        uint256 tokenId;
        address seller;
        uint256 price;
        bool active;
        uint256 createdAt;
    }
    
    // Mapping from listing ID to listing details
    mapping(uint256 => Listing) public listings;
    
    // Mapping from NFT contract and token ID to listing ID
    mapping(address => mapping(uint256 => uint256)) public tokenToListingId;
    
    // Events
    event NFTListed(
        uint256 indexed listingId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        uint256 price
    );
    
    event NFTSold(
        uint256 indexed listingId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address buyer,
        uint256 price
    );
    
    event ListingCanceled(uint256 indexed listingId);
    event PriceUpdated(uint256 indexed listingId, uint256 newPrice);
    event MarketplaceFeeUpdated(uint256 newFeePercentage);
    
    /**
     * @dev List an NFT for sale
     * @param nftContract Address of the NFT contract
     * @param tokenId Token ID to list
     * @param price Price in wei
     * @return listingId The created listing ID
     */
    function listNFT(address nftContract, uint256 tokenId, uint256 price) 
        public 
        nonReentrant 
        returns (uint256) 
    {
        require(price > 0, "Price must be greater than 0");
        require(IERC721(nftContract).ownerOf(tokenId) == msg.sender, "Not the owner");
        require(IERC721(nftContract).isApprovedForAll(msg.sender, address(this)) || 
                IERC721(nftContract).getApproved(tokenId) == address(this), 
                "Marketplace not approved");
        require(tokenToListingId[nftContract][tokenId] == 0, "NFT already listed");
        
        _listingIdCounter.increment();
        uint256 listingId = _listingIdCounter.current();
        
        listings[listingId] = Listing({
            listingId: listingId,
            nftContract: nftContract,
            tokenId: tokenId,
            seller: msg.sender,
            price: price,
            active: true,
            createdAt: block.timestamp
        });
        
        tokenToListingId[nftContract][tokenId] = listingId;
        
        emit NFTListed(listingId, nftContract, tokenId, msg.sender, price);
        
        return listingId;
    }
    
    /**
     * @dev Buy an NFT from a listing
     * @param listingId ID of the listing to purchase
     */
    function buyNFT(uint256 listingId) public payable nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.active, "Listing not active");
        require(msg.value >= listing.price, "Insufficient payment");
        require(msg.sender != listing.seller, "Cannot buy your own NFT");
        
        // Check if seller still owns the NFT
        require(IERC721(listing.nftContract).ownerOf(listing.tokenId) == listing.seller, 
                "Seller no longer owns the NFT");
        
        address seller = listing.seller;
        uint256 price = listing.price;
        uint256 tokenId = listing.tokenId;
        address nftContract = listing.nftContract;
        
        // Mark listing as inactive
        listing.active = false;
        tokenToListingId[nftContract][tokenId] = 0;
        
        // Calculate fees and royalties
        uint256 marketplaceFee = (price * marketplaceFeePercentage) / 10000;
        uint256 royaltyAmount = 0;
        address creator = address(0);
        
        // Check if it's our NFT contract and calculate royalties
        if (nftContract == address(this)) {
            try ArchitectDAONFT(nftContract).getRoyaltyInfo(tokenId) returns (address _creator, uint256 royaltyPercentage) {
                creator = _creator;
                royaltyAmount = (price * royaltyPercentage) / 10000;
            } catch {
                // If getRoyaltyInfo fails, no royalties
            }
        }
        
        uint256 sellerProceeds = price - marketplaceFee - royaltyAmount;
        
        // Transfer NFT to buyer
        IERC721(nftContract).safeTransferFrom(seller, msg.sender, tokenId);
        
        // Transfer payments
        if (sellerProceeds > 0) {
            (bool success, ) = payable(seller).call{value: sellerProceeds}("");
            require(success, "Failed to send payment to seller");
        }
        
        if (royaltyAmount > 0 && creator != address(0)) {
            (bool success, ) = payable(creator).call{value: royaltyAmount}("");
            require(success, "Failed to send royalty payment");
        }
        
        if (marketplaceFee > 0) {
            (bool success, ) = payable(owner()).call{value: marketplaceFee}("");
            require(success, "Failed to send marketplace fee");
        }
        
        // Refund excess payment
        if (msg.value > price) {
            (bool success, ) = payable(msg.sender).call{value: msg.value - price}("");
            require(success, "Failed to refund excess payment");
        }
        
        emit NFTSold(listingId, nftContract, tokenId, seller, msg.sender, price);
    }
    
    /**
     * @dev Cancel a listing (only seller can cancel)
     * @param listingId ID of the listing to cancel
     */
    function cancelListing(uint256 listingId) public {
        Listing storage listing = listings[listingId];
        require(listing.active, "Listing not active");
        require(msg.sender == listing.seller, "Only seller can cancel");
        
        listing.active = false;
        tokenToListingId[listing.nftContract][listing.tokenId] = 0;
        
        emit ListingCanceled(listingId);
    }
    
    /**
     * @dev Update price of a listing (only seller can update)
     * @param listingId ID of the listing to update
     * @param newPrice New price in wei
     */
    function updatePrice(uint256 listingId, uint256 newPrice) public {
        require(newPrice > 0, "Price must be greater than 0");
        Listing storage listing = listings[listingId];
        require(listing.active, "Listing not active");
        require(msg.sender == listing.seller, "Only seller can update price");
        
        listing.price = newPrice;
        emit PriceUpdated(listingId, newPrice);
    }
    
    /**
     * @dev Get listing details
     * @param listingId ID of the listing
     * @return listing details
     */
    function getListing(uint256 listingId) public view returns (Listing memory) {
        return listings[listingId];
    }
    
    /**
     * @dev Check if an NFT is listed
     * @param nftContract Address of the NFT contract
     * @param tokenId Token ID to check
     * @return true if listed, false otherwise
     */
    function isNFTListed(address nftContract, uint256 tokenId) public view returns (bool) {
        uint256 listingId = tokenToListingId[nftContract][tokenId];
        return listingId != 0 && listings[listingId].active;
    }
    
    /**
     * @dev Get active listings (paginated)
     * @param offset Starting index
     * @param limit Number of listings to return
     * @return activeListings Array of active listings
     */
    function getActiveListings(uint256 offset, uint256 limit) 
        public 
        view 
        returns (Listing[] memory) 
    {
        require(limit <= 50, "Limit too high");
        
        uint256 totalListings = _listingIdCounter.current();
        uint256 activeCount = 0;
        
        // Count active listings
        for (uint256 i = 1; i <= totalListings; i++) {
            if (listings[i].active) {
                activeCount++;
            }
        }
        
        if (offset >= activeCount) {
            return new Listing[](0);
        }
        
        uint256 resultSize = limit;
        if (offset + limit > activeCount) {
            resultSize = activeCount - offset;
        }
        
        Listing[] memory result = new Listing[](resultSize);
        uint256 resultIndex = 0;
        uint256 currentIndex = 0;
        
        for (uint256 i = 1; i <= totalListings && resultIndex < resultSize; i++) {
            if (listings[i].active) {
                if (currentIndex >= offset) {
                    result[resultIndex] = listings[i];
                    resultIndex++;
                }
                currentIndex++;
            }
        }
        
        return result;
    }
    
    /**
     * @dev Get total number of listings
     * @return total number of created listings
     */
    function getTotalListings() public view returns (uint256) {
        return _listingIdCounter.current();
    }
    
    /**
     * @dev Update marketplace fee (only owner)
     * @param newFeePercentage New fee percentage in basis points
     */
    function updateMarketplaceFee(uint256 newFeePercentage) public onlyOwner {
        require(newFeePercentage <= 1000, "Fee cannot exceed 10%");
        marketplaceFeePercentage = newFeePercentage;
        emit MarketplaceFeeUpdated(newFeePercentage);
    }
    
    /**
     * @dev Withdraw accumulated marketplace fees (only owner)
     */
    function withdrawFees() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Failed to withdraw fees");
    }
}