import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Dashboard from './Dashboard';

describe('Dashboard Component', () => {
  it('should render the Dashboard heading', () => {
    render(<Dashboard brandData={null} ideas={[]} scripts={[]} />);

    const heading = screen.getByText('Dashboard');
    expect(heading).toBeInTheDocument();
  });

  it('should show "Pending" when brandData is null', () => {
    render(<Dashboard brandData={null} ideas={[]} scripts={[]} />);

    const brandStatus = screen.getByText('Pending');
    expect(brandStatus).toBeInTheDocument();
  });

  it('should show "Completed" when brandData is provided', () => {
    const mockBrandData = {
      uvp: 'Test UVP',
      audience: 'Test Audience',
      painPoints: 'Test Pain Points'
    };

    render(<Dashboard brandData={mockBrandData} ideas={[]} scripts={[]} />);

    const brandStatus = screen.getByText('Completed');
    expect(brandStatus).toBeInTheDocument();
  });

  it('should display the correct number of generated ideas', () => {
    const mockIdeas = ['Idea 1', 'Idea 2', 'Idea 3'];

    render(<Dashboard brandData={null} ideas={mockIdeas} scripts={[]} />);

    const ideasCount = screen.getByText('3');
    expect(ideasCount).toBeInTheDocument();
  });

  it('should display the correct number of generated scripts', () => {
    const mockScripts = ['Script 1', 'Script 2'];

    render(<Dashboard brandData={null} ideas={[]} scripts={mockScripts} />);

    const scriptsCount = screen.getByText('2');
    expect(scriptsCount).toBeInTheDocument();
  });

  it('should display zero when no ideas or scripts exist', () => {
    render(<Dashboard brandData={null} ideas={[]} scripts={[]} />);

    const zeroElements = screen.getAllByText('0');
    expect(zeroElements).toHaveLength(2); // One for ideas, one for scripts
  });

  it('should render all three stat cards', () => {
    render(<Dashboard brandData={null} ideas={[]} scripts={[]} />);

    expect(screen.getByText('Brand Status')).toBeInTheDocument();
    expect(screen.getByText('Generated Ideas')).toBeInTheDocument();
    expect(screen.getByText('Generated Scripts')).toBeInTheDocument();
  });

  it('should apply correct styling classes', () => {
    const { container } = render(<Dashboard brandData={null} ideas={[]} scripts={[]} />);

    const gridContainer = container.querySelector('.grid');
    expect(gridContainer).toBeInTheDocument();
  });
});
