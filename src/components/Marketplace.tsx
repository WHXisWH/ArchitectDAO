import React, { useState } from 'react';
import { Search, XCircle, ShoppingBag } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { NFTCard } from './NFTCard';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NFTCardSkeleton } from './NFTCardSkeleton';
import { useMarketplace } from '@/hooks/useMarketplace'; // Import the new hook

export const Marketplace: React.FC = () => {
  const { t } = useTranslation();
  const { listings, isLoading, error } = useMarketplace(); // Use the hook
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNFTs = listings.filter(nft => 
    (nft.creator?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    nft.id.toString().includes(searchTerm) ||
    (nft.name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <NFTCardSkeleton key={index} />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <XCircle className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-4 text-lg font-medium text-red-500">{t('marketplace.errorTitle')}</h3>
          <p className="mt-2 text-sm text-slate-500">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline" className="mt-6">
            {t('marketplace.retry')}
          </Button>
        </div>
      );
    }

    if (filteredNFTs.length === 0) {
      return (
        <div className="text-center py-12 bg-toda-light-blue/20 rounded-lg">
          <ShoppingBag className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-4 text-lg font-medium text-slate-700">
            {searchTerm ? t('marketplace.noResults') : t('marketplace.emptyTitle')}
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            {searchTerm ? t('marketplace.noResultsDesc') : t('marketplace.emptyDesc')}
          </p>
          {!searchTerm && (
            <Button onClick={() => { /* Navigate to mint page */ }} className="mt-6 bg-toda-red hover:bg-toda-red/90">
              {t('marketplace.mintFirst')}
            </Button>
          )}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in-0">
        {filteredNFTs.map(nft => (
          <NFTCard key={nft.id} nft={nft} />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="h2 text-slate-800 border-b-2 border-toda-blue pb-2 whitespace-nowrap">
          {t('marketplace.title')}
        </h2>
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder={t('marketplace.searchPlaceholder')}
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="pl-10 w-full sm:w-64"
          />
        </div>
      </div>
      {renderContent()}
    </div>
  );
};
