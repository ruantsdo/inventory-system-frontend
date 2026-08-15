import {
  FaBoxes,
  FaChartBar,
  FaClipboardList,
  FaExchangeAlt,
  FaFileAlt,
  FaIndustry,
  FaLayerGroup,
  FaTachometerAlt,
  FaUsers,
} from "react-icons/fa";
import type { NavItem } from "../../types/navigation";

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    icon: <FaTachometerAlt size={16} />,
    path: "/dashboard",
  },
  {
    label: "Estoque",
    icon: <FaBoxes size={16} />,
    path: "/estoque",
    permission: "inventory.view",
  },
  {
    label: "Requisições",
    icon: <FaFileAlt size={16} />,
    path: "/requisicoes",
    permission: "requests.view",
  },
  {
    label: "Lotes",
    icon: <FaLayerGroup size={16} />,
    path: "/lotes",
    permission: "batches.view",
  },
  {
    label: "Movimentações",
    icon: <FaExchangeAlt size={16} />,
    path: "/movimentacoes",
    permission: "requests.view",
  },
  {
    label: "Fabricantes",
    icon: <FaIndustry size={16} />,
    path: "/manufacturers",
    permission: "items.view",
  },
  {
    label: "Usuários",
    icon: <FaUsers size={16} />,
    path: "/users/dashboard",
    permission: "users.view",
  },
  {
    label: "Auditoria",
    icon: <FaClipboardList size={16} />,
    path: "/audits",
    permission: "audit.view",
  },
];

export const APP_LOGO_ICON = <FaChartBar size={16} className="text-white" />;
export const APP_NAME = "Gestão de Estoque";

