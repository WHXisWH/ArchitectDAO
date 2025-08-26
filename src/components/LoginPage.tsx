import React from 'react';
import { Building, Loader2, Shield, Zap, Users, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useWeb3 } from '@/contexts/Web3Context';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const { login, isLoggingIn } = useWeb3();
  const { currentLanguage, changeLanguage } = useLanguage();

  const toggleLanguage = () => {
    changeLanguage(currentLanguage === 'ja' ? 'en' : 'ja');
  };

  return (
    <div className="w-full h-screen flex flex-col lg:flex-row bg-gradient-to-br from-slate-50 to-toda-blue/5">
      {/* Language Toggle - Fixed Position */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleLanguage}
          className="bg-white/90 backdrop-blur-sm border-toda-grey/20 text-slate-600 hover:text-toda-blue"
        >
          <Globe className="h-4 w-4 mr-1" />
          {currentLanguage === 'ja' ? 'EN' : 'JA'}
        </Button>
      </div>
      
      {/* Left side - Branding */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-16">
        <div className="max-w-lg text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start mb-8">
            <div className="bg-gradient-to-br from-toda-blue to-toda-blue/80 rounded-full p-4 shadow-lg">
              <Building className="h-12 w-12 text-white" />
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-bold text-slate-800">{t('app.title')}</h1>
              <p className="text-toda-grey">{t('app.web3ForArchitects')}</p>
            </div>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-4 leading-tight">
            {t('login.heroTitle')} <span className="bg-gradient-to-r from-toda-red to-toda-blue bg-clip-text text-transparent">{t('login.heroTitle').split(' ').slice(-2).join(' ')}</span>
          </h2>
          
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            {t('login.heroSubtitle')}
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="p-4">
              <div className="bg-toda-blue/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Shield className="h-6 w-6 text-toda-blue" />
              </div>
              <h3 className="font-semibold text-slate-800">{t('login.secureLogin')}</h3>
              <p className="text-sm text-slate-600">{t('login.secureLoginDesc')}</p>
            </div>
            <div className="p-4">
              <div className="bg-toda-red/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Zap className="h-6 w-6 text-toda-red" />
              </div>
              <h3 className="font-semibold text-slate-800">{t('login.zeroGasFees')}</h3>
              <p className="text-sm text-slate-600">{t('login.zeroGasFeesDesc')}</p>
            </div>
            <div className="p-4">
              <div className="bg-toda-grey/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-toda-grey" />
              </div>
              <h3 className="font-semibold text-slate-800">{t('login.globalMarket')}</h3>
              <p className="text-sm text-slate-600">{t('login.globalMarketDesc')}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
        <Card className="w-full max-w-md shadow-2xl border-toda-blue/20">
          <CardHeader className="text-center p-8">
            <CardTitle className="text-2xl font-bold text-slate-800 mb-2">
              {t('login.welcome')}
            </CardTitle>
            <CardDescription className="text-base text-slate-600">
              {t('login.loginDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <Button 
              onClick={login} 
              disabled={isLoggingIn} 
              size="lg" 
              className="w-full bg-gradient-to-r from-toda-blue to-toda-blue/90 hover:from-toda-blue/90 hover:to-toda-blue shadow-lg text-white font-semibold py-4"
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
            
            <div className="mt-6 text-xs text-slate-500 text-center leading-relaxed bg-slate-50 p-4 rounded-lg">
              <strong className="text-toda-blue">{t('login.web3AuthSecurity')}</strong><br/>
              {t('login.web3AuthSecurityDesc')}
            </div>
            
            <p className="text-xs text-slate-400 mt-4 text-center">
              {t('login.termsNote')}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};