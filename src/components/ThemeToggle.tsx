import { ActionIcon, Button, useComputedColorScheme, useMantineColorScheme } from "@mantine/core";
import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

import type { ThemeToggleProps } from "../types/components";

export function ThemeToggle({ iconOnly = false }: ThemeToggleProps) {
  const { toggleColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);


  const isDark = computedColorScheme === "dark";
  const icon = isDark ? <FaSun size={16} /> : <FaMoon size={16} />;
  const label = isDark ? "Tema Claro" : "Tema Escuro";

  const handleToggle = () => {
    document.documentElement.classList.add("theme-transitioning");
    toggleColorScheme();
    setTimeout(() => {
      document.documentElement.classList.remove("theme-transitioning");
    }, 350);
  };

  if (!mounted) {
    return <div className="w-9 h-9 rounded-lg bg-surface-hover animate-pulse" />;
  }

  if (iconOnly) {
    return (
      <ActionIcon
        onClick={handleToggle}
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
      onClick={handleToggle}
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
