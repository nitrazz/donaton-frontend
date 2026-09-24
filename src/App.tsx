import React, { useState } from 'react';
import { Sidebar } from '../src/components/organisms/SideBar';
import { DashboardPage } from './components/pages/DashboardPage';
import { EnviosPage }    from './components/pages/EnviosPage';
import { NecesidadesPage } from './components/pages/NecesidadesPage';
import { ReportarPage }  from './components/pages/ReportarPage';
import { DonacionesPage } from './components/pages';

type ViewKey = 'dashboard' | 'envios' | 'necesidades' | 'reportar' | 'acopios' | 'donaciones';

export const App: React.FC = () => {
  const [view, setView] = useState<ViewKey>('dashboard');

  const renderView = () => {
    switch (view) {
      case 'dashboard':   return <DashboardPage onNavigate={(k: string) => setView(k as ViewKey)} />;
      case 'envios':      return <EnviosPage />;
      case 'necesidades': return <NecesidadesPage />;
      case 'reportar':    return <ReportarPage />;
      case 'donaciones':  return <DonacionesPage/>;
      default:            return <DashboardPage onNavigate={(k: string) => setView(k as ViewKey)} />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F5F4F0' }}>
      <Sidebar activeKey={view} onNavigate={(k: string) => setView(k as ViewKey)} />
      <main
        style={{ marginLeft: '220px', padding: '2rem', flex: 1, minHeight: '100vh' }}
        aria-label="Contenido principal"
      >
        {renderView()}
      </main>
    </div>
  );
};



export default App;