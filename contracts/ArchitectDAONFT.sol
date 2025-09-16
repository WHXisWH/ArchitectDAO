// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract ArchitectDAONFT is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    
    // Mapping from token ID to creator address
    mapping(uint256 => address) public tokenCreators;
    
    // Mapping from token ID to royalty percentage (in basis points, e.g., 500 = 5%)
    mapping(uint256 => uint256) public tokenRoyalties;
    
    // Mapping of authorized minters
    mapping(address => bool) public authorizedMinters;
    
    // Maximum number of NFTs that can be minted per transaction
    uint256 public constant MAX_BATCH_SIZE = 10;
    
    // Events
    event NFTMinted(uint256 indexed tokenId, address indexed creator, string tokenURI);
    event RoyaltySet(uint256 indexed tokenId, uint256 royaltyPercentage);
    event MinterAuthorized(address indexed minter);
    event MinterRevoked(address indexed minter);
    
    constructor() ERC721("ArchitectDAO NFT", "ARCH") {
        // Owner is automatically authorized to mint
        authorizedMinters[msg.sender] = true;
    }
    
    /**
     * @dev Mint NFT with metadata URI (only authorized minters)
     * @param to Address to mint the NFT to
     * @param _tokenURI Metadata URI for the NFT
     * @param royaltyPercentage Royalty percentage in basis points (e.g., 500 = 5%)
     * @return tokenId The minted token ID
     */
    function mint(address to, string memory _tokenURI, uint256 royaltyPercentage) 
        public 
        nonReentrant 
        returns (uint256) 
    {
        require(authorizedMinters[msg.sender] || msg.sender == owner(), "Not authorized to mint");
        require(royaltyPercentage <= 1000, "Royalty percentage cannot exceed 10%");
        
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        
        _mint(to, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        
        // Set creator and royalty info
        tokenCreators[tokenId] = msg.sender;
        tokenRoyalties[tokenId] = royaltyPercentage;
        
        emit NFTMinted(tokenId, msg.sender, _tokenURI);
        emit RoyaltySet(tokenId, royaltyPercentage);
        
        return tokenId;
    }
    
    /**
     * @dev Batch mint multiple NFTs (only authorized minters)
     * @param to Address to mint the NFTs to
     * @param tokenURIs Array of metadata URIs
     * @param royaltyPercentages Array of royalty percentages
     * @return tokenIds Array of minted token IDs
     */
    function batchMint(
        address to, 
        string[] memory tokenURIs, 
        uint256[] memory royaltyPercentages
    ) 
        public 
        nonReentrant 
        returns (uint256[] memory) 
    {
        require(authorizedMinters[msg.sender] || msg.sender == owner(), "Not authorized to mint");
        require(tokenURIs.length == royaltyPercentages.length, "Arrays length mismatch");
        require(tokenURIs.length <= MAX_BATCH_SIZE, "Exceeds maximum batch size");
        
        uint256[] memory tokenIds = new uint256[](tokenURIs.length);
        
        for (uint256 i = 0; i < tokenURIs.length; i++) {
            require(royaltyPercentages[i] <= 1000, "Royalty percentage cannot exceed 10%");
            
            _tokenIdCounter.increment();
            uint256 tokenId = _tokenIdCounter.current();
            
            _mint(to, tokenId);
            _setTokenURI(tokenId, tokenURIs[i]);
            
            // Set creator and royalty info
            tokenCreators[tokenId] = msg.sender;
            tokenRoyalties[tokenId] = royaltyPercentages[i];
            
            emit NFTMinted(tokenId, msg.sender, tokenURIs[i]);
            emit RoyaltySet(tokenId, royaltyPercentages[i]);
            
            tokenIds[i] = tokenId;
        }
        
        return tokenIds;
    }
    
    /**
     * @dev Get creator of a token
     * @param tokenId Token ID to query
     * @return creator address
     */
    function getCreator(uint256 tokenId) public view returns (address) {
        require(_exists(tokenId), "Token does not exist");
        return tokenCreators[tokenId];
    }
    
    /**
     * @dev Get royalty info for a token
     * @param tokenId Token ID to query
     * @return creator address and royalty amount in basis points
     */
    function getRoyaltyInfo(uint256 tokenId) public view returns (address, uint256) {
        require(_exists(tokenId), "Token does not exist");
        return (tokenCreators[tokenId], tokenRoyalties[tokenId]);
    }
    
    /**
     * @dev Calculate royalty amount for a sale
     * @param tokenId Token ID
     * @param salePrice Sale price in wei
     * @return royaltyAmount Amount to pay in royalties
     */
    function calculateRoyalty(uint256 tokenId, uint256 salePrice) 
        public 
        view 
        returns (uint256) 
    {
        require(_exists(tokenId), "Token does not exist");
        return (salePrice * tokenRoyalties[tokenId]) / 10000;
    }
    
    /**
     * @dev Get total number of minted tokens
     * @return current token count
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter.current();
    }
    
    /**
     * @dev Update royalty percentage for a token (only creator can do this)
     * @param tokenId Token ID to update
     * @param newRoyaltyPercentage New royalty percentage in basis points
     */
    function updateRoyalty(uint256 tokenId, uint256 newRoyaltyPercentage) public {
        require(_exists(tokenId), "Token does not exist");
        require(tokenCreators[tokenId] == msg.sender, "Only creator can update royalty");
        require(newRoyaltyPercentage <= 1000, "Royalty percentage cannot exceed 10%");
        
        tokenRoyalties[tokenId] = newRoyaltyPercentage;
        emit RoyaltySet(tokenId, newRoyaltyPercentage);
    }
    
    // Override required functions
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
    
    /**
     * @dev Authorize an address to mint NFTs (only owner)
     * @param minter Address to authorize
     */
    function authorizeMinter(address minter) public onlyOwner {
        require(minter != address(0), "Invalid minter address");
        authorizedMinters[minter] = true;
        emit MinterAuthorized(minter);
    }
    
    /**
     * @dev Revoke minting authorization (only owner)
     * @param minter Address to revoke authorization from
     */
    function revokeMinter(address minter) public onlyOwner {
        authorizedMinters[minter] = false;
        emit MinterRevoked(minter);
    }
    
    /**
     * @dev Check if an address is authorized to mint
     * @param minter Address to check
     * @return true if authorized, false otherwise
     */
    function isMinterAuthorized(address minter) public view returns (bool) {
        return authorizedMinters[minter] || minter == owner();
    }
}