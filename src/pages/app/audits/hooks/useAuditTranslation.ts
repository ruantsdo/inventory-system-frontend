import { useCallback } from "react";
import { auditCategories } from "./dictionaries/auditCategories";
import { usersAuditActions } from "./dictionaries/usersActions";

export function useAuditTranslation() {
  const translateAction = useCallback((action: string): string => {
    if (!action) return "";
    return usersAuditActions[action as keyof typeof usersAuditActions] ?? action;
  }, []);

  const translateCategory = useCallback((category: string): string => {
    if (!category) return "";
    return auditCategories[category as keyof typeof auditCategories] ?? category;
  }, []);

  const translate = useCallback(
    (value: string, type: "action" | "category" = "action"): string => {
      if (type === "category") {
        return translateCategory(value);
      }
      return translateAction(value);
    },
    [translateAction, translateCategory],
  );

  return {
    translateAction,
    translateCategory,
    translate,
  };
}
