import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Box, Button, Stack, Text, Title } from "@mantine/core";
import { useNavigate } from "react-router";
import { ThemeToggle } from "../../components";

export function NotFoundPage() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/dashboard");
  };
  return (
    <Box className="bg-background h-screen w-screen relative flex flex-col items-center justify-center">
      <Box pos="absolute" top={20} right={20}>
        <ThemeToggle iconOnly />
      </Box>
      <Box p="xl">
        <Stack align="center" mb="lg">
          <Box maw={600}>
            <Title fw={800} ta="center" className="text-text-main">
              Página não encontrada
            </Title>
            <Text size="md" ta="center" fw={500} mt={4} className="text-primary">
              A página que você está tentando acessar não foi encontrada.
            </Text>
          </Box>
        </Stack>
      </Box>
      <Box className="w-[600px]">
        <DotLottieReact src="src/public/assets/animations/404.lottie" speed={0.4} loop autoplay />
      </Box>
      <Button
        mt="lg"
        onClick={handleGoBack}
        className="bg-primary hover:bg-primary/90 text-primary-foreground"
        radius="md"
        size="md"
      >
        Voltar para a página inicial
      </Button>
    </Box>
  );
}
