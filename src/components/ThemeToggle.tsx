import {
	ActionIcon,
	useComputedColorScheme,
	useMantineColorScheme,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

export function ThemeToggle() {
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

	if (!mounted) {
		return <ActionIcon size="lg" variant="subtle" color="gray" />;
	}

	return (
		<ActionIcon
			onClick={() => toggleColorScheme()}
			size="lg"
			variant="default"
			aria-label="Toggle theme"
			className="bg-surface text-text-main hover:bg-surface-hover border-border transition-colors duration-200"
		>
			{computedColorScheme === "dark" ? <FaSun size={18} /> : <FaMoon size={18} />}
		</ActionIcon>
	);
}
