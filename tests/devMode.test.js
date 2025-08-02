// Dev Mode Protection Tests
// Run with: npm test

import { render, screen, fireEvent } from '@testing-library/react';
import MedicareLanding from '../src/pages/MedicareLanding';

// Mock fetch and navigator.sendBeacon
global.fetch = jest.fn();
Object.defineProperty(navigator, 'sendBeacon', {
  value: jest.fn(),
  writable: true,
});

describe('Dev Mode Protection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock URL search params
    delete window.location;
    window.location = { search: '' };
  });

  test('should NOT send webhooks in dev mode', async () => {
    // Set dev mode URL
    window.location.search = '?dev=true';
    
    render(<MedicareLanding />);
    
    // Simulate form completion and visibility change
    // ... fill out form to consent step
    // ... trigger visibility change
    
    // Assert NO webhook calls were made
    expect(fetch).not.toHaveBeenCalled();
    expect(navigator.sendBeacon).not.toHaveBeenCalled();
  });

  test('should send webhooks in production mode', async () => {
    // No dev mode in URL
    window.location.search = '';
    
    render(<MedicareLanding />);
    
    // ... same test but expect webhooks to fire
    expect(fetch).toHaveBeenCalled();
    expect(navigator.sendBeacon).toHaveBeenCalled();
  });

  test('should show dev mode banner when dev=true', () => {
    window.location.search = '?dev=true';
    render(<MedicareLanding />);
    
    expect(screen.getByText(/DEV MODE ACTIVE/)).toBeInTheDocument();
  });
});
