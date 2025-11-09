import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import SurveyPlotsPage from './pages/SurveyPlotsPage';
import SpeciesPage from './pages/SpeciesPage';
import AiSpatialPage from './pages/AiSpatialPage';
import AiTaxonomyPage from './pages/AiTaxonomyPage';
import OpenDataPage from './pages/OpenDataPage';
import { Page } from './types';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('home');

  const renderPage = useMemo(() => {
    switch (activePage) {
      case 'home':
        return <HomePage />;
      case 'plots':
        return <SurveyPlotsPage />;
      case 'species':
        return <SpeciesPage />;
      case 'spatial':
        return <AiSpatialPage />;
      case 'taxonomy':
        return <AiTaxonomyPage />;
      case 'data':
        return <OpenDataPage />;
      default:
        return <HomePage />;
    }
  }, [activePage]);

  const mainContainerClass = activePage === 'plots' || activePage === 'species' ? 'max-w-full' : 'max-w-7xl';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      <Header activePage={activePage} setActivePage={setActivePage} />
      <main className="p-4 sm:p-6 lg:p-8 flex-grow">
        <div className={`${mainContainerClass} mx-auto`}>
          {renderPage}
        </div>
      </main>
      <footer className="bg-white mt-auto py-4 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-500">
          <p>&copy; 2025 Department of Climate Change and Environment & Kasetsart University. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
