import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { App } from '../App';

// 1. Mockeamos únicamente las páginas para evitar lógica de red pesada
vi.mock('../components/pages/DashboardPage', () => ({
  DashboardPage: ({ onNavigate }: { onNavigate: any }) => (
    <div>
      <span>Mock Dashboard Page</span>
      <button onClick={() => onNavigate('envios')}>Ir a Envios</button>
    </div>
  )
}));

vi.mock('../components/pages/EnviosPage', () => ({ EnviosPage: () => <div>Mock Envios Page</div> }));
vi.mock('../components/pages/NecesidadesPage', () => ({ NecesidadesPage: () => <div>Mock Necesidades Page</div> }));
vi.mock('../components/pages/ReportarPage', () => ({ ReportarPage: () => <div>Mock Reportar Page</div> }));

vi.mock('../components/pages', () => ({
  DonacionesPage: () => <div>Mock Donaciones Page</div>,
  DashboardPage: ({ onNavigate }: { onNavigate: any }) => (
    <div>
      <span>Mock Dashboard Page</span>
      <button onClick={() => onNavigate('envios')}>Ir a Envios</button>
    </div>
  ),
  EnviosPage: () => <div>Mock Envios Page</div>,
  NecesidadesPage: () => <div>Mock Necesidades Page</div>,
  ReportarPage: () => <div>Mock Reportar Page</div>
}));

describe('Pruebas en el Componente Principal App', () => {
  test('debería renderizar la vista de Dashboard por defecto', () => {
    render(<App />);
    expect(screen.getByText('Mock Dashboard Page')).toBeTruthy();
  });

  test('debería cambiar de vista cuando se navega desde el Dashboard', () => {
    render(<App />);
    
    const btnIrAEnvios = screen.getByText('Ir a Envios');
    fireEvent.click(btnIrAEnvios);
    
    expect(screen.getByText('Mock Envios Page')).toBeTruthy();
  });

  test('debería cambiar de estado y renderizar la vista de Envíos usando la Sidebar real', () => {
    render(<App />);

    // Buscamos la opción real de tu menú basándonos en tu prueba guardada (/envíos/i)
    const linkEnvios = screen.getByText(/envíos/i);
    expect(linkEnvios).toBeTruthy();

    // Simulamos el clic real en la barra lateral
    fireEvent.click(linkEnvios);

    // Comprobamos que el switch de App.tsx reaccionó renderizando el mock de Envíos
    expect(screen.getByText('Mock Envios Page')).toBeTruthy();
  });
});