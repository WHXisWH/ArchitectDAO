import React from 'react';
import { useTranslation } from 'react-i18next';
import { useWeb3 } from '@/contexts/Web3Context';
import { Marketplace } from './Marketplace';
import { MintNFTForm } from './MintNFTForm';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';

export const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useWeb3();

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <Marketplace />
        </div>
        
        <div className="space-y-6">
          <div className="sticky top-24 space-y-6">
            {isAuthenticated ? (
              <MintNFTForm />
            ) : (
              <Card className="border-toda-blue/20">
                <CardHeader>
                  <CardTitle className="text-toda-blue">
                    {t('auth.loginRequired')}
                  </CardTitle>
                  <CardDescription>
                    {t('auth.loginRequiredDesc')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-slate-500 py-8">
                    {t('auth.loginPrompt')}
                  </p>
                </CardContent>
              </Card>
            )}
            
            {/* Features Card */}
            <Card className="border-toda-grey/20">
              <CardHeader>
                <CardTitle className="text-toda-blue text-lg">
                  Platform Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-toda-red rounded-full mt-2"></div>
                  <div>
                    <p className="font-semibold text-sm text-slate-700">
                      Zero Gas Fees
                    </p>
                    <p className="text-xs text-slate-500">
                      Mint your first NFT without any transaction fees
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-toda-blue rounded-full mt-2"></div>
                  <div>
                    <p className="font-semibold text-sm text-slate-700">
                      Social Login
                    </p>
                    <p className="text-xs text-slate-500">
                      No need to manage private keys or seed phrases
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-toda-grey rounded-full mt-2"></div>
                  <div>
                    <p className="font-semibold text-sm text-slate-700">
                      IP Protection
                    </p>
                    <p className="text-xs text-slate-500">
                      Built-in licensing and royalty management
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};