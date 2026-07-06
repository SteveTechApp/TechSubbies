import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatCard } from './StatCard';

const DummyIcon = (props: any) => <svg data-testid="dummy-icon" {...props} />;

describe('StatCard', () => {
  it('renders the value and label', () => {
    render(<StatCard icon={DummyIcon} value="42" label="Active Contracts" />);

    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('Active Contracts')).toBeInTheDocument();
  });

  it('renders the provided icon', () => {
    render(<StatCard icon={DummyIcon} value="7" label="Open Jobs" />);

    expect(screen.getByTestId('dummy-icon')).toBeInTheDocument();
  });

  it('falls back to the default color class when none is provided', () => {
    const { container } = render(<StatCard icon={DummyIcon} value="1" label="Reviews" />);

    expect(container.querySelector('.bg-blue-500')).not.toBeNull();
  });
});
