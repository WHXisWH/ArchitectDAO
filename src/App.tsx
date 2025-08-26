import React from 'react';
import { useWeb3 } from '@/contexts/Web3Context';
import { Header } from '@/components/Header';
import { HomePage } from '@/components/HomePage';
import { LoginPage } from '@/components/LoginPage';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Footer } from '@/components/Footer';

const MainApp: React.FC = () => {
  const { isAuthenticated, isLoading } = useWeb3();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      <Header />
      <main className="flex-1">
        <HomePage />
      </main>
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return <MainApp />;
};

export default App;