import { render, screen } from '@testing-library/react';
import App from './App';

test('muestra la pantalla de inicio de sesión al abrir la app', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: 'Inicio de sesión' })).toBeInTheDocument();
});
