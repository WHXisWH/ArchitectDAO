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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
      {/* Hero Section */}
      <section
        className="relative h-[600px] bg-cover bg-center flex items-center justify-center text-white shadow-2xl overflow-hidden"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-premium-blue/60 via-luxury-purple/50 to-premium-cyan/40"></div>
        <div className="absolute inset-0 luxury-gradient opacity-20"></div>

        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-4 h-4 bg-luxury-gold rounded-full animate-float opacity-60"></div>
          <div className="absolute top-40 right-32 w-2 h-2 bg-luxury-silver rounded-full animate-float opacity-40" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-32 left-32 w-3 h-3 bg-premium-cyan rounded-full animate-float opacity-50" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="relative z-10 text-center p-4 max-w-4xl">
          <h1 className="text-6xl font-bold mb-6 drop-shadow-2xl animate-float">{t('app.tagline')}</h1>
          <p className="text-2xl drop-shadow-lg text-slate-200 animate-float" style={{animationDelay: '0.5s'}}>{t('login.heroSubtitle')}</p>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 premium-card p-8 rounded-2xl shadow-xl backdrop-blur-sm">
            <Marketplace />
          </div>

          <div className="space-y-8">
            <div className="sticky top-24 space-y-8">
              {isAuthenticated ? (
                <MintNFTForm />
              ) : (
                <Card className="premium-card border-luxury-gold/30 shadow-xl backdrop-blur-sm">
                  <CardHeader className="text-center">
                    <CardTitle className="h4 text-luxury-gold luxury-glow">
                      {t('auth.loginRequired')}
                    </CardTitle>
                    <CardDescription className="body text-slate-600">
                      {t('auth.loginRequiredDesc')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="body text-center text-slate-500 py-8 italic">
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