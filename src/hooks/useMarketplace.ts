import { useState, useEffect } from 'react';
import { useWeb3 } from '@/contexts/Web3Context';
import { NFTAsset } from '@/types';

// Define the shape of a listing from the contract
interface RawMarketplaceListing {
  listingId: string;
  nftContract: string;
  tokenId: string;
  seller: string;
  price: string;
  active: boolean;
  createdAt: string;
}

export const useMarketplace = () => {
  const { contractService } = useWeb3();
  const [listings, setListings] = useState<NFTAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      if (!contractService) {
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        setError(null);
        const rawListings: RawMarketplaceListing[] = await contractService.getActiveListings();

        const fetchedNFTs = await Promise.all(rawListings.map(async (listing) => {
          const nftInfo = await contractService.getNFTInfo(parseInt(listing.tokenId));
          let metadata: any = {};
          let previewFileUrl: string | undefined;

          if (nftInfo && nftInfo.tokenURI) {
            // Fetch metadata from tokenURI
            try {
              const response = await fetch(nftInfo.tokenURI);
              metadata = await response.json();
              // Assuming metadata contains name, description, image, and potentially previewFileUrl
              if (metadata.animation_url) {
                previewFileUrl = metadata.animation_url;
              }
            } catch (metaError) {
              console.error(`Failed to fetch metadata for tokenId ${listing.tokenId}:`, metaError);
            }
          }

          return {
            id: listing.listingId, // Ensure this is string
            name: metadata.name || `NFT #${listing.tokenId}`,
            description: metadata.description || 'No description available.',
            creator: nftInfo?.creator || listing.seller,
            owner: nftInfo?.owner || listing.seller,
            price: listing.price,
            image: metadata.image || '/api/placeholder/400/300',
            fileType: metadata.fileType || 'Mixed',
            createdAt: listing.createdAt,
            tokenId: listing.tokenId,
            contractAddress: listing.nftContract,
            previewFileUrl: previewFileUrl,
          } as NFTAsset;
        }));
        setListings(fetchedNFTs);

      } catch (err: any) {
        console.error('Error fetching marketplace listings:', err);
        setError(err.message || 'Failed to fetch listings');
      } finally {
        setIsLoading(false);
      }
    };
    fetchListings();
  }, [contractService]);

  return { listings, isLoading, error };
};