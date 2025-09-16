import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { shortAddress } from '@/utils';
import { ModelViewer } from './ModelViewer';
import { useTranslation } from 'react-i18next';
import { NFTAsset } from '@/types'; // Import NFTAsset

interface NFTCardProps {
  nft: NFTAsset;
}

export const NFTCard: React.FC<NFTCardProps> = ({ nft }) => {
  const { t } = useTranslation();

  // Check for 3D preview file
  // Get preview file info from localStorage
  const has3DPreview = nft.previewFileUrl && localStorage.getItem(`3d_preview_${nft.id}`);

  return (
    <Card className="overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out flex flex-col">
      <div className="relative w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
        {has3DPreview ? (
          <ModelViewer modelUrl={nft.previewFileUrl!} />
        ) : (
          <img src={nft.image} alt={nft.name} className="object-cover w-full h-full" />
        )}
        {has3DPreview && (
          <span className="absolute bottom-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
            {t('nftCard.preview3DModel')}
          </span>
        )}
      </div>
      <CardContent className="p-4 flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 truncate">{nft.name}</h3>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{nft.description}</p>
        <div className="mt-3 text-sm">
          <p className="text-gray-700">{t('marketplace.author')} {shortAddress(nft.creator)}</p>
          <p className="text-gray-700">{t('marketplace.fileType')} {nft.fileType}</p>
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-gray-50 border-t flex justify-between items-center">
        <span className="text-xl font-bold text-toda-blue">{nft.price} NERO</span>
        <Link to={`/nft/${nft.id}`}>
          <Button>{t('marketplace.purchase')}</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
