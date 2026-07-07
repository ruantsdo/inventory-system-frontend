import { useComputedColorScheme, useMantineColorScheme } from "@mantine/core";

export function useThemeToggle() {
  const { toggleColorScheme } = useMantineColorScheme();
  const currentTheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  const isDark = currentTheme === "dark";

  const handleThemeToggle = () => {
    document.documentElement.classList.add("theme-transitioning");
    toggleColorScheme();
    setTimeout(() => {
      document.documentElement.classList.remove("theme-transitioning");
    }, 350);
  };

  return { isDark, handleThemeToggle };
}
