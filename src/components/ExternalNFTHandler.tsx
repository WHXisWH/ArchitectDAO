import React, { useState, useEffect } from 'react';
import { X, Gift, ExternalLink, Copy, CheckCircle } from 'lucide-react';
import { useWeb3 } from '@/contexts/Web3Context';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  parseNFTDataFromURL, 
  clearURLParams, 
  getNFTDataSummary,
  type ExternalNFTData,
  type URLParserResult
} from '@/utils/urlParams';
import { useLanguage } from '@/hooks/useLanguage';

interface ExternalNFTHandlerProps {
  onClose?: () => void;
}

export const ExternalNFTHandler: React.FC<ExternalNFTHandlerProps> = ({ onClose }) => {
  const { executeGaslessMint, isAuthenticated, login, isLoading: web3Loading } = useWeb3();
  const { t } = useLanguage();
  
  const [nftData, setNftData] = useState<ExternalNFTData | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMintSuccess, setIsMintSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Detect external NFT data from URL
  useEffect(() => {
    const checkForExternalNFT = () => {
      const result: URLParserResult = parseNFTDataFromURL();
      
      if (result.hasExternalNFT && result.nftData) {
        console.log('External NFT detected:', getNFTDataSummary(result.nftData));
        setNftData(result.nftData);
        setIsVisible(true);
        
        // Clear URL params to avoid reprocessing
        setTimeout(() => {
          clearURLParams();
        }, 1000);
      } else if (result.error) {
        console.error('NFT data parsing error:', result.error);
        setError(result.error);
        setIsVisible(true);
      }
    };

    checkForExternalNFT();
  }, []);

  // Copy text to clipboard
  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  // Handle receiving the NFT
  const handleReceiveNFT = async () => {
    if (!nftData) return;

    try {
      setIsProcessing(true);
      setError(null);

      // Check if user is authenticated
      if (!isAuthenticated) {
        console.log('User not authenticated, prompting login...');
        await login();
        return; // Will re-trigger after login
      }

      console.log('Starting NFT mint process for:', getNFTDataSummary(nftData));

      // Build metadata URI (using IPFS)
      const metadataUri = nftData.ipfsUrl || `https://ipfs.io/ipfs/${nftData.ipfsCID}`;

      // Execute mint
      const result = await executeGaslessMint(metadataUri);

      if (result && result.success) {
        console.log('NFT mint successful:', result);
        setIsMintSuccess(true);
        
        // Auto-close success message after 3 seconds
        setTimeout(() => {
          handleClose();
        }, 3000);
      } else {
        throw new Error('Mint transaction failed');
      }

    } catch (error) {
      console.error('NFT receive error:', error);
      setError(error instanceof Error ? error.message : 'Failed to receive NFT');
    } finally {
      setIsProcessing(false);
    }
  };

  // Close the modal
  const handleClose = () => {
    setIsVisible(false);
    setNftData(null);
    setError(null);
    setIsMintSuccess(false);
    onClose?.();
  };

  // Handle later
  const handleLater = () => {
    console.log('User chose to handle NFT later');
    handleClose();
  };

  if (!isVisible || (!nftData && !error)) {
    return null;
  }

  // Error state
  if (error && !nftData) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-red-500">{t('externalNFT.parseErrorTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button onClick={handleClose} variant="outline" className="w-full">
              {t('common.close')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!nftData) return null;

  // Success state
  if (isMintSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-green-600">{t('externalNFT.receiveSuccessTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm" dangerouslySetInnerHTML={{ __html: t('externalNFT.receiveSuccessBody', { name: nftData.name }) }} />
            <p className="text-xs text-muted-foreground">
              {t('externalNFT.checkInMarketplace')}
            </p>
            <Button onClick={handleClose} className="w-full">
              {t('common.confirm')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="relative">
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Gift className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">{t('externalNFT.giftReceivedTitle')}</CardTitle>
            <p className="text-sm text-muted-foreground">
              from {nftData.originalPlatform}
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* NFT Basic Info */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">{nftData.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {nftData.description}
              </p>
            </div>

            {/* Gift Status Display */}
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                🎁 {t('externalNFT.freeGift')}
              </Badge>
              <Badge variant="outline">
                {nftData.blockchain}
              </Badge>
              <Badge variant="outline">
                {nftData.category}
              </Badge>
            </div>

            {/* Creator Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-sm mb-2">{t('common.creator')}</h4>
              <p className="text-sm">{nftData.creator}</p>
            </div>
          </div>

          {/* Attributes Display */}
          {nftData.attributes && nftData.attributes.length > 0 && (
            <div>
              <h4 className="font-medium text-sm mb-3">{t('common.attributes')}</h4>
              <div className="grid grid-cols-2 gap-2">
                {nftData.attributes.map((attr, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-muted-foreground">
                      {attr.trait_type}
                    </div>
                    <div className="text-sm font-medium">
                      {attr.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Blockchain Info */}
          <div className="border rounded-lg p-4 space-y-3">
            <h4 className="font-medium text-sm">{t('common.blockchainInfo')}</h4>
            
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Token ID:</span>
                <div className="flex items-center gap-1">
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                    {nftData.originalTokenId}
                  </code>
                  <button
                    onClick={() => copyToClipboard(nftData.originalTokenId, 'tokenId')}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    {copiedField === 'tokenId' ? (
                      <CheckCircle className="w-3 h-3 text-green-500" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Contract:</span>
                <div className="flex items-center gap-1">
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                    {nftData.originalContract.slice(0, 6)}...{nftData.originalContract.slice(-4)}
                  </code>
                  <button
                    onClick={() => copyToClipboard(nftData.originalContract, 'contract')}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    {copiedField === 'contract' ? (
                      <CheckCircle className="w-3 h-3 text-green-500" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">IPFS CID:</span>
                <div className="flex items-center gap-1">
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                    {nftData.ipfsCID.slice(0, 8)}...{nftData.ipfsCID.slice(-6)}
                  </code>
                  <button
                    onClick={() => copyToClipboard(nftData.ipfsCID, 'ipfs')}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    {copiedField === 'ipfs' ? (
                      <CheckCircle className="w-3 h-3 text-green-500" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                  {nftData.ipfsUrl && (
                    <a
                      href={nftData.ipfsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Asset Info */}
          {(nftData.modelFile || nftData.modelSize) && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-sm mb-2 text-blue-800">{t('common.modelInfo')}</h4>
              <div className="text-xs space-y-1">
                {nftData.modelFile && (
                  <div>{t('externalNFT.file')}: {nftData.modelFile}</div>
                )}
                {nftData.modelSize && (
                  <div>{t('externalNFT.size')}: {nftData.modelSize}</div>
                )}
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-medium text-sm text-red-800 mb-1">{t('common.error')}</h4>
              <p className="text-xs text-red-600">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleLater}
              variant="outline"
              className="flex-1"
              disabled={isProcessing}
            >
              {t('common.later')}
            </Button>
            <Button
              onClick={handleReceiveNFT}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              disabled={isProcessing || web3Loading}
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t('common.processing')}
                </div>
              ) : !isAuthenticated ? (
                t('externalNFT.loginToReceive')
              ) : (
                t('externalNFT.receive')
              )}
            </Button>
          </div>

          {/* Acquirable Rights Description */}
          <div className="text-xs text-muted-foreground bg-gray-50 rounded-lg p-4">
            <h5 className="font-medium mb-2">{t('externalNFT.rightsTitle')}</h5>
            <ul className="space-y-1 list-disc list-inside">
              <li>{t('externalNFT.right1')}</li>
              <li>{t('externalNFT.right2')}</li>
              <li>{t('externalNFT.right3')}</li>
              <li>{t('externalNFT.right4')}</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExternalNFTHandler;