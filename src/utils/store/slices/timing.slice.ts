import type { SliceCreator, TimingSlice } from "../../types/utils.types";

export const createTimingSlice: SliceCreator<TimingSlice> = () => ({
  greeting: () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  },

  formattedDate: () => {
    return new Date().toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  },
});
