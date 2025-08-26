import React, { useState } from 'react';
import { Wallet } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NFTAsset } from '@/types';
import { shortAddress, formatPrice } from '@/utils';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

interface NFTCardProps {
  nft: NFTAsset;
}

export const NFTCard: React.FC<NFTCardProps> = ({ nft }) => {
  const { t } = useTranslation();
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  return (
    <>
      <Card 
        className="group cursor-pointer overflow-hidden hover:border-toda-blue/40 transition-all duration-300" 
        onClick={() => setIsDetailOpen(true)}
      >
        <div className="overflow-hidden">
          <img 
            src={nft.image} 
            alt={nft.name} 
            className="h-56 w-full object-cover group-hover:scale-105 transition-transform duration-300" 
          />
        </div>
        <CardHeader>
          <CardTitle className="text-slate-800 group-hover:text-toda-blue transition-colors">
            {nft.name}
          </CardTitle>
          <CardDescription>
            {t('marketplace.author')} {shortAddress(nft.author)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="text-xl font-bold text-toda-red">
              {formatPrice(nft.price)} ETH
            </div>
            <div className="text-sm text-slate-500">
              {nft.fileType}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Modal 
        isOpen={isDetailOpen} 
        onClose={() => setIsDetailOpen(false)} 
        title={nft.name}
      >
        <div className="space-y-4">
          <img 
            src={nft.image} 
            alt={nft.name} 
            className="w-full h-64 object-cover rounded-lg"
          />
          <p className="text-slate-600 leading-relaxed">
            {nft.description}
          </p>
          <div className="text-sm bg-slate-50 p-4 rounded-lg space-y-2 border border-toda-blue/10">
            <p>
              <span className="font-semibold text-toda-blue">
                {t('nft.creatorAddress')}
              </span> 
              <span className="font-mono break-all ml-2 text-slate-600">
                {nft.author}
              </span>
            </p>
            <p>
              <span className="font-semibold text-toda-blue">
                {t('nft.fileFormat')}
              </span> 
              <span className="ml-2 text-slate-600">
                {nft.fileType}
              </span>
            </p>
            {nft.createdAt && (
              <p>
                <span className="font-semibold text-toda-blue">
                  Created:
                </span> 
                <span className="ml-2 text-slate-600">
                  {nft.createdAt}
                </span>
              </p>
            )}
          </div>
          <div className="pt-4">
            <Button 
              size="lg" 
              className="w-full bg-toda-red hover:bg-toda-red/90"
            >
              <Wallet className="mr-2 h-5 w-5"/>
              {t('nft.purchase')} {formatPrice(nft.price)} ETH
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};