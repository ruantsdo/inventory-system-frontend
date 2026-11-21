import dayjs from "dayjs";

export function formatBrDateToIso(dateStr: string): string {
  if (!dateStr) return "";
  return dayjs(dateStr).format("YYYY-MM-DD");
}

export function formatToBrDate(dateStr: string): string {
  if (!dateStr) return "";
  return dayjs(dateStr).format("DD/MM/YYYY");
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

export function getFormattedDate(): string {
  return new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
