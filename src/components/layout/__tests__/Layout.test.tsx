import { render, screen } from '@testing-library/react';
import { Layout } from '../Layout';
import { ChakraProvider } from '@chakra-ui/react';

describe('Layout Component', () => {
  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <ChakraProvider>{ui}</ChakraProvider>
    );
  };

  it('renders children content', () => {
    const testContent = 'Test Content';
    renderWithProviders(
      <Layout>
        <div>{testContent}</div>
      </Layout>
    );

    expect(screen.getByText(testContent)).toBeInTheDocument();
  });

  it('renders header and footer', () => {
    renderWithProviders(
      <Layout>
        <div>Content</div>
      </Layout>
    );

    expect(screen.getByRole('banner')).toBeInTheDocument(); // header
    expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // footer
  });

  it('renders sidebar on desktop view', () => {
    const { container } = renderWithProviders(
      <Layout>
        <div>Content</div>
      </Layout>
    );

    const sidebar = container.querySelector('[data-testid="sidebar"]');
    expect(sidebar).toBeInTheDocument();
    expect(window.getComputedStyle(sidebar!).display).not.toBe('none');
  });
});