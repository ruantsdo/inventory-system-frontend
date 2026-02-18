import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Box, Stack, Text, Title } from "@mantine/core";
import { ThemeToggle } from "../../components";

const LoaderPage = () => {
  return (
    <Box className="bg-background h-screen w-screen relative flex flex-col items-center justify-center">
      <Box pos="absolute" top={20} right={20}>
        <ThemeToggle iconOnly />
      </Box>
      <Box>
        <Stack>
          <Box maw={600}>
            <Title fw={800} ta="center" className="text-text-main">
              Carregando...
            </Title>
            <Text size="md" ta="center" fw={500} mt={4} className="text-primary">
              Aguarde enquanto carregamos sua sessão.
            </Text>
          </Box>
        </Stack>
      </Box>
      <Box className="w-[600px]">
        <DotLottieReact src="src/assets/animations/pageLoader.lottie" speed={0.4} loop autoplay />
      </Box>
    </Box>
  );
};

export default LoaderPage;
