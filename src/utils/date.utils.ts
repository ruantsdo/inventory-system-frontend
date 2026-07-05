import dayjs from "dayjs";

export function formatBrDateToIso(dateStr: string): string {
  if (!dateStr) return "";
  return dayjs(dateStr).format("YYYY-MM-DD");
}

export function formatToBrDate(dateStr: string): string {
  if (!dateStr) return "";
  return dayjs(dateStr).format("DD/MM/YYYY");
}
