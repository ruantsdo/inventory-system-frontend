export interface ConsumptionData {
  day: string;
  value: number;
}

export interface ChartTooltipProps {
  label: React.ReactNode;
  payload: Record<string, ConsumptionData>[] | undefined;
}

export interface AlertItem {
  id: number;
  title: string;
  description: string;
  urgency: "alto" | "médio" | "baixo";
  icon: React.ReactNode;
  quantity: number;
}

export interface Movement {
  id: number;
  item: string;
  lot: string;
  type: "Entrada" | "Saída";
  quantity: number;
  responsible: string;
  date: string;
}
