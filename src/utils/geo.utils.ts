import { brazilianStates } from "../enums";

export function resolveStateUf(stateStr?: string | null): string {
  if (!stateStr) return "";

  const trimmed = stateStr.trim();
  const ufMatch = brazilianStates.find(
    (s) =>
      s.value.toLowerCase() === trimmed.toLowerCase() ||
      trimmed.toLowerCase().includes(s.value.toLowerCase()) ||
      trimmed.toLowerCase().includes(s.label.toLowerCase()),
  );

  return ufMatch ? ufMatch.value : trimmed;
}
