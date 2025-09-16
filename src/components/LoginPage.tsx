import React from 'react';
import { Building, Loader2, Shield, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useWeb3 } from '@/contexts/Web3Context';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const { login, isLoggingIn } = useWeb3();
  const { currentLanguage, changeLanguage } = useLanguage();

  const toggleLanguage = () => {
    changeLanguage(currentLanguage === 'ja' ? 'en' : 'ja');
  };

  return (
    <div className="w-full h-screen flex flex-col lg:flex-row blueprint-background">
      {/* Language Toggle - Fixed Position */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleLanguage}
          className="bg-slate-900/80 backdrop-blur-sm border-toda-blue/30 text-slate-200 hover:text-white"
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
              <h1 className="h2 text-slate-100">{t('app.title')}</h1>
              <p className="body text-slate-400">{t('app.web3ForArchitects')}</p>
            </div>
          </div>
          
          
          
          
        </div>
      </div>
      
      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
        <Card className="w-full max-w-md bg-slate-800/60 backdrop-blur-md border border-toda-blue/50 shadow-2xl">
          <CardHeader className="text-center p-8">
            <CardTitle className="h3 text-slate-100 mb-2">
              {t('login.welcome')}
            </CardTitle>
            
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
            
            
            
            
          </CardContent>
        </Card>
      </div>
    </div>
  );
};