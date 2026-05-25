import React, { useState } from 'react';
import { HomePage } from './HomePage';
import { MissCardGame } from './MissCardGame';
import { KingsCupGame } from './KingsCupGame';

type View = 'home' | 'miss-card' | 'kings-cup';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');

  const navigateToHome = () => setCurrentView('home');
  const navigateToMissCard = () => setCurrentView('miss-card');
  const navigateToKingsCup = () => setCurrentView('kings-cup');

  return (
    <div className="antialiased">
      {currentView === 'home' && (
        <HomePage onPlayMissCard={navigateToMissCard} onPlayKingsCup={navigateToKingsCup} />
      )}
      
      {currentView === 'miss-card' && (
        <MissCardGame onBack={navigateToHome} />
      )}

      {currentView === 'kings-cup' && (
        <KingsCupGame onBack={navigateToHome} />
      )}
    </div>
  );
};

export default App;