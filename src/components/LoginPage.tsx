import React from 'react';
import { Building, Loader2, Shield, Globe, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useWeb3 } from '@/contexts/Web3Context';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const { login, isLoggingIn, enterDemoMode } = useWeb3();
  const { currentLanguage, changeLanguage } = useLanguage();

  const toggleLanguage = () => {
    changeLanguage(currentLanguage === 'ja' ? 'en' : 'ja');
  };

  return (
    <div className="w-full h-screen flex flex-col lg:flex-row luxury-gradient relative overflow-hidden">
      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-luxury-gold rounded-full animate-float opacity-60"></div>
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-luxury-silver rounded-full animate-float opacity-40" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-premium-cyan rounded-full animate-float opacity-30" style={{animationDelay: '4s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-luxury-purple rounded-full animate-float opacity-50" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Language Toggle - Fixed Position */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleLanguage}
          className="bg-slate-900/90 border-luxury-gold/50 text-white hover:text-white hover:bg-luxury-gold/30 transition-all duration-300 shadow-lg"
        >
          <Globe className="h-4 w-4 mr-1" />
          {currentLanguage === 'ja' ? 'EN' : 'JA'}
        </Button>
      </div>

      {/* Left side - Branding */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-16 relative z-10">
        <div className="max-w-lg text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start mb-8">
            <div className="bg-gradient-to-br from-luxury-gold to-luxury-purple rounded-full p-4 shadow-lg luxury-glow animate-pulse">
              <Building className="h-12 w-12 text-white animate-float" />
            </div>
            <div className="ml-4">
              <h1 className="h2 text-white drop-shadow-lg">{t('app.title')}</h1>
              <p className="body text-slate-200 drop-shadow-md">{t('app.web3ForArchitects')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16 relative z-10">
        <Card className="w-full max-w-md premium-card shadow-2xl backdrop-blur-xl border-luxury-silver/20">
          <CardHeader className="text-center p-8">
            <CardTitle className="h3 text-white mb-2 drop-shadow-lg">
              {t('login.welcome')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 pt-0 space-y-6">
            <Button
              onClick={login}
              disabled={isLoggingIn}
              size="lg"
              className="w-full premium-button text-white font-semibold py-4 transition-all duration-300"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                  {t('login.connecting')}
                </>
              ) : (
                <>
                  <Shield className="mr-3 h-5 w-5" />
                  {t('login.socialLogin')}
                </>
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-luxury-silver/30"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-slate-900/80 text-white font-medium rounded-full border border-luxury-silver/30">{t('login.or')}</span>
              </div>
            </div>

            <Button
              onClick={enterDemoMode}
              variant="outline"
              size="lg"
              className="w-full glass-effect border-luxury-gold/70 text-white bg-luxury-gold/20 hover:text-white hover:bg-luxury-gold/30 font-medium py-4 transition-all duration-300 hover:shadow-lg hover:shadow-luxury-gold/25"
            >
              <Eye className="mr-3 h-5 w-5" />
              {t('login.demoMode')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};