import { useAuthStore } from "../stores/auth";

export function useFacilityContext() {
  const { currentSession, setCurrentSession } = useAuthStore();

  const facilities = currentSession?.facilities ?? [];
  const sessionRoles = currentSession?.sessionRoles ?? [];
  const roles = currentSession?.roles ?? [];

  const facilitySelectData = facilities.map((f) => ({
    value: f.id,
    label: f.name,
  }));

  const activeFacilityValue = currentSession?.activeContext?.facilityId ?? null;

  const resolveRoleForFacility = (facilityId: string | null): string | null => {
    if (!facilityId) return roles[0]?.displayName ?? null;

    const matchedSessionRole = sessionRoles.find((sr) => sr.facilities.includes(facilityId));
    if (!matchedSessionRole) return null;

    if (matchedSessionRole.displayName) return matchedSessionRole.displayName;

    const roleIndex = sessionRoles.indexOf(matchedSessionRole);
    return roles[roleIndex]?.displayName ?? null;
  };

  const handleFacilityChange = (facilityId: string | null) => {
    if (!currentSession) return;

    const selected = facilities.find((f) => f.id === facilityId) ?? null;
    const activeRoleDisplayName = resolveRoleForFacility(facilityId);

    setCurrentSession({
      ...currentSession,
      activeContext: {
        ...currentSession.activeContext,
        facilityId: selected?.id ?? null,
        facilityName: selected?.name ?? null,
        isGlobal: !selected,
        activeRoleDisplayName,
      },
    });
  };

  const activeRoleDisplayName =
    currentSession?.activeContext?.activeRoleDisplayName ??
    resolveRoleForFacility(activeFacilityValue);

  return {
    facilitySelectData,
    activeFacilityValue,
    handleFacilityChange,
    activeRoleDisplayName,
  };
}
