import React from 'react';
import { useTranslation } from 'react-i18next';
import { useWeb3 } from '@/contexts/Web3Context';
import { Marketplace } from './Marketplace';
import { MintNFTForm } from './MintNFTForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useWeb3();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section
        className="relative h-[500px] bg-cover bg-center flex items-center justify-center text-white shadow-lg"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8bW9kZXJuJTIwYXJjaGl0ZWN0dXJlJTIwYmx1ZXByaW50fGVufDB8fHx8MTcwMTY3MjY3Nnww')` }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-center p-4">
          <h1 className="text-5xl font-bold mb-4">{t('app.tagline')}</h1>
          <p className="text-xl">{t('login.heroSubtitle')}</p>
        </div>
      </section>

      <div className="container mx-auto px-6 py-10 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <Marketplace />
          </div>
          
          <div className="space-y-6">
            <div className="sticky top-24 space-y-6">
              {isAuthenticated ? (
                <MintNFTForm />
              ) : (
                <Card className="border-toda-blue/20 bg-toda-light-blue/50 shadow-md">
                  <CardHeader>
                    <CardTitle className="h4 text-toda-blue">
                      {t('auth.loginRequired')}
                    </CardTitle>
                    <CardDescription className="body">
                      {t('auth.loginRequiredDesc')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="body text-center text-slate-500 py-8">
                      {t('auth.loginPrompt')}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};