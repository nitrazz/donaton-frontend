// 1. Importamos las herramientas de Vitest y Testing Library
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
// Importamos tu componente (ajusta la ruta si es necesario)
import { Sidebar } from '../components/organisms/SideBar';

// 'describe' agrupa todas las pruebas de un mismo componente
describe('Componente Sidebar', () => {

  // 'it' (o 'test') define un caso de prueba específico
  it('debe renderizarse correctamente mostrando las opciones', () => {
    // 1. Renderizar el componente pasándole las props obligatorias
    render(<Sidebar activeKey="dashboard" onNavigate={() => {}} />);

    // 2. Buscar un elemento en la pantalla (Asumimos que el menú dice "Dashboard")
    // Usamos una expresión regular /dashboard/i para ignorar mayúsculas/minúsculas
    const linkDashboard = screen.getByText(/dashboard/i);

    // 3. Afirmar que el elemento existe en el documento
    expect(linkDashboard).toBeInTheDocument();
  });

  it('debe llamar a la función onNavigate al hacer clic en "Envíos"', () => {
    // vi.fn() crea una "función espía". No hace nada, pero recuerda si alguien la llamó.
    const mockOnNavigate = vi.fn();

    // Renderizamos el componente pasándole nuestro espía
    render(<Sidebar activeKey="dashboard" onNavigate={mockOnNavigate} />);

    // Buscamos el elemento que dice "Envíos"
    const linkEnvios = screen.getByText(/envíos/i);

    // Simulamos un clic del usuario sobre ese enlace
    fireEvent.click(linkEnvios);

    // Afirmamos que el componente ejecutó nuestra función espía 
    // y le pasó la palabra 'envios' como argumento
    expect(mockOnNavigate).toHaveBeenCalledWith('envios');
  });

});