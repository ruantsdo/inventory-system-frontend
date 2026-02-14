import { ActionIcon, Button, useComputedColorScheme, useMantineColorScheme } from "@mantine/core";
import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

interface ThemeToggleProps {
  iconOnly?: boolean;
}

export function ThemeToggle({ iconOnly = false }: ThemeToggleProps) {
  const { toggleColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (computedColorScheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [computedColorScheme]);

  const isDark = computedColorScheme === "dark";
  const icon = isDark ? <FaSun size={16} /> : <FaMoon size={16} />;
  const label = isDark ? "Tema Claro" : "Tema Escuro";

  if (!mounted) {
    return <div className="w-9 h-9 rounded-lg bg-surface-hover animate-pulse" />;
  }

  if (iconOnly) {
    return (
      <ActionIcon
        onClick={() => toggleColorScheme()}
        aria-label={label}
        variant="outline"
        size="lg"
        radius="md"
        className="text-text-secondary border-border hover:text-text-main"
      >
        {icon}
      </ActionIcon>
    );
  }

  return (
    <Button
      onClick={() => toggleColorScheme()}
      aria-label={label}
      variant="outline"
      radius="md"
      fullWidth
      justify="flex-start"
      leftSection={icon}
      className="text-text-secondary border-border hover:text-text-main"
      classNames={{
        inner: "justify-start",
        label: "text-sm font-medium",
      }}
    >
      {label}
    </Button>
  );
}
