import { useCallback, useEffect, useMemo, useState } from "react";
import { getAllUsers, getUsersByFacilityId } from "../../../../services/users";
import { useAuthStore } from "../../../../stores/auth";
import type { UserListItem, UserStatusFilter } from "../../../../types/usersDashboard";

const PAGE_SIZE = 10;

export function useUsersDashboard() {
  const { currentSession } = useAuthStore();

  const [allUsers, setAllUsers] = useState<UserListItem[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<UserStatusFilter>("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let result: UserListItem[] = [];

      if (currentSession?.activeContext.facilityId) {
        result = await getUsersByFacilityId(currentSession.activeContext.facilityId);
      } else if (currentSession?.activeContext.isGlobal) {
        result = await getAllUsers();
      }

      setAllUsers(result);
    } catch {
      setError("Não foi possível carregar os usuários. Tente novamente.");
      setAllUsers([]);
    } finally {
      setLoading(false);
    }
  }, [currentSession?.activeContext.isGlobal, currentSession?.activeContext.facilityId]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const filteredUsers = useMemo(() => {
    const lower = search.trim().toLowerCase();

    return allUsers.filter((u) => {
      const matchesSearch =
        !lower ||
        u.fullName.toLowerCase().includes(lower) ||
        u.email.toLowerCase().includes(lower) ||
        u.cpf.includes(lower);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && u.isActive) ||
        (statusFilter === "inactive" && !u.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [allUsers, search, statusFilter]);

  const total = filteredUsers.length;
  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredUsers.slice(start, start + PAGE_SIZE);
  }, [filteredUsers, page]);

  return {
    users: paginatedUsers,
    allUsers: filteredUsers,
    total,
    page,
    pageSize: PAGE_SIZE,
    search,
    statusFilter,
    loading,
    error,
    setPage,
    setSearch,
    setStatusFilter,
    refetch: fetchUsers,
  };
}
