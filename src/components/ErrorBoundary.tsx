import { Box, Button, Stack, Text, Title } from "@mantine/core";
import { Component, type ErrorInfo, type ReactNode } from "react";
import { FaExclamationTriangle } from "react-icons/fa";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[ErrorBoundary]", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box className="flex items-center justify-center min-h-[400px] p-8">
          <Stack align="center" gap="md" maw={420}>
            <Box
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "color-mix(in srgb, var(--status-error) 15%, transparent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FaExclamationTriangle size={28} color="var(--status-error)" />
            </Box>
            <Title order={4} ta="center" c="var(--text-main)">
              Algo deu errado
            </Title>
            <Text size="sm" c="var(--text-secondary)" ta="center">
              Ocorreu um erro inesperado. Tente recarregar a página ou volte mais tarde.
            </Text>
            {this.state.error && (
              <Text size="xs" c="dimmed" ta="center" style={{ fontFamily: "monospace" }}>
                {this.state.error.message}
              </Text>
            )}
            <Button
              variant="light"
              color="red"
              onClick={this.handleReset}
              radius="md"
            >
              Tentar novamente
            </Button>
          </Stack>
        </Box>
      );
    }

    return this.props.children;
  }
}
