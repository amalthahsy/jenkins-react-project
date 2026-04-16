import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders main heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Jenkins CI\/CD Demo/i);
  expect(headingElement).toBeInTheDocument();
});