import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useWeb3 } from '@/contexts/Web3Context';
import { Header } from '@/components/Header';
import { HomePage } from '@/components/HomePage';
import { LoginPage } from '@/components/LoginPage';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Footer } from '@/components/Footer';
import { DAOCommunityPage } from '@/components/DAOCommunityPage';
import { CustomOrderPage } from '@/components/CustomOrderPage';
import ExternalNFTHandler from '@/components/ExternalNFTHandler';

const MainApp: React.FC = () => {
  const { isAuthenticated, isLoading } = useWeb3();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      {/* External NFT Handler - Always available to detect URL parameters */}
      <ExternalNFTHandler />
      
      {isLoading ? (
        <LoadingScreen />
      ) : !isAuthenticated ? (
        <LoginPage />
      ) : (
        <Router>
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/community" element={<DAOCommunityPage />} />
              <Route path="/custom-order" element={<CustomOrderPage />} />
            </Routes>
          </main>
          <Footer />
        </Router>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return <MainApp />;
};

export default App;
