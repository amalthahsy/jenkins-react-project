import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders main heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Jenkins CI\/CD Demo/i);
  expect(headingElement).toBeInTheDocument();
});

test('counter button increments count', () => {
  render(<App />);
  const buttonElement = screen.getByText(/Click Me!/i);
  fireEvent.click(buttonElement);
  const countElement = screen.getByText(/Counter: 1/i);
  expect(countElement).toBeInTheDocument();
});

test('fetch button exists', () => {
  render(<App />);
  const fetchButton = screen.getByText(/Fetch Data/i);
  expect(fetchButton).toBeInTheDocument();
});